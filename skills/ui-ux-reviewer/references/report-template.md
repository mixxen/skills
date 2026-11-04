# Review output

Use this structure, adapting length to the request. Keep all seven category rows and Overall whenever presenting a scorecard. For a quick review, shorten findings and commentary rather than dropping categories or scope limitations.

## Opening

**Overall: [score]/10 — [artifact/version and review scope].**
**Confidence:** [high/medium/low]. [One or two sentences giving the verdict, strongest quality, and decisive limitation. State that Overall is holistic.]

**Reviewed:** [screens, viewport, state, or tested flow]. **Not verified:** [only the material limits, briefly].

If no actual UI can be assessed, replace the numeric headline with **Overall: N/O — interface evidence unavailable**, explain what was provided, and identify the smallest useful missing input. Do not produce a generic invented review to fill space.

## Scores

| Category | Score / 10 | Evidence and main gap |
|---|---:|---|
| Typography | [score or N/O/N/A] | [Observed strength and remaining limitation, if any.] |
| Hierarchy | | |
| Spacing & density | | |
| Color & contrast | | |
| Iconography | | |
| Consistency & polish | | |
| Clarity | | |
| **Overall** | **[score or N/O]** | **[Holistic rationale tied to the primary task and declared scope.]** |

Explain N/O and N/A when used. Keep evidence concrete. Do not write the same vague “looks clean” rationale in every row.

## Findings, highest impact first

Use a compact table or individual entries, whichever is easier to read. Include as many findings as the evidence warrants, without a minimum quota. For each finding provide:

**[ID] · [Severity] · [Category] · [Location/state]**

- **Observed:** [Specific evidence; identify inference or uncertainty separately.]
- **Why it matters:** [Likely consequence for the actual task, without invented user-research claims.]
- **Change:** [Smallest concrete intervention.]
- **Verify:** [Visible or testable acceptance condition.]

If helpful, label effort S/M/L and confidence. Do not confuse easy-to-fix with low impact. Show critical task failures before cosmetic refinements.

## Preserve and improve

Name the strongest elements to preserve. Give a short ordered next pass, distinguishing task-success fixes from refinements toward exceptional quality. Explain what currently prevents a 10; do not promise that implementing a list will automatically earn it.

For an interface with no supported weaknesses and convincing exceptional execution, explain why 10 is earned within scope and what remains outside scope. Do not invent three fixes.

## Optional: comparison

Use one column per observed version/reference and a shared rationale column. Keep the seven categories and Overall in their original order. Put N/O in unavailable columns; disclose differences in scope or state.

| ID | Prior evidence | Current evidence | Status |
|---|---|---|---|
| [ID] | [Baseline location/state, if available.] | [Current observation.] | [Fixed / partially fixed / still present / regression / newly observed / not rechecked.] |

Explain material score changes. If a defect already existed but the prior review omitted it, say **previously missed**, not **regression**. If prior artifacts are unavailable, give the current review without claiming a verified change.
