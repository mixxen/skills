# Hill climbing a library design

Use the rubric as feedback on real outcomes. A higher rating follows better design or stronger evidence for the same scope.

1. **Capture a baseline.** Record the revision, relevant callers, workflows and failure cases, targets, requirements, and evidence. Save a scorecard. Choose a few checks that can be repeated, including coverage for behavior worth preserving. Keep the calibration for 7.0 independent of the baseline revision's score.
2. **Pick the next change.** Choose a finding that materially affects intended callers and has a testable improvement. Write the hypothesis and success check in terms of behavior. Prefer a small change whose effect you can distinguish from setup changes. Prioritize resolving unmet mandatory requirements and testing unverified ones within scope before tuning secondary dimensions.
3. **Compare the candidate.** When implementation is in scope, make the change and run the same checks on baseline and candidate using matched conditions. Add a focused check if the previous checks missed a relevant behavior. Record observed improvements, regressions, uncertainty, and changes in complexity or cost. When a change simplifies the library, check that it preserves the required behavior and account for any work that moves to callers. With design-only evidence, describe the expected effect and the verification needed.
4. **Re-score and decide.** Re-score the affected dimensions and revisit Overall. Mark an important untested path N/O for the candidate. Preserve the old scorecard and explain whether the movement came from a code change, new evidence, or a correction to the earlier judgment. Keep a change when evidence supports a worthwhile improvement within the constraints. Revise, set aside, or revert a candidate when the trade-off fails the agreed goal.
5. **Repeat while the next experiment can change the decision.** Stop when the user's acceptance criteria are met, the review budget is spent, the remaining trade-off requires a product decision, or further changes show no meaningful benefit. Record the unresolved trade-off or next evidence needed.

Keep scope fixed within a comparison. When targets, workloads, or scoring criteria change, report the new comparison boundary and re-establish the baseline if possible. Where the prior scope is only partly covered, compare the common scope and show the broader result separately. A switch from board to host testing can establish faster local feedback and leaves board behavior unverified for the new candidate.

## Iteration record

| Finding and change | Repeated check and observed result | Before → after | Decision and remaining question |
|---|---|---|---|
| [Same behavior shared by two callers; move it into the core.] | [Build both callers and change one caller's policy. Record which source changes and which existing checks still pass.] | [Dimension and score delta, with evidence.] | [Keep, revise, or set aside.] |

A reusable core may merit a higher reuse score if the two caller examples share execution and a policy change stays local. If a candidate adds helpers while each caller still implements its own execution, record how much behavior is actually shared.
