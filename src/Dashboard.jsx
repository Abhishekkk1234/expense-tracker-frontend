import { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import {
  getMonthlyTotal, getWeeklyTotal, getDailyBreakdown, getMonthlyComparison,
} from './utils/expenseCalculations';

function Dashboard({ expenses }) {
  const [activeTab, setActiveTab] = useState('7days');

  const today = new Date();
  const monthlyTotal = getMonthlyTotal(expenses, today.getFullYear(), today.getMonth());
  const weeklyTotal = getWeeklyTotal(expenses);
  const dailyData = getDailyBreakdown(expenses);
  const monthlyComparison = getMonthlyComparison(expenses);
  const currentMonthName = today.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const chartData = activeTab === '7days' ? dailyData : monthlyComparison;

  const tabs = [
    { id: '7days', label: 'Last 7 Days' },
    { id: '6months', label: 'Last 6 Months' },
  ];

  return (
    <div className="mb-10">

      {/* Summary strip */}
      <div className="grid grid-cols-2 gap-8 mb-8 pb-6 border-b border-rule">
        <div>
          <p className="text-muted text-xs tracking-[0.15em] uppercase mb-1 font-mono">{currentMonthName}</p>
          <p className="font-display text-3xl text-gold">₹{monthlyTotal.toFixed(2)}</p>
        </div>
        <div>
          <p className="text-muted text-xs tracking-[0.15em] uppercase mb-1 font-mono">Last 7 Days</p>
          <p className="font-display text-3xl text-mint">₹{weeklyTotal.toFixed(2)}</p>
        </div>
      </div>

      {/* Chart with tabs */}
      <div className="flex items-center gap-6 mb-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`text-sm font-mono pb-2 border-b-2 transition-colors ${
              activeTab === tab.id
                ? 'border-gold text-ivory'
                : 'border-transparent text-muted hover:text-ivory'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="bg-surface border border-rule rounded-lg p-6">
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="2 4" stroke="#2C3140" vertical={false} />
            <XAxis dataKey="label" stroke="#8C8FA3" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#8C8FA3" fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip
              contentStyle={{ backgroundColor: '#20242F', border: '1px solid #2C3140', borderRadius: '6px', fontFamily: 'IBM Plex Mono' }}
              labelStyle={{ color: '#EDEBE4' }}
              formatter={(value) => [`₹${value.toFixed(2)}`, 'Spent']}
              cursor={{ fill: '#2C3140', opacity: 0.4 }}
            />
            <Bar dataKey="total" fill="#D9A94E" radius={[3, 3, 0, 0]} maxBarSize={36} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default Dashboard;