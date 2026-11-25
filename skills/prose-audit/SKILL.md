---
name: prose-audit
description: Audit the prose that agents read (AGENTS.md, CLAUDE.md, rules files, skills, and the contributor and architecture docs they point to) and remove text that excuses workarounds or turns one small correction into an absolute rule, converting enforceable warnings into checks. Use this when the user asks to clean up, shorten, review, reorganise or deduplicate agent instructions or rules, when instruction files are long, stale, contradictory or full of NEVER and ALWAYS rules, when agents seem confused by their instructions, or for a periodic review of agent guidance. Code comments are out of scope.
metadata:
  version: "0.7"
  source: "Based on Lauren Tan, All Code Is Slop (Except Mine), AI Engineer Code Summit 2026"
---

# Audit agent-facing prose

Prose is the weakest layer of an agent's environment: nothing enforces it, and agents both ignore it and over-apply it. Two failure modes are common. Agents write down justifications for not doing the right thing, and they take one small correction and record it as a rule that can never be broken. Over time, instruction files fill up with both.

The goal is a shorter set of instructions that holds only what needs human judgment. Anything code could check should become a check.

## Scope

Read every file agents load or are pointed to: AGENTS.md and any nested copies, CLAUDE.md, `.cursor/rules` and other rules directories, SKILL.md files, and the CONTRIBUTING and architecture docs those files reference.

If none of these exist, say so; a repo that agents work in with no AGENTS.md is worth reporting. Then audit what agents read instead, in this order: docs the code or tooling points agents to, docs written for agents (handoffs, prompts, agent guides), then READMEs and docs shipped in published packages, which agents read from `node_modules`. Where the last group is large, read the top-level READMEs in full and check the rest mechanically for stale paths, commands and labels. Whichever case applies, say in the report which files you read in full, which you checked mechanically, and which you skipped, and why.

Leave code comments out. A comment policy enforced by a lint rule handles them better than an audit; if the project has no such policy, mention that in the report.

Record each file's line count before you start.

## What to look for

Decide which of these each statement is:

| Finding | What it looks like | Action |
|---|---|---|
| **Justification** | Explains why a workaround, shortcut or rule-break is fine ("we use setTimeout here because the store updates late") | Delete it. If it points at a real design problem, list that in the report. |
| **Over-rotated rule** | An absolute (NEVER, ALWAYS, "under no circumstances") addressed to agents or contributors, with no reason or scope, often added after a single incident | Find where it came from: `git log -S "[phrase]" -- [file]` shows the commit and usually the PR. If the original problem was narrow, propose rewriting it with its scope and reason, or deleting it. |
| **Enforceable warning** | "Don't import X from Y", "always use helper Z", "never call API W directly" | Convert it with `encode-correction`, then delete the text once the check exists. Don't delete it first: until the check lands, the text is the only guard. If the text is also a contract for readers outside the repo (authors of plugins or packages built against it), keep it and add the check. |
| **Stale** | A present-tense claim that names a file, command, API, version, directory or UI label that no longer exists or now behaves differently | Check it mechanically: does the path exist, does the command run, do quoted UI labels, selectors and example snippets still match the code? Fix it or delete it. A dated statement ("on 3 March, 61 tests passed") is correct for its date. A setting read only by an outside consumer can't be settled by searching this repo; ask. |
| **Restates a check** | An instruction to agents or contributors that an existing test, script or lint rule already enforces | Delete it; at most keep a one-line pointer to the check. |
| **Reference for people** | API docs, integrator guides and format specs that people build against | Leave it, even where tests also cover what it says; trim only change history and stale claims. |
| **Spec invariant** | NEVER or ALWAYS describing what the system guarantees (a format, an API contract), not telling anyone what to do | Not an over-rotated rule. Check that a test covers it and list the ones no test covers. In a long spec, check only the absolutes (NEVER, ALWAYS, MUST) and those agent instructions point to, and say how many you left unchecked. |
| **Historical record** | Dated design docs, plans, changelogs, trial prompts and their results | Don't rewrite it: it's evidence, and editing a benchmark prompt breaks comparison between runs. If it reads as current guidance, add a one-line status at the top pointing to the doc that is current. A finished one-shot prompt goes under "Needs a decision" for deletion. |
| **Duplicate or contradiction** | The same rule in several files, or two rules that disagree | Keep one copy, in the most specific file that needs it. Use evidence in the repo (lockfiles, configs, scripts) to settle contradictions; report any you can't settle. |
| **Judgment** | Guidance no check can capture: product intent, trade-offs, when to ask a person | Keep it, and keep it short. This is what prose is for. |

## Make the changes

Edit the files directly, grouped so that each change is easy to review. The files usually end up shorter, since new text replaces old. A few added lines are fine where they make guidance easier to follow (a rule's scope, owner or exception, or a status line on a historical record), but don't add new rules. Deleted justifications go away entirely; don't move them into code comments or another doc. For over-rotated rules, and for contradictions where the answer depends on the team's intent, propose the change and ask rather than deciding alone: the person who added the rule may know something the history doesn't show.

Don't delete a whole file, even one that would be left empty or holds only duplicates. Other tools or people may load it by path (a `.cursor/rules` file, a skill, a doc linked from elsewhere). Remove the content you're removing, then list the file under "Needs a decision" with a one-line reason to delete it.

## Report

```
## Prose audit
Scope: [read in full / checked mechanically / skipped, and why]
Files: [n]   Lines before: [N]   Lines after: [M]

| File:line | Finding | Action | Note |
|---|---|---|---|

Handed to encode-correction: [list]
Needs a decision: [list]
```
