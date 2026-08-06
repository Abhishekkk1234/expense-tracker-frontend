// Get the number of days in a specific month (handles 28/29/30/31 automatically)
export function getDaysInMonth(year, month) {
  // month is 0-indexed (0 = January). Day 0 of "next month" = last day of "this month"
  return new Date(year, month + 1, 0).getDate();
}

// Total spent in a specific calendar month (e.g. August 2026)
export function getMonthlyTotal(expenses, year, month) {
  return expenses
    .filter((exp) => {
      const d = new Date(exp.date);
      return d.getFullYear() === year && d.getMonth() === month;
    })
    .reduce((sum, exp) => sum + exp.amount, 0);
}

// Total spent in the last 7 days (rolling week, not calendar week)
export function getWeeklyTotal(expenses) {
  const today = new Date();
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(today.getDate() - 6); // includes today = 7 days total

  return expenses
    .filter((exp) => {
      const d = new Date(exp.date);
      return d >= sevenDaysAgo && d <= today;
    })
    .reduce((sum, exp) => sum + exp.amount, 0);
}

// Day-by-day breakdown for the last 7 days — for the daily bar chart
export function getDailyBreakdown(expenses) {
  const result = [];
  const today = new Date();

  for (let i = 6; i >= 0; i--) {
    const day = new Date();
    day.setDate(today.getDate() - i);
    const dayStr = day.toISOString().split('T')[0]; // "YYYY-MM-DD"

    const total = expenses
      .filter((exp) => exp.date === dayStr)
      .reduce((sum, exp) => sum + exp.amount, 0);

    result.push({
      label: day.toLocaleDateString('en-US', { weekday: 'short' }), // "Mon", "Tue"...
      total,
    });
  }
  return result;
}

// Month-over-month comparison — last 6 months, each correctly bounded by its own day count
export function getMonthlyComparison(expenses) {
  const result = [];
  const today = new Date();

  for (let i = 5; i >= 0; i--) {
    const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
    const year = d.getFullYear();
    const month = d.getMonth();

    const total = getMonthlyTotal(expenses, year, month);

    result.push({
      label: d.toLocaleDateString('en-US', { month: 'short' }), // "Mar", "Apr"...
      total,
      daysInMonth: getDaysInMonth(year, month), // useful if you want a daily average later
    });
  }
  return result;
}