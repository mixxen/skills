---
name: harvest-corrections
description: Mine recent PR review comments, reverts and changes to agent rules files for corrections that keep recurring, group them, and rank which to turn into automatic checks next, along with a summary of what human review still catches. Use this when the user asks what keeps coming up in code review, what to lint or automate next, why review is a bottleneck, which agent mistakes repeat, or wants a weekly or monthly review of corrections. Hand the top items to encode-correction.
metadata:
  version: "0.4"
  source: "Based on Lauren Tan, All Code Is Slop (Except Mine), AI Engineer Code Summit 2026"
---

# Harvest corrections

The ideal is to turn every correction into a check the moment it happens. In practice teams fall behind, and the same comments keep appearing in review. This skill finds them in the history and ranks what to encode next. It also shows what review still catches, which is how you tell whether review is actually shrinking.

## Inputs

Default window: the last 30 days, or since the previous harvest report if the user keeps them. If corrections cluster in a longer stretch, such as the current release or milestone, widen the window to that and say so; a fixed 30 days can cut a cluster in half. If the project doesn't tag releases, the last version bump marks the start: `git log -S'"version"' --format='%h %ad %s' -- package.json` (or the project's version file). Sources, most useful first:

1. **PR review comments**, both inline and in the PR conversation.
2. **Reverts**: commits that undo earlier work, and the reason given.
3. **Changes to agent rules files** such as AGENTS.md, CLAUDE.md, GEMINI.md and rules directories. Each added "don't" line is a correction someone wrote as prose instead of code.
4. **Commit messages.** Teams that review before merging often record findings in the fix commit itself ("review round 2: …", "addresses R1", "regression test fails on 1a2b3c4"). Where review comments aren't available, these are the main source. One commit body can list several findings; split them into separate corrections.
5. **Agent session logs**, only if the user points you to them. Don't go looking through personal logs.

`scripts/collect_corrections.py` gathers sources 1 to 4 as JSON lines. Run it from inside the repository:

```
python scripts/collect_corrections.py --since 2026-10-22 --out corrections.jsonl
```

The review comments need a signed-in `gh` CLI; everything else needs only `git`. It skips bot accounts and merge commits. For other hosts, pass `--no-github` and fetch review comments with that host's CLI or API if you can (for GitLab, `glab api projects/:id/merge_requests/:iid/discussions`). If you can't, say so in the Sources line ("0 review comments: GitLab not reachable") and rely on commit messages.

Commit messages are matched against review-style patterns by default (review, regression, corrective, "fails on <sha>" or "red on <sha>"); pass `--commit-grep` (repeatable, extended regex) to use the project's own words, such as its finding IDs. "Regression" also matches commits that only add a regression test to a new feature; read those before counting them. Each commit item also carries `pr` and `merge`: the PR or merge request it was merged in, worked out from the merge commit or a "(#123)" squash subject. `pr` keeps the host's notation (`#45` on GitHub, `group/project!12` on GitLab), so a repository that moved hosts doesn't merge two PRs that share a number.

## 1. Turn comments into corrections

Read each item and rewrite it as "wrong → right" in one line. Drop:

- approvals, questions and conversation;
- comments about one change only (a wrong value, a typo, a misunderstood requirement);
- comments that an existing check already catches.

If an existing check should have caught something and didn't, keep that item and flag it: the check is broken, bypassed or too narrow.

## 2. Group and count

Cluster corrections that describe the same rule, even when they're worded differently. Group by the underlying mistake, not by feature: "cleanup error replaces the original error" in five different modules is one cluster. For each cluster, record how many times it appears, in how many PRs, and two or three example links. Count distinct `pr` values; where the history has none, count distinct `merge` values, and only then commits. A cluster confined to one PR is usually one feature's chain of fixes, not a habit, so weigh it below one that recurs across PRs.

If a cluster stopped recurring after a shared helper or API landed, check whether anything stops new code from reimplementing it locally. An unfenced helper is the next correction waiting to happen; suggest fencing it (see `encode-correction`).

## 3. Rank

Rank the clusters by:

- **frequency:** how often it recurs;
- **cost:** reverts and incidents count more than performance problems, which count more than style;
- **encodability:** whether a deterministic check could catch it. The control list in `encode-correction` shows the options.

Frequent, costly and checkable goes to the top. Frequent but needing judgment goes in the "still needs review" list.

When the criteria disagree, recurrence across PRs comes first, then cost. A cluster that is only partly checkable can still go under "Encode next" if the partial control is worth having: name what it catches, and list the rest under "still needs review". A cluster whose only control is a behavioural test that already exists ranks below one that has no check yet.

## Report

Show the top five by default:

```
## Corrections harvest: [date range]
Sources: [n] review comments, [n] commits with review findings, [n] reverts, [n] rules-file changes

### Encode next
1. [wrong → right]: [count] times in [n] PRs (e.g. [links]). Suggested control: [type].

### Checks that should have caught something
- [check]: [what slipped through]

### What review still catches (not encodable yet)
- [category]: [count], e.g. [example]

### Compared with the last harvest
[trend, if a previous report exists]
```

Then offer to run `encode-correction` on the top item. If the user wants to track trends, save the report somewhere they choose (for example `docs/harvest/YYYY-MM-DD.md`) so the next run can compare against it.
