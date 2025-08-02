# CRUSH.md

Project type: Static single-page app (index.html + sincoData.json) using vanilla JS and D3 v7.8.5. Built and served from public/; Vite present for build/preview.

Build/serve

- python -m http.server 8000 -d public # Serve locally at http://localhost:8000 from public/
- npx http-server public -p 8000 # Alternative if Node is available
- npm run dev # Vite dev server
- npm run build && npm run preview # Build to dist/ and preview
- open http://localhost:8000 # macOS helper

Lighthouse & a11y

- npx -y @lhci/cli autorun --config=.lighthouserc.json # Run Lighthouse CI locally
- npx -y axe-core@latest http://127.0.0.1:8000 --tags wcag2a,wcag2aa,best-practice || true # Basic axe scan (requires server running)

Tests

- No unit tests yet. For manual testing: load the app and use search, view toggles, node interactions.
- npm run check:links # Link check (requires server running)

Data validation

- npm run check:schema # Validate public/sincoData.json against schema/sinco.schema.json

Lint/format

- npm run lint
- npm run check:format

Code style

- Modules: single script files loaded via <script> from public/; avoid globals, use IIFE or module pattern.
- Imports: use CDN for D3 only.
- Language: ES6+; prefer const/let; strict mode enabled.
- Types: JSDoc for complex objects (state, nodes) if adding new functions.
- Naming: camelCase for vars/functions, PascalCase for constructors, UPPER_SNAKE for constants.
- Functions: small, single-responsibility; group by sections used here (init, data processing, D3, rendering, events).
- Errors: catch fetch errors; show user-friendly message in #loader; never expose stack traces to UI.
- DOM access: cache selectors in DOM object; avoid repeated queries; update via fragments where possible.
- Performance: use debounce for input/resize; avoid unnecessary recalculations; reuse D3 selections.
- Formatting: 2-space indent; trailing commas where valid; template literals for HTML; avoid inline event handlers.
- Security: do not log secrets; sanitize any dynamic HTML; keep innerHTML usage constrained to known-safe content.

Repo hygiene

- Add .crush directory to .gitignore; keep large data files out of version control unless necessary.
