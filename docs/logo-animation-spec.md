# Impact Murals — Logo Animation Specification

## Source asset
Use:
`public/assets/logo/impact-murals.svg`

This is a **working vector trace reconstructed from the supplied raster logo**.
It is suitable for prototyping the web animation, but it should be replaced later if the original brand vector becomes available.

Do not intentionally redesign the mark.
The final resting state must match the supplied SVG exactly.

## SVG structure
- Root: `impact-murals-logo`
- Upper wordmark: `impact-wordmark`
- Animatable fragments: `impact-fragment-01` to `impact-fragment-16`
- Stable lower wordmark: `murals-wordmark`
- Lower shapes: `murals-shape-01` to `murals-shape-07`

## Embedded motion data
Each `impact-fragment-*` path includes:
- `data-vector-x`
- `data-vector-y`
- `data-motion-weight`
- `data-zone`
- `data-center-x`
- `data-center-y`

Use these values to derive a controlled displacement from the shared impact origin rather than assigning random directions.

`data-zone="central"` fragments may receive slightly more visible movement.
`data-zone="outer"` fragments should move less.

## Visual intent
The logo should react as if a controlled force has passed through the upper wordmark.
The result must feel:
- premium;
- architectural;
- material;
- short;
- precise;
- slightly dimensional.

It must not feel:
- explosive;
- cartoonish;
- gaming-inspired;
- glossy;
- permanently animated.

## Recommended behavior
1. The logo is readable immediately.
2. Upper fragments begin with a very small offset along their embedded vectors.
3. Add restrained rotation and depth based on `data-motion-weight`.
4. Use a short impulse and controlled settling motion.
5. Keep `murals-wordmark` almost static; a tiny opacity or vertical stabilization is acceptable.
6. Total load sequence: approximately `0.9s` to `1.2s`.
7. No loop.
8. Optional light desktop hover response only.
9. Disable movement for `prefers-reduced-motion`.
10. Do not block navigation or CTA interaction during the animation.

## Color
The SVG uses `currentColor`.
Control logo color from the component or surrounding CSS rather than editing individual paths.

## Technical guidance
- Inline the SVG in the Astro component so individual fragment paths are addressable.
- Use the project's single primary animation library.
- Motion is sufficient for an isolated logo animation.
- Use GSAP only if it is already the chosen animation system for the whole landing.
