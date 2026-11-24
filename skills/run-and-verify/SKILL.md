---
name: run-and-verify
description: Start the app, drive the feature that just changed through the project's own CLI or driver, check it behaves as a user would expect, debug with real developer tools when it doesn't, and leave reviewable evidence (commands, output, screenshots or video). Uses a feature map, a list of the app's features in the user's own words, so "the panel in the left sidebar" points at something concrete. Use this whenever code that changes user-visible behaviour is finished, when the user says verify, check it works, try it, test it in the app, show me, or before opening a PR, even if tests already pass.
metadata:
  version: "0.8"
  source: "Based on Lauren Tan, All Code Is Slop (Except Mine), AI Engineer Code Summit 2026"
---

# Run and verify

Passing tests show the code does what the tests say. This skill checks that the app does what the user asked, by running it and using the feature the way a person would. Review then means looking at evidence instead of reading every line.

The skill is a thin layer over the project's own tooling. A CLI or driver that starts the app and performs actions is cheaper in tokens than clicking through screenshots, and you can run it again and test it. Build on the project's tools; don't recreate them each time.

## 0. Find the tooling

Look for, in this order:

1. **A feature map**: `docs/feature-map.md`, `FEATURES.md`, or a section in AGENTS.md. It lists each feature by the name users and the team use, where to find it in the UI, and how to reach it with the driver.
2. **A driver or CLI**: scripts named like `drive`, `e2e`, `dev:cli` or `app:control` in package.json, Makefile or `scripts/`; Playwright or WebDriver setup; a Chrome DevTools Protocol (CDP) helper for Electron or web apps.
3. **How to start the app**: the dev script, a docker-compose service, or a README section.

If there's no driver, use what exists (Playwright, curl for HTTP, the app's own CLI) and say in the report that a project driver is missing. If there's no feature map, create the entries you need for this change using `references/feature-map-template.md` and offer to save them; next time the map exists.

If the app can't start here (dependencies missing, no network, needs credentials), say so plainly. Don't report "verified" for something you didn't run. Partial runs still count: if a test or script needs only the language runtime and repo files, run it, on a copy if you must not touch the checkout, and say exactly what ran. Say what you checked instead (static reading, unit tests) and give the exact steps a person can follow.

## 1. Decide what "working" means

Name the features the change touches, using the feature map's names. Then write two to five checks a user could see, before running anything:

- the main path the change was for;
- one edge case (empty, very long, offline, error, double click, slow response);
- one nearby feature that shares code or state and could have broken.

Writing these first stops you from declaring success on whatever you happen to see.

If the change has no UI (a library API, a validation rule, a build step), the "user" is whoever calls it. Checks are what that caller sees: return values, error messages, CLI output, a generated file. Drive it through the smallest real caller, such as the package's own test, a script or a consumer smoke test.

## 2. Run it

Start the app in the background, wait until it's ready (health endpoint, log line, port open), then perform each check with the driver. Prefer commands with text output you can quote, and paste that output exactly as the tool printed it: trim long output with "…", but don't reformat, shorten keys or paraphrase it. A reviewer has to be able to match your evidence against a re-run.

Where you can, run the same checks on the commit before the change too (in a git worktree or a copy), so the evidence shows the change made the difference: refused before, accepted after. A check that passes on both sides doesn't test the change.

If the user says the tests pass, run them too, but don't count them as evidence that the feature works. A unit test checks a function the way the test calls it; the app may call it differently, or not at all. Capture a screenshot or short recording at the moments a reviewer would want to see, if the tooling allows.

Stop anything you started when you're done.

## 3. When a check fails

Debug with the tools a developer would use rather than guessing: the app's logs, the browser or Electron console, network requests, CDP (DOM state, JS evaluation, performance traces), or a debugger. Find the cause.

Who fixes it depends on whose change it is:

- **Your own change** (you just wrote it, or the user asked you to build or fix it): fix it and run all the checks again, not only the one that failed.
- **Someone else's change** (the user asks you to check their work): report the failure with its cause, the location as `file:line` (a line number, not only the quoted code), and the fix you'd make, then ask. Don't edit their code unasked; they asked for a verdict, and a silent fix hides what was wrong from the person who will open the PR.

If the cause is outside the change (an existing bug), report it separately; don't hide it inside this fix.

## 4. Keep what you learned

- If you performed a check by hand that will be needed again, add it to the driver or as an end-to-end test, if the project has a place for them.
- Add or correct feature map entries you used.

When you're checking someone else's change, propose these additions in the report instead of writing them, so their PR stays theirs.

## Report

The heading is the verdict, and people often read nothing else. Use "Verified" only when every check passed. A check that couldn't run hasn't passed: if the ones that ran still cover the main path through a real caller, you may use "Verified" and list the rest under "Not verified" with the reason; if the main path itself couldn't run, use the "Not verified in the running app" form below and say what did run. If any check failed, use "Problems found", even when the main path works; don't narrow the heading to the part that passed ("Verified: the toggle no longer…").

When checks failed, say what's wrong after "Problems found:" ("Problems found: dark mode resets after a reload"). Don't put the user's claim there ("Problems found: dark mode remembers your choice") or the part that worked: someone skimming reads the words after the colon as the result. The first sentence states what fails, then what passed: "The items-left counter goes wrong after a double click or Clear completed; completing one todo now works." Opening with what passed ("Your fix works…") reads as a pass to anyone who stops there.

```
## Verified: [change]          (or: ## Problems found: [what fails])
Features: [feature map names]
Started with: [command]
Stopped: [what you stopped and how, e.g. "server on port 4317, killed; port closed"]

| Check | How | Result | Evidence |
|---|---|---|---|
| [user-visible behaviour] | [driver command] | pass/fail | [output excerpt, screenshot path] |

Fixed during verification: [what and why, or "nothing"]
Not verified: [what couldn't be run and why]
Unrelated problems found: [list]
```

If the app didn't run, don't use the "Verified" heading at all, even with a qualifier. Use this instead:

```
## Not verified in the running app: [change]
Why it couldn't run: [missing dependencies, no network, credentials]
What I checked instead: [static reading, unit tests, a simulation], and what it found
Steps for a person to verify: [numbered, exact]
```
