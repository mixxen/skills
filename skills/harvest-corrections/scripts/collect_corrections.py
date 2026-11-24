#!/usr/bin/env python3
"""Collect recent corrections from a repository as JSON lines.

Sources:
  review_comment  inline PR review comments (GitHub, via gh)
  pr_comment      PR conversation comments (GitHub, via gh)
  revert          commits that revert earlier commits (git)
  rules_change    lines added to agent rules files (git)
  commit_finding  non-merge commits whose message records a review finding or
                  a regression fix (git; patterns set with --commit-grep)

Reverts and commit findings also carry "merge" (the first-parent merge that
brought the commit in) and "pr" (the PR or merge request number from that merge's
message, or from a "(#123)" squash subject), so findings can be counted per PR
when the history has no PR links.

Run from inside the repository. The GitHub sources need an authenticated gh
CLI; pass --no-github to collect only the git sources (for GitLab, Bitbucket,
or offline use). Bot accounts and merge commits are skipped.

Example:
  python collect_corrections.py --since 2026-10-22 --out corrections.jsonl
"""

import argparse
import json
import re
import shutil
import subprocess
import sys
from datetime import datetime, timedelta, timezone

# Git pathspecs: without the glob magic, "*" also matches "/", so "*AGENTS.md"
# finds AGENTS.md at any depth.
RULE_PATHSPECS = [
    "*AGENTS.md",
    "*CLAUDE.md",
    "*GEMINI.md",
    ".cursorrules",
    ".cursor/rules",
    ".clinerules",
    ".github/copilot-instructions.md",
    ".github/instructions",
    ".windsurfrules",
]

# Extended regexes (matched case-insensitively) for commit messages that record a
# review finding or a regression fix. --commit-grep replaces them.
DEFAULT_COMMIT_PATTERNS = [
    r"\breview",
    r"\bregression",
    r"\bcorrective",
    r"\b(fail|fails|failed|failing|red) on [0-9a-f]{7,40}",
]
FAILS_ON = re.compile(r"\b(?:fail|fails|failed|failing|red) on ([0-9a-f]{7,40})\b", re.IGNORECASE)
# PR or merge request numbers in merge messages and squash subjects:
# "See merge request group/project!123", "Merge pull request #45", "Fix x (#67)".
PR_REF = re.compile(r"merge request \S*!(\d+)|pull request #(\d+)|\(#(\d+)\)\s*$", re.IGNORECASE | re.MULTILINE)

FIELD = "\x1f"
RECORD = "\x1e"


def run(cmd):
    result = subprocess.run(
        cmd, capture_output=True, text=True, encoding="utf-8", errors="replace"
    )
    if result.returncode != 0:
        raise RuntimeError(f"{' '.join(cmd)} failed: {result.stderr.strip()}")
    return result.stdout


def is_bot(login, user_type):
    return user_type == "Bot" or (login or "").endswith("[bot]")


def github_comments(since_iso):
    """Inline review comments and PR conversation comments since a date."""
    items = []
    review_jq = (
        '.[] | {kind: "review_comment", author: .user.login, author_type: .user.type, '
        "created_at, url: .html_url, path, body} | @json"
    )
    conversation_jq = (
        '.[] | select(.html_url | test("/pull/")) | {kind: "pr_comment", '
        "author: .user.login, author_type: .user.type, created_at, "
        "url: .html_url, body} | @json"
    )
    for endpoint, jq in (
        ("pulls/comments", review_jq),
        ("issues/comments", conversation_jq),
    ):
        out = run(
            [
                "gh", "api", "--paginate",
                f"repos/{{owner}}/{{repo}}/{endpoint}?since={since_iso}&per_page=100",
                "--jq", jq,
            ]
        )
        for line in out.splitlines():
            line = line.strip()
            if not line:
                continue
            item = json.loads(line)
            # "since" filters on update time; keep only comments created in the window.
            if item.get("created_at", "") < since_iso:
                continue
            if is_bot(item.get("author"), item.get("author_type")):
                continue
            item.pop("author_type", None)
            items.append(item)
    return items


def pr_number(text):
    match = PR_REF.search(text or "")
    return next((group for group in match.groups() if group), None) if match else None


def merge_map(since_iso):
    """Map each commit to the first-parent merge that brought it into the current branch.

    Returns {commit sha: {"merge": merge sha, "pr": number or None}}. Squash and rebase
    workflows have no such merges; their PR number, if any, is read from the subject.
    """
    out = run(
        [
            "git", "log", "--first-parent", "--merges", f"--since={since_iso}",
            f"--format=%H{FIELD}%s{FIELD}%b{RECORD}",
        ]
    )
    mapping = {}
    for record in out.split(RECORD):
        record = record.strip("\n")
        if not record:
            continue
        sha, subject, body = (record.split(FIELD) + [""] * 3)[:3]
        pr = pr_number(f"{subject}\n{body}")
        try:
            members = run(["git", "rev-list", "--no-merges", f"{sha}^1..{sha}^2"]).split()
        except RuntimeError:
            continue
        for member in members:
            mapping.setdefault(member, {"merge": sha, "pr": pr})
    return mapping


def add_merge_info(items, mapping):
    for item in items:
        info = mapping.get(item.get("commit"), {})
        item["merge"] = info.get("merge")
        item["pr"] = info.get("pr") or pr_number(item.get("subject"))
    return items


def reverts(since_iso):
    out = run(
        [
            "git", "log", f"--since={since_iso}", "-i",
            "--grep=^revert", "--grep=This reverts commit",
            f"--format=%H{FIELD}%an{FIELD}%aI{FIELD}%s{FIELD}%b{RECORD}",
        ]
    )
    items = []
    for record in out.split(RECORD):
        record = record.strip("\n")
        if not record:
            continue
        sha, author, date, subject, body = (record.split(FIELD) + [""] * 5)[:5]
        items.append(
            {
                "kind": "revert",
                "author": author,
                "created_at": date,
                "commit": sha,
                "subject": subject,
                "body": body.strip(),
            }
        )
    return items


def commit_findings(since_iso, patterns):
    """Non-merge commits whose message matches a pattern; reverts are left to reverts()."""
    cmd = ["git", "log", f"--since={since_iso}", "--no-merges", "-i", "-E"]
    cmd += [f"--grep={pattern}" for pattern in patterns]
    cmd.append(f"--format=%H{FIELD}%an{FIELD}%aI{FIELD}%s{FIELD}%b{RECORD}")
    out = run(cmd)
    compiled = [re.compile(pattern, re.IGNORECASE) for pattern in patterns]
    items = []
    for record in out.split(RECORD):
        record = record.strip("\n")
        if not record:
            continue
        sha, author, date, subject, body = (record.split(FIELD) + [""] * 5)[:5]
        if re.match(r"revert", subject, re.IGNORECASE) or "This reverts commit" in body:
            continue
        message = f"{subject}\n{body}"
        items.append(
            {
                "kind": "commit_finding",
                "author": author,
                "created_at": date,
                "commit": sha,
                "subject": subject,
                "body": body.strip(),
                "matched": [p.pattern for p in compiled if p.search(message)],
                "fails_on": sorted(set(FAILS_ON.findall(message))),
            }
        )
    return items


def rules_changes(since_iso):
    log = run(
        ["git", "log", f"--since={since_iso}", f"--format=%H{FIELD}%an{FIELD}%aI{FIELD}%s", "--"]
        + RULE_PATHSPECS
    )
    items = []
    for line in log.splitlines():
        if not line.strip():
            continue
        sha, author, date, subject = (line.split(FIELD) + [""] * 4)[:4]
        diff = run(["git", "show", "--format=", "--unified=0", sha, "--"] + RULE_PATHSPECS)
        current_file = None
        for diff_line in diff.splitlines():
            if diff_line.startswith("+++ "):
                path = diff_line[4:]
                current_file = path[2:] if path.startswith("b/") else path
            elif diff_line.startswith("+") and not diff_line.startswith("+++"):
                text = diff_line[1:].strip()
                if text:
                    items.append(
                        {
                            "kind": "rules_change",
                            "author": author,
                            "created_at": date,
                            "commit": sha,
                            "subject": subject,
                            "path": current_file,
                            "added_line": text,
                        }
                    )
    return items


def main():
    parser = argparse.ArgumentParser(
        description="Collect recent review comments, review findings recorded in commit "
        "messages, reverts and rules-file changes as JSON lines."
    )
    parser.add_argument(
        "--since",
        help="Start date, YYYY-MM-DD (default: 30 days ago, at 00:00 UTC)",
    )
    parser.add_argument("--out", help="Output file (default: stdout)")
    parser.add_argument(
        "--no-github",
        action="store_true",
        help="Skip the GitHub comment sources and collect git sources only",
    )
    parser.add_argument(
        "--commit-grep",
        action="append",
        metavar="REGEX",
        help="Extended regex, matched case-insensitively, for commit messages that record "
        "review findings; repeatable. Replaces the defaults: " + ", ".join(DEFAULT_COMMIT_PATTERNS),
    )
    parser.add_argument(
        "--no-commits",
        action="store_true",
        help="Skip the commit-message source",
    )
    args = parser.parse_args()

    if args.since:
        since = datetime.strptime(args.since, "%Y-%m-%d").replace(tzinfo=timezone.utc)
    else:
        # Midnight UTC, so two runs on the same day use the same window.
        since = (datetime.now(timezone.utc) - timedelta(days=30)).replace(
            hour=0, minute=0, second=0, microsecond=0
        )
    since_iso = since.strftime("%Y-%m-%dT%H:%M:%SZ")

    try:
        run(["git", "rev-parse", "--is-inside-work-tree"])
    except (RuntimeError, FileNotFoundError):
        sys.exit("Run this from inside a git repository (and make sure git is installed).")

    items = []
    counts = {}
    if not args.no_github:
        if shutil.which("gh") is None:
            print("gh not found: skipping GitHub comments (use --no-github to silence this).", file=sys.stderr)
        else:
            try:
                items += github_comments(since_iso)
            except RuntimeError as error:
                print(f"Skipping GitHub comments: {error}", file=sys.stderr)
    git_items = reverts(since_iso)
    if not args.no_commits:
        git_items += commit_findings(since_iso, args.commit_grep or DEFAULT_COMMIT_PATTERNS)
    items += add_merge_info(git_items, merge_map(since_iso))
    items += rules_changes(since_iso)

    for item in items:
        counts[item["kind"]] = counts.get(item["kind"], 0) + 1

    lines = "".join(json.dumps(item, ensure_ascii=False) + "\n" for item in items)
    if args.out:
        with open(args.out, "w", encoding="utf-8") as handle:
            handle.write(lines)
    else:
        sys.stdout.write(lines)

    summary = ", ".join(f"{count} {kind}" for kind, count in sorted(counts.items())) or "nothing"
    print(f"Collected since {since_iso}: {summary}", file=sys.stderr)


if __name__ == "__main__":
    main()
