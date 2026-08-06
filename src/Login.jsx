import { useState } from 'react';
import axios from 'axios';

const AUTH_URL = 'http://localhost:8080/api/auth';

function Login({ onLogin }) {
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (isRegister) {
        await axios.post(`${AUTH_URL}/register`, form);
        const res = await axios.post(`${AUTH_URL}/login`, {
          email: form.email,
          password: form.password,
        });
        onLogin(res.data);
      } else {
        const res = await axios.post(`${AUTH_URL}/login`, {
          email: form.email,
          password: form.password,
        });
        onLogin(res.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Check your details.');
    }
  };

  return (
    <div className="min-h-screen bg-ink text-ivory font-body flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <p className="text-gold text-xs tracking-[0.2em] uppercase mb-2 font-mono text-center">Personal Ledger</p>
        <h1 className="font-display text-3xl text-center mb-8">
          {isRegister ? 'Create Account' : 'Welcome Back'}
        </h1>

        <form onSubmit={handleSubmit} className="bg-surface border border-rule rounded-lg p-6 space-y-4">
          {isRegister && (
            <input
              type="text" name="name" placeholder="Name" value={form.name}
              onChange={handleChange} required
              className="w-full bg-ink border border-rule rounded-md px-4 py-2.5 text-ivory placeholder-muted focus:outline-none focus:border-gold transition-colors"
            />
          )}
          <input
            type="email" name="email" placeholder="Email" value={form.email}
            onChange={handleChange} required
            className="w-full bg-ink border border-rule rounded-md px-4 py-2.5 text-ivory placeholder-muted focus:outline-none focus:border-gold transition-colors"
          />
          <input
            type="password" name="password" placeholder="Password" value={form.password}
            onChange={handleChange} required
            className="w-full bg-ink border border-rule rounded-md px-4 py-2.5 text-ivory placeholder-muted focus:outline-none focus:border-gold transition-colors"
          />

          {error && <p className="text-coral text-sm font-mono">{error}</p>}

          <button
            type="submit"
            className="w-full bg-gold hover:bg-goldSoft transition-colors text-ink font-semibold px-6 py-2.5 rounded-md"
          >
            {isRegister ? 'Create Account' : 'Log In'}
          </button>
        </form>

        <p className="text-center text-muted text-sm mt-4 font-mono">
          {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button
            onClick={() => { setIsRegister(!isRegister); setError(''); }}
            className="text-gold hover:text-goldSoft"
          >
            {isRegister ? 'Log in' : 'Sign up'}
          </button>
        </p>
      </div>
    </div>
  );
}

export default Login;