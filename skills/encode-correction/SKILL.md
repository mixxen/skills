---
name: encode-correction
description: Turn a correction into an automatic control (a better API, a fenced API, an import boundary, a lint rule or a test) so agents can't repeat the mistake, instead of adding another line to AGENTS.md or a rules file. Use this whenever someone corrects how code was written, a review comment points out a pattern that keeps recurring, or the user says things like "agents keep doing X", "make sure this never happens again", "add a lint rule for", "ban X" or "lock this down". Also use it when you are about to write a new rule, warning or "don't" note into AGENTS.md, CLAUDE.md, a rules file or a code comment; prefer a check over prose.
metadata:
  version: "0.3"
  source: "Based on Lauren Tan, All Code Is Slop (Except Mine), AI Engineer Code Summit 2026"
---

# Encode a correction

When an agent gets something wrong and someone corrects it, the easy response is to write the correction down in prose. That rarely holds. Agents copy what they see in the codebase, they either ignore prose or over-apply it, and nothing enforces it. A check in code runs every time, for every agent and every contributor, and needs no context to work.

So the job is to take one correction and make the codebase enforce it, using the strongest control that is practical.

## 1. Pin down the correction

Write one sentence for each:

- **Wrong:** what the code did. Find a real example in the repo or in the diff that prompted the correction.
- **Right:** what it should do instead, naming the supported API or pattern.
- **Why:** the consequence, such as a bug, UI jank, a security hole or a broken boundary. If the mistake is a workaround for a deeper design problem, say so. The control should steer agents towards the real fix, not towards a different workaround.

If the correction is about this one change only (a wrong value, a typo, a misread requirement), there is no pattern to encode, and turning a one-off into a permanent rule is its own failure mode. Don't add a lint rule or a line to AGENTS.md or a rules file. If the project has tests, add a behavioural test for that specific requirement next to the existing ones, so the requirement itself is protected, and say why a broader rule would be the wrong response.

If you can't name the "right" alternative, stop and ask. A ban with no supported alternative pushes agents into workarounds, which is exactly what this skill is meant to prevent.

## 2. Choose the strongest control

Work down this list and stop at the first option that works. The higher options remove the mistake entirely; the lower ones only catch it.

1. **Make it impossible.** Change the API or types so the wrong thing can't be written: remove the dangerous parameter, use a type that only the safe constructor produces, or make the internal module private.
2. **Fence a risky API.** If an API is legitimate but needs nuance to use well, ban it in product code and allow it only inside a small, owned wrapper or framework module that offers a safe API. Lauren Tan's team bans React's useEffect in product code and allows it only inside their in-house framework's APIs. The same applies to a shared helper written to fix a recurring mistake: if nothing stops new code from writing its own copy, ban local reimplementations (for example by function name) everywhere except the helper's module.
3. **Enforce a boundary.** If the mistake is code reaching across a boundary, make the boundary visible in the directory structure and enforce it with a dependency rule. Her team keeps `electron-main` and `electron-renderer` as top-level directories and bans imports between them.
4. **Lint rule, type check or structural test.** Catch the pattern statically.
5. **Behavioural test.** If the mistake is about what the code does rather than how it's written, add a test that fails on the wrong behaviour.

Use the project's existing tools before writing custom ones. `references/controls-by-language.md` lists common options for each language.

Don't add, remove or upgrade dependencies or tool versions to get a control in place without asking first. A version bump changes behaviour for the whole team and deserves its own review. If the best control needs a new package or a newer version, build the best control the installed versions allow, then say what the upgrade would add and ask.

Only if none of these can work, write a short prose rule with its reason and scope, and say in your report why it couldn't be a check.

## 3. Write the error message for the next agent

The error message is the only thing the next agent reads when it hits the control, so make it teach the fix. Include:

- what isn't allowed;
- why, in one clause;
- what to do instead, naming the supported API or file.

For example: "Don't call setTimeout in feature components. Timers here usually patch over a state-ordering problem and cause GC jank. Derive the value during render, or use useScheduledTask from src/framework/scheduling."

A message that only says what's wrong invites the agent to patch around the check.

## 4. Prove the control works

Add fixtures or tests showing that:

- a wrong example fails, with your message;
- the right alternative passes;
- any sanctioned exception, such as code inside the wrapper module, passes.

Then run the check across the whole repo and note how many existing violations it finds. Confirm the check reaches every file it should: the lint command's globs and extensions (`.mjs`, `.ts`, `.vue`), the config's ignore lists, and whether CI fails at the rule's severity (`--quiet` hides warnings). A rule that the project's command never applies to a file protects nothing there.

## 5. Block new cases now; clean up later

Turn the check on so it fails for new code, without forcing a repo-wide rewrite in the same change. Use the linter's baseline or suppression feature if it has one. Otherwise, turn the rule off for the files that have violations through a per-file override list, or record the violations in a checked-in list that CI compares against, so the count can only go down. Hand the existing violations to the `weed-pattern` skill.

Run the check where agents hit it during their normal loop: the pre-commit hook, the project's check command and CI. A nightly job alone is too late. Fast feedback is what makes agents fix the root cause instead of moving on.

## 6. Remove the prose it replaces

If the correction was already written into AGENTS.md, a rules file, a skill or a code comment, delete that text now that the code enforces it. Keeping both creates two sources of truth, and the prose version drifts.

## Report

Finish with this summary:

```
## Correction encoded
Wrong → right: [one line]
Control: [type from step 2] in [files]
Message: "[the error message]"
Proof: wrong example fails / right example passes / exception passes
Existing violations: [N], baselined in [file], handed to weed-pattern
Prose removed: [file:line, or none]
Not encoded: [only if you fell back to prose: why no check was possible]
```
