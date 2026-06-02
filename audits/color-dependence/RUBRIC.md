# Color Dependence Audit

> **Color Dependence Law**
>
> A product may use color to carry meaning only when that meaning survives the loss of hue. Any status, value, mode, or signal that exists *only* as a difference in color — and collapses for a color-vision-deficient user even after the contrast check passes — is not communicated. It is **communicated to some users and withheld from others**.

> This audit does not ask whether colors have enough contrast. It asks **whether the meaning carried by color survives when the color does not**.

## Purpose

Most accessibility scanners answer "is the contrast high enough?" This one answers a different question that no scanner can answer: "if a user cannot distinguish these two hues, does the interface still tell them what they need to know?" — at the status layer, the chart layer, the form layer, and the mode layer.

It is intended for:
- Product reviews of tools where state and data matter (dashboards, monitoring, CI status, data-viz products, forms, editors with mode state)
- Self-audits by teams shipping interfaces that use color to encode status, category, or value
- Catching meaning-by-color-only failures that pass a luminance-contrast check and therefore pass `axe` / `Lighthouse` / `Pa11y`

It is **not**:
- A WCAG contrast scan (use axe, Lighthouse, Pa11y for SC 1.4.3 / 1.4.11)
- A subjective "the palette looks nice" review
- A re-run of the contrast checker. The whole point is that contrast can pass while color dependence still fails (see the boundary rule below).

## Key discriminator — the boundary rule

A surface can **PASS** WCAG 1.4.3 luminance contrast and still **FAIL** for color-vision-deficient users, because hue is the sole differentiator. The clearest example: red text and green text at equal luminance against the same background. The contrast ratio is identical for both; a deuteranope sees one color.

This audit separates two WCAG criteria that are routinely conflated:

- **SC 1.4.3 (Contrast, Minimum)** is about **luminance**. WCAG deliberately excludes hue from its contrast formula because luminance contrast is the remedy for low-vision users, not for CVD users [F11, F18]. A passing contrast ratio says nothing about whether two colors are distinguishable under color-vision deficiency.
- **SC 1.4.1 (Use of Color)** is about **hue as a carrier of meaning**. It is the criterion this audit governs. It cannot be checked by any contrast scanner [F2].

The two axes are mechanistically independent. In CIELAB terms, luminance lives on the `L*` axis and chromatic discriminability lives on the `a*`/`b*` axes; CVD distorts `a*`/`b*` while leaving `L*` largely intact [F19]. Dichromatic confusion lines in LMS color space run orthogonal to the luminance axis, so a high-contrast dark-red / light-green pair can still collapse to a single perceived hue [F19].

**Mandatory consequence for every check:** when a color pair passes the luminance-contrast formula, the audit must still ask whether the pair lies on a CVD confusion line. A high luminance score does not offset a hue-confusion failure. Each section below carries a **Contrast-Pass / Hue-Fail** test for exactly this case.

## How to use this audit

1. Define the **target**: URL, app flow, screen, or component.
2. Define the **state**: the realistic state where color carries meaning (a dashboard with mixed pass/fail rows, a multi-series chart with 6+ categories, a form mid-validation with errors showing, an editor in a non-default mode). The audit must be run against the state where color is actually doing work — this is Section 6.
3. **Qualify the tools first.** Before any finding, confirm the CVD-simulation pipeline is physiologically valid and free of the sRGB-linearization bug. Desaturation is not CVD simulation. See Section 4 and the tool-qualification gate.
4. Walk the seven sections in order. Each section produces zero or more findings.
5. Score each section: **Pass / Warn / Fail**. A Fail in any section blocks "Color Dependence Audited" status.
6. Output findings in the format specified at the end of this document.

Sections are ordered from the most common surface (status text) to the most specialised (data viz), then through forms and modes, then the methods gate, configuration, and evidence.

---

## Research grounding

This rubric is grounded in the empirical and normative literature below. Each finding is referenced by number throughout the sections. Citations without an architectural connection are noise; every finding here justifies a specific section, question, or severity rule.

1. **Red-green CVD affects ~8% of males and ~0.4% of females in European-Caucasian populations; ~4–6.5% of East-Asian males.** Birch 2012 (DOI:10.1364/JOSAA.29.000313). Population baseline for the whole audit. A red-vs-green-only encoding is inaccessible to ~1 in 12 male users; Section 0 cites this and a color-only red/green encoding of meaning is scored Critical.
2. **WCAG SC 1.4.1 (Use of Color, Level A) is categorically undetectable by automated scanners; meeting 1.4.3 does not satisfy 1.4.1.** W3C WAI 2023 (WCAG 2.2 SC 1.4.1). Failure techniques F73 (links by color alone), F81 (required/error fields by color alone), F13 (alt text omits color-conveyed meaning) map directly onto Sections 0, 2, and 1. Justifies the manual-only framing of the entire audit.
3. **SC 1.4.1 prohibits color as the sole visual means of conveying information, including in images.** W3C WAI 2018 (WCAG 2.1 SC 1.4.1). This is the normative floor: any element where meaning is encoded by color alone is a Level A failure, not a best-practice gap. Justifies the Critical floor in Sections 0 and 1.
4. **G14 (information in text) and G111 (color + pattern) are W3C-blessed sufficient techniques for 1.4.1; any one secondary cue is sufficient.** W3C WAI 2023 (WCAG 2.1 Technique G14). Justifies the scoring rule across all sections: one recognised secondary cue (text, icon, shape, or pattern) passes the element; zero cues fails. Prevents over-penalising icon-only or pattern-only designs.
5. **~40% of scientific visualization figures had CVD-accessibility issues in a crowdsourced study of 1,710 images; color-only encoding was a dominant failure mode.** Angerbauer et al. 2022 (DOI:10.1145/3491102.3502133). Section 1 baseline: assume multi-series charts using color as the only differentiator fail for a large share of CVD users. Justifies requiring a redundant channel on every chart; color-only legend = High.
6. **Rainbow/jet colormaps introduce >7% data distortion and exclude the ~8% of men with CVD; red-green colormaps exclude them at the endpoints.** Crameri et al. 2020 (DOI:10.1038/s41467-020-19160-7). Justifies the Section 1 hard-fail: a rainbow/jet or red-green diverging colormap fails unconditionally regardless of luminance contrast.
7. **Jet/rainbow colormaps with ample luminance range still cause severe value misinterpretation for CVD users; r² fell below 0.5 vs ~1.0 for perceptually-uniform alternatives.** Nuñez et al. 2018 (DOI:10.1371/journal.pone.0199239). The misread is driven by hue confusion, not luminance. Justifies the Section 1 Contrast-Pass / Hue-Fail test: a chart can pass the grayscale (luminance) test yet fail under protan/deutan simulation.
8. **Category count and color discriminability are the two primary drivers of categorical-perception failure; accuracy degrades as category count rises.** Tseng et al. 2023 (DOI:10.1145/3544548.3581416). Justifies the Section 1 question on category count; exceeding ~8 color-only categories is a High-severity finding.
9. **Redundant pattern+color encoding makes CVD group distinctions interpretable where color-only fails, even at 82 groups.** Guha et al. 2022 (DOI:10.7554/eLife.82128). Direct evidence that texture compensates for CVD failure in dense plots. Justifies the Section 1 rule: color-only scatter/cluster plots with >4 overlapping groups are High.
10. **The Okabe-Ito 8-color palette is distinguishable under protanopia, deuteranopia, and tritanopia; it is the Nature Methods reference accessible palette.** Wong 2011 (DOI:10.1038/nmeth.1618). Justifies the Section 1 pass condition: a palette verified CVD-safe under simulation satisfies the palette component. Pure red adjacent to pure green at similar luminance is an automatic High even if contrast passes.
11. **Deuteranomaly is the dominant red-green CVD subtype within the ~8% male prevalence baseline (F1); tritan and achromatopsia together are < 1 in 30,000.** Almustanyir 2025 (DOI:10.3390/healthcare13162031). Justifies the severity weighting: deuteranomaly carries the highest failure weight (most prevalent, most often missed); tritan gets a separate lighter-weight check. The specific subtype breakdown (~5% deuteranomaly / ~1% each of the others) is the canonical figure across the CVD prevalence literature anchored by F1 (Birch 2012); confirm the specific percentages against the live source at PT0.
12. **Blue-yellow (tritan) CVD is autosomal and affects both sexes equally (~0.001–0.2%), unlike X-linked red-green.** Hofmann & Palczewski 2015 (DOI:10.1016/j.preteyeres.2015.07.004). Justifies a distinct tritan audit question (CD-T1) that cannot be collapsed into a single "color-blind check."
13. *[Citation removed during external-verifier hardening, 2026-06-02. The originally cited DOI 10.3390/app14219931 resolves to an unrelated 2024 dental paper, not the stated work. The substantive CIELAB orthogonal-axis claim is preserved via F19 (Machado, Oliveira & Fernandes 2009), which independently establishes that dichromatic confusion lines in LMS space are orthogonal to the luminance axis. No body doctrine was lost in the removal.]*
14. **Only Vischeck (Brettel/Viénot/Mollon 1997) was psychophysically accurate among three tested simulators; Variantor and Coblis v1 failed the accuracy check.** Lillo, Álvaro & Moreira 2014 (DOI:10.1167/14.8.15). Justifies the Section 4 tool-qualification gate: an unqualified "ColorMatrix" filter produces false-negative results. Approved implementations are a Gate-A precondition.
15. **Dichromacy-only simulators overstate severity for the majority of CVD users, who are anomalous trichromats.** DaltonLens 2021 (daltonlens.org/opensource-cvd-simulation). Justifies the scoring rule: a finding flagged only by a dichromacy-only simulator is POTENTIAL-FAIL, not FAIL, unless confirmed by a Machado-model tool set to the appropriate severity. Prevents over-reporting.
16. **Many CVD-simulation implementations contain an sRGB-linearization bug that makes output far too dark, invalidating perceptual comparison.** DaltonLens 2021 (daltonlens.org/understanding-cvd-simulation). Justifies the tool-qualification check: the pipeline must apply sRGB→linear decode before the CVD matrix. Belongs in the audit's setup, not assumed.
17. **Simulated-CVD ratings of UI aesthetics/functionality correlate positively, but results are valid only for simulated screenshots — not confirmed against real CVD-user task performance.** Jamil & Denes 2024 (arXiv:2401.10357). Justifies the two-tier evidence standard: simulation is fine for triage and ranking, but any blocking failure must be confirmed by at least one CVD tester before it is marked BLOCK. Drives Section 6.
18. **WCAG 1.4.3 deliberately excludes hue from its contrast formula; luminance contrast is the low-vision remedy, not the CVD remedy.** W3C WAI 2018 (WCAG 2.1 SC 1.4.3). Justifies the boundary rule and the mandatory Contrast-Pass / Hue-Fail row in every section.
19. **Machado/Oliveira/Fernandes (2009) physiological model: dichromatic confusion lines in LMS space are orthogonal to the luminance axis, so any luminance relationship can still collapse to one perceived hue.** Machado et al. 2009 (DOI:10.1109/TVCG.2009.113). Justifies the Section 4 requirement that simulation use a physiologically-validated model (Brettel/Viénot/Mollon 1997 or Machado/Oliveira/Fernandes 2009), never desaturation. Desaturation tests luminance, not hue.

References F1–F19 above are cited inline below as `[Fn]`.

---

## Section 0 — Color-only information conveyance

**Purpose.** The most common surface: status badges, required-field markers, links, and inline state text where color is the channel. The question is whether the meaning survives without the hue.

**Failure modes.**
- Status conveyed only by color (green dot = healthy, red dot = down) with no label, icon, or shape
- Required form fields marked only by a red asterisk color, or by a colored label, with no text or symbol [F2, F3]
- Links distinguished from body text only by color, with no underline or non-color cue (WCAG failure F73) [F2]
- Pass/fail, on/off, valid/invalid encoded as a red-vs-green hue difference at similar luminance [F1]
- Color-coded legends or keys where the only mapping from color to meaning is the color swatch itself

**Audit questions.**
- For every element where color carries meaning (status, required, valid, selected, link), is there at least one non-color cue — text label, icon, shape, underline, or pattern? [F4]
- Is any status or state encoded as red-vs-green at similar luminance? (The single most common CVD failure; ~1 in 12 male users.) [F1]
- Are inline links distinguishable from surrounding text without relying on color? [F2, F73]
- Are required fields marked by something other than color alone? [F2, F81]
- **Contrast-Pass / Hue-Fail:** for each color pair that passes 1.4.3, does the pair survive a protan/deutan simulation, or does the distinction vanish? [F18, F19]

**Standards / research anchors.** WCAG 2.2 SC 1.4.1 (F73, F81, F13) [F2, F3]; Birch 2012 population baseline [F1]; G14 / G111 sufficient techniques [F4].

**Severity guidance.** Color-only red/green encoding of meaningful state is **Critical** (it is a 1.4.1 Level A failure and excludes ~8% of male users) [F1, F3]. A single recognised secondary cue passes the element [F4].

**Automation.** No. SC 1.4.1 is categorically beyond scanners [F2]. Click-depth and "missing alt/label" can be flagged statically, but "is color the sole carrier of meaning?" is a manual judgment.

---

## Section 1 — Chart / graph color encoding

**Purpose.** Whether a chart still reads when color is removed and when it is viewed under CVD simulation. The highest-density color-dependence surface — and the one with the strongest evidence base.

**Failure modes.**
- Multi-series line/bar/pie charts where the only differentiator between series is line/segment color [F5]
- Color-only legends mapping series to hue, with no direct labels, markers, or patterns [F5, F9]
- Rainbow / jet / spectral colormaps for sequential or diverging data [F6, F7]
- Red-green diverging scales (the classic "bad-to-good" gradient) [F6, F10]
- More than ~8 categories distinguished by color alone [F8]
- Dense scatter / UMAP / cluster plots where group membership is color-only [F9]

**Audit questions.**
- Does each data series carry a non-color channel — direct label, distinct marker shape, line style, or fill pattern? [F4, F9]
- Does the chart use a rainbow/jet or red-green diverging colormap? (If yes, hard-fail regardless of contrast.) [F6, F7]
- Is the categorical palette CVD-safe under simulation (e.g. Okabe-Ito), or does it place pure red adjacent to pure green at similar luminance? [F10]
- Does the chart exceed ~8 color-only categories? [F8]
- In dense scatter/cluster plots, is group encoding color-only, or is there a pattern/texture overlay? [F9]
- **Contrast-Pass / Hue-Fail (the grayscale + simulation test):** does the encoding degrade gracefully when hue is removed (grayscale shows ordered brightness) *and* remain interpretable under protan/deutan simulation? A chart can pass the grayscale test yet fail the CVD hue test. [F7, F13]

**Standards / research anchors.** Angerbauer et al. 2022 (~40% of figures fail) [F5]; Crameri et al. 2020 (rainbow distortion + CVD exclusion) [F6]; Nuñez et al. 2018 (jet hue-confusion despite luminance) [F7]; Tseng et al. 2023 (category count) [F8]; Guha et al. 2022 (pattern overlay) [F9]; Wong 2011 (Okabe-Ito) [F10]; WCAG SC 1.4.1 G111 / G14 [F3, F4].

**Severity guidance.** Rainbow/jet or red-green diverging colormap encoding data meaning is **Critical** (unconditional, regardless of luminance contrast) [F6]. Color-only legend for data series, or >8 color-only categories, or color-only group encoding in dense plots with >4 groups, is **High** [F5, F8, F9].

**Automation.** No. Requires applying CVD simulation to chart screenshots and judging whether rank-order and group boundaries survive. The grayscale test is mechanical; the CVD-hue test requires a qualified simulator (Section 4).

---

## Section 2 — Form validation signaling

**Purpose.** Whether a user can tell which fields are required, which are in error, and what to fix — without depending on hue. Forms are where color-only signaling does the most direct task damage.

**Failure modes.**
- Error state shown only by a red border or red label, with no error text, icon, or `aria-invalid` cue [F2, F81]
- Required fields marked only by color (red label, colored asterisk with no symbol semantics) [F2]
- Success state shown only by a green border with no confirming text or icon
- Inline validation that changes a field's color but adds no text the user can read or a screen reader can announce
- A summary that lists "fields with errors" using color highlighting only, with no text enumeration

**Audit questions.**
- When a field is in error, is the error communicated by text and/or icon, not color alone? [F2, F4]
- Are required fields indicated by a symbol or text ("required"), not only a colored marker? [F2]
- Is success/valid state confirmed by something a CVD user perceives — text, checkmark icon — not only a green outline? [F4]
- Does inline validation announce the change in a non-color channel (text, icon, ARIA)? [F2]
- **Contrast-Pass / Hue-Fail:** if the error border passes contrast against the field background, does it still read as "error" under protan/deutan simulation, or does it look like an ordinary border? [F18, F19]

**Standards / research anchors.** WCAG SC 1.4.1 failure technique F81 (required/error fields marked by color alone) [F2]; G14 (information in text) [F4].

**Severity guidance.** Error or required state communicated by color alone, blocking a user from completing a form, is **High** (common workflow, direct task cost); **Critical** if it blocks a core task for the CVD population with no alternative path [F2, F3].

**Automation.** No. A scanner can detect a missing `aria-invalid` or missing label, but cannot judge whether color is the sole signal of validity [F2].

---

## Section 3 — Mode / state indication

**Purpose.** Whether the current mode or state of a stateful surface is perceivable without hue. Editors, toggles, and live dashboards encode "which mode am I in?" — and color alone is a frequent answer.

**Failure modes.**
- Edit / view, draft / published, online / offline shown only by a color change to a chrome element
- Selected vs unselected tab, item, or toggle distinguished only by color
- A "recording" / "live" / "armed" state shown only by a red indicator with no label, icon, or motion
- A current-vs-other state in a stepper or segmented control where the active segment differs only in fill color
- Color-coded calendar/category state (busy/free, owned/shared) with no secondary marker

**Audit questions.**
- For each mode or state the surface can be in, is the current state shown by text, icon, shape, or position — not color alone? [F3, F4]
- Is the active item in a tab set, toggle, or segmented control distinguishable without relying on fill color? [F4]
- Is any safety-relevant or destructive-mode state (record, publish, delete-armed) signaled by more than a red hue? [F2]
- If two states differ only in color, do those colors survive protan/deutan simulation? [F1, F19]
- **Contrast-Pass / Hue-Fail:** an active-tab underline color that passes contrast against its neighbours may still be the only differentiator — does a non-color cue (weight, underline presence, icon) distinguish active from inactive? [F18]

**Standards / research anchors.** WCAG SC 1.4.1 (color as sole means of conveying state) [F2, F3]; Birch 2012 population baseline [F1].

**Severity guidance.** Current mode/state perceivable only by hue is **High** in common workflows; **Critical** where the unperceived state is destructive or safety-relevant and no other cue exists [F2, F3]. A single non-color cue passes the element [F4].

**Automation.** No. Runtime, behavioral check requiring state changes to be exercised and observed under simulation.

---

## Section 4 — Color-blindness simulation (the methods gate)

**Purpose.** Whether the audit's own simulation is physiologically valid. This is the gate that makes the other sections trustworthy: a bad simulator produces false negatives (misses real failures) and false positives (over-reports). Sections 0–3 cannot be scored honestly until this gate passes.

**Tool-qualification gate (Gate-A precondition).** Before any CVD finding is recorded:
- The simulator must use a **physiologically-validated model** — Brettel/Viénot/Mollon 1997 or Machado/Oliveira/Fernandes 2009 — **not desaturation**. Desaturation tests luminance, not hue discriminability, and is not CVD simulation. [F19]
- The pipeline must apply **sRGB → linear decode before** the CVD matrix transform. The common sRGB-linearization bug makes output far too dark and invalidates perceptual comparison. Verify the tool passes this check; record the tool name and version. [F16]
- Approved implementations include Vischeck (the one psychophysically validated among tested tools) and Machado-model tools (e.g. the `colorblindness` R package, validated emulators). An ad-hoc "ColorMatrix" filter is not qualified. [F14]

**Coverage.** The audit must simulate, at minimum:
- **Deuteranomaly / deuteranopia** — the dominant failure modes (~5–6% deuteranomaly, ~1% deuteranopia of males in European-ancestry populations); highest severity weight. [F11]
- **Protanomaly / protanopia** — ~1% each; included in the red-green set. [F11]
- **Tritanopia / tritanomaly** — audited by a distinct question (CD-T1) because tritan is autosomal and affects both sexes; much lower prevalence, lower severity threshold. [F12]
- **Monochromacy / achromatopsia** — a worst-case grayscale check; rare (< 1 in 30,000) but the strongest test of luminance-only survival. [F11]

**Failure modes.**
- Using desaturation or a grayscale filter and calling it CVD simulation [F19]
- Using a simulator with the sRGB-linearization bug, then judging colors as "too dark" or "fine" against a distorted render [F16]
- Treating a dichromacy-only simulation as ground truth, then over-reporting failures that anomalous trichromats (the majority of CVD users) would not experience [F15]
- Checking only red-green and skipping tritan entirely [F12]

**Audit questions.**
- Is the simulator physiologically validated (Brettel/Viénot/Mollon 1997 or Machado/Oliveira/Fernandes 2009)? [F14, F19]
- Does the pipeline apply sRGB linearization before the CVD transform? [F16]
- Were deuteranopia, protanopia, tritanopia, and monochromacy all simulated? [F11, F12]
- For tritan specifically, was a distinct check run (CD-T1), not folded into the red-green pass? [F12]

**Severity precondition for this section.**

A finding flagged **only** by a dichromacy-only simulator is recorded as **POTENTIAL-FAIL** (Medium), not Fail, unless confirmed by a Machado-model tool set to the appropriate anomalous-trichromacy severity level. This prevents over-reporting that undermines the audit's credibility with product teams. [F15]

| Simulation evidence | Classification |
|---|---|
| Failure confirmed by a qualified physiological model at the relevant severity level | Fail at the section's stated severity |
| Failure seen only under dichromacy-only simulation (no anomalous-trichromacy confirmation) | POTENTIAL-FAIL (Medium), confirm before promoting |
| Failure seen only under desaturation / unqualified filter | Not a finding — re-run with a qualified tool |
| Tritan-only ambiguity (CD-T1) | Scored on the lighter tritan threshold, not the red-green threshold |

**Automation.** Partial. Whether a tool is qualified is a checklist item (model + sRGB check). Applying the simulation is mechanical; interpreting the result is judgment.

---

## Section 5 — Configuration cost

**Purpose.** Whether any color-accommodation controls the product offers are reachable and effective under constraint. The recursive trap, mirrored from the Cognitive Load Audit's Configuration Cost section: an accommodation that requires the accommodation to find it.

**Failure modes.**
- A high-contrast / color-blind-safe theme exists but is buried in Settings → Account → Preferences → Display → Advanced
- A "color-blind mode" that only changes the palette but leaves color as the sole channel (re-skinning, not adding a second cue)
- Theme controls that themselves rely on color-only state (the "selected theme" swatch distinguished only by hue)
- A palette toggle that does not persist across sessions, forcing reconfiguration
- Per-chart or per-view palette settings with no global preset

**Audit questions.**
- If the product offers a color-blind or high-contrast mode, how many steps from the working surface to reach it?
- Does that mode add a secondary cue (pattern, icon, label), or merely swap one hue set for another? (A re-skin that keeps color as the sole channel does not fix color dependence.) [F4]
- Is the control that selects the mode itself perceivable without color (i.e. does the settings UI obey Sections 0 and 3)?
- Does the chosen palette / mode persist across sessions?
- **Contrast-Pass / Hue-Fail:** is the "currently selected" theme indicated by more than a colored highlight? [F18]

**Standards / research anchors.** The recursive form of the Color Dependence Law: configuration is itself a surface that must obey Sections 0 and 3. A palette swap that keeps color as the sole channel is not a remedy [F4].

**Severity guidance.** A color-accommodation control that is itself color-dependent, or unreachable from a constrained state, is **High**. A color-blind mode that re-skins without adding a secondary cue is **High** (it markets a fix that does not fix the underlying 1.4.1 failure). Burial alone (control exists, several clicks deep, and works) is **Medium**.

**Automation.** Partial. Click-depth from the primary surface to the accommodation control can be measured. Whether the mode actually adds a non-color channel is judgment.

---

## Section 6 — Evidence

**Purpose.** Whether the audit tested the real state where color carries meaning, under a qualified simulator, with the right confidence labeling. The process gate.

**Failure modes.**
- Findings collected against an empty or demo state where no status, error, or data color is present
- Simulation run once on a marketing screenshot rather than the dense working state
- A blocking failure (e.g. a status badge distinguishable only by hue) marked BLOCK on simulation alone, with no CVD-tester confirmation [F17]
- Tool name / version not recorded, so the sRGB-linearization check cannot be audited later [F16]
- Single-CVD-type testing (red-green only), no tritan or monochromacy pass [F12]

**Audit questions.**
- Was the audit run against the realistic state where color does work (mixed-status dashboard, multi-series chart, form mid-error, non-default mode)?
- Is the state documented per finding ("Observed in X surface with Y status mix / Z data series")?
- Is the simulation tool and version recorded, and did it pass the sRGB-linearization and physiological-model checks? [F14, F16]
- For any finding marked as a blocking failure, was it confirmed by at least one CVD tester, not simulation alone? [F17]
- Were all four CVD classes exercised (deutan, protan, tritan, monochromacy)? [F11, F12]

**Two-tier evidence standard (precondition for BLOCK).**

Simulation is appropriate for triage and severity ranking, because simulated-CVD ratings correlate with real interface quality — but those results are valid only for simulated screenshots, not confirmed against real CVD-user task performance [F17]. Therefore:

- A finding may be **Inferred** (and scored at its section severity) on qualified-simulator evidence alone.
- A finding may only be marked **BLOCK / Observed-blocking** after confirmation by at least one CVD tester.

This two-tier rule is the analog of the Cognitive Load Audit's evidence discipline, specialised for the simulation/real-user gap unique to CVD.

**Standards / research anchors.** Jamil & Denes 2024 (simulation valid for screenshots, not real-user task performance) [F17]; DaltonLens 2023 (tool qualification) [F16]; Lillo et al. 2014 (approved tools) [F14].

**Automation.** No. Process gate.

---

## Finding format

Each finding produced by this audit takes the following shape:

```
## Finding CD-{NN} — {short title}

Severity: {Critical | High | Medium | Low}
Section: {section name}
Surface: {where in the product}
Load displaced to: {one or more from the enum below}
Evidence state: {Observed | Inferred | Open question}

Issue:
{One paragraph describing what the interface does.}

Why it matters:
{One paragraph naming the cost. Reference the Color Dependence Law if the
dependence is non-obvious, and the CVD class affected.}

Evidence:
{State, surface, status/data mix, CVD class simulated, tool + version,
screenshot reference. If this line is empty, the finding fails Section 6 and
is not yet a finding.}

Fix:
{One paragraph. Should add a non-color channel — text, icon, shape, or
pattern — not merely swap one hue for another.}
```

**Severity definitions.** Severities and the section-Fail threshold are defined in [`../../shared/severity-model.md`](../../shared/severity-model.md). This audit uses them unchanged:

| Severity | Meaning in this audit |
|---|---|
| Critical | A CVD user cannot complete a core task or read core state because color is the sole channel. Includes any color-only red/green encoding of meaningful state [F1, F3], and any rainbow/jet or red-green diverging colormap encoding data [F6]. |
| High | Significant color dependence in a common workflow: color-only chart legend, color-only error/required signaling, color-only mode indication, or a color-accommodation control that is itself color-dependent [F5, F8, F9]. |
| Medium | Color dependence in a non-core surface; a failure seen only under dichromacy-only simulation pending anomalous-trichromacy confirmation [F15]; a buried-but-working accommodation control. |
| Low | Polish-level. Secondary surfaces, edge-case states, tritan-only ambiguity that survives for the dominant red-green population. |

**A single Critical or three Highs in any one section produces a section-level Fail** (per [`../../shared/severity-model.md`](../../shared/severity-model.md)). Domain preconditions live in this rubric: Section 4's dichromacy-only POTENTIAL-FAIL rule and Section 6's two-tier BLOCK rule are this audit's analogs of the Cognitive Load Audit's Section 4 precondition. They refine severity for specific cases; they do not override the shared threshold.

**Load-displaced-to enum.** The `Load displaced to:` field uses one or more values from the shared enum defined in [`../../shared/finding-format.md`](../../shared/finding-format.md). Color-dependence failures map onto it as follows:

- `visual decoding` — the user must work to decode meaning that hue would have carried instantly (the primary displacement for almost every CD finding)
- `memory` — the user must remember which color means what (e.g. "red dot = 3rd item from the legend")
- `trust` — the user must accept a status or value they cannot independently perceive
- `verification` — the user must leave the surface (hover for a tooltip, open a legend, check a tester) to confirm what a color was supposed to say
- `feature loss` — a color-blind mode removes capability or detail rather than adding a second cue
- `time` — distinguishing series or status that should be instant takes measurable seconds of decoding
- `recovery / undo` — the user acts on a misread color state and must undo
- `configuration` — the user must enable an accommodation mode to use the surface at all

A CD finding most often combines `visual decoding` with one of `memory`, `trust`, or `verification`. Findings with vague displacement targets are weaker findings. Do not invent new values; the enum is shared and fixed.

---

## Automatable vs judgment cut

| Section | Scanner-checkable | Skill / judgment required |
|---|---|---|
| 0. Color-only conveyance | No (1.4.1 is beyond scanners [F2]); missing label/alt can be flagged | Yes ("is color the sole carrier of meaning?") |
| 1. Chart / graph encoding | Partial (grayscale test is mechanical) | Yes (CVD-hue test, palette judgment, category count) |
| 2. Form validation | Partial (missing `aria-invalid` / label) | Yes ("is color the only error signal?") |
| 3. Mode / state indication | No | Yes (exercise state changes, judge under simulation) |
| 4. CVD simulation | Partial (tool-qualification is a checklist) | Yes (interpreting simulated output) |
| 5. Configuration cost | Partial (click-depth to controls) | Yes (does the mode add a non-color channel?) |
| 6. Evidence | No | Yes (process check) |

This audit is **not** "run axe and call it done." Axe, Lighthouse, and Pa11y check SC 1.4.3 luminance contrast; they cannot check SC 1.4.1 use-of-color [F2]. The entire leverage of this audit is the criterion the scanners cannot touch.

---

## Running this as a skill

The skill that runs this audit lives at [`skill/SKILL.md`](skill/SKILL.md). It walks the rubric defined above and produces three outputs: `color-dependence-findings.md`, `color-dependence-scorecard.json`, `remediation-priority-list.md`.

**Hierarchy.** The rubric is canonical. The skill never invents criteria. If the rubric and the skill disagree, the rubric wins. Updates to audit criteria go in this file first; the skill is updated to match. Pressure-test outputs live under `evidence/<run-id>/`. The PT0 target shortlist is in [`evidence/PT0-candidates.md`](evidence/PT0-candidates.md).

---

## References

- Birch, J. (2012). *Worldwide prevalence of red-green color deficiency*. Journal of the Optical Society of America A, 29(3), 313–320. DOI:10.1364/JOSAA.29.000313.
- W3C Web Accessibility Initiative. (2023). *Understanding SC 1.4.1: Use of Color (WCAG 2.2)*. https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html
- W3C Web Accessibility Initiative. (2018). *Understanding SC 1.4.1: Use of Color (WCAG 2.1)*. https://www.w3.org/WAI/WCAG21/Understanding/use-of-color.html
- W3C Web Accessibility Initiative. (2018). *Understanding SC 1.4.3: Contrast (Minimum) (WCAG 2.1)*. https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html
- W3C Web Accessibility Initiative. (2023). *Technique G14: Ensuring that information conveyed by color differences is also available in text*. https://www.w3.org/WAI/WCAG21/Techniques/general/G14.html
- Angerbauer, K., et al. (2022). *Accessibility for Color Vision Deficiencies: Challenges and Findings of a Large Scale Study on Visualizations*. CHI '22. DOI:10.1145/3491102.3502133.
- Crameri, F., Shephard, G. E., & Heron, P. J. (2020). *The misuse of colour in science communication*. Nature Communications, 11, 5444. DOI:10.1038/s41467-020-19160-7.
- Nuñez, J. R., Anderton, C. R., & Renslow, R. S. (2018). *Optimizing colormaps with consideration for color vision deficiency to enable accurate interpretation of scientific data*. PLoS ONE, 13(7), e0199239. DOI:10.1371/journal.pone.0199239.
- Tseng, C., et al. (2023). *Measuring Categorical Perception in Color-Coded Scatterplots*. CHI '23. DOI:10.1145/3544548.3581416.
- Guha, T., Fertig, E. J., & Deshpande, A. (2022). *Generating colorblind-friendly scatter plots for single-cell data* (the work that introduced the scatterHatch package). eLife, 11, e82128. DOI:10.7554/eLife.82128.
- Wong, B. (2011). *Points of View: Color blindness*. Nature Methods, 8, 441. DOI:10.1038/nmeth.1618.
- Almustanyir, A. (2025). *A Global Perspective of Color Vision Deficiency: Awareness, Diagnosis, and Lived Experiences*. Healthcare, 13(16), 2031. DOI:10.3390/healthcare13162031.
- Hofmann, L., & Palczewski, K. (2015). *Advances in understanding the molecular basis of the first steps in color vision*. Progress in Retinal and Eye Research, 49, 46–66. DOI:10.1016/j.preteyeres.2015.07.004.
- Lillo, J., Álvaro, L., & Moreira, H. (2014). *An experimental method for the assessment of color simulation tools*. Journal of Vision, 14(8), 15. DOI:10.1167/14.8.15.
- Machado, G. M., Oliveira, M. M., & Fernandes, L. A. F. (2009). *A physiologically-based model for simulation of color vision deficiency*. IEEE TVCG, 15(6), 1291–1298. DOI:10.1109/TVCG.2009.113.
- DaltonLens. (2021). *Review of Open Source Color Blindness Simulations* and *Understanding LMS-based Color Blindness Simulations*. https://daltonlens.org/opensource-cvd-simulation/ and https://daltonlens.org/understanding-cvd-simulation/
- Jamil, A., & Denes, G. (2024). *Investigating Color Blind User Interface Accessibility via Simulated Interfaces*. Computers, 13(2), 53. arXiv:2401.10357. DOI:10.3390/computers13020053.

---

*Draft — rubric authored 2026-06-02 (study-swarm, research-grounded). Not yet pressure-tested. The PT0 shortlist of calibration targets is in [`evidence/PT0-candidates.md`](evidence/PT0-candidates.md). The first pressure test calibrates Section 1 (chart encoding) and the Section 4 methods gate against a real target; the Contrast-Pass / Hue-Fail boundary rule is the specific behavior PT0 must exercise. See [`CHANGELOG.md`](CHANGELOG.md).*
