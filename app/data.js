// Hearthside data: the Novak family's November 2026 budget.
//
// Everything here is the family's own figures. The state is loaded from
// localStorage when the household has changed something (a transaction, a
// planned amount, money toward a goal); otherwise this seed is used, so the
// site always opens with real, consistent numbers.

export const MONTH = 'November 2026';

export const CATEGORIES = [
  { id: 'housing',     name: 'Housing',          color: '#1e4d38', planned: 1850, kind: 'need' },
  { id: 'groceries',   name: 'Groceries',        color: '#7ba05b', planned: 650,  kind: 'need' },
  { id: 'utilities',   name: 'Utilities',        color: '#4f7d8a', planned: 320,  kind: 'need' },
  { id: 'transport',   name: 'Transport',        color: '#d9a441', planned: 430,  kind: 'need' },
  { id: 'dining',      name: 'Dining Out',       color: '#c05f33', planned: 280,  kind: 'want' },
  { id: 'health',      name: 'Health',           color: '#8a6fa8', planned: 230,  kind: 'need' },
  { id: 'kids',        name: 'Kids & School',    color: '#3e7cb1', planned: 360,  kind: 'need' },
  { id: 'clothing',    name: 'Clothing',         color: '#b08968', planned: 140,  kind: 'want' },
  { id: 'entertainment', name: 'Entertainment',  color: '#c98aa8', planned: 190,  kind: 'want' },
  { id: 'household',   name: 'Household & Pets', color: '#6b8e6b', planned: 160,  kind: 'want' },
  { id: 'misc',        name: 'Miscellaneous',    color: '#9a9a8a', planned: 150,  kind: 'want' },
];

export const INCOME = [
  { id: 'inc-1', date: '2026-11-01', source: 'Daniel Novak — salary (Northgate Logistics)', amount: 4200 },
  { id: 'inc-2', date: '2026-11-01', source: 'Priya Novak — salary (Riverside Clinic)', amount: 1950 },
];

export const SAVINGS_TRANSFER = 800;

export const SEED_TRANSACTIONS = [
  { id: 't01', date: '2026-11-01', merchant: 'Maple Court Apartments', category: 'housing', amount: 1650, note: 'Monthly rent' },
  { id: 't02', date: '2026-11-01', merchant: 'Transfer to savings', category: 'savings', amount: 800, note: 'Automatic transfer on payday' },
  { id: 't03', date: '2026-11-02', merchant: 'GreenMart Supermarket', category: 'groceries', amount: 148, note: 'Weekly shop' },
  { id: 't04', date: '2026-11-02', merchant: 'StreamFlix', category: 'entertainment', amount: 24, note: 'Monthly subscription' },
  { id: 't05', date: '2026-11-03', merchant: 'ShieldHome Insurance', category: 'housing', amount: 200, note: 'Home insurance premium' },
  { id: 't06', date: '2026-11-04', merchant: 'Route 9 Petrol', category: 'transport', amount: 58, note: 'Fuel' },
  { id: 't07', date: '2026-11-05', merchant: 'City Power & Light', category: 'utilities', amount: 132, note: 'Electricity bill' },
  { id: 't08', date: '2026-11-05', merchant: 'PaperTrail', category: 'kids', amount: 86, note: 'School supplies' },
  { id: 't09', date: '2026-11-06', merchant: 'Metro Transit', category: 'transport', amount: 96, note: 'Monthly pass' },
  { id: 't10', date: '2026-11-06', merchant: 'FixIt Hardware', category: 'household', amount: 52, note: 'Batteries and light bulbs' },
  { id: 't11', date: '2026-11-07', merchant: 'ClearWater Utility', category: 'utilities', amount: 48, note: 'Water bill' },
  { id: 't12', date: '2026-11-07', merchant: 'Bistro Luna', category: 'dining', amount: 46, note: 'Family dinner out' },
  { id: 't13', date: '2026-11-08', merchant: 'GreenMart Supermarket', category: 'groceries', amount: 96, note: 'Weekly shop' },
  { id: 't14', date: '2026-11-08', merchant: 'Starlight Cinema', category: 'entertainment', amount: 48, note: 'Movie night, family of four' },
  { id: 't15', date: '2026-11-09', merchant: 'MediCare Plus Pharmacy', category: 'health', amount: 42, note: 'Prescriptions' },
  { id: 't16', date: '2026-11-10', merchant: 'NorthNet Internet', category: 'utilities', amount: 68, note: 'Broadband' },
  { id: 't17', date: '2026-11-10', merchant: 'Melody School', category: 'kids', amount: 120, note: 'Piano lessons, November' },
  { id: 't18', date: '2026-11-11', merchant: "Tony's Pizza", category: 'dining', amount: 32, note: 'Pizza night' },
  { id: 't19', date: '2026-11-12', merchant: 'BrightCell Mobile', category: 'utilities', amount: 50, note: 'Mobile plan' },
  { id: 't20', date: '2026-11-12', merchant: 'TuneWave Music', category: 'entertainment', amount: 18, note: 'Music streaming' },
  { id: 't21', date: '2026-11-13', merchant: 'BrightSmile Dental', category: 'health', amount: 120, note: 'Dental check-up' },
  { id: 't22', date: '2026-11-14', merchant: 'FreshBox Market', category: 'groceries', amount: 122, note: 'Weekly shop' },
  { id: 't23', date: '2026-11-14', merchant: 'Morning Bean Café', category: 'dining', amount: 28, note: 'Coffee and pastries' },
  { id: 't24', date: '2026-11-14', merchant: 'Paws & Co', category: 'household', amount: 44, note: 'Dog food' },
  { id: 't25', date: '2026-11-15', merchant: 'Route 9 Petrol', category: 'transport', amount: 62, note: 'Fuel' },
  { id: 't26', date: '2026-11-15', merchant: 'Thread & Co', category: 'clothing', amount: 96, note: 'Winter coats for the kids' },
  { id: 't27', date: '2026-11-16', merchant: 'StepUp Shoes', category: 'kids', amount: 74, note: "Kids' shoes" },
  { id: 't28', date: '2026-11-17', merchant: 'Wok & Roll', category: 'dining', amount: 58, note: 'Takeout dinner' },
  { id: 't29', date: '2026-11-17', merchant: 'GiftWorks', category: 'misc', amount: 45, note: 'Birthday gift for grandma' },
  { id: 't30', date: '2026-11-18', merchant: 'ShieldAuto Insurance', category: 'transport', amount: 126, note: 'Car insurance premium' },
  { id: 't31', date: '2026-11-19', merchant: 'GreenMart Supermarket', category: 'groceries', amount: 87, note: 'Weekly shop' },
  { id: 't32', date: '2026-11-19', merchant: 'PlayHouse', category: 'entertainment', amount: 42, note: 'Board game' },
  { id: 't33', date: '2026-11-20', merchant: 'Sunny School Canteen', category: 'kids', amount: 61, note: 'School lunches' },
  { id: 't34', date: '2026-11-21', merchant: 'Bistro Luna', category: 'dining', amount: 64, note: 'Anniversary dinner' },
  { id: 't35', date: '2026-11-21', merchant: 'CleanHome Supplies', category: 'household', amount: 52, note: 'Cleaning supplies' },
  { id: 't36', date: '2026-11-22', merchant: 'MediCare Plus Pharmacy', category: 'health', amount: 52, note: 'Vitamins and first aid' },
  { id: 't37', date: '2026-11-23', merchant: 'Corner Grocery', category: 'groceries', amount: 54, note: 'Top-up shop' },
  { id: 't38', date: '2026-11-23', merchant: 'Starlight Cinema', category: 'entertainment', amount: 40, note: 'Saturday matinee' },
  { id: 't39', date: '2026-11-24', merchant: 'Route 9 Petrol', category: 'transport', amount: 60, note: 'Fuel' },
  { id: 't40', date: '2026-11-24', merchant: 'PaperTrail', category: 'misc', amount: 28, note: 'Stationery' },
  { id: 't41', date: '2026-11-25', merchant: 'Morning Bean Café', category: 'dining', amount: 36, note: 'Coffee with friends' },
  { id: 't42', date: '2026-11-26', merchant: 'GreenMart Supermarket', category: 'groceries', amount: 105, note: 'Thanksgiving week shop' },
  { id: 't43', date: '2026-11-26', merchant: 'Corner Store', category: 'misc', amount: 48, note: 'Umbrella and odds and ends' },
];

export const SEED_GOALS = [
  { id: 'g1', name: 'Emergency fund', target: 6000, saved: 4250, note: 'Six months of essentials, for the unexpected.' },
  { id: 'g2', name: 'Family vacation — Oregon coast', target: 2400, saved: 1180, note: 'A week by the sea next summer.' },
  { id: 'g3', name: 'New family car', target: 9000, saved: 2650, note: 'Replacing the 2012 sedan within two years.' },
  { id: 'g4', name: "Kids' education fund", target: 5000, saved: 1900, note: 'A little each month, starting early.' },
];

// Income vs. spending for the last six months (spending here is what the
// household spent, not counting the monthly $800 savings transfer).
export const MONTHS = [
  { label: 'Jun', income: 6100, spent: 4620 },
  { label: 'Jul', income: 6150, spent: 4510 },
  { label: 'Aug', income: 6150, spent: 4760 },
  { label: 'Sep', income: 6200, spent: 4390 },
  { label: 'Oct', income: 6150, spent: 4680 },
  { label: 'Nov', income: 6150, spent: 4518 },
];

const STORAGE_KEY = 'hearthside-novak-budget-v1';

function seedState() {
  return {
    planned: Object.fromEntries(CATEGORIES.map((c) => [c.id, c.planned])),
    transactions: SEED_TRANSACTIONS.map((t) => ({ ...t })),
    goals: SEED_GOALS.map((g) => ({ ...g })),
  };
}

export function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return seedState();
    const parsed = JSON.parse(raw);
    if (!parsed || !Array.isArray(parsed.transactions) || !Array.isArray(parsed.goals)) return seedState();
    return parsed;
  } catch {
    return seedState();
  }
}

export function saveState(state) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch { /* private mode: keep it in memory */ }
}

export function resetState() {
  try { localStorage.removeItem(STORAGE_KEY); } catch { /* ignore */ }
  return seedState();
}

// ---- derived figures (all computed from the same state the pages show) ----

export function categoryOf(id) {
  return CATEGORIES.find((c) => c.id === id) || { id, name: id, color: '#9a9a8a', kind: 'want' };
}

export function totalIncome() {
  return INCOME.reduce((sum, row) => sum + row.amount, 0);
}

export function spentByCategory(state) {
  const spent = Object.fromEntries(CATEGORIES.map((c) => [c.id, 0]));
  for (const t of state.transactions) {
    if (t.category === 'savings') continue;
    if (t.category in spent) spent[t.category] += t.amount;
  }
  return spent;
}

export function totalSpent(state) {
  return Object.values(spentByCategory(state)).reduce((a, b) => a + b, 0);
}

export function totals(state) {
  const income = totalIncome();
  const spent = totalSpent(state);
  const saved = SAVINGS_TRANSFER;
  return { income, spent, saved, left: income - spent - saved };
}

export function plannedTotal(state) {
  return Object.values(state.planned).reduce((a, b) => a + b, 0);
}

export function ruleSplit(state) {
  const spent = spentByCategory(state);
  const income = totalIncome();
  let needs = 0;
  let wants = 0;
  for (const c of CATEGORIES) {
    if (c.kind === 'need') needs += spent[c.id];
    else wants += spent[c.id];
  }
  const saved = SAVINGS_TRANSFER + Math.max(0, totals(state).left);
  return {
    needs, wants, saved,
    needsPct: Math.round((needs / income) * 100),
    wantsPct: Math.round((wants / income) * 100),
    savedPct: Math.round((saved / income) * 100),
  };
}

export function money(n) {
  return '$' + n.toLocaleString('en-US');
}

export function shortDate(iso) {
  const [, month, day] = iso.split('-').map(Number);
  const names = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return names[month - 1] + ' ' + day;
}
