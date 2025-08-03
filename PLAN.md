# SINCO Talent Intelligence – Productization & Execution Plan

Owner: EduConsultor Labs
Date: 2025-08-02
Status: Draft (v0.1)

## Vision

Deliver a talent intelligence platform for HR to benchmark occupations, design roles, set compensation bands, and forecast hiring, built on SINCO plus enriched labor market data.

## Personas & JTBD

- HR Business Partner: advise org design, talent strategies
- Talent Acquisition Lead: plan pipelines, reduce time-to-fill
- Compensation & Benefits: set/adjust comp bands, control budget variance
- Executives: monitor market dynamics, allocate headcount

## Modules (Phase 1–3)

1. Org Design

- Occupation mapping to internal job architecture
- Division -> Role -> Level hierarchy, skills & proficiency

2. Compensation

- Market benchmarks (percentiles, locality indices)
- Compensation band generator and simulator

3. Labor Supply

- Role scarcity, demand trends, education output
- Time-to-fill and acceptance probability forecasts

4. Hiring Pipeline

- Target profiles, sourcing mix, interview funnel health
- Alerts on hot roles and market shifts

5. Skills Heatmap

- Role-to-skill taxonomy, gap analysis, mobility suggestions

## Data Strategy

- Sources: SINCO, job postings, salary surveys, CPI, education, turnover
- Standardization: occupation-to-job mapping, skills taxonomy
- Governance: lineage, versioned datasets, methodology notes, confidence intervals

## UX Roadmap (90 days)

- 0–30d (M1): saved views, export (PDF/CSV), alerts MVP, role search with synonyms, comp band generator v1
- 31–60d (M2): skills taxonomy integration, locality indices, forecasting v1, SSO, audit logs
- 61–90d (M3): peer-group analytics, internal mobility insights, public/private benchmarks, API for HRIS/ATS

## Neobrutalism UI Plan

Goals

- Bold, high-contrast, functional aesthetics with accessible color contrast
- Reduced shadows/gradients; heavy borders, solid fills, chunky controls
- Maintain performance and a11y (focus states, touch targets)

Design tokens

- Colors: bg:#fff, text:#111, primary:#111, accent:#00D4FF, border:#111, muted:#f2f2f2, danger:#ff3366, success:#00cc66
- Radius: 0px (square), with rare 4px exceptions
- Border: 2–3px solid #111; focus: 3px outline offset
- Spacing scale: 4,8,12,16,24
- Typography: Inter or system UI; headings bold 800; base 16px; letter-spacing tight

Components to update

- Header: solid bar, thick bottom border
- Tabs: pill -> square buttons with 2px border; clear active state; focus rings
- Cards: solid background (muted), 2–3px border, no gradients; shadow only on active
- Buttons: square, 2px border, solid fills; hover invert; disabled dim
- Table: header/footer borders 2px; rows zebra-muted; compact padding
- Tree nodes: circles -> squares; thicker link strokes
- Badges: solid fills, uppercase, letter-spacing
- Tooltip: solid border, no blur; pointer triangle optional

Implementation steps

1) Add CSS tokens and neobrutal class names; keep old vars for fallback
2) Replace gradients/shadows with solid fills and borders
3) Update tree node styles and link stroke widths
4) Tighten focus states and keyboard outlines
5) Add reduced-motion support
6) Verify a11y and color-contrast (axe, Lighthouse)

Rollout

- Feature flag via body class .theme-neo; default off, toggle in header
- QA on mobile/desktop; collect feedback; then make default

Risks

- Contrast fatigue; mitigate with spacing and muted grays
- D3 layout readability with thicker strokes; test on dense trees

## Technical Roadmap

- Frontend: continue static SPA; progressively enhance with modules; keyboard/a11y-first; mobile responsive
- Backend (Phase 2): lightweight API for enrichment & forecasting; Python jobs for data ingestion; Postgres + object storage
- Integrations: HRIS/ATS (Workday, SAP SF, Greenhouse, Lever); BI connectors; Slack/Teams alerts
- Security: hardened CSP/headers; access control; audit logging; SSO (SAML/OIDC)

## Analytics & ML

- Forecast models: demand, time-to-fill, salary drift
- Skills gap & mobility recommendations
- Cohort benchmarks (industry/region/peer group)

## GTM & Pricing

- Tiers: Starter (benchmarking), Pro (forecasting + alerts), Enterprise (integrations + governance)
- Land-and-expand motion with onboarding & advisory

## Success Metrics

- Time-to-fill reduction, offer acceptance uplift, comp band alignment, budget variance, attrition on hot roles, HM satisfaction

## Delivery Plan & Milestones

- Milestone 1 (0–30d)
  - Role mapping tool (occupation -> internal job)
  - Comp band generator v1 (percentiles + localization)
  - Saved views + exports (PDF/CSV)
  - Alerts MVP
- Milestone 2 (31–60d)
  - Skills taxonomy integration
  - Forecasting v1 (time-to-fill, acceptance)
  - Locality indices; SSO; audit logs
- Milestone 3 (61–90d)
  - Peer-group analytics; mobility insights
  - Public/private benchmark networks
  - HRIS/ATS API and BI connectors

## Work Tracking

- Use this document as the canonical plan; changes tracked via PRs.
- Maintain a CHANGELOG in this file with date, author, and summary.

## Open Risks

- Data coverage and licensing for surveys/postings
- Model accuracy and explainability requirements
- Integration complexity with HRIS/ATS

---

## CHANGELOG

- 2025-08-02 (v0.1): Initial plan drafted (personas, modules, data, UX/tech/GTM roadmaps)
