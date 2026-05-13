# Evidence states

Every finding produced by an audit carries one of three evidence states. Findings without an evidence state are not findings — they are open questions.

## States

| State | Meaning | When to use |
|---|---|---|
| **Observed** | Seen directly in live session, with screenshot, click path, or direct interaction | Default for findings collected on Path 1 (live navigation) |
| **Inferred** | Strongly implied by observed behavior or by documented design (DOM/CSS classes, framework patterns, vendor documentation) but not directly proven on the target run | Use sparingly; the inference chain must be explicit in the Evidence line |
| **Open question** | Plausible issue, but evidence is insufficient | Default for any finding that does not meet Observed or Inferred. Resolution path must be documented. |

## The Inferred fallback

Some audits cannot run with full live observation — responsive layouts on rigs that won't render below specific viewport widths, products behind auth gates, intermittent runtime states. DOM/CSS-class analysis or vendor documentation is acceptable Inferred evidence, **provided**:

- The limitation is documented in the scorecard's `context.viewport_render_limitation` field (or equivalent)
- The inference cites the specific framework class, component pattern, or vendor doc being interpreted
- The cleaner path (headless browser with explicit viewport, signed-in session, etc.) is acknowledged as preferred when available

Vendor documentation as evidence is acceptable but weaker than live observation. A doc-fallback run should be labeled clearly (e.g., `pt2-outlook-doc-fallback`) and should not be treated as carrying the same evidence strength as a live PT.

## The discipline rule

Findings without evidence are downgraded to Open questions, not laundered into Observed findings. This is the brake against manufacturing findings to fit a test's scope.

The auditor's job is to record what was seen, not what would feel satisfying to claim. A pressure test designed to find a specific failure shape (e.g. "find a Removed-power case") is at structural risk of over-fitting. Treat that as a flag for extra reclassification discipline: start conservative, re-check after the run, accept the downgrade if the evidence demands it. Findings that survive second-pass reclassification are the real output.
