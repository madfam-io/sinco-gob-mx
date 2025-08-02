# CRUSH.md

Project type: Static single-page app (index.html + sincoData.json) using vanilla JS and D3 v7.8.5. No package manager or build tooling is present.

Build/serve
- python -m http.server 8000  # Serve locally at http://localhost:8000
- npx http-server -p 8000     # Alternative if Node is available
- open http://localhost:8000  # macOS helper

Tests
- No test framework configured. For manual testing, load the app and use the search, view toggles, and node interactions. If you add tests later, document commands here.

Lint/format
- No configured linter/formatter. If adopting one, prefer Prettier (printWidth 100, semi true, singleQuote false) and ESLint with browser + ES2021.

Code style
- Modules: single inline <script> in index.html wrapped in an IIFE; keep code within that closure, avoid globals.
- Imports: use CDN for D3 only; do not add package.json unless project setup changes.
- Language: ES6+ only; prefer const/let; strict mode enabled.
- Types: JSDoc for complex objects (state, nodes) if adding new functions.
- Naming: camelCase for vars/functions, PascalCase for constructors, UPPER_SNAKE for constants.
- Functions: small, single-responsibility; group by sections used here (init, data processing, D3, rendering, events).
- Errors: catch fetch errors; show user-friendly message in #loader; never expose stack traces to UI.
- DOM access: cache selectors in DOM object; avoid repeated queries; update via fragments where possible.
- Performance: use debounce for input/resize; avoid unnecessary recalculations; reuse D3 selections.
- Formatting: 2-space indent; trailing commas where valid; template literals for HTML; avoid inline event handlers.
- Security: do not log secrets; sanitize any dynamic HTML; keep innerHTML usage constrained to known-safe content.

Cursor/Copilot rules
- No .cursor or Copilot instruction files present; if added, mirror key rules here.

Repo hygiene
- Add .crush directory to .gitignore; keep large data files out of version control unless necessary.
