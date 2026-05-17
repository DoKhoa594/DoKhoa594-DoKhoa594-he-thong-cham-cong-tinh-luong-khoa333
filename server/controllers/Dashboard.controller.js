import connection from "../config/db.js";

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

    // =========================
    // TOTAL EMPLOYEES
    // =========================
    const emp = await query("SELECT COUNT(*) as total FROM employees");
    const totalEmployees = emp[0].total;

    // =========================
    // PRESENT (có check_in)
    // =========================
    const present = await query(
      `SELECT COUNT(*) as total
       FROM attendance
       WHERE work_date = ?
       AND check_in IS NOT NULL`,
      [date],
    );

    // =========================
    // LATE / ABSENT (logic thật)
    // =========================
    const late = await query(
      `SELECT COUNT(*) as total
       FROM attendance
       WHERE work_date = ?
       AND (
         check_in IS NULL
         OR TIME(check_in) > '08:00:00'
       )`,
      [date],
    );

    // =========================
    // HOURS TODAY (CHUẨN PHÚT)
    // =========================
    const hoursToday = await query(
      `SELECT SUM(
         TIMESTAMPDIFF(
           MINUTE,
           check_in,
           IFNULL(check_out, NOW())
         )
       ) / 60 as total
       FROM attendance
       WHERE work_date = ?
       AND check_in IS NOT NULL`,
      [date],
    );

    const hoursByDate = hoursToday[0].total || 0;

    // =========================
    // HOURS MONTH (CHUẨN PHÚT)
    // =========================
    const hoursMonth = await query(
      `SELECT SUM(
         TIMESTAMPDIFF(
           MINUTE,
           check_in,
           IFNULL(check_out, NOW())
         )
       ) / 60 as total
       FROM attendance
       WHERE DATE_FORMAT(work_date, '%Y-%m') = ?
       AND check_in IS NOT NULL`,
      [month],
    );

    const hoursByMonth = hoursMonth[0].total || 0;

    // =========================
    // SALARY
    // =========================
    const SALARY_PER_HOUR = 50000;

    const salaryToday = hoursByDate * SALARY_PER_HOUR;
    const salaryMonth = hoursByMonth * SALARY_PER_HOUR;

    // =========================
    // CHART (THEO NGÀY TRONG THÁNG)
    // =========================
    const chart = await query(
      `SELECT
         DAY(work_date) as day,
         SUM(
           TIMESTAMPDIFF(
             MINUTE,
             check_in,
             IFNULL(check_out, NOW())
           )
         ) / 60 as hours
       FROM attendance
       WHERE DATE_FORMAT(work_date, '%Y-%m') = ?
       AND check_in IS NOT NULL
       GROUP BY DAY(work_date)
       ORDER BY DAY(work_date)`,
      [month],
    );

    const chartData = chart.map((item) => ({
      day: String(item.day).padStart(2, "0"),
      hours: Number(item.hours || 0).toFixed(2),
    }));

    // =========================
    // RESPONSE
    // =========================
    res.json({
      stats: {
        totalEmployees,
        todayPresent: present[0].total,
        lateOrAbsent: late[0].total,
        totalHours: Number(hoursByDate.toFixed(2)),

        salaryToday: Math.round(salaryToday),
        salaryMonth: Math.round(salaryMonth),

        hoursByDate: Number(hoursByDate.toFixed(2)),
        hoursByMonth: Number(hoursByMonth.toFixed(2)),
      },
      chart: chartData,
    });
  } catch (err) {
    console.error("❌ Dashboard error:", err);
    res.status(500).json({ error: err.message });
  }
};
