import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:8080/api/expenses';

function App() {
  const [expenses, setExpenses] = useState([]);
  const [form, setForm] = useState({
    amount: '',
    category: '',
    date: '',
    note: ''
  });

  // Fetch all expenses when the page loads
  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    const response = await axios.get(API_URL);
    setExpenses(response.data);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post(API_URL, {
      ...form,
      amount: parseFloat(form.amount)
    });
    setForm({ amount: '', category: '', date: '', note: '' });
    fetchExpenses();
  };

  const handleDelete = async (id) => {
    await axios.delete(`${API_URL}/${id}`);
    fetchExpenses();
  };

  return (
    <div style={{ maxWidth: '600px', margin: '40px auto', fontFamily: 'sans-serif' }}>
      <h1>Expense Tracker</h1>

      <form onSubmit={handleSubmit} style={{ marginBottom: '30px' }}>
        <input
          type="number"
          name="amount"
          placeholder="Amount"
          value={form.amount}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="category"
          placeholder="Category"
          value={form.category}
          onChange={handleChange}
          required
        />
        <input
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="note"
          placeholder="Note"
          value={form.note}
          onChange={handleChange}
        />
        <button type="submit">Add Expense</button>
      </form>

      <table border="1" cellPadding="8" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>Amount</th>
            <th>Category</th>
            <th>Date</th>
            <th>Note</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map((exp) => (
            <tr key={exp.id}>
              <td>{exp.amount}</td>
              <td>{exp.category}</td>
              <td>{exp.date}</td>
              <td>{exp.note}</td>
              <td>
                <button onClick={() => handleDelete(exp.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;