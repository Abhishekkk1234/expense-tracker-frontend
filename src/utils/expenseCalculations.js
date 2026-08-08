// Format a Date object as YYYY-MM-DD using LOCAL time (not UTC) — avoids timezone shift bugs
function toLocalDateString(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Get the number of days in a specific month (handles 28/29/30/31 automatically)
export function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

// Total spent in a specific calendar month (e.g. August 2026)
export function getMonthlyTotal(expenses, year, month) {
  return expenses
    .filter((exp) => {
      const [expYear, expMonth] = exp.date.split('-').map(Number);
      return expYear === year && (expMonth - 1) === month;
    })
    .reduce((sum, exp) => sum + exp.amount, 0);
}

// Total spent in the last 7 days (rolling week, not calendar week)
export function getWeeklyTotal(expenses) {
  const today = new Date();
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(today.getDate() - 6);

  const todayStr = toLocalDateString(today);
  const sevenDaysAgoStr = toLocalDateString(sevenDaysAgo);

  return expenses
    .filter((exp) => exp.date >= sevenDaysAgoStr && exp.date <= todayStr)
    .reduce((sum, exp) => sum + exp.amount, 0);
}

// Day-by-day breakdown for the last 7 days — for the daily bar chart
export function getDailyBreakdown(expenses) {
  const result = [];
  const today = new Date();

  for (let i = 6; i >= 0; i--) {
    const day = new Date();
    day.setDate(today.getDate() - i);
    const dayStr = toLocalDateString(day); // LOCAL date, not UTC — this is the fix

    const total = expenses
      .filter((exp) => exp.date === dayStr)
      .reduce((sum, exp) => sum + exp.amount, 0);

    result.push({
      label: day.toLocaleDateString('en-US', { weekday: 'short' }),
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
      label: d.toLocaleDateString('en-US', { month: 'short' }),
      total,
      daysInMonth: getDaysInMonth(year, month),
    });
  }
  return result;
}