import connection from "../config/db.js";

// =====================================
// TIME HELPERS (VN +7)
// =====================================

const getVNDate = () => {
  const d = new Date();
  return new Date(d.getTime() + 7 * 60 * 60 * 1000).toISOString().split("T")[0];
};

const getVNTime = () => {
  const d = new Date();
  return new Date(d.getTime() + 7 * 60 * 60 * 1000)
    .toTimeString()
    .split(" ")[0];
};

// =====================================
// GET ATTENDANCE
// =====================================

export const getAttendances = async (req, res) => {
  try {
    const { date } = req.query;

    console.log("DATE =", date);
    console.log("WHERE RUNNING");

    const sql = `
      SELECT
        attendance.id,
        attendance.employee_id,
        employees.name AS employee_name,
        attendance.work_date,
        attendance.check_in,
        attendance.check_out,
        attendance.status
      FROM attendance
      INNER JOIN employees
        ON attendance.employee_id = employees.id
      WHERE attendance.work_date = ?
    `;

    connection.query(sql, [date], (err, results) => {
      if (err) {
        console.log(err);

        return res.status(500).json({
          message: "Lỗi lấy attendance",
        });
      }

      const present = results.filter(
        (item) => item.status === "present",
      ).length;

      const late = results.filter((item) => item.status === "late").length;

      const absent = results.filter((item) => item.status === "absent").length;

      res.json({
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

    res.status(500).json({
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
        (employee_id, work_date, check_in, status)
        VALUES (?, ?, ?, ?)
      `;

      connection.query(insertSql, [employee_id, today, time, status], (err) => {
        if (err) {
          console.log(err);
          return res.status(500).json({
            message: "Check in thất bại",
          });
        }

        res.json({
          message: "Check in thành công",
          time,
          date: today,
        });
      });
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
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

      res.json({
        message: "Check out thành công",
        time,
        date: today,
      });
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Server Error",
    });
  }
};
