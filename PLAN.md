# PLAN

## Product goals
- HR reference: org structure, roles, competencies, compensation bands, headcount status
- Hiring framework: role templates, pipelines, evaluation, diversity metrics, budget guardrails

## Data model upgrades
- Extend sincoData.json and schema with:
  - roleId, jobFamily, level
  - competencies[]
  - salaryBand { min, mid, max, currency }
  - headcount { authorized, filled, open }
  - location, contractType, tags[]
  - hiringPipeline { stage, status, owner }
  - diversity { gender, ethnicity, disability, ageBands }
  - notes (non-exported)
- Validate via scripts/validate-data.mjs and schema/sinco.schema.json

## UI/UX features
- Role detail panel: responsibilities, competencies, interview rubrics, salary band, open reqs
- Hiring dashboard: open roles, pipeline by stage, time-to-fill, offers, SLAs
- Candidate view: anonymized aggregate charts only; no PII stored
- Filters/search: family, level, location, tags, open/filled
- Compare roles: side-by-side salary bands and competencies
- Diversity & equity: representation charts + hiring funnel drop-off
- Budget view: authorized vs filled cost; forecast with open roles
- Accessibility: extend ARIA/keyboard; focus traps, skip links, contrast tokens
- Mobile: larger tap targets, responsive panels, virtualized lists

## Analytics & metrics
- Org stats: headcount, openings, span of control
- Hiring KPIs: time-to-source/screen/offer/hire, stage conversion
- DEI KPIs: representation by family/level/location; funnel parity
- Compensation: compa-ratio by level; band coverage
- Export PNG/CSV

## Internationalization
- HR/legal terms in i18n resources; locale number/date; RTL readiness

## Performance
- Lazy load detail panels; memoize aggregates; debounce filters; reuse D3 selections; >10k nodes readiness

## Security & privacy
- No PII; only aggregates; strict CSP; sanitize DOM; exclude notes from exports by default

## Testing/CI
- Expand Playwright e2e; add unit tests for data processors
- CI: schema validate, build, LHCI budgets; JSON diff checks on large data changes

## Documentation
- Hiring framework guide: competencies library, leveling matrix, rubric templates, compensation philosophy
- Admin guide: data updates, schema rules, release checklist; CSV import spec

## Roadmap
- M1: Schema + validation + filters/search
- M2: Role detail + hiring dashboard basics + KPIs v1
- M3: Budget view + comp analytics + exports
- M4: DEI analytics + compare roles
- M5: Perf hardening + a11y AA audit + mobile virtualization
- M6: Docs + rubrics + governance
