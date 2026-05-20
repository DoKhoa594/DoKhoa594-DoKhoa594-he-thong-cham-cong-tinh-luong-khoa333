import connection from "../config/db.js";

// =====================================
// TIME HELPERS (VN +7)
// =====================================

const getVNDate = () => {
  const now = new Date();

  // lấy ngày VN thật
  now.setHours(now.getHours() + 7);

  return now.toISOString().split("T")[0];
};

const getVNTime = () => {
  const now = new Date();

  now.setHours(now.getHours() + 7);

  return now.toTimeString().split(" ")[0];
};

// =====================================
// GET ATTENDANCE
// =====================================

export const getAttendances = async (req, res) => {
  try {
    const { date } = req.query;
    const today = getVNDate();

    console.log("DATE FILTER =", date);

    const sql = `
      SELECT
        employees.id,
        employees.name AS employee_name,

        attendance.id AS attendance_id,
        attendance.employee_id,
        attendance.work_date,
        attendance.check_in,
        attendance.check_out,
         attendance.reason,

     CASE
  WHEN attendance.status IS NULL
       AND DATE(?) <= DATE(?)
  THEN 'absent'

  ELSE attendance.status
END AS status

      FROM employees

      LEFT JOIN attendance
        ON employees.id = attendance.employee_id
        AND DATE(attendance.work_date) = DATE(?)

      ORDER BY employees.id DESC
    `;

    connection.query(sql, [date, today, date], (err, results) => {
      if (err) {
        console.log(err);

        return res.status(500).json({
          message: "Lỗi lấy attendance",
        });
      }

      console.log("RESULT =", results);

      const present = results.filter(
        (item) => item.status === "present",
      ).length;

      const late = results.filter((item) => item.status === "late").length;

      const absent = results.filter((item) => item.status === "absent").length;

      return res.json({
        attendance: results,
        summary: {
          present,
          late,
          absent,
        },
      });
    });
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      message: "Server Error",
    });
  }
};

// =====================================
// CHECK IN
// =====================================

export const checkIn = async (req, res) => {
  try {
    const { employee_id } = req.body;

    const today = getVNDate();

    const time = getVNTime();

    const checkSql = `
      SELECT *
      FROM attendance
      WHERE employee_id = ?
      AND work_date = ?
    `;

    connection.query(checkSql, [employee_id, today], (err, results) => {
      if (err) {
        console.log(err);

        return res.status(500).json({
          message: "Database error",
        });
      }

      if (results.length > 0) {
        return res.status(400).json({
          message: "Đã check in hôm nay",
        });
      }

      const status = time > "08:00:00" ? "late" : "present";

      const insertSql = `
        INSERT INTO attendance
        (
          employee_id,
          work_date,
          check_in,
          status
        )
        VALUES (?, ?, ?, ?)
      `;

      connection.query(insertSql, [employee_id, today, time, status], (err) => {
        if (err) {
          console.log(err);

          return res.status(500).json({
            message: "Check in thất bại",
          });
        }

        return res.json({
          message: "Check in thành công",
          time,
          date: today,
        });
      });
    });
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      message: "Server Error",
    });
  }
};

// =====================================
// CHECK OUT
// =====================================

export const checkOut = async (req, res) => {
  try {
    const { employee_id } = req.body;

    const today = getVNDate();

    const time = getVNTime();

    const sql = `
      UPDATE attendance
      SET check_out = ?
      WHERE employee_id = ?
      AND work_date = ?
    `;

    connection.query(sql, [time, employee_id, today], (err) => {
      if (err) {
        console.log(err);

        return res.status(500).json({
          message: "Check out thất bại",
        });
      }

      return res.json({
        message: "Check out thành công",
        time,
        date: today,
      });
    });
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      message: "Server Error",
    });
  }
};
