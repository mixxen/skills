---
name: weed-pattern
description: Find and remove existing copies of a banned, deprecated or workaround pattern across a codebase in small reviewable batches, until only deliberate uses remain, so agents stop copying it. Use this when a new lint rule or check has a baseline or suppression list of existing violations, when the user asks to clean up, migrate off, replace or get rid of an old pattern, library, API or workaround everywhere, when agents keep copying outdated code, or after encode-correction reports existing violations. Also use it to delete dead code and stale examples that agents might imitate.
metadata:
  version: "0.5"
  source: "Based on Lauren Tan, All Code Is Slop (Except Mine), AI Engineer Code Summit 2026"
---

# Weed a pattern

Agents learn from the code around them. Every leftover workaround, deprecated API or anti-pattern looks like the house style, so the next agent copies it and it spreads. Blocking new cases (with `encode-correction`) stops the spread; this skill removes what is already there.

## Before you start

You need three things. Ask about any that aren't clear.

- **The pattern, and a mechanical way to find it.** Ideally that's the lint rule or check that bans it; otherwise a Semgrep, ast-grep or grep query. You need a query you can rerun, because it's how you prove progress.
- **The replacement:** the supported API or pattern.
- **The allowed uses:** places where the pattern is deliberate and stays, such as inside the wrapper or framework module that the rule exempts.

If nothing blocks new occurrences yet, set that up first with `encode-correction`. Otherwise the count can rise while you work. Check that the rule actually reaches the files: the lint command's globs and extensions (a `**/*.js` glob skips `.mjs`, `.ts` and `.vue`), and whether CI fails on the rule's severity (`--quiet` hides warnings, so a warn-level rule never fails a build). If the block is a test, check that the test runner's glob and a CI job pick it up, and that it scans these files.

If the user hasn't named a pattern, survey candidates first and recommend one or two. Rank them by how many copies exist, whether they have spread across modules or packages, whether anything blocks new copies, whether the codebase already has the replacement (a house style to move towards), and what a copy costs when an agent imitates it. Show the candidates with counts and let the user pick.

## 1. Count and classify

Run the query and record the total. If the baseline turns the rule off for some files, the normal lint command reports nothing there; count with the rule forced on (ESLint's `overrideConfig`, or `--rule` on the CLI, which takes precedence over the config file) so baselined files are included. Put each occurrence into one of these groups:

- **Mechanical:** the replacement is a direct swap. Sometimes the right replacement is nothing at all: if the workaround wasn't needed (deferring work that is safe to do immediately), remove it rather than routing it through the supported API.
- **Needs a design fix:** the pattern is patching over a deeper problem. Lauren Tan's example: agents used setTimeout and requestAnimationFrame to paper over a clash between an imperative architecture and a declarative one. Swapping one timer API for another keeps the bug. Fix the underlying problem, or flag it; don't trade one workaround for another.
- **Allowed:** a deliberate use in an exempt place. Record these in the rule's configuration (exempt paths or allow-list), not in a code comment.
- **Dead:** unused code, old examples or obsolete docs, including docs shipped in the published package, which agents read from `node_modules`. Delete them rather than migrating them: agents copy these too, and removing them is cheaper than fixing them. Check nothing imports them first. If you can't delete a file in this environment, say so and give the exact command.

## 2. Migrate in small batches

Group occurrences by module or owner so that each batch is easy to review, typically one directory or 5 to 20 sites. For each batch:

1. Replace the occurrences.
2. Delete any comments that justified the old workaround. Once the workaround is gone they are wrong, and they teach the next agent that workarounds are acceptable. Don't replace them with new comments explaining why the workaround is no longer needed; that belongs in the commit message.
3. Run the tests and the check. If the change affects behaviour, run the app and verify it, using the project's runtime verification skill if it has one. For a swap meant to change nothing, run the old and new code side by side on representative and edge inputs, and list every difference in the commit message: tests rarely cover the edges where two implementations disagree.
4. Lower the baseline so that the count can't go back up. If the linter has no baseline feature, lower the checked-in list or remove each batch's files from the per-file override list. Update any test that pins the baseline in the same commit.
5. Make one commit or PR per batch, stating the before and after counts.

## 3. Finish when only allowed uses remain

When the query finds only allowed uses, remove this rule's baseline entry so that the rule becomes a plain error everywhere except the exempt places. If the pattern was a library, remove the dependency too.

## When to stop early

Stop and report instead of forcing the change when:

- the replacement can't handle a real use case (the rule may need a supported alternative first);
- a batch breaks behaviour and the cause isn't clear;
- an occurrence needs a design change bigger than this migration. List it with a short explanation and leave it in the baseline.

## Report

```
## Pattern weeded: [name]
Before: [N] occurrences   After: [M]
Batches: [commits or PRs, with counts]
Allowed uses kept: [K], recorded in [config file]
Left in baseline: [each one, with the reason]
Justification comments and dead code removed: [count or list]
Checks run: [command → result]   Not run: [what, and why]
```
