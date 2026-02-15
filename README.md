# SalesSync UI Framework (v0)

A lightweight, custom CSS/JS framework extracted from the original SalesSync integration flow UI.

## Files
- `tokens.css` — design tokens (colors, spacing, radius, shadows)
- `components.css` — UI components (hero, toggle, legend, flow, cards, tabs, tables)
- `components.js` — behaviors (tabs, flow toggle, reveal)
- `demo.html` — example markup showing usage

## Usage
1. Include `tokens.css` then `components.css` in your page.
2. Include `components.js` at the end of the body.
3. Use the class names in `demo.html` as a starting point.

## Notes
- All styles are scoped under `.ss-ui` to avoid collisions.
- The JS expects elements with the classes used in `demo.html`.

## Themes
- Use `tokens.css` for dark (original) styling.
- Use `tokens.light.css` for light styling.
