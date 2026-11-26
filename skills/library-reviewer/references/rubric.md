# Library scoring rubric

## Calibration

Apply these anchors to each dimension and Overall. Calibrate 7.0 against the ordinary capabilities of competent libraries serving the declared use case. State that comparison class and label it as an estimate when direct evidence is limited. Score every candidate against those anchors. The previous revision is the comparator for measuring change and keeps whatever score it earned. The scale describes quality in the declared scope and imposes no distribution.

| Score | Anchor |
|---|---|
| 0.0 | Observed complete failure in this dimension within the reviewed scope. |
| 0.1–2.9 | Severe, pervasive problems prevent dependable use. |
| 3.0–4.9 | Major shortcomings affect essential workflows or require extensive workarounds. |
| 5.0–6.9 | Usable with recurring friction, fragility, or meaningful gaps relative to a competent peer. |
| **7.0** | **Average.** A competent, typical library delivers the expected capability with ordinary costs and limitations. |
| 7.1–7.9 | Above average in specific ways that matter to its callers. Material improvements remain available. |
| 8.0–8.9 | Strong. The main workflows and relevant edge cases hold up well, with limited weaknesses. |
| 9.0–9.4 | Excellent. Important workflows are unusually clear or robust, with minor weaknesses. |
| 9.5–9.9 | Exceptional. Evidence shows a marked benefit over a competent peer, with very small remaining gaps. |
| **10.0** | **Exceptional even at the top of the scale.** Evidence establishes a standout benefit in representative use, including relevant difficult cases. The reviewed scope has no known material weakness in the dimension being scored. |

Use one decimal place. Tenths express review judgment. Treat nearby scores as effectively tied unless a user-relevant and repeatable difference supports a preference. Reserve exceptional scores for demonstrated caller benefits in representative use.

## Dimensions

Choose applicable dimensions before grading. Add domain-specific criteria when they could change the decision. Record any required thresholds or weights up front.

| Dimension | Inspect | What strong evidence looks like |
|---|---|---|
| API design and complexity | Setup, common calls, naming, defaults, ownership, and caller responsibilities. Look for options, abstractions, and steps that add cost without serving the use case. | The API fits the workflows and constraints. Common calls are clear, and mechanisms for difficult cases earn their cost by preserving guarantees, preventing misuse, or reducing work across callers. |
| Readability | Source structure, naming, indirection, and whether a maintainer can trace behavior. | A reviewer can follow a meaningful operation and its failure path using local context and documented invariants. |
| Maintainability | Change locality, extension points, dependency boundaries, and ownership of shared behavior. | A representative fix or extension is localized and its effects are easy to review. |
| Reusability and composition | Which mechanics consumers share, which policy they supply, and how the library integrates. | When multi-consumer reuse matters, distinct callers use the same core. A policy change for one caller stays local. A single-purpose library fits its declared boundary. |
| Correctness and failure handling | Contracts, invariants, invalid input, and failure and recovery behavior. Check concurrency where relevant. | Representative normal and adverse cases preserve the contract and return actionable errors or recover as specified. |
| Testability and verification | Deterministic controls, public test seams, regression coverage, and the ease of reproducing failures. | A downstream caller can control inputs and verify meaningful outcomes. Tests cover the paths that drive the decision. |
| Diagnostics and operability | What a caller or operator can observe and use to diagnose and recover from a problem. | A realistic fault is distinguishable and attributable with the information available to the intended caller. |
| Resource and platform fit | Supported platforms and toolchains, runtime assumptions, latency, footprint, and allocation where relevant. | Comparable builds and measurements show fit on the intended target with the relevant workload and features. |
| Adoption and lifecycle | Getting started, documentation accuracy, compatibility and upgrades, release activity, license, and supply-chain burden. | A caller can integrate a pinned release and follow a credible upgrade path. Maintenance and dependencies suit the project's needs. |

Judge complexity by the work it does for the declared use case. For example, a shared retry and cancellation mechanism can justify extra implementation code when callers need bounded recovery. A plug-in layer for a fixed operation adds overhead if no in-scope caller needs to vary it. Evaluate the whole workflow, including any work consumers must implement themselves.

Assign each finding to its primary dimension. Mention effects on other dimensions when they are independently evidenced. For example, returning a rejected item on overflow is evidence of correctness. A caller that uses the overflow signal to track losses demonstrates diagnostic value separately. Give credit for that observable outcome and record who owns the instrumentation.

Use downloads, stars, and commits as context for adoption or activity. Evaluate API quality, correctness, and reuse through caller behavior and shared implementation.

## Evidence and Overall

- Use **N/O** when evidence is insufficient and **N/A** when a dimension does not apply. Give the reason in either case. Score a narrower observation only when its label makes the boundary clear, such as host correctness with target correctness marked N/O. Carry decision-relevant gaps into the conclusion.
- Name the evidence behind each score. A documented claim establishes intent. Source inspection can support structural judgments and show defects. A passing build establishes compilation for the recorded configuration. Tests, benchmarks, and operational observations support only the behavior and conditions they exercised. For target performance, identify the hardware, configuration, workload, and measurement method. With only source and build evidence, label the resource and platform fit score accordingly and mark any in-scope unmeasured target metrics N/O. For reuse, identify what each caller actually shares.
- Give a holistic **Overall** score tied to the primary use and its most consequential trade-offs. If the user wants a weighted score, disclose the weights and missing-evidence treatment before scoring. Keep a mandatory requirement's result visible regardless of either score. For each candidate, record each requirement as met, unmet, or unverified with its evidence. Recommend adoption only within a scope whose mandatory requirements are met. A promising candidate with an unverified requirement can remain under evaluation, with the missing check as the next step.
- A scoped Overall can still be meaningful when unrelated or secondary areas are N/O. When comparable evidence is insufficient for the decision, show the decision-level Overall as N/O and name the check that would resolve it. A narrower result, such as a host-only ranking, can be reported with its scope.

## Review output

Lead with the recommendation and the scope it covers. Use a compact scorecard and name the version, conditions, and limits of the evidence. For a comparison, show each candidate's score against the same dimensions.

| Dimension | Score / 10 | Evidence and main limitation |
|---|---:|---|
| [Dimension] | [score, N/O, or N/A] | [Source path, command and result, or source link] |
| **Overall** | **[score or N/O]** | **[Reason and scope]** |

For each consequential finding, give its impact, location or reproduction, the smallest useful improvement, and the check that would establish a fix. Name strengths worth preserving when they constrain the proposed change. Include outstanding requirements and what evidence is still needed for the decision.
