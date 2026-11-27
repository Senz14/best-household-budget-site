// Hearthside views: one renderer per page. Each returns an HTML string
// built from the state in data.js; main.js puts it on the page and wires
// the controls. Nothing here fetches anything — every figure comes from
// the household's own data.

import {
  CATEGORIES, INCOME, MONTHS, MONTH, categoryOf, money, shortDate,
  spentByCategory, totals, plannedTotal, ruleSplit,
} from './data.js';
import { donutChart, trendChart, planBar } from './charts.js';

function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function budgetBars(state, limit = 0) {
  const spent = spentByCategory(state);
  const rows = CATEGORIES.map((c) => ({ ...c, spent: spent[c.id], planned: state.planned[c.id] }))
    .sort((a, b) => b.spent - a.spent);
  const shown = limit ? rows.slice(0, limit) : rows;
  return shown.map((c) => {
    const left = c.planned - c.spent;
    const over = left < 0;
    return `<div class="budget-row">
      <div class="row-head"><span><span class="dot" style="background:${c.color}"></span>${esc(c.name)}</span>
      <span class="spent">${money(c.spent)} of ${money(c.planned)}</span></div>
      ${planBar(c.planned, c.spent)}
      <div class="row-foot"><span>${over ? 'Over plan' : 'Within plan'}</span><span>${over ? money(-left) + ' over' : money(left) + ' left'}</span></div>
    </div>`;
  }).join('');
}

function transactionRows(state, list) {
  return list.map((t) => {
    const cat = t.category === 'savings' ? { name: 'Savings', color: '#c05f33' } : categoryOf(t.category);
    return `<tr>
      <td>${shortDate(t.date)}</td>
      <td><strong>${esc(t.merchant)}</strong><br><span class="small">${esc(t.note || '')}</span></td>
      <td><span class="tag${t.category === 'savings' ? ' savings' : ''}" style="background:${cat.color}22;color:${cat.color}">${esc(cat.name)}</span></td>
      <td class="num">${money(t.amount)}</td>
      <td class="num hide-phone"><button type="button" class="danger" data-action="delete-tx" data-id="${t.id}" aria-label="Delete ${esc(t.merchant)}">Remove</button></td>
    </tr>`;
  }).join('');
}

export function renderDashboard(state) {
  const t = totals(state);
  const spent = spentByCategory(state);
  const slices = CATEGORIES.map((c) => ({ label: c.name, value: spent[c.id], color: c.color }))
    .filter((s) => s.value > 0)
    .sort((a, b) => b.value - a.value);
  const recent = [...state.transactions].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 8);
  const topGoals = [...state.goals].sort((a, b) => (b.saved / b.target) - (a.saved / a.target)).slice(0, 2);

  return `
  <div class="page-head">
    <p class="kicker">Dashboard</p>
    <h1>November at a glance</h1>
    <p class="lede">The Novak household — Daniel and Priya, two kids, one dog — brought in ${money(t.income)} this month, spent ${money(t.spent)}, moved ${money(t.saved)} to savings, and has ${money(t.left)} left to spend.</p>
  </div>

  <div class="grid grid-4">
    <div class="card stat good"><div class="label">Income</div><div class="value">${money(t.income)}</div><div class="sub">Two salaries, paid Nov 1</div></div>
    <div class="card stat"><div class="label">Spent</div><div class="value">${money(t.spent)}</div><div class="sub">${money(plannedTotal(state) - t.spent)} under the ${money(plannedTotal(state))} plan</div></div>
    <div class="card stat good"><div class="label">Saved</div><div class="value">${money(t.saved)}</div><div class="sub">Automatic transfer on payday</div></div>
    <div class="card stat ${t.left < 0 ? 'warn' : 'good'}"><div class="label">Left to spend</div><div class="value">${money(t.left)}</div><div class="sub">${t.left >= 0 ? 'On track for the month' : 'Over the monthly income'}</div></div>
  </div>

  <div class="grid grid-main" style="margin-top:16px">
    <div class="card">
      <h2>Where the money went</h2>
      <div class="donut-wrap">${donutChart(slices)}</div>
      <ul class="legend">
        ${slices.map((s) => `<li><span class="dot" style="background:${s.color}"></span>${esc(s.label)} <span class="amt">— ${money(s.value)}</span></li>`).join('')}
      </ul>
    </div>
    <div class="card">
      <h2>Budget check</h2>
      ${budgetBars(state, 5)}
      <p style="margin-top:14px"><a class="btn secondary" href="#/planner">Open the Budget Planner</a></p>
    </div>
  </div>

  <div class="grid grid-2" style="margin-top:16px">
    <div class="card">
      <h2>Recent transactions</h2>
      <table><thead><tr><th>Date</th><th>What</th><th>Category</th><th class="num">Amount</th></tr></thead>
      <tbody>${transactionRows(state, recent)}</tbody></table>
      <p style="margin-top:14px"><a class="btn secondary" href="#/transactions">See all ${state.transactions.length} transactions</a></p>
    </div>
    <div class="card">
      <h2>Savings goals</h2>
      ${topGoals.map((g) => {
        const pct = Math.round((g.saved / g.target) * 100);
        return `<div class="budget-row"><div class="row-head"><span>${esc(g.name)}</span><span class="spent">${money(g.saved)} of ${money(g.target)}</span></div>
        <div class="bar"><span style="width:${pct}%"></span></div>
        <div class="row-foot"><span>${pct}% there</span><span>${money(g.target - g.saved)} to go</span></div></div>`;
      }).join('')}
      <p style="margin-top:14px"><a class="btn secondary" href="#/goals">Open Savings Goals</a></p>
    </div>
  </div>`;
}

export function renderTransactions(state) {
  const sorted = [...state.transactions].sort((a, b) => b.date.localeCompare(a.date) || b.id.localeCompare(a.id));
  return `
  <div class="page-head">
    <p class="kicker">Transactions</p>
    <h1>Every dollar, November 2026</h1>
    <p class="lede">${state.transactions.length} transactions. Filter by category or search for a shop — or add one of your own below; the totals everywhere update at once.</p>
  </div>

  <div class="grid grid-main">
    <div class="card">
      <div class="form-row" style="margin-bottom:12px">
        <div class="field"><label for="f-cat">Category</label>
          <select id="f-cat"><option value="">All categories</option>
          ${CATEGORIES.map((c) => `<option value="${c.id}">${esc(c.name)}</option>`).join('')}
          <option value="savings">Savings</option></select></div>
        <div class="field"><label for="f-q">Search</label>
          <input id="f-q" type="search" placeholder="e.g. GreenMart"></div>
      </div>
      <table><thead><tr><th>Date</th><th>What</th><th>Category</th><th class="num">Amount</th><th class="num hide-phone"></th></tr></thead>
      <tbody id="tx-body">${transactionRows(state, sorted)}</tbody></table>
      <p class="small" id="tx-count">${sorted.length} transactions shown</p>
    </div>

    <div class="card">
      <h2>Add a transaction</h2>
      <form id="add-tx">
        <div class="field"><label for="tx-date">Date</label><input id="tx-date" type="date" value="2026-11-27" required></div>
        <div class="field"><label for="tx-merchant">Where / what</label><input id="tx-merchant" type="text" placeholder="e.g. GreenMart Supermarket" required maxlength="80"></div>
        <div class="form-row">
          <div class="field"><label for="tx-category">Category</label>
            <select id="tx-category">${CATEGORIES.map((c) => `<option value="${c.id}">${esc(c.name)}</option>`).join('')}<option value="savings">Savings</option></select></div>
          <div class="field"><label for="tx-amount">Amount ($)</label><input id="tx-amount" type="number" min="0.01" step="0.01" placeholder="0.00" required></div>
        </div>
        <div class="field"><label for="tx-note">Note (optional)</label><input id="tx-note" type="text" placeholder="e.g. Weekly shop" maxlength="120"></div>
        <button type="submit">Add transaction</button>
      </form>
      <p class="small" style="margin-top:12px">Income for the month is fixed — the two November salaries (${money(INCOME[0].amount)} + ${money(INCOME[1].amount)}) — because this page tracks spending.</p>
    </div>
  </div>`;
}

export function renderPlanner(state) {
  const t = totals(state);
  const planned = plannedTotal(state);
  const rule = ruleSplit(state);
  return `
  <div class="page-head">
    <p class="kicker">Budget Planner</p>
    <h1>Plan the month, then check it</h1>
    <p class="lede">Set what each category may cost, and the bars show what actually happened. Change a planned amount and the plan totals update immediately — the plan is yours, not a template.</p>
  </div>

  <div class="grid grid-4" style="margin-bottom:16px">
    <div class="card stat"><div class="label">Planned spending</div><div class="value">${money(planned)}</div><div class="sub">Across ${CATEGORIES.length} categories</div></div>
    <div class="card stat"><div class="label">Actually spent</div><div class="value">${money(t.spent)}</div><div class="sub">${money(planned - t.spent)} under plan</div></div>
    <div class="card stat"><div class="label">Planned to save</div><div class="value">${money(t.saved)}</div><div class="sub">Transfer on payday</div></div>
    <div class="card stat good"><div class="label">Planned leftover</div><div class="value">${money(t.income - planned - t.saved)}</div><div class="sub">Income ${money(t.income)} minus plan and savings</div></div>
  </div>

  <div class="grid grid-main">
    <div class="card">
      <h2>Planned vs. actual</h2>
      ${CATEGORIES.map((c) => {
        const spent = spentByCategory(state)[c.id];
        const p = state.planned[c.id];
        const left = p - spent;
        return `<div class="budget-row">
          <div class="row-head"><span><span class="dot" style="background:${c.color}"></span>${esc(c.name)}</span>
          <span class="spent">${money(spent)} of ${money(p)}</span></div>
          ${planBar(p, spent)}
          <div class="row-foot"><span>${left < 0 ? 'Over by ' + money(-left) : money(left) + ' left'}</span>
          <span>Plan: $<input type="number" min="0" step="1" value="${p}" data-planned="${c.id}" aria-label="Planned amount for ${esc(c.name)}" style="width:84px;display:inline-block;padding:3px 7px"> / month</span></div>
        </div>`;
      }).join('')}
    </div>
    <div class="card">
      <h2>The 50/30/20 check</h2>
      <p>A common guide splits take-home pay into <strong>50% needs</strong>, <strong>30% wants</strong> and <strong>20% savings</strong>. Here is where November actually landed:</p>
      <div class="rule-strip" style="grid-template-columns:1fr;margin-bottom:12px">
        <div><div class="pct needs">${rule.needsPct}%</div><strong>Needs</strong><br><span class="small">${money(rule.needs)} — housing, groceries, utilities, transport, health, school</span></div>
        <div><div class="pct wants">${rule.wantsPct}%</div><strong>Wants</strong><br><span class="small">${money(rule.wants)} — dining out, fun, clothes, treats</span></div>
        <div><div class="pct saves">${rule.savedPct}%</div><strong>Saved</strong><br><span class="small">${money(rule.saved)} — the $800 transfer plus what's left over</span></div>
      </div>
      <p>Needs run at ${rule.needsPct}% — above the 50% guide, mostly because rent is $1,650 of a ${money(t.income)} income. That is the honest picture for this family: the fix is not a stricter grocery list, it is protecting the savings transfer first and letting wants flex.</p>
      <p><a class="btn secondary" href="#/insights">See the full Insights page</a></p>
    </div>
  </div>`;
}

export function renderGoals(state) {
  const totalSaved = state.goals.reduce((a, g) => a + g.saved, 0);
  const totalTarget = state.goals.reduce((a, g) => a + g.target, 0);
  return `
  <div class="page-head">
    <p class="kicker">Savings Goals</p>
    <h1>Saving for what comes next</h1>
    <p class="lede">${money(totalSaved)} saved toward ${money(totalTarget)} of goals. Add money to any goal — the bar and the total move right away — or start a new one.</p>
  </div>

  <div class="grid grid-2">
    ${state.goals.map((g) => {
      const pct = Math.min(100, Math.round((g.saved / g.target) * 100));
      return `<div class="card goal">
        <div class="goal-head"><h2 style="margin:0">${esc(g.name)}</h2>
        <div class="goal-amount">${money(g.saved)} <span>of ${money(g.target)}</span></div></div>
        <p class="small" style="margin:0">${esc(g.note || '')}</p>
        <div class="bar"><span style="width:${pct}%"></span></div>
        <div class="row-foot" style="display:flex;justify-content:space-between;font-size:.86rem;color:var(--muted)"><span>${pct}% there</span><span>${money(Math.max(0, g.target - g.saved))} to go</span></div>
        <form class="goal-actions" data-goal-add="${g.id}">
          <input type="number" min="1" step="1" value="50" aria-label="Amount to add to ${esc(g.name)}" required>
          <button type="submit" class="small">Add money</button>
          <button type="button" class="small secondary" data-action="quick-add" data-id="${g.id}" data-amount="50">+ $50</button>
          <button type="button" class="small secondary" data-action="quick-add" data-id="${g.id}" data-amount="100">+ $100</button>
        </form>
      </div>`;
    }).join('')}
  </div>

  <div class="card" style="margin-top:16px">
    <h2>Start a new goal</h2>
    <form id="new-goal">
      <div class="form-row">
        <div class="field"><label for="goal-name">Goal name</label><input id="goal-name" type="text" placeholder="e.g. New washing machine" required maxlength="60"></div>
        <div class="field"><label for="goal-target">Target amount ($)</label><input id="goal-target" type="number" min="1" step="1" placeholder="1000" required></div>
      </div>
      <div class="field"><label for="goal-note">Why this goal? (optional)</label><input id="goal-note" type="text" placeholder="e.g. The old one is on its last legs" maxlength="120"></div>
      <button type="submit">Create goal</button>
    </form>
  </div>`;
}

export function renderInsights(state) {
  const t = totals(state);
  const spent = spentByCategory(state);
  const ranked = CATEGORIES.map((c) => ({ ...c, spent: spent[c.id] })).sort((a, b) => b.spent - a.spent);
  const rule = ruleSplit(state);
  const biggest = ranked[0];
  const dining = spent.dining;
  return `
  <div class="page-head">
    <p class="kicker">Insights</p>
    <h1>Six months, three lessons</h1>
    <p class="lede">Income has held steady around ${money(6150)} a month while spending moves between ${money(4390)} and ${money(4760)}. November's ${money(t.spent)} is the second-lowest of the half-year — and still ${money(t.left)} is left over.</p>
  </div>

  <div class="grid grid-main">
    <div class="card">
      <h2>Income vs. spending</h2>
      ${trendChart(MONTHS)}
      <p class="small">Every month since June, income has covered spending with room to save. August was the dearest month (${money(4760)}) — the car service and the back-to-school shop landed together.</p>
    </div>
    <div class="card">
      <h2>Where November went</h2>
      <table><thead><tr><th>Category</th><th class="num">Spent</th><th class="num">Share</th></tr></thead>
      <tbody>${ranked.slice(0, 6).map((c) => `<tr><td><span class="dot" style="background:${c.color}"></span>${esc(c.name)}</td><td class="num">${money(c.spent)}</td><td class="num">${Math.round((c.spent / t.spent) * 100)}%</td></tr>`).join('')}</tbody></table>
      <p class="small">${esc(biggest.name)} is the biggest slice at ${money(biggest.spent)} — ${Math.round((biggest.spent / t.spent) * 100)}% of all spending. It is also the least flexible: rent and insurance do not move month to month.</p>
    </div>
  </div>

  <h2>Three things worth doing</h2>
  <div class="tip"><strong>Keep the payday transfer sacred.</strong> The $800 moves to savings on the 1st, before anything is spent. November still ended ${money(t.left)} ahead — the transfer is why, not willpower.</div>
  <div class="tip"><strong>One home-cooked weekend dinner a week.</strong> Dining out cost ${money(dining)} in November — $16 under plan, but still the family's most flexible spend. Swapping one restaurant dinner for a cooked one each week saves roughly $60 a month.</div>
  <div class="tip"><strong>Groceries: the list works.</strong> Groceries came in $38 under plan. The shops that stuck to a list (Nov 8, Nov 19) were the cheapest of the month; the Thanksgiving-week shop was the dearest. Keep the list, keep the savings.</div>

  <h2>The 50/30/20 split, November</h2>
  <div class="rule-strip">
    <div><div class="pct needs">${rule.needsPct}%</div><strong>Needs</strong><br><span class="small">${money(rule.needs)} of ${money(t.income)}</span></div>
    <div><div class="pct wants">${rule.wantsPct}%</div><strong>Wants</strong><br><span class="small">${money(rule.wants)} of ${money(t.income)}</span></div>
    <div><div class="pct saves">${rule.savedPct}%</div><strong>Saved</strong><br><span class="small">${money(rule.saved)} of ${money(t.income)}</span></div>
  </div>
  <p class="small" style="margin-top:12px">Needs above 50% is not a failure — it is what rent costs where this family lives. The guide is a direction, not a grade.</p>`;
}

export function renderGuide() {
  return `
  <div class="page-head">
    <p class="kicker">Budget Guide</p>
    <h1>How the Novak household budgets</h1>
    <p class="lede">No spreadsheets at midnight, no guilt. A household budget is a plan for the month, written before the month spends itself.</p>
  </div>

  <div class="grid grid-main">
    <div class="card">
      <h2>The method, in five steps</h2>
      <ol class="guide-steps">
        <li><strong>Pay yourself first.</strong> On payday, $800 moves to savings before anything else. What is left is what the month may spend — never the other way round.</li>
        <li><strong>Give every dollar a job.</strong> The Budget Planner sets a number for each category — housing, groceries, transport, all of it — so money is spent on purpose, not by accident.</li>
        <li><strong>Track as you go.</strong> Every receipt lands on the Transactions page the day it happens. A budget checked once a month is a history lesson; checked weekly, it is a steering wheel.</li>
        <li><strong>Compare, don't scold.</strong> At month's end, planned vs. actual shows where the plan was wrong — usually the plan, not the person. Adjust the plan, not the family.</li>
        <li><strong>Save for named things.</strong> “Emergency fund” beats “savings” because you can picture it. Four goals, each with a number and a reason, sit on the Savings Goals page.</li>
      </ol>
    </div>
    <div class="card">
      <h2>The 50/30/20 rule</h2>
      <p>Split take-home pay three ways:</p>
      <p><strong>50% needs</strong> — the bills that keep the household running: rent, groceries, utilities, transport, health, school.</p>
      <p><strong>30% wants</strong> — the life that makes the running worthwhile: eating out, films, clothes, treats.</p>
      <p><strong>20% savings</strong> — the future: the emergency fund, the vacation, the next car.</p>
      <p>It is a guide, not a law. A household whose rent eats 30% of its income will not hit 50% needs — and that is fine. What matters is that savings happens first, on purpose, every month.</p>
      <h2>Using this site</h2>
      <p><strong>Dashboard</strong> for the month at a glance. <strong>Transactions</strong> to add or remove spending. <strong>Budget Planner</strong> to change what a category may cost. <strong>Savings Goals</strong> to move money toward something named. <strong>Insights</strong> for the six-month view. Everything is saved on this device only — there is no account and nothing is sent anywhere.</p>
    </div>
  </div>`;
}
