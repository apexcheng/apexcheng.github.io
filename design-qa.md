# Design QA — GROUPBY + XLOOKUP 高性能汇总

## Visual truth

- Selected direction: option 2, “data compression theater”.
- Full source reference: `/workspace/scratch/64ac202b2fc4/generated_images/exec-ccd2da54-3856-4f06-bad7-aff37de36b98.png` (1487 × 1058).
- Mechanism crop used for comparison: `/workspace/scratch/64ac202b2fc4/source-option-2-mechanism.png` (1090 × 775).
- Formula crop used for focused comparison: `/workspace/scratch/64ac202b2fc4/source-option-2-formula.png`.

## Implementation evidence

- Desktop capture: `/tmp/groupby-runtime-desktop-qa2.png` (854 × 1323 pixels).
- Desktop CSS bounds: 853.687 × 1322.508 at approximately 1× density.
- Focused formula capture: `/tmp/groupby-formula-focused-qa2.png` (1608 × 348 Retina capture).
- Mobile capture: `/tmp/groupby-runtime-mobile-qa2.png` (390 × 844 viewport).
- Mobile runtime bounds: 296.797 × 3014.867 CSS pixels.
- Tested state: article default state, plus table-of-contents navigation to the GROUPBY section.

## Full-view comparison

The implementation preserves the selected reference's principal mechanism: source rows become a composite key, GROUPBY compresses repeated records into unique key/sum pairs, TAKE exposes lookup and return columns, and XLOOKUP returns the result array. Numbered stages, warm paper background, navy/coral/mustard accents, and the repeated-scan comparison remain visually aligned with the source direction.

The reference's single horizontal row was deliberately reflowed into a 3 × 2 desktop grid because the production article uses a constrained reading column with persistent metadata and table-of-contents rails. This preserves legibility and avoids collisions while maintaining the same reading order. On mobile, the stages become one sequential column.

## Focused comparison

The formula panel was checked separately against the source formula crop. The implementation uses the article's exact formula and maps each highlighted sub-expression to its visual stage. This is more semantically accurate than the generated reference text while keeping the same hierarchy and color-coded mechanism.

## Comparison history

### Pass 1

- P2: The principal board did not expose the exact formula-to-stage mapping clearly enough.
- P2: Several internal labels and muted accents were too small or too low-contrast for sustained reading.

Changes applied:

- Added an exact formula panel beneath the six-stage runtime board.
- Added color-coded mappings for srcKey, GROUPBY, TAKE, and XLOOKUP.
- Increased internal table and label type sizes.
- Adjusted muted and coral tokens to meet contrast targets.
- Added explicit dark-mode tokens and responsive stacking.

### Pass 2

- No P0, P1, or P2 issues remained.
- Intentional P3-level difference: the horizontal source flow reflows to a 3 × 2 desktop grid and a one-column mobile sequence to respect the existing article shell.

### Pass 3

- Added a compact before/after compression band ahead of the six-stage board.
- The production example now exposes the 8-row detail input and 4-row unique-Key output before readers enter the formula stages.
- Desktop uses a 317 / 150 / 317 pixel comparison; mobile stacks the same sequence into one 269-pixel column.
- No desktop or mobile horizontal overflow was introduced.

## Mandatory fidelity surfaces

- Typography and iconography: existing production font and icon systems retained.
- Logos and imagery: existing site logo retained; no external raster asset is required for the mechanism diagram.
- Hero or decorative graphics: reference cylinder is represented as a semantic GROUPBY engine card.
- Key colors and gradients: navy, coral, mustard, mint, and warm-paper palette retained with dark-mode equivalents.
- Visual treatments: numbered stages, data tables, arrows, route strip, formula strip, and repeated-scan comparison retained.
- Layout and density: information density preserved while adapting to the production reading column.

## Browser verification

- Desktop horizontal overflow: none.
- Mobile horizontal overflow: none.
- Compression band desktop bounds: 803.687 × 123.75 CSS pixels.
- Compression band mobile bounds: 269.203 × 364.687 CSS pixels.
- Console errors: none.
- Primary interaction: table-of-contents link navigates to the GROUPBY section and aligns the heading with the viewport.
- Build and automated test results are recorded in the delivery verification.

final result: passed
