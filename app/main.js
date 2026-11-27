// Hearthside wiring: hash router, page rendering, and the controls.
// Every page is rendered from the state in data.js; every change is saved
// to localStorage and re-renders the page it sits on.

import { loadState, saveState, resetState, categoryOf, money, spentByCategory } from './data.js';
import {
  renderDashboard, renderTransactions, renderPlanner,
  renderGoals, renderInsights, renderGuide,
} from './views.js';

const view = document.getElementById('view');
let state = loadState();

const ROUTES = {
  '': { render: renderDashboard, nav: 'dashboard' },
  transactions: { render: renderTransactions, nav: 'transactions' },
  planner: { render: renderPlanner, nav: 'planner' },
  goals: { render: renderGoals, nav: 'goals' },
  insights: { render: renderInsights, nav: 'insights' },
  guide: { render: renderGuide, nav: 'guide' },
};

function route() {
  const hash = location.hash.replace(/^#\/?/, '').split('?')[0];
  const page = ROUTES[hash] || ROUTES[''];
  document.querySelectorAll('[data-nav]').forEach((a) => {
    a.classList.toggle('active', a.dataset.nav === page.nav);
  });
  view.innerHTML = page.render(state);
  bindPage(page.nav);
  window.scrollTo(0, 0);
}

function rerender() {
  saveState(state);
  route();
}

// ---- transactions page ----

function applyTxFilter() {
  const cat = document.getElementById('f-cat');
  const q = document.getElementById('f-q');
  if (!cat || !q) return;
  const needle = q.value.trim().toLowerCase();
  const rows = [...state.transactions]
    .sort((a, b) => b.date.localeCompare(a.date) || b.id.localeCompare(a.id))
    .filter((t) => (!cat.value || t.category === cat.value)
      && (!needle || (t.merchant + ' ' + (t.note || '')).toLowerCase().includes(needle)));
  const body = document.getElementById('tx-body');
  if (!body) return;
  body.innerHTML = rows.length
    ? rows.map((t) => {
        const c = t.category === 'savings' ? { name: 'Savings', color: '#c05f33' } : categoryOf(t.category);
        return `<tr><td>${t.date.slice(5).replace('-', ' ')}</td>
          <td><strong>${t.merchant}</strong><br><span class="small">${t.note || ''}</span></td>
          <td><span class="tag" style="background:${c.color}22;color:${c.color}">${c.name}</span></td>
          <td class="num">${money(t.amount)}</td>
          <td class="num hide-phone"><button type="button" class="danger" data-action="delete-tx" data-id="${t.id}">Remove</button></td></tr>`;
      }).join('')
    : '<tr><td colspan="5" class="empty">No transactions match that filter.</td></tr>';
  document.getElementById('tx-count').textContent = `${rows.length} transaction${rows.length === 1 ? '' : 's'} shown`;
}

function bindTransactions() {
  const cat = document.getElementById('f-cat');
  const q = document.getElementById('f-q');
  if (cat) cat.addEventListener('change', applyTxFilter);
  if (q) q.addEventListener('input', applyTxFilter);

  const form = document.getElementById('add-tx');
  if (form) form.addEventListener('submit', (ev) => {
    ev.preventDefault();
    const amount = Number(document.getElementById('tx-amount').value);
    if (!Number.isFinite(amount) || amount <= 0) return;
    state.transactions.push({
      id: 'u' + Date.now().toString(36),
      date: document.getElementById('tx-date').value || '2026-11-27',
      merchant: document.getElementById('tx-merchant').value.trim().slice(0, 80),
      category: document.getElementById('tx-category').value,
      amount: Math.round(amount * 100) / 100,
      note: document.getElementById('tx-note').value.trim().slice(0, 120),
    });
    rerender();
  });
}

// ---- planner page ----

function bindPlanner() {
  view.querySelectorAll('[data-planned]').forEach((input) => {
    input.addEventListener('change', () => {
      const value = Number(input.value);
      if (!Number.isFinite(value) || value < 0) return;
      state.planned[input.dataset.planned] = Math.round(value);
      rerender();
    });
  });
}

// ---- goals page ----

function bindGoals() {
  view.querySelectorAll('[data-goal-add]').forEach((form) => {
    form.addEventListener('submit', (ev) => {
      ev.preventDefault();
      const goal = state.goals.find((g) => g.id === form.dataset.goalAdd);
      const amount = Number(form.querySelector('input').value);
      if (!goal || !Number.isFinite(amount) || amount <= 0) return;
      goal.saved = Math.round((goal.saved + amount) * 100) / 100;
      rerender();
    });
  });
  const form = document.getElementById('new-goal');
  if (form) form.addEventListener('submit', (ev) => {
    ev.preventDefault();
    const name = document.getElementById('goal-name').value.trim().slice(0, 60);
    const target = Number(document.getElementById('goal-target').value);
    if (!name || !Number.isFinite(target) || target <= 0) return;
    state.goals.push({
      id: 'g' + Date.now().toString(36),
      name,
      target: Math.round(target),
      saved: 0,
      note: document.getElementById('goal-note').value.trim().slice(0, 120),
    });
    rerender();
  });
}

function bindPage(nav) {
  if (nav === 'transactions') bindTransactions();
  if (nav === 'planner') bindPlanner();
  if (nav === 'goals') bindGoals();
}

// ---- page-wide controls (work on every page) ----

view.addEventListener('click', (ev) => {
  const el = ev.target.closest('[data-action]');
  if (!el) return;
  if (el.dataset.action === 'delete-tx') {
    state.transactions = state.transactions.filter((t) => t.id !== el.dataset.id);
    rerender();
  }
  if (el.dataset.action === 'quick-add') {
    const goal = state.goals.find((g) => g.id === el.dataset.id);
    if (!goal) return;
    goal.saved = Math.round((goal.saved + Number(el.dataset.amount)) * 100) / 100;
    rerender();
  }
});

document.querySelector('[data-action="reset-data"]').addEventListener('click', () => {
  if (window.confirm('Reset the budget to the original November figures? Your changes will be lost.')) {
    state = resetState();
    rerender();
  }
});

window.addEventListener('hashchange', route);
route();

// Keep the dashboard's figures honest in the console for anyone checking.
console.log('Hearthside — November 2026:', {
  spentByCategory: spentByCategory(state),
});
