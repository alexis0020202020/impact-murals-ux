# Claude Code — Logo Implementation Note

Use `public/assets/logo/impact-murals.svg`.

The asset is a working vector trace prepared from the supplied PNG. Do not redesign it.
Inline it as a reusable accessible component and preserve its final resting geometry.

Animate primarily:
- `impact-fragment-01` to `impact-fragment-16`

Keep mostly stable:
- `murals-wordmark`

Read the embedded fragment attributes:
- `data-vector-x`
- `data-vector-y`
- `data-motion-weight`
- `data-zone`

Use them to build one controlled impact impulse:
- tiny outward displacement;
- subtle rotation and layered depth;
- stronger but still restrained motion for central fragments;
- precise stabilization in `0.9s` to `1.2s`;
- no loop;
- no splash screen;
- no particles;
- no gaming or glossy 3D aesthetic;
- static fallback for `prefers-reduced-motion`.

Use the project's primary animation library only.
