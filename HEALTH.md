# Project Health Report

Date: 2025-08-02
Repository: sinco-gob-mx

## Summary
Overall, the project is a static SPA served from /public with vanilla JS + D3. It recently adopted Vite for local tooling but deploys static assets. Security posture improved with CSP. Primary risks: lack of automated tests, no lint/format enforcement in CI for HTML/inline scripts, runtime-only validation of data, missing accessibility and performance budgets, and minimal error reporting/observability.

## Architecture & Build
- Runtime: Static site (index.html, sincoData.json, app.js). No framework runtime.
- Tooling: Vite present for dev/build. Rollup input set to public/index.html.
- Bundle: D3 via CDN; app.js unbundled. No tree-shaking on D3 because CDN.
- Suggestion:
  - Consider bundling D3 and app.js via Vite to reduce blocking requests and enable minification/hash (keep CSP compatible with external script-src).
  - Generate dist/ with hashed filenames; keep vercel.json routing.

## Security
- CSP: meta tag enforces script-src 'self' cdnjs; style-src allows 'unsafe-inline'; connect-src 'self'. Good start.
  - Risk: inline style allowance; consider extracting critical inline styles or adding a style hash.
  - Add object-src 'none'; base-uri 'self'; frame-ancestors 'none' (or desired domains).
- No secrets stored.
- Fetch path switched to relative to avoid 404s.
- Recommendations:
  - Add Subresource Integrity (SRI) for D3 CDN.
  - Add Referrer-Policy, X-Content-Type-Options, X-Frame-Options/Frame-Options via meta or headers on Vercel.
  - Validate JSON against schema at build/CI (schema/sinco.schema.json already present).

## Data Integrity
- Schema present for sincoData.json.
- scripts/validate-data.mjs presumably validates; ensure it’s run in CI.
- App computes totals from hierarchy leaves (robust).
- Recommendations:
  - Enforce schema validation in CI and pre-deploy.
  - Add data freshness/version fields and surface last-updated in UI.

## Performance
- D3 renders a collapsible tree; zoom enabled.
- render costs: updateTree performs transitions for all nodes; OK for moderate data sizes.
- Search: linear scan over allNodes; acceptable. Debounced.
- Cards/Table: pagination added (25/page) to limit DOM size; good.
- Recommendations:
  - Defer D3 CDN with defer and set <script> at end already done; keep.
  - Use passive listeners for scroll/touch if added later.
  - Consider requestIdleCallback for initial cards/table populate if not in view.
  - Add lazy i18n loading per language only.

## Accessibility (a11y)
- ARIA roles for banner, main, tablist, tabpanel; good.
- Tooltip uses aria-live and aria-hidden toggling.
- Needs:
  - Keyboard navigation for tree nodes and view tabs.
  - Focus management when switching tabs.
  - Buttons should have aria-pressed or selected states where appropriate.
  - Ensure sufficient color contrast of gradients and badges.
  - Add labels for new pagination and expand/collapse controls.

## Internationalization (i18n)
- i18n resources exist (en/es) and runtime loader.
- Ensure new UI strings (Expandir/Colapsar, Anterior/Siguiente) are added to i18n files.
- Add lang switch persistence (localStorage).

## Code Quality
- Code is modular within an IIFE, follows ES6, debounced events, minimal globals; good.
- Missing linting for JS/HTML in CI.
- Recommendations:
  - ESLint + Prettier run on src/public app.js; add scripts and CI step.
  - Type hints via JSDoc for complex objects (state, nodes) to aid tooling.

## Testing
- tests/e2e.spec.ts exists (Playwright), but no test runner configured in CRUSH.md originally. CI includes Playwright? Check .github/workflows/ci.yml.
- Recommendations:
  - Add Playwright CI job to launch static server and run e2e.
  - Add a few unit tests for data processing with Vitest (if bundling) or simple Node tests for helpers.

## CI/CD
- ci.yml present; ensure it runs: schema validation, lint, build, e2e, and deploy previews.
- Recommendations:
  - Add job caching for node_modules if used.
  - Fail build on CSP regressions using csp-evaluator in CI.

## Observability
- No analytics, no error reporting.
- Recommendation: Add basic error boundary display (already shows loader error). Optionally add Sentry/lightweight logging (opt-in, privacy-aware).

## Documentation
- README exists. Should include local dev, test, build, deploy, CSP notes, data schema, and i18n process.
- Add HEALTH.md to track ongoing quality tasks.

## Actionable Checklist
- Security
  - [ ] Add object-src 'none', base-uri 'self', frame-ancestors policy to CSP
  - [ ] Add SRI to D3 CDN
  - [ ] Add security headers on Vercel (vercel.json or edge headers)
- Data
  - [ ] Enforce schema validation in CI for public/sincoData.json
  - [ ] Display data last-updated date in UI
- Performance
  - [ ] Bundle/minify app.js with Vite; consider bundling D3
  - [ ] Add performance budget check in CI (Lighthouse CI)
- Accessibility
  - [ ] Keyboard controls for tree (arrow keys) and tabs
  - [ ] Focus management on view switch
  - [ ] Translate new UI strings to en.json/es.json
- Testing/CI
  - [ ] Ensure Playwright e2e runs in CI against a local static server
  - [ ] Add lint/format checks (ESLint/Prettier) for public/app.js and HTML
  - [ ] Add unit tests for helpers (debounce, stats, salary class)
- Docs
  - [ ] Update README with dev/test/build/run instructions and CSP rationale
  - [ ] Document i18n workflow and adding new strings

## Notable Files Reviewed
- public/index.html: main markup, styles, CSP, D3 include
- public/app.js: app logic (tree/table/cards/search/pagination/a11y basics)
- public/i18n/*: translations
- schema/sinco.schema.json: data schema
- scripts/validate-data.mjs: data validation utility
- .github/workflows/ci.yml: CI setup
- vercel.json: deploy config and routes

## Risks
- CDN reliance for D3 without SRI
- No automated regression tests for UI interactions beyond single e2e
- Accessibility gaps may affect keyboard/screen reader users
- CSP relies on meta; headers preferable in production

## Conclusion
Health is fair with recent functional and security improvements. Prioritize CI-backed data validation, lint/tests, CSP hardening, and a11y/pagination i18n to reach a solid baseline.
