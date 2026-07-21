import React, { useState, useMemo } from "react";
import {
  Wallet,
  LogOut,
  Plus,
  Trash2,
  TrendingUp,
  TrendingDown,
  Lock,
  Mail,
  ArrowRight,
  LayoutGrid,
  Receipt,
  PiggyBank,
  BarChart3,
  Settings as SettingsIcon,
  Search,
  User,
  Bell,
  Globe,
  ShieldCheck,
  Pencil,
  Check,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

// ---------------------------------------------------------------------------
// Seed data
// ---------------------------------------------------------------------------
const CATEGORIES = [
  "Salary",
  "Freelance",
  "Groceries",
  "Rent",
  "Dining",
  "Transport",
  "Utilities",
  "Entertainment",
  "Shopping",
  "Health",
];

const EXPENSE_CATEGORIES = CATEGORIES.filter((c) => c !== "Salary" && c !== "Freelance");

const CATEGORY_COLORS = {
  Groceries: "#C29A5B",
  Rent: "#2F5745",
  Dining: "#8B3A3A",
  Transport: "#7C8FA6",
  Utilities: "#4C7A5B",
  Entertainment: "#A66B8F",
  Shopping: "#B08642",
  Health: "#6C8B4A",
};

const SEED_TRANSACTIONS = [
  { id: "t1", date: "2026-05-01", description: "Monthly salary", category: "Salary", type: "income", amount: 4200 },
  { id: "t2", date: "2026-05-02", description: "Rent — May", category: "Rent", type: "expense", amount: 1350 },
  { id: "t3", date: "2026-05-05", description: "Whole Foods", category: "Groceries", type: "expense", amount: 88.4 },
  { id: "t4", date: "2026-05-09", description: "Electric & water", category: "Utilities", type: "expense", amount: 138 },
  { id: "t5", date: "2026-05-12", description: "Dinner — Nomad Kitchen", category: "Dining", type: "expense", amount: 52 },
  { id: "t6", date: "2026-05-18", description: "Metro pass", category: "Transport", type: "expense", amount: 45 },
  { id: "t7", date: "2026-05-22", description: "Bookstore run", category: "Shopping", type: "expense", amount: 41.2 },
  { id: "t8", date: "2026-05-27", description: "Icon commission", category: "Freelance", type: "income", amount: 300 },

  { id: "t9", date: "2026-06-01", description: "Monthly salary", category: "Salary", type: "income", amount: 4200 },
  { id: "t10", date: "2026-06-02", description: "Rent — June", category: "Rent", type: "expense", amount: 1350 },
  { id: "t11", date: "2026-06-04", description: "Trader Joe's", category: "Groceries", type: "expense", amount: 74.6 },
  { id: "t12", date: "2026-06-07", description: "Website build", category: "Freelance", type: "income", amount: 800 },
  { id: "t13", date: "2026-06-10", description: "Electric & water", category: "Utilities", type: "expense", amount: 151 },
  { id: "t14", date: "2026-06-13", description: "Concert tickets", category: "Entertainment", type: "expense", amount: 96 },
  { id: "t15", date: "2026-06-16", description: "Pharmacy", category: "Health", type: "expense", amount: 33.5 },
  { id: "t16", date: "2026-06-20", description: "Ramen night", category: "Dining", type: "expense", amount: 38.7 },
  { id: "t17", date: "2026-06-24", description: "Rideshare", category: "Transport", type: "expense", amount: 27 },
  { id: "t18", date: "2026-06-29", description: "New jacket", category: "Shopping", type: "expense", amount: 129 },

  { id: "t19", date: "2026-07-01", description: "Monthly salary", category: "Salary", type: "income", amount: 4200 },
  { id: "t20", date: "2026-07-02", description: "Rent — July", category: "Rent", type: "expense", amount: 1350 },
  { id: "t21", date: "2026-07-03", description: "Whole Foods", category: "Groceries", type: "expense", amount: 96.4 },
  { id: "t22", date: "2026-07-05", description: "Logo design contract", category: "Freelance", type: "income", amount: 650 },
  { id: "t23", date: "2026-07-06", description: "Electric & water", category: "Utilities", type: "expense", amount: 142.1 },
  { id: "t24", date: "2026-07-08", description: "Dinner — Nomad Kitchen", category: "Dining", type: "expense", amount: 64.5 },
  { id: "t25", date: "2026-07-10", description: "Metro pass", category: "Transport", type: "expense", amount: 45 },
  { id: "t26", date: "2026-07-12", description: "Cinema night", category: "Entertainment", type: "expense", amount: 32 },
  { id: "t27", date: "2026-07-14", description: "New running shoes", category: "Shopping", type: "expense", amount: 118.75 },
  { id: "t28", date: "2026-07-16", description: "Pharmacy", category: "Health", type: "expense", amount: 27.9 },
  { id: "t29", date: "2026-07-18", description: "Trader Joe's", category: "Groceries", type: "expense", amount: 58.2 },
];

const SEED_BUDGETS = {
  Groceries: 400,
  Rent: 1400,
  Dining: 200,
  Transport: 120,
  Utilities: 180,
  Entertainment: 100,
  Shopping: 150,
  Health: 80,
};

const currency = (n) =>
  n.toLocaleString("en-LKR", { style: "currency", currency: "LKR", minimumFractionDigits: 2 });

const formatDate = (d) =>
  new Date(d + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" });

const monthLabel = (ym) => {
  const [y, m] = ym.split("-");
  return new Date(`${y}-${m}-01T00:00:00`).toLocaleDateString("en-US", { month: "short" });
};

// ---------------------------------------------------------------------------
// App
// ---------------------------------------------------------------------------
export default function App() {
  const [authed, setAuthed] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const handleLogin = () => {
    if (!email.trim() || !password.trim()) {
      setLoginError("Enter an email and password to continue.");
      return;
    }
    setLoginError("");
    setAuthed(true);
  };

  return (
    <div className="app">
      <GlobalStyles />
      {!authed ? (
        <LoginScreen
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          error={loginError}
          onSubmit={handleLogin}
        />
      ) : (
        <Shell email={email} onLogout={() => setAuthed(false)} />
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Shell — sidebar + page router
// ---------------------------------------------------------------------------
function Shell({ email, onLogout }) {
  const [page, setPage] = useState("overview");
  const [transactions, setTransactions] = useState(SEED_TRANSACTIONS);
  const [budgets, setBudgets] = useState(SEED_BUDGETS);

  const totals = useMemo(() => {
    let income = 0, expense = 0;
    transactions.forEach((t) => (t.type === "income" ? (income += t.amount) : (expense += t.amount)));
    return { income, expense, balance: income - expense };
  }, [transactions]);

  const categoryData = useMemo(() => {
    const map = {};
    transactions.forEach((t) => {
      if (t.type !== "expense") return;
      map[t.category] = (map[t.category] || 0) + t.amount;
    });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [transactions]);

  const addTransaction = (tx) => setTransactions((prev) => [{ ...tx, id: `t${Date.now()}` }, ...prev]);
  const deleteTransaction = (id) => setTransactions((prev) => prev.filter((t) => t.id !== id));

  const navItems = [
    { key: "overview", label: "Overview", icon: LayoutGrid },
    { key: "transactions", label: "Transactions", icon: Receipt },
    { key: "budgets", label: "Budgets", icon: PiggyBank },
    { key: "analytics", label: "Analytics", icon: BarChart3 },
    { key: "settings", label: "Settings", icon: SettingsIcon },
  ];

  return (
    <div className="shell">
      <aside className="sidebar">
        <div className="stitch" />
        <div className="brand" style={{ padding: "8px 24px 28px 24px" }}>
          <span className="brand-icon"><Wallet size={16} /></span>
          Ledger
        </div>
        <nav className="nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.key}
                className={`nav-item ${page === item.key ? "active" : ""}`}
                onClick={() => setPage(item.key)}
              >
                <Icon size={16} />
                {item.label}
              </button>
            );
          })}
        </nav>
        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="avatar"><User size={14} /></div>
            <div className="sidebar-user-email">{email}</div>
          </div>
          <button className="btn-ghost" style={{ width: "100%", justifyContent: "center" }} onClick={onLogout}>
            <LogOut size={14} /> Log out
          </button>
        </div>
      </aside>

      <main className="main-area">
        <div className="content">
          {page === "overview" && (
            <OverviewPage
              totals={totals}
              categoryData={categoryData}
              transactions={transactions}
              onViewAll={() => setPage("transactions")}
            />
          )}
          {page === "transactions" && (
            <TransactionsPage
              transactions={transactions}
              onAdd={addTransaction}
              onDelete={deleteTransaction}
            />
          )}
          {page === "budgets" && (
            <BudgetsPage transactions={transactions} budgets={budgets} setBudgets={setBudgets} />
          )}
          {page === "analytics" && <AnalyticsPage transactions={transactions} categoryData={categoryData} />}
          {page === "settings" && <SettingsPage email={email} />}
        </div>
      </main>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page header helper
// ---------------------------------------------------------------------------
function PageHeader({ eyebrow, title, action }) {
  return (
    <div className="page-header">
      <div>
        <div className="eyebrow">{eyebrow}</div>
        <h1 className="page-title">{title}</h1>
      </div>
      {action}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Overview page
// ---------------------------------------------------------------------------
function OverviewPage({ totals, categoryData, transactions, onViewAll }) {
  const recent = useMemo(
    () => [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5),
    [transactions]
  );

  return (
    <>
      <PageHeader eyebrow="Overview" title="Where things stand" />

      <div className="summary-row">
        <div className="summary-card">
          <div className="eyebrow">Balance — all entries</div>
          <div className="summary-value">{currency(totals.balance)}</div>
          <div className="summary-icon" style={{ background: "rgba(47,87,69,0.12)" }}>
            <Wallet size={15} color="#2f5745" />
          </div>
        </div>
        <div className="summary-card">
          <div className="eyebrow">Income</div>
          <div className="summary-value" style={{ color: "#4c7a5b" }}>{currency(totals.income)}</div>
          <div className="summary-icon" style={{ background: "rgba(76,122,91,0.12)" }}>
            <TrendingUp size={15} color="#4c7a5b" />
          </div>
        </div>
        <div className="summary-card">
          <div className="eyebrow">Expenses</div>
          <div className="summary-value" style={{ color: "#8b3a3a" }}>{currency(totals.expense)}</div>
          <div className="summary-icon" style={{ background: "rgba(139,58,58,0.12)" }}>
            <TrendingDown size={15} color="#8b3a3a" />
          </div>
        </div>
      </div>

      <div className="grid-two">
        <div className="panel">
          <div className="ledger-header">
            <h3 style={{ margin: 0 }}>Recent entries</h3>
            <button className="link-btn" onClick={onViewAll}>View all →</button>
          </div>
          {recent.map((t) => (
            <LedgerRow key={t.id} t={t} />
          ))}
        </div>

        <div className="panel">
          <h3>Spending by category</h3>
          {categoryData.length === 0 ? (
            <div className="empty-chart">No expenses logged yet.</div>
          ) : (
            <div className="chart-wrap">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={categoryData} dataKey="value" nameKey="name" innerRadius={55} outerRadius={85} paddingAngle={2}>
                    {categoryData.map((entry) => (
                      <Cell key={entry.name} fill={CATEGORY_COLORS[entry.name] || "#c29a5b"} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v) => currency(v)} />
                  <Legend layout="vertical" align="right" verticalAlign="middle" wrapperStyle={{ fontSize: 12, fontFamily: "var(--font-body)" }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function LedgerRow({ t, onDelete }) {
  return (
    <div className="ledger-row">
      <span
        className="ledger-cat-dot"
        style={{ background: t.type === "income" ? "#4c7a5b" : (CATEGORY_COLORS[t.category] || "#c29a5b") }}
      />
      <div>
        <div className="ledger-desc">{t.description}</div>
        <div className="ledger-meta">{formatDate(t.date)} · {t.category}</div>
      </div>
      <div className="ledger-leader" />
      <div className={`ledger-amount ${t.type}`}>
        {t.type === "income" ? "+" : "−"}{currency(t.amount)}
      </div>
      {onDelete && (
        <button className="delete-btn" onClick={() => onDelete(t.id)}>
          <Trash2 size={14} />
        </button>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Transactions page
// ---------------------------------------------------------------------------
function TransactionsPage({ transactions, onAdd, onDelete }) {
  const [filter, setFilter] = useState("all");
  const [query, setQuery] = useState("");
  const [showForm, setShowForm] = useState(false);

  const [desc, setDesc] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState(CATEGORIES[2]);
  const [type, setType] = useState("expense");
  const [date, setDate] = useState("2026-07-20");

  const handleAdd = () => {
    const numAmount = parseFloat(amount);
    if (!desc.trim() || !numAmount || numAmount <= 0) return;
    onAdd({ date, description: desc.trim(), category, type, amount: numAmount });
    setDesc("");
    setAmount("");
    setShowForm(false);
  };

  const filtered = useMemo(() => {
    let list = filter === "all" ? transactions : transactions.filter((t) => t.type === filter);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter((t) => t.description.toLowerCase().includes(q) || t.category.toLowerCase().includes(q));
    }
    return [...list].sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [transactions, filter, query]);

  return (
    <>
      <PageHeader
        eyebrow="Transactions"
        title="Every entry, in one place"
        action={
          <button className="btn-primary" style={{ background: "var(--brass-deep)", width: "auto", padding: "10px 18px" }} onClick={() => setShowForm((v) => !v)}>
            <Plus size={15} /> New entry
          </button>
        }
      />

      {showForm && (
        <div className="panel" style={{ marginBottom: 20 }}>
          <div className="type-toggle" style={{ marginBottom: 14, maxWidth: 280 }}>
            <button className={type === "expense" ? "active-expense" : ""} onClick={() => setType("expense")}>Expense</button>
            <button className={type === "income" ? "active-income" : ""} onClick={() => setType("income")}>Income</button>
          </div>
          <div className="form-row">
            <div className="field">
              <label>Description</label>
              <div className="input-wrap">
                <input type="text" placeholder="e.g. Coffee with Sam" value={desc} onChange={(e) => setDesc(e.target.value)} />
              </div>
            </div>
            <div className="field">
              <label>Amount</label>
              <div className="input-wrap">
                <input type="number" placeholder="0.00" value={amount} onChange={(e) => setAmount(e.target.value)} />
              </div>
            </div>
          </div>
          <div className="form-row">
            <div className="field">
              <label>Date</label>
              <div className="input-wrap">
                <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
              </div>
            </div>
            <div className="field">
              <label>Category</label>
              <div className="input-wrap">
                <select className="select-input" value={category} onChange={(e) => setCategory(e.target.value)}>
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
          </div>
          <button className="btn-primary" style={{ background: "var(--forest)" }} onClick={handleAdd}>
            <Plus size={15} /> Save entry
          </button>
        </div>
      )}

      <div className="ledger-panel">
        <div className="ledger-header">
          <div className="tabs">
            <button className={`tab ${filter === "all" ? "active" : ""}`} onClick={() => setFilter("all")}>All</button>
            <button className={`tab ${filter === "income" ? "active" : ""}`} onClick={() => setFilter("income")}>Income</button>
            <button className={`tab ${filter === "expense" ? "active" : ""}`} onClick={() => setFilter("expense")}>Expenses</button>
          </div>
          <div className="input-wrap" style={{ maxWidth: 220 }}>
            <Search size={14} color="#6b6151" />
            <input type="text" placeholder="Search entries…" value={query} onChange={(e) => setQuery(e.target.value)} />
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="empty-state">No entries match. Try a different search or filter.</div>
        ) : (
          filtered.map((t) => <LedgerRow key={t.id} t={t} onDelete={onDelete} />)
        )}
      </div>
    </>
  );
}

// ---------------------------------------------------------------------------
// Budgets page
// ---------------------------------------------------------------------------
function BudgetsPage({ transactions, budgets, setBudgets }) {
  const [editing, setEditing] = useState(null);
  const [draft, setDraft] = useState("");

  const spentByCategory = useMemo(() => {
    const map = {};
    transactions.forEach((t) => {
      if (t.type !== "expense") return;
      map[t.category] = (map[t.category] || 0) + t.amount;
    });
    return map;
  }, [transactions]);

  const startEdit = (cat) => {
    setEditing(cat);
    setDraft(String(budgets[cat] ?? ""));
  };

  const saveEdit = (cat) => {
    const val = parseFloat(draft);
    if (!isNaN(val) && val >= 0) {
      setBudgets((prev) => ({ ...prev, [cat]: val }));
    }
    setEditing(null);
  };

  const totalBudget = Object.values(budgets).reduce((a, b) => a + b, 0);
  const totalSpent = Object.values(spentByCategory).reduce((a, b) => a + b, 0);

  return (
    <>
      <PageHeader eyebrow="Budgets" title="Monthly limits by category" />

      <div className="summary-row" style={{ gridTemplateColumns: "1fr 1fr" }}>
        <div className="summary-card">
          <div className="eyebrow">Total budgeted</div>
          <div className="summary-value">{currency(totalBudget)}</div>
        </div>
        <div className="summary-card">
          <div className="eyebrow">Total spent this ledger</div>
          <div className="summary-value" style={{ color: totalSpent > totalBudget ? "#8b3a3a" : "#4c7a5b" }}>
            {currency(totalSpent)}
          </div>
        </div>
      </div>

      <div className="panel">
        {EXPENSE_CATEGORIES.map((cat) => {
          const limit = budgets[cat] ?? 0;
          const spent = spentByCategory[cat] ?? 0;
          const pct = limit > 0 ? Math.min(100, (spent / limit) * 100) : 0;
          const over = spent > limit && limit > 0;
          return (
            <div className="budget-row" key={cat}>
              <div className="budget-row-top">
                <div className="budget-cat">
                  <span className="ledger-cat-dot" style={{ background: CATEGORY_COLORS[cat] }} />
                  {cat}
                </div>
                {editing === cat ? (
                  <div className="budget-edit">
                    <div className="input-wrap" style={{ width: 110, padding: "4px 8px" }}>
                      <input
                        type="number"
                        value={draft}
                        onChange={(e) => setDraft(e.target.value)}
                        autoFocus
                      />
                    </div>
                    <button className="icon-btn" onClick={() => saveEdit(cat)}><Check size={14} /></button>
                  </div>
                ) : (
                  <div className="budget-figures">
                    <span className={over ? "over" : ""}>{currency(spent)}</span>
                    <span className="of-text">of {currency(limit)}</span>
                    <button className="icon-btn" onClick={() => startEdit(cat)}><Pencil size={12} /></button>
                  </div>
                )}
              </div>
              <div className="progress-track">
                <div
                  className="progress-fill"
                  style={{
                    width: `${pct}%`,
                    background: over ? "var(--maroon)" : (CATEGORY_COLORS[cat] || "var(--brass)"),
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

// ---------------------------------------------------------------------------
// Analytics page
// ---------------------------------------------------------------------------
function AnalyticsPage({ transactions, categoryData }) {
  const monthly = useMemo(() => {
    const map = {};
    transactions.forEach((t) => {
      const ym = t.date.slice(0, 7);
      if (!map[ym]) map[ym] = { month: ym, income: 0, expense: 0 };
      map[ym][t.type] += t.amount;
    });
    return Object.values(map)
      .sort((a, b) => a.month.localeCompare(b.month))
      .map((m) => ({ ...m, label: monthLabel(m.month) }));
  }, [transactions]);

  const topCategories = useMemo(
    () => [...categoryData].sort((a, b) => b.value - a.value).slice(0, 5),
    [categoryData]
  );

  const avgMonthlyExpense = monthly.length
    ? monthly.reduce((s, m) => s + m.expense, 0) / monthly.length
    : 0;
  const avgMonthlyIncome = monthly.length
    ? monthly.reduce((s, m) => s + m.income, 0) / monthly.length
    : 0;

  return (
    <>
      <PageHeader eyebrow="Analytics" title="Trends across your ledger" />

      <div className="summary-row" style={{ gridTemplateColumns: "1fr 1fr" }}>
        <div className="summary-card">
          <div className="eyebrow">Avg. monthly income</div>
          <div className="summary-value" style={{ color: "#4c7a5b" }}>{currency(avgMonthlyIncome)}</div>
        </div>
        <div className="summary-card">
          <div className="eyebrow">Avg. monthly expenses</div>
          <div className="summary-value" style={{ color: "#8b3a3a" }}>{currency(avgMonthlyExpense)}</div>
        </div>
      </div>

      <div className="panel" style={{ marginBottom: 16 }}>
        <h3>Income vs. expenses by month</h3>
        <div className="chart-wrap" style={{ height: 260 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthly} barGap={6}>
              <CartesianGrid strokeDasharray="3 3" stroke="#d9cfb2" vertical={false} />
              <XAxis dataKey="label" tick={{ fontSize: 12, fontFamily: "var(--font-mono)", fill: "#6b6151" }} axisLine={{ stroke: "#d9cfb2" }} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fontFamily: "var(--font-mono)", fill: "#6b6151" }} axisLine={false} tickLine={false} />
              <Tooltip formatter={(v) => currency(v)} contentStyle={{ fontFamily: "var(--font-body)", fontSize: 13 }} />
              <Legend wrapperStyle={{ fontSize: 12, fontFamily: "var(--font-body)" }} />
              <Bar dataKey="income" name="Income" fill="#4c7a5b" radius={[3, 3, 0, 0]} />
              <Bar dataKey="expense" name="Expenses" fill="#8b3a3a" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid-two">
        <div className="panel">
          <h3>Category breakdown</h3>
          {categoryData.length === 0 ? (
            <div className="empty-chart">No expenses logged yet.</div>
          ) : (
            <div className="chart-wrap">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={categoryData} dataKey="value" nameKey="name" innerRadius={55} outerRadius={85} paddingAngle={2}>
                    {categoryData.map((entry) => (
                      <Cell key={entry.name} fill={CATEGORY_COLORS[entry.name] || "#c29a5b"} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v) => currency(v)} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        <div className="panel">
          <h3>Top spending categories</h3>
          {topCategories.map((c, i) => (
            <div className="top-cat-row" key={c.name}>
              <div className="top-cat-rank">{i + 1}</div>
              <span className="ledger-cat-dot" style={{ background: CATEGORY_COLORS[c.name] }} />
              <div className="ledger-desc" style={{ flex: 1 }}>{c.name}</div>
              <div className="ledger-amount expense">{currency(c.value)}</div>
            </div>
          ))}
          {topCategories.length === 0 && <div className="empty-state">No expenses yet.</div>}
        </div>
      </div>
    </>
  );
}

// ---------------------------------------------------------------------------
// Settings page
// ---------------------------------------------------------------------------
function SettingsPage({ email }) {
  const [notifyBudget, setNotifyBudget] = useState(true);
  const [notifyWeekly, setNotifyWeekly] = useState(false);
  const [currency_, setCurrency_] = useState("USD");

  return (
    <>
      <PageHeader eyebrow="Settings" title="Your account" />

      <div className="grid-two">
        <div className="panel">
          <h3>Profile</h3>
          <div className="settings-row">
            <div className="settings-icon"><User size={15} /></div>
            <div>
              <div className="settings-label">Email</div>
              <div className="settings-value">{email}</div>
            </div>
          </div>
          <div className="settings-row">
            <div className="settings-icon"><Globe size={15} /></div>
            <div style={{ flex: 1 }}>
              <div className="settings-label">Currency</div>
              <div className="input-wrap" style={{ marginTop: 6 }}>
                <select className="select-input" value={currency_} onChange={(e) => setCurrency_(e.target.value)}>
                  <option value="USD">USD — US Dollar</option>
                  <option value="EUR">EUR — Euro</option>
                  <option value="GBP">GBP — British Pound</option>
                  <option value="LKR">LKR — Sri Lankan Rupee</option>
                </select>
              </div>
            </div>
          </div>
          <div className="settings-row">
            <div className="settings-icon"><ShieldCheck size={15} /></div>
            <div>
              <div className="settings-label">Account status</div>
              
            </div>
          </div>
        </div>

        <div className="panel">
          <h3>Notifications</h3>
          <div className="toggle-row">
            <div>
              <div className="settings-label">Budget alerts</div>
              <div className="settings-sub">Get notified when a category goes over its limit</div>
            </div>
            <Switch checked={notifyBudget} onChange={() => setNotifyBudget((v) => !v)} />
          </div>
          <div className="toggle-row">
            <div>
              <div className="settings-label">Weekly summary</div>
              <div className="settings-sub">A recap of income and spending every Monday</div>
            </div>
            <Switch checked={notifyWeekly} onChange={() => setNotifyWeekly((v) => !v)} />
          </div>
          <div className="toggle-row" style={{ borderBottom: "none" }}>
            <div className="settings-icon" style={{ marginTop: 2 }}><Bell size={14} /></div>
            <div className="settings-sub" style={{ flex: 1 }}>
              Notifications are illustrative only in this demo — no emails are actually sent.
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function Switch({ checked, onChange }) {
  return (
    <button className={`switch ${checked ? "on" : ""}`} onClick={onChange}>
      <span className="switch-knob" />
    </button>
  );
}

// ---------------------------------------------------------------------------
// Login screen
// ---------------------------------------------------------------------------
function LoginScreen({ email, setEmail, password, setPassword, error, onSubmit }) {
  const handleKey = (e) => {
    if (e.key === "Enter") onSubmit();
  };

  return (
    <div className="login-screen">
      <div className="login-left">
        <div className="login-left-texture" />
        <div className="stitch" />

        <div className="brand">
          <span className="brand-icon"><Wallet size={18} /></span>
          Ledger
        </div>

        <div className="login-left-center">
          <div className="ring-decor" />
          <p className="login-quote">
            Every entry tells you where the money went — <span>and where it's going.</span>
          </p>
          <p className="login-quote-attr">— kept daily, balanced monthly</p>
        </div>

        <div className="login-left-footer">
          <span className="badge-dot" /> Local demo session — nothing leaves your browser
        </div>
      </div>

      <div className="login-right">
        <div className="login-right-inner">
          <div className="eyebrow" style={{ color: "var(--brass-deep)", marginBottom: 10 }}>Sign in</div>
          <h2>Welcome back</h2>
          <p className="login-sub">Enter any details to open your ledger.</p>

          {error && <div className="login-error">{error}</div>}

          <div className="field">
            <label>Email</label>
            <div className="input-wrap">
              <Mail size={15} color="#6b6151" />
              <input type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} onKeyDown={handleKey} />
            </div>
          </div>

          <div className="field">
            <label>Password</label>
            <div className="input-wrap">
              <Lock size={15} color="#6b6151" />
              <input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} onKeyDown={handleKey} />
            </div>
          </div>

          <button className="btn-primary" onClick={onSubmit}>
            Sign in <ArrowRight size={15} />
          </button>

          <p className="login-demo-note">This is a demo — any email and password will work.</p>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Global styles
// ---------------------------------------------------------------------------
function GlobalStyles() {
  return (
    <style>{`
      :root {
        --font-display: Georgia, 'Iowan Old Style', 'Palatino Linotype', 'Book Antiqua', serif;
        --font-body: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
        --font-mono: ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace;
        --ink: #14211d;
        --ink-soft: #1c2b26;
        --paper: #f6f1e4;
        --paper-dim: #ece4cf;
        --paper-line: #d9cfb2;
        --brass: #c29a5b;
        --brass-deep: #a87f43;
        --forest: #2f5745;
        --maroon: #8b3a3a;
        --moss: #4c7a5b;
        --text: #241f17;
        --text-soft: #6b6151;
      }

      * { box-sizing: border-box; }

      .app {
        font-family: var(--font-body);
        background: var(--ink);
        color: var(--paper);
        min-height: 100vh;
        width: 100%;
      }

      .eyebrow {
        font-family: var(--font-mono);
        font-size: 11px;
        letter-spacing: 0.14em;
        text-transform: uppercase;
      }

      /* LOGIN SCREEN ---------------------------------------------------- */
      .login-screen {
        min-height: 100vh;
        width: 100%;
        display: grid;
        grid-template-columns: 1.1fr 1fr;
      }

      .login-left {
        background:
          radial-gradient(circle at 20% 15%, rgba(194,154,91,0.16), transparent 40%),
          radial-gradient(circle at 90% 85%, rgba(194,154,91,0.10), transparent 45%),
          linear-gradient(165deg, var(--forest) 0%, #16281f 100%);
        color: var(--paper);
        padding: 44px 56px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        position: relative;
        overflow: hidden;
        min-height: 100vh;
      }

      .login-left-texture {
        position: absolute;
        inset: 0;
        opacity: 0.5;
        background-image: radial-gradient(rgba(246,241,228,0.09) 1px, transparent 1px);
        background-size: 22px 22px;
        pointer-events: none;
      }

      .stitch {
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        width: 1px;
        background-image: repeating-linear-gradient(to bottom, var(--brass) 0 6px, transparent 6px 14px);
      }
      .stitch::before, .stitch::after {
        content: '';
        position: absolute;
        right: -3.5px;
        width: 7px;
        height: 7px;
        border-radius: 50%;
        background: var(--brass);
      }
      .stitch::before { top: 4px; }
      .stitch::after { bottom: 4px; }

      .brand {
        display: flex;
        align-items: center;
        gap: 10px;
        font-family: var(--font-display);
        font-size: 22px;
        font-weight: 600;
        letter-spacing: 0.01em;
        position: relative;
        z-index: 1;
      }

      .brand-icon {
        width: 30px;
        height: 30px;
        border-radius: 50%;
        background: var(--brass);
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--forest);
        flex-shrink: 0;
      }

      .login-left-center {
        position: relative;
        z-index: 1;
        max-width: 460px;
      }

      .ring-decor {
        position: absolute;
        width: 300px;
        height: 300px;
        border-radius: 50%;
        border: 1px solid rgba(194,154,91,0.25);
        top: 50%;
        left: -60px;
        transform: translateY(-50%);
        pointer-events: none;
      }
      .ring-decor::before {
        content: '';
        position: absolute;
        inset: 40px;
        border-radius: 50%;
        border: 1px solid rgba(194,154,91,0.18);
      }

      .login-quote {
        font-family: var(--font-display);
        font-size: 30px;
        line-height: 1.4;
        font-weight: 500;
        position: relative;
      }
      .login-quote span { color: var(--brass); font-style: italic; }

      .login-quote-attr {
        margin-top: 18px;
        font-family: var(--font-mono);
        font-size: 12px;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        color: rgba(246,241,228,0.6);
        position: relative;
      }

      .login-left-footer {
        display: flex;
        align-items: center;
        gap: 8px;
        font-family: var(--font-mono);
        font-size: 11.5px;
        letter-spacing: 0.03em;
        color: rgba(246,241,228,0.55);
        position: relative;
        z-index: 1;
      }
      .badge-dot {
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: var(--brass);
        flex-shrink: 0;
        box-shadow: 0 0 0 3px rgba(194,154,91,0.18);
      }

      .login-right {
        background: var(--paper);
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 40px;
        min-height: 100vh;
      }
      .login-right-inner { width: 100%; max-width: 360px; }
      .login-right h2 { font-family: var(--font-display); font-size: 30px; margin: 0 0 6px 0; color: var(--text); }
      .login-sub { font-size: 14px; color: var(--text-soft); margin: 0 0 28px 0; }

      .field { margin-bottom: 16px; }
      .field label {
        display: block;
        font-family: var(--font-mono);
        font-size: 11px;
        letter-spacing: 0.1em;
        text-transform: uppercase;
        color: var(--text-soft);
        margin-bottom: 6px;
      }

      .input-wrap {
        display: flex;
        align-items: center;
        gap: 8px;
        border: 1px solid var(--paper-line);
        border-bottom: 2px solid var(--text);
        background: #fffdf8;
        padding: 10px 12px;
        border-radius: 2px;
      }
      .input-wrap:focus-within { border-bottom-color: var(--brass-deep); }
      .input-wrap input {
        border: none; outline: none; background: transparent;
        font-family: var(--font-body); font-size: 14px; width: 100%; color: var(--text);
      }

      .btn-primary {
        margin-top: 8px;
        width: 100%;
        background: var(--forest);
        color: var(--paper);
        border: none;
        padding: 13px 16px;
        border-radius: 2px;
        font-family: var(--font-body);
        font-weight: 600;
        font-size: 14px;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        cursor: pointer;
        transition: background 0.15s ease;
      }
      .btn-primary:hover { background: #1d3a2e; }

      .login-error { font-size: 12.5px; color: var(--maroon); margin: -6px 0 14px 0; }
      .login-demo-note { margin-top: 20px; font-size: 12px; color: var(--text-soft); text-align: center; }

      /* SHELL / SIDEBAR --------------------------------------------------- */
      .shell { display: grid; grid-template-columns: 232px 1fr; min-height: 100vh; }

      .sidebar {
        background: var(--ink-soft);
        border-right: 1px solid rgba(246,241,228,0.1);
        padding: 24px 0;
        display: flex;
        flex-direction: column;
        position: relative;
      }

      .nav { display: flex; flex-direction: column; gap: 2px; padding: 0 12px; flex: 1; }
      .nav-item {
        display: flex;
        align-items: center;
        gap: 10px;
        background: transparent;
        border: none;
        color: rgba(246,241,228,0.65);
        padding: 10px 12px;
        border-radius: 4px;
        font-family: var(--font-body);
        font-size: 13.5px;
        font-weight: 500;
        cursor: pointer;
        text-align: left;
      }
      .nav-item:hover { background: rgba(246,241,228,0.06); color: var(--paper); }
      .nav-item.active { background: var(--brass); color: var(--forest); font-weight: 600; }

      .sidebar-footer { padding: 16px 16px 4px 16px; border-top: 1px solid rgba(246,241,228,0.1); margin-top: 12px; }
      .sidebar-user { display: flex; align-items: center; gap: 10px; margin-bottom: 12px; }
      .avatar {
        width: 28px; height: 28px; border-radius: 50%;
        background: rgba(194,154,91,0.18); color: var(--brass);
        display: flex; align-items: center; justify-content: center; flex-shrink: 0;
      }
      .sidebar-user-email { font-size: 12px; color: rgba(246,241,228,0.7); word-break: break-all; }

      .btn-ghost {
        display: flex; align-items: center; gap: 6px;
        background: transparent; border: 1px solid rgba(246,241,228,0.25); color: var(--paper);
        padding: 8px 14px; border-radius: 2px; font-size: 13px; font-family: var(--font-body);
        cursor: pointer; transition: border-color 0.15s ease, background 0.15s ease;
      }
      .btn-ghost:hover { border-color: var(--brass); background: rgba(194,154,91,0.08); }

      .main-area {
        position: relative;
        overflow-x: hidden;
        min-height: 100vh;
        background:
          radial-gradient(circle at 12% 8%, rgba(194,154,91,0.07), transparent 38%),
          radial-gradient(circle at 92% 85%, rgba(47,87,69,0.35), transparent 45%),
          var(--ink);
      }
      .main-area::before {
        content: '';
        position: absolute;
        inset: 0;
        background-image: radial-gradient(rgba(246,241,228,0.05) 1px, transparent 1px);
        background-size: 22px 22px;
        pointer-events: none;
      }
      .content { max-width: 1180px; margin: 0 auto; padding: 36px 40px 64px 40px; position: relative; z-index: 1; }

      .page-header { display: flex; align-items: flex-end; justify-content: space-between; margin-bottom: 22px; gap: 12px; flex-wrap: wrap; }
      .page-header .eyebrow { color: var(--brass); margin-bottom: 6px; }
      .page-title { font-family: var(--font-display); font-size: 30px; margin: 0; color: var(--paper); font-weight: 600; }

      .link-btn {
        background: none; border: none; color: var(--forest); font-family: var(--font-body);
        font-size: 12.5px; font-weight: 600; cursor: pointer; padding: 0;
      }

      /* CARDS / GRIDS ------------------------------------------------------ */
      .summary-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 24px; }
      .summary-card { background: var(--paper); color: var(--text); border-radius: 4px; padding: 20px 22px; position: relative; overflow: hidden; }
      .summary-card .eyebrow { color: var(--text-soft); }
      .summary-value { font-family: var(--font-mono); font-size: 26px; font-weight: 600; margin-top: 8px; }
      .summary-icon { width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; position: absolute; top: 18px; right: 18px; }

      .grid-two { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 24px; align-items: stretch; }
      .panel { background: var(--paper); color: var(--text); border-radius: 4px; padding: 22px 24px; }
      .panel h3 { font-family: var(--font-display); font-size: 18px; margin: 0 0 18px 0; }

      .form-row { display: flex; gap: 10px; margin-bottom: 12px; }
      .form-row .field { flex: 1; margin-bottom: 0; }

      select.select-input {
        border: none; outline: none; background: transparent;
        font-family: var(--font-body); font-size: 14px; width: 100%; color: var(--text);
      }

      .type-toggle { display: flex; border: 1px solid var(--paper-line); border-radius: 2px; overflow: hidden; }
      .type-toggle button {
        flex: 1; padding: 10px; border: none; cursor: pointer;
        font-family: var(--font-body); font-size: 13px; font-weight: 600;
        background: #fffdf8; color: var(--text-soft);
      }
      .type-toggle button.active-expense { background: var(--maroon); color: var(--paper); }
      .type-toggle button.active-income { background: var(--moss); color: var(--paper); }

      .chart-wrap { height: 220px; }
      .empty-chart { height: 220px; display: flex; align-items: center; justify-content: center; color: var(--text-soft); font-size: 13px; text-align: center; }

      .ledger-panel { background: var(--paper); color: var(--text); border-radius: 4px; padding: 22px 24px 8px 24px; }
      .ledger-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px; gap: 12px; flex-wrap: wrap; }

      .tabs { display: flex; gap: 6px; }
      .tab {
        font-family: var(--font-mono); font-size: 11px; letter-spacing: 0.08em; text-transform: uppercase;
        padding: 6px 12px; border-radius: 20px; border: 1px solid var(--paper-line);
        background: transparent; color: var(--text-soft); cursor: pointer;
      }
      .tab.active { background: var(--forest); border-color: var(--forest); color: var(--paper); }

      .ledger-row { display: flex; align-items: center; gap: 12px; padding: 13px 0; border-bottom: 1px dashed var(--paper-line); }
      .ledger-row:last-child { border-bottom: none; }
      .ledger-cat-dot { width: 9px; height: 9px; border-radius: 50%; flex-shrink: 0; }
      .ledger-desc { font-size: 14px; font-weight: 500; }
      .ledger-meta { font-family: var(--font-mono); font-size: 11px; color: var(--text-soft); margin-top: 2px; }
      .ledger-leader { flex: 1; border-bottom: 1px dotted var(--paper-line); margin: 0 10px; transform: translateY(-4px); }
      .ledger-amount { font-family: var(--font-mono); font-size: 14.5px; font-weight: 600; white-space: nowrap; }
      .ledger-amount.income { color: var(--moss); }
      .ledger-amount.expense { color: var(--maroon); }

      .delete-btn { background: none; border: none; cursor: pointer; color: var(--text-soft); padding: 4px; display: flex; transition: color 0.15s ease; }
      .delete-btn:hover { color: var(--maroon); }

      .empty-state { padding: 40px 0; text-align: center; color: var(--text-soft); font-size: 13px; }

      /* BUDGETS ------------------------------------------------------------ */
      .budget-row { padding: 14px 0; border-bottom: 1px dashed var(--paper-line); }
      .budget-row:last-child { border-bottom: none; }
      .budget-row-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; }
      .budget-cat { display: flex; align-items: center; gap: 8px; font-size: 14px; font-weight: 500; }
      .budget-figures { display: flex; align-items: center; gap: 6px; font-family: var(--font-mono); font-size: 13px; }
      .budget-figures .over { color: var(--maroon); font-weight: 600; }
      .budget-figures .of-text { color: var(--text-soft); }
      .budget-edit { display: flex; align-items: center; gap: 8px; }
      .icon-btn { background: none; border: none; color: var(--text-soft); cursor: pointer; display: flex; padding: 4px; }
      .icon-btn:hover { color: var(--forest); }
      .progress-track { height: 6px; background: var(--paper-dim); border-radius: 4px; overflow: hidden; }
      .progress-fill { height: 100%; border-radius: 4px; transition: width 0.3s ease; }

      /* ANALYTICS ------------------------------------------------------------ */
      .top-cat-row { display: flex; align-items: center; gap: 10px; padding: 11px 0; border-bottom: 1px dashed var(--paper-line); }
      .top-cat-row:last-child { border-bottom: none; }
      .top-cat-rank {
        font-family: var(--font-mono); font-size: 12px; color: var(--text-soft);
        width: 18px; height: 18px; border-radius: 50%; border: 1px solid var(--paper-line);
        display: flex; align-items: center; justify-content: center; flex-shrink: 0;
      }

      /* SETTINGS ------------------------------------------------------------ */
      .settings-row { display: flex; align-items: flex-start; gap: 12px; padding: 14px 0; border-bottom: 1px dashed var(--paper-line); }
      .settings-row:last-child { border-bottom: none; }
      .settings-icon {
        width: 28px; height: 28px; border-radius: 50%; background: var(--paper-dim); color: var(--forest);
        display: flex; align-items: center; justify-content: center; flex-shrink: 0;
      }
      .settings-label { font-size: 13.5px; font-weight: 600; }
      .settings-value { font-size: 13px; color: var(--text-soft); margin-top: 2px; }
      .settings-sub { font-size: 12.5px; color: var(--text-soft); margin-top: 2px; max-width: 320px; }

      .toggle-row { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 14px 0; border-bottom: 1px dashed var(--paper-line); }

      .switch {
        width: 40px; height: 22px; border-radius: 20px; border: none; background: var(--paper-line);
        position: relative; cursor: pointer; flex-shrink: 0; transition: background 0.15s ease;
      }
      .switch.on { background: var(--forest); }
      .switch-knob {
        position: absolute; top: 2px; left: 2px; width: 18px; height: 18px; border-radius: 50%;
        background: #fffdf8; transition: transform 0.15s ease;
      }
      .switch.on .switch-knob { transform: translateX(18px); }

      @media (max-width: 900px) {
        .shell { grid-template-columns: 1fr; }
        .sidebar { display: none; }
      }
      @media (max-width: 720px) {
        .login-screen { grid-template-columns: 1fr; }
        .login-left { display: none; }
        .summary-row { grid-template-columns: 1fr; }
        .grid-two { grid-template-columns: 1fr; }
        .form-row { flex-direction: column; }
        .content { padding: 24px 16px 48px 16px; }
      }
    `}</style>
  );
}
