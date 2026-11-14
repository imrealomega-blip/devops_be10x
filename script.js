const monthSelect = document.getElementById('month-select');
const transactionForm = document.getElementById('transaction-form');
const transactionList = document.getElementById('transaction-list');
const budgetList = document.getElementById('budget-list');
const goalList = document.getElementById('goal-list');
const totalBalanceEl = document.getElementById('total-balance');
const incomeTotalEl = document.getElementById('income-total');
const expenseTotalEl = document.getElementById('expense-total');
const savingsRateEl = document.getElementById('savings-rate');

const data = {
  currentMonth: new Date().getMonth(),
  transactions: [
    { id: 1, title: 'Monthly Salary', category: 'Salary', type: 'income', amount: 5200, date: '2026-11-01' },
    { id: 2, title: 'Freelance Design', category: 'Freelance', type: 'income', amount: 890, date: '2026-11-05' },
    { id: 3, title: 'Apartment Rent', category: 'Housing', type: 'expense', amount: 1800, date: '2026-11-02' },
    { id: 4, title: 'Grocery Run', category: 'Food & Dining', type: 'expense', amount: 182.4, date: '2026-11-07' },
    { id: 5, title: 'Electric Bill', category: 'Utilities', type: 'expense', amount: 96.5, date: '2026-11-09' },
    { id: 6, title: 'Fuel', category: 'Transport', type: 'expense', amount: 72.8, date: '2026-11-12' },
    { id: 7, title: 'Travel Fund', category: 'Travel', type: 'expense', amount: 420, date: '2026-11-18' },
    { id: 8, title: 'Dividend Payout', category: 'Investments', type: 'income', amount: 210, date: '2026-11-20' }
  ],
  budgets: [
    { category: 'Housing', limit: 2200, spent: 1800 },
    { category: 'Food & Dining', limit: 600, spent: 430 },
    { category: 'Transport', limit: 260, spent: 205 },
    { category: 'Utilities', limit: 350, spent: 280 },
    { category: 'Travel', limit: 700, spent: 420 }
  ],
  goals: [
    { title: 'Emergency Fund', target: 15000, saved: 9800, due: '2026-12-31' },
    { title: 'Vacation', target: 6000, saved: 3100, due: '2026-09-30' },
    { title: 'Home Upgrade', target: 12000, saved: 7400, due: '2027-02-15' }
  ]
};

const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD'
});

function formatCurrency(value) {
  return currency.format(value);
}

function getMonthMatches() {
  return data.transactions.filter((item) => {
    const itemDate = new Date(item.date);
    return itemDate.getMonth() === data.currentMonth;
  });
}

function getSummary() {
  const monthItems = getMonthMatches();

  const income = monthItems
    .filter((item) => item.type === 'income')
    .reduce((sum, item) => sum + item.amount, 0);

  const expenses = monthItems
    .filter((item) => item.type === 'expense')
    .reduce((sum, item) => sum + item.amount, 0);

  const balance = income - expenses;
  const savingsRate = income > 0 ? (balance / income) * 100 : 0;

  return { income, expenses, balance, savingsRate };
}

function renderSummary() {
  const summary = getSummary();
  totalBalanceEl.textContent = formatCurrency(summary.balance);
  incomeTotalEl.textContent = formatCurrency(summary.income);
  expenseTotalEl.textContent = formatCurrency(summary.expenses);
  savingsRateEl.textContent = `${Math.max(summary.savingsRate, 0).toFixed(1)}%`;
}

function renderBudgets() {
  budgetList.innerHTML = '';

  data.budgets.forEach((budget) => {
    const percentage = (budget.spent / budget.limit) * 100;
    const fillClass = percentage > 90 ? 'danger' : percentage > 75 ? 'warning' : '';

    const item = document.createElement('div');
    item.className = 'budget-item';
    item.innerHTML = `
      <div class="budget-meta">
        <strong>${budget.category}</strong>
        <span>${formatCurrency(budget.spent)} / ${formatCurrency(budget.limit)}</span>
      </div>
      <div class="progress-bar">
        <div class="progress-fill ${fillClass}" style="width: ${Math.min(percentage, 100)}%"></div>
      </div>
    `;

    budgetList.appendChild(item);
  });
}

function renderGoals() {
  goalList.innerHTML = '';

  data.goals.forEach((goal) => {
    const percentage = (goal.saved / goal.target) * 100;
    const item = document.createElement('div');
    item.className = 'goal-item';
    item.innerHTML = `
      <div class="goal-top">
        <h4>${goal.title}</h4>
        <span class="goal-amount">${Math.round(percentage)}%</span>
      </div>
      <div class="goal-progress progress-bar">
        <div class="progress-fill" style="width: ${Math.min(percentage, 100)}%"></div>
      </div>
      <div class="goal-footer">
        <span>${formatCurrency(goal.saved)} saved</span>
        <span>Goal ${formatCurrency(goal.target)}</span>
      </div>
    `;

    goalList.appendChild(item);
  });
}

function renderTransactions() {
  const monthItems = getMonthMatches().sort((a, b) => new Date(b.date) - new Date(a.date));
  transactionList.innerHTML = '';

  if (!monthItems.length) {
    transactionList.innerHTML = '<p class="empty-state">No transactions for this month yet.</p>';
    return;
  }

  monthItems.forEach((item) => {
    const row = document.createElement('div');
    row.className = 'transaction-row';
    row.innerHTML = `
      <div class="transaction-name">
        <strong>${item.title}</strong>
        <span>${item.type === 'income' ? 'Income' : 'Expense'}</span>
      </div>
      <span class="transaction-category">${item.category}</span>
      <span class="transaction-date">${new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
      <span class="amount ${item.type}">${item.type === 'income' ? '+' : '-'}${formatCurrency(item.amount)}</span>
    `;

    transactionList.appendChild(row);
  });
}

function refreshDashboard() {
  renderSummary();
  renderBudgets();
  renderGoals();
  renderTransactions();
}

monthSelect.addEventListener('change', (event) => {
  data.currentMonth = Number(event.target.value);
  refreshDashboard();
});

transactionForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const title = document.getElementById('entry-title').value.trim();
  const category = document.getElementById('entry-category').value;
  const type = document.getElementById('entry-type').value;
  const amount = Number(document.getElementById('entry-amount').value);
  const date = document.getElementById('entry-date').value;

  if (!title || !date || !amount) {
    return;
  }

  data.transactions.unshift({
    id: Date.now(),
    title,
    category,
    type,
    amount,
    date
  });

  transactionForm.reset();
  document.getElementById('entry-date').valueAsDate = new Date();
  document.getElementById('entry-type').value = 'expense';
  refreshDashboard();
});

window.addEventListener('DOMContentLoaded', () => {
  const today = new Date();
  document.getElementById('entry-date').valueAsDate = today;
  monthSelect.value = String(data.currentMonth);
  refreshDashboard();
});
