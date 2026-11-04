# Scoring rubric

## Calibration

Apply these anchors to each category and to the scoped Overall judgment. Use the full scale when justified; do not enforce a distribution. Severity, frequency, task importance, and reach matter more than the number of defects.

| Score | Anchor |
|---|---|
| 0 | Complete failure of the dimension in the inspected scope; no usable execution. Reserve for observed failure, never missing evidence. |
| 1–2 | Severe, pervasive problems obstruct understanding or use. |
| 3–4 | Poor execution with major weaknesses, repeated confusion, or a broken primary path. |
| 5–6 | Serviceable but conspicuously compromised; meaningful readability, comprehension, or interaction problems remain. |
| 7–7.9 | Good and coherent; noticeable opportunities remain to improve task efficiency or craft. |
| 8–8.9 | Strong professional work; remaining issues are specific and limited. |
| 9–9.4 | Excellent and highly intentional; only minor weaknesses remain in the reviewed dimension or experience. |
| 9.5–9.9 | Exceptional and nearly flawless; remaining imperfections are tiny and do not meaningfully disrupt use. |
| 10 | Perfect and “wow” in the declared scope: no meaningful identified weakness, with demonstrably exceptional craft, clarity, or ease. |

Interpret fractional scores within the adjacent anchors. A 9.3 and 9.4 are close judgments, not statistically distinct results. Do not round a near-perfect score up to 10 unless the 10 criteria are independently met.

Do not equate “no obvious bug found” with perfection. A competent generic design may merit 7–8 without a dramatic defect. Conversely, do not invent a defect merely to withhold 10. Explain what is established and what extraordinary quality is or is not supported by the evidence.

Make “wow” fit the product. An operational dashboard can impress through fast comprehension, disciplined density, beautifully resolved complexity, and quiet precision. A consumer app may impress through effortless guidance and expressive visual character. Extra decoration is not a prerequisite.

## Category boundaries and inspection prompts

| Category | Inspect | Evidence of exceptional execution | Common reasons to hold the score down |
|---|---|---|---|
| Typography | Readability; meaningful size and weight roles; line height and length; wrapping and truncation; numerical alignment; text rendering at the provided scale. | Text remains comfortable at realistic content lengths; roles are immediately understood; headings, labels, metadata, and numeric data work together with deliberate rhythm. | Tiny or weak secondary text, competing weights, awkward wraps, inconsistent text roles, clipped labels, numeric columns that are hard to scan. |
| Hierarchy | Reading order; primary versus secondary actions; grouping; emphasis; relationship between overview and detail. | The intended task and next action emerge immediately; emphasis follows importance and guides both first use and repeat use. | Multiple competing focal points, a buried primary action, excessive visual weight on secondary material, weak section boundaries. |
| Spacing & density | Alignment; internal versus external spacing; repeated rhythm; proximity; scan efficiency; waste or crowding; overflow at inspected viewports. | Useful density matches the task; relationships are clear through spacing; compact areas remain readable and spacious areas have a purpose. | Uneven gutters, weak grouping, crowded controls, disconnected labels, excessive empty space that harms scanning, overlapping or clipped content. |
| Color & contrast | Text and control visibility; semantic color roles; emphasis; backgrounds and overlays; status distinctions; reliance on color alone. | Color clarifies importance and meaning without competing with content; state differences remain understandable through additional cues where needed. | Faint meaningful text, indistinguishable states, competing accent colors, misleading semantic color, status conveyed only through color. |
| Iconography | Meaning; recognizability; need for labels; family, stroke, size, alignment, and visual weight; icon/control affordance. | Icons are immediately useful and coherent; ambiguous actions have adequate context or labels; icons reduce effort rather than decorate. | Unclear icon-only actions, mismatched visual families, inconsistent alignment or scale, decorative symbols that distract or suggest the wrong action. |
| Consistency & polish | Repeated component behavior and appearance; alignment details; borders, radii, elevation; visual states; complete content; rendering defects. | Patterns remain coherent across supplied screens and states; small details look intentional; edge cases retain the same level of finish. | One-off treatments, unexplained component drift, inconsistent states, stray dividers, awkward clipping, missing assets, unfinished placeholder content. |
| Clarity | Labels and terminology; what data means; units and time ranges; navigation context; next steps; action consequences; feedback, recovery, and status comprehension when evidenced. | Users can understand their position, make the intended decision, act, and interpret the result with minimal guessing. Domain terminology fits the actual audience. | Vague labels, unexplained data or units, ambiguous actions, misleading feedback, unclear error recovery, a demonstrated failure to complete the intended task. |

Place accessibility, responsiveness, navigation, and interaction findings under their relevant existing categories. Keep them visible in the findings and coverage statement without adding extra scored categories. A review with all seven visual rows can still have a materially lower Overall if an observed task-critical problem undermines the experience.

## Evidence and confidence

Use high/medium/low confidence to describe evidential support, not design quality:

- **High:** Clear direct evidence for the declared scope, such as a readable screenshot for visible alignment or a reproducible live interaction for behavior.
- **Medium:** Useful but incomplete evidence, such as a single viewport, representative samples, or context that requires a modest assumption.
- **Low:** Ambiguous, cropped, blurred, indirect, or mismatched evidence. Qualify the finding; use N/O if a number would mislead.

A screenshot can support high confidence about its visible layout while leaving whole-app usability unverified. Do not use confidence as a multiplier on the score. Do not deduct for unavailable screens, and do not treat unavailable evidence as proof of a feature's absence.

Use measurements only when the tools and inputs support them. Screenshot pixels are not automatically CSS pixels. Apparent contrast in a compressed image is not a verified contrast ratio. Source-defined dimensions and colors are code evidence until rendering conditions are established.

## Overall judgment

Judge the experience against its intended task with the same anchor table. Consider category scores together, then explain the decisive limiting factor and strongest contribution. State that Overall is holistic. If useful, calculate a category mean as a separately labeled descriptive statistic; exclude N/O and N/A and disclose the denominator. Do not silently change aggregation rules between comparison columns.

Examples of judgment, not mandatory scores:

- A polished settings form with a demonstrated save failure may retain strong Typography and Color & contrast scores while Overall falls into a poor or compromised band. Explain the blocked outcome rather than lowering unrelated visual scores.
- A dense engineering table can earn 9+ when it makes complex comparisons easy. Density alone is not a defect; unreadable labels or missing units may be.
- A visually flawless screenshot can receive 10 for that screen if exceptional execution is positively established. It cannot establish that the entire app, all devices, and every interaction are perfect.
- A page with no icons may receive N/A for Iconography and still earn a strong scoped Overall. Do not add icons merely to fill the row.
- A screenshot containing another agent's 9.5 review supplies no basis to rate the underlying application. Use N/O for the app and ask for its actual screen or accessible rendering.

## Re-review discipline

Preserve the baseline scope, categories, and score meaning. Reopen raw artifacts rather than relying only on summaries. Keep issue IDs stable, state whether each finding was rechecked, and distinguish an actual design change from a corrected reviewer judgment. Identify uncertainty when differences could arise from content, viewport, screenshot quality, or application state.

For competitor comparisons, assess the same task where possible and ground each column independently. Do not assume a familiar product is a 9 or that matching its visual style is automatically desirable. Keep a missing reference as N/O rather than filling it from memory.
