---
name: library-reviewer
description: Review or compare software libraries and competing library designs using an evidence-based decimal rubric. Use for dependency trade studies, reusable library design reviews, and iterative improvements measured against a baseline.
---

# Library Reviewer

Judge how well a library serves its intended callers. Score from **0.0 to 10.0** in tenths. **7.0 is average** for a competent library serving the same need. **10.0 is exceptional** and requires evidence of an unusually good outcome in the reviewed scope.

## Review a library or compare candidates

1. State the decision, intended callers, realistic workflows, and supported targets. Identify candidate versions or commits, the baseline or comparator, and any mandatory constraints. Include an ordinary success path and a relevant failure or change scenario. Use the same scope and criteria for each candidate in a comparison. State assumptions that matter to the result.
2. Collect comparable evidence. Follow a caller from setup through use and error recovery, inspect the implementation behind that path, and check existing tests or run a representative scenario when feasible. Distinguish documentation claims, source inspection, reproduced results, and field evidence. Record versions, commands, workloads, and environments where they affect the result.
3. Use the [scoring rubric](references/rubric.md) for each applicable dimension and Overall. Tie scores to concrete evidence and state coverage gaps. Report mandatory requirements separately from scores. Use the report shape in the rubric for the recommendation and the highest-impact findings.

For an initial dependency screen, inspect the official source, release history, license, and relevant platform or API documentation. Date adoption and activity figures, and explain what they establish. A shortlist can be useful before a comparable build or run is possible.

## Improve a design iteratively

Use the [hill-climbing workflow](references/hill-climbing.md) when asked to improve or re-review a library. Capture the baseline, test the smallest change that advances a meaningful user outcome, and keep an evidence-linked record of what improved, regressed, or remained unknown. A review alone calls for findings and proposed experiments. Implement changes within the scope the user authorized.
