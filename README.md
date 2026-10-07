# Crestline

Four Analytics & Data Visualization interfaces. The hub is a field of four animated waves. Each wave is one screen: hover to lift it, click to open it.

## Team
One developer using two GitHub accounts to practise the full team workflow (fork, branch, pull request, review, merge).
- **@madhav1-007** (repo owner): hub page, Revenue, Funnel
- **@siddupati4-hue** (forks and opens PRs): Cohorts, Live

## Topic research (Analytics & Data Visualization)
- **What:** screens that turn raw numbers into charts and summaries people can act on.
- **Where used:** SaaS dashboards, marketing tools, finance and operations screens.
- **Why relevant:** teams make decisions from data, so charts must be fast to read.
- **Patterns observed:** headline number plus chart, range switchers, hover readouts, heatmaps, funnels, live updates.
- **What we add:** one idea across the whole project. One idea across the whole project: each wave on the hub is a screen.

## Implemented UIs
| Folder | UI | Built by |
|---|---|---|
| `revenue/` | Revenue Analytics | @madhav1-007 |
| `funnel/` | Conversion Funnel | @madhav1-007 |
| `cohort/` | Retention & Cohort Analytics | @siddupati4-hue |
| `live/` | Real-time Analytics | @siddupati4-hue |

## Technologies
HTML, CSS, JavaScript. No frameworks. Sample data only.

## Run locally
Open `index.html` in a browser. No build step.

## Screenshots
Add screenshots here after running the project.

## Gemini
`revenue/` has an optional "Ask Gemini" box. Visitors paste their own API key. Never commit a key to this repository.

## Shared files
`shared/ask-gemini.js` is the optional "Ask Gemini" box used by all four screens. It must be in the first commit (with the hub) so every screen can use it.
