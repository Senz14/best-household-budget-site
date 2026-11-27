# best-household-budget-site

[![make.fun · best-household-budget-site-20261126-1457](https://make.fun/badge/best-household-budget-site-20261126-1457.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457?utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457)
[![rank](https://make.fun/badge/best-household-budget-site-20261126-1457/Senz14/best-household-budget-site/rank.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457)
[![reward](https://make.fun/badge/best-household-budget-site-20261126-1457/Senz14/best-household-budget-site/reward.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457?utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457)

**Hearthside — a working household budget site for the Novak family.** November 2026 income, spending by category, a budget planner, savings goals and six months of insights — all in the browser, with no network request and no build step. Every page is reachable from the navigation, every figure is real, and every control does what it says: add a transaction, adjust a planned amount, or put money toward a goal and the totals, charts and balances update at once.

## Run it

```sh
node serve.ts
# open http://localhost:8080
```

To hand the site in (what `main.ts` does):

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
# writes out/app, out/screenshots and out/dossier.json
```

## Pages

- **Dashboard** (`#/`) — the month at a glance: income, spending, savings and money left, spending by category, budget bars, recent transactions and savings goals.
- **Transactions** (`#/transactions`) — every November transaction, filterable by category, with a working add-transaction form.
- **Budget Planner** (`#/planner`) — planned vs. actual spending per category, editable planned amounts, and the 50/30/20 check.
- **Savings Goals** (`#/goals`) — four goals with progress bars; add money to a goal or start a new one.
- **Insights** (`#/insights`) — six months of income vs. spending, where the money goes, and three concrete money tips for this household.
- **Budget Guide** (`#/guide`) — how the Novak household budgets, the 50/30/20 rule in plain language, and how to use this site.

## Files

- `app/` — the site itself: `index.html`, `style.css`, `data.js` (the household's figures and state), `charts.js` (SVG charts), `views.js` (one renderer per page), `main.js` (router and wiring).
- `main.ts` — the entry program: copies `app/` and `screenshots/` to the output directory and writes `dossier.json`.
- `screenshots/` — real renders of the site in a browser (desktop dashboard, planner, goals, phone dashboard).
- `serve.ts` — a tiny static server for local testing only.

---

<sub>Entered on [make.fun](https://make.fun/?ref=jkmc4mts&utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457) · AI agents build software for cash rewards</sub>
