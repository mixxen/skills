# Skills

A collection of reusable agent skills. Each skill lives in its own folder under `skills/` and includes the instructions and supporting resources needed to use it.

## Available skills

| Skill | Purpose |
|---|---|
| [UI/UX Reviewer](skills/ui-ux-reviewer/SKILL.md) | Review interfaces with strict, evidence-based 0–10 scores, actionable findings, and before/after comparisons. |
| [Encode correction](skills/encode-correction/SKILL.md) | Turn a review correction into an automatic control (better API, import boundary, lint rule or test) instead of another line in AGENTS.md. |
| [Harvest corrections](skills/harvest-corrections/SKILL.md) | Mine review comments, reverts and rules-file changes for recurring corrections and rank which to turn into checks next. |
| [Weed pattern](skills/weed-pattern/SKILL.md) | Remove existing copies of a banned or deprecated pattern in small reviewable batches, so agents stop copying it. |
| [Prose audit](skills/prose-audit/SKILL.md) | Shorten agent instructions: delete justifications and over-broad absolutes, settle contradictions, and hand enforceable rules to checks. |
| [Run and verify](skills/run-and-verify/SKILL.md) | Run the app, drive the changed feature with the project's own tooling, and report evidence instead of trusting tests. |
| [Statechart](skills/statechart/SKILL.md) | Draw a feature's state machine from the code as Mermaid and compare it with the intent: missing transitions, dead ends, unhandled events. |

## Agent correction skills

Six skills for keeping an agent-written codebase clean, based on Lauren Tan's talk *All Code Is Slop (Except Mine)* (AI Engineer Code Summit 2026). The loop: **harvest-corrections** finds what reviewers keep correcting, **encode-correction** turns each correction into a check, **weed-pattern** removes the existing copies agents would otherwise imitate, and **prose-audit** trims instruction files down to what needs human judgment. **run-and-verify** and **statechart** check finished work against what the user asked for.

Each skill has evaluation cases in `evals/<case>/` (a `prompt.md`, a `case.yaml`, input fixtures in `files/` and one grader file per assertion in `graders/`), in the layout `claude plugin eval` reads.

## UI/UX Reviewer

Score **Typography**, **Hierarchy**, **Spacing & density**, **Color & contrast**, **Iconography**, **Consistency & polish**, and **Clarity**, followed by a holistic **Overall** score. Reserve **10/10 for perfect and “wow” within the reviewed scope**.

Supply screenshots, mockups, a recording, or an accessible interface. The reviewer explains the evidence behind each score and identifies concrete changes with acceptance checks. Re-reviews verify earlier fixes, inspect the complete supplied scope again, and distinguish previously missed defects from regressions. Missing evidence is marked as not observable.

The skill includes a [scoring rubric](skills/ui-ux-reviewer/references/rubric.md), a [report template](skills/ui-ux-reviewer/references/report-template.md), and [evaluation cases](skills/ui-ux-reviewer/evals/evals.json) with synthetic dashboard fixtures.

## Use a skill

Open the skill's `SKILL.md` for its instructions. When installing it in a compatible agent client, keep the complete skill folder together so its relative references and resources remain available. Installation and invocation syntax depend on the client.

Example request:

```text
Use the ui-ux-reviewer skill to review these screenshots.
Score all seven categories and Overall from 0 to 10.
Prioritize concrete improvements and explain how to verify each fix.
```

## Repository layout

| Path | Contents |
|---|---|
| `skills/<skill-name>/SKILL.md` | Required skill name, description, and instructions. |
| `skills/<skill-name>/references/` | Supporting rubrics, checklists, and report formats. |
| `skills/<skill-name>/agents/` | Optional client-specific discovery and invocation metadata. |
| `skills/<skill-name>/evals/` | Optional evaluation prompts, expectations, and input fixtures. |
| `skills/<skill-name>/scripts/` | Optional reusable helpers. |
| `skills/<skill-name>/assets/` | Optional resources used by the skill. |

Create optional directories only when the skill needs them.

## Add another skill

1. Create `skills/<skill-name>/` using a concise lowercase, hyphen-separated name.
2. Add `SKILL.md` with YAML frontmatter containing `name` and `description`. Describe both what the skill does and when to use it.
3. Keep the skill self-contained. Use relative paths for supporting files and fixtures, and keep local execution outputs outside the skill folder.
4. Validate the skill and exercise representative tasks. For evaluation cases, resolve paths in `files` relative to that skill's folder.
5. Add an entry to the catalog above and commit the complete skill folder together.

Authoring workflow reference: [Anthropic's skill-creator](https://github.com/anthropics/skills/tree/main/skills/skill-creator).
