import { useState, useEffect } from 'react';
import axios from 'axios';
import Dashboard from './Dashboard';
import Login from './Login';

const API_URL = 'http://localhost:8080/api/expenses';

function App() {
  const [authData, setAuthData] = useState(() => {
    const saved = localStorage.getItem('authData');
    return saved ? JSON.parse(saved) : null;
  });

  const [expenses, setExpenses] = useState([]);
  const [form, setForm] = useState({ amount: '', category: '', date: '', note: '' });

  const authHeader = { headers: { Authorization: `Bearer ${authData?.token}` } };

  useEffect(() => {
    if (authData) fetchExpenses();
  }, [authData]);

  const fetchExpenses = async () => {
    const response = await axios.get(API_URL, authHeader);
    setExpenses(response.data);
  };

  const handleLogin = (data) => {
    localStorage.setItem('authData', JSON.stringify(data));
    setAuthData(data);
  };

  const handleLogout = () => {
    localStorage.removeItem('authData');
    setAuthData(null);
    setExpenses([]);
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post(API_URL, { ...form, amount: parseFloat(form.amount) }, authHeader);
    setForm({ amount: '', category: '', date: '', note: '' });
    fetchExpenses();
  };

  const handleDelete = async (id) => {
    await axios.delete(`${API_URL}/${id}`, authHeader);
    fetchExpenses();
  };

  if (!authData) return <Login onLogin={handleLogin} />;

  const total = expenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="min-h-screen bg-ink text-ivory font-body">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-14">

        {/* Header — ledger masthead */}
        <div className="mb-8 sm:mb-10 border-b border-rule pb-6 flex items-start sm:items-center justify-between gap-4">
          <div>
            <p className="text-gold text-xs tracking-[0.2em] uppercase mb-2 font-mono">Personal Ledger</p>
            <h1 className="font-display text-3xl sm:text-4xl text-ivory tracking-tight">Expense Tracker</h1>
          </div>
          <div className="text-right shrink-0">
            <p className="text-muted text-sm font-mono truncate max-w-[120px] sm:max-w-none">{authData.name}</p>
            <button onClick={handleLogout} className="text-coral text-sm hover:text-red-400">
              Log out
            </button>
          </div>
        </div>

        <Dashboard expenses={expenses} />

        {/* Form */}
        <div className="mb-8 sm:mb-10">
          <h2 className="font-display text-xl text-ivory mb-4">New Entry</h2>
          <form onSubmit={handleSubmit} className="bg-surface border border-rule rounded-lg p-4 sm:p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <input
                type="number" name="amount" placeholder="Amount" value={form.amount}
                onChange={handleChange} required
                className="w-full bg-ink border border-rule rounded-md px-4 py-2.5 text-ivory font-mono placeholder-muted focus:outline-none focus:border-gold transition-colors"
              />
              <input
                type="text" name="category" placeholder="Category" value={form.category}
                onChange={handleChange} required
                className="w-full bg-ink border border-rule rounded-md px-4 py-2.5 text-ivory placeholder-muted focus:outline-none focus:border-gold transition-colors"
              />
              <input
                type="date" name="date" value={form.date}
                onChange={handleChange} required
                className="w-full bg-ink border border-rule rounded-md px-4 py-2.5 text-ivory font-mono placeholder-muted focus:outline-none focus:border-gold transition-colors [color-scheme:dark]"
              />
              <input
                type="text" name="note" placeholder="Note (optional)" value={form.note}
                onChange={handleChange}
                className="w-full bg-ink border border-rule rounded-md px-4 py-2.5 text-ivory placeholder-muted focus:outline-none focus:border-gold transition-colors"
              />
            </div>
            <button
              type="submit"
              className="w-full sm:w-auto bg-gold hover:bg-goldSoft transition-colors text-ink font-semibold px-6 py-2.5 rounded-md"
            >
              Add Entry
            </button>
          </form>
        </div>

        {/* Ledger table */}
        <div>
          <div className="flex items-baseline justify-between mb-4">
            <h2 className="font-display text-xl text-ivory">Entries</h2>
            <p className="font-mono text-sm text-muted">
              Total <span className="text-gold">₹{total.toFixed(2)}</span>
            </p>
          </div>

          <div className="border-t border-rule">
            {expenses.length === 0 && (
              <p className="py-10 text-center text-muted font-mono text-sm">
                No entries yet — add your first one above.
              </p>
            )}
            {expenses.map((exp) => (
              <div
                key={exp.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between py-4 border-b border-rule group gap-1 sm:gap-0"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-ivory truncate">{exp.category}</p>
                  <p className="text-muted text-sm truncate">{exp.note || '—'}</p>
                </div>
                <div className="flex items-center justify-between sm:contents">
                  <p className="font-mono text-sm text-muted sm:w-28">{exp.date}</p>
                  <p className="font-mono text-gold sm:w-24 sm:text-right">₹{exp.amount.toFixed(2)}</p>
                </div>
                <button
                  onClick={() => handleDelete(exp.id)}
                  className="self-start sm:self-auto sm:ml-4 text-coral sm:opacity-0 sm:group-hover:opacity-100 transition-opacity text-sm"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

export default App;