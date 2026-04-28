import connection from "../config/db.js";
import bcrypt from "bcrypt";
const query = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    connection.query(sql, params, (err, results) => {
      if (err) reject(err);
      else resolve(results);
    });
  });
};

export const getDashboard = async (req, res) => {
  try {
    const { date, month } = req.query;

    // ===== TOTAL EMPLOYEES =====
    const emp = await query("SELECT COUNT(*) as total FROM employees");
    const totalEmployees = emp[0].total;

    // ===== TODAY PRESENT =====
    const present = await query(
      `SELECT COUNT(*) as total 
       FROM attendance 
       WHERE work_date = ? AND status = 'present'`,
      [date],
    );

    // ===== LATE / ABSENT =====
    const late = await query(
      `SELECT COUNT(*) as total 
       FROM attendance 
       WHERE work_date = ? AND status IN ('late','absent')`,
      [date],
    );

    // ===== HOURS TODAY =====
    const hoursToday = await query(
      `SELECT SUM(
        TIMESTAMPDIFF(HOUR, check_in, check_out)
      ) as total
       FROM attendance
       WHERE work_date = ?`,
      [date],
    );

    const hoursByDate = hoursToday[0].total || 0;

    // ===== HOURS MONTH =====
    const hoursMonth = await query(
      `SELECT SUM(
        TIMESTAMPDIFF(HOUR, check_in, check_out)
      ) as total
       FROM attendance
       WHERE DATE_FORMAT(work_date, '%Y-%m') = ?`,
      [month],
    );

    const hoursByMonth = hoursMonth[0].total || 0;

    // ===== SALARY =====
    const SALARY_PER_HOUR = 50000;

    const salaryToday = hoursByDate * SALARY_PER_HOUR;
    const salaryMonth = hoursByMonth * SALARY_PER_HOUR;

    // ===== CHART =====
    const chart = await query(
      `
      SELECT 
        DAY(work_date) as day,
        SUM(TIMESTAMPDIFF(HOUR, check_in, check_out)) as hours
      FROM attendance
      WHERE DATE_FORMAT(work_date, '%Y-%m') = ?
      GROUP BY DAY(work_date)
      ORDER BY DAY(work_date)
      `,
      [month],
    );

    const chartData = chart.map((item) => ({
      day: item.day.toString().padStart(2, "0"),
      hours: item.hours || 0,
    }));

    res.json({
      stats: {
        totalEmployees,
        todayPresent: present[0].total,
        lateOrAbsent: late[0].total,
        totalHours: hoursByDate,

        salaryToday,
        salaryMonth,

        hoursByDate,
        hoursByMonth,
      },
      chart: chartData,
    });
  } catch (err) {
    console.error("❌ Dashboard error:", err);
    res.status(500).json({ error: err.message });
  }
};
