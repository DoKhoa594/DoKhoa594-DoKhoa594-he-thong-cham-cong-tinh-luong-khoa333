import connection from "../config/db.js";

// =====================================
// TIME HELPERS (VN +7)
// =====================================

const getVNDate = () => {
  return new Date().toLocaleDateString("en-CA", {
    timeZone: "Asia/Ho_Chi_Minh",
  });
};

const getVNTime = () => {
  return new Date().toLocaleTimeString("en-GB", {
    timeZone: "Asia/Ho_Chi_Minh",
    hour12: false,
  });
};

// =====================================
// GET ATTENDANCES
// =====================================

export const getAttendances = async (req, res) => {
  try {
    const { date } = req.query;

    const sql = `
      SELECT
        employees.id AS employee_id,
        employees.name AS employee_name,

        attendance.id AS attendance_id,
        attendance.work_date,
        attendance.check_in,
        attendance.check_out,
        attendance.reason,
        attendance.leave_status,

        CASE
          WHEN attendance.id IS NULL THEN 'absent'
          ELSE attendance.status
        END AS status

      FROM employees
      LEFT JOIN attendance
        ON employees.id = attendance.employee_id
        AND DATE(attendance.work_date) = DATE(?)

      ORDER BY employees.id DESC
    `;

    connection.query(sql, [date], (err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          message: "Lỗi lấy attendance",
        });
      }

      const present = results.filter((r) => r.status === "present").length;
      const late = results.filter((r) => r.status === "late").length;
      const leave = results.filter((r) => r.status === "leave").length;
      const absent = results.filter((r) => r.status === "absent").length;

      return res.json({
        attendance: results,
        summary: { present, late, leave, absent },
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
// GET MY ATTENDANCE TODAY
// =====================================

export const getMyAttendance = (req, res) => {
  try {
    const { employee_id } = req.params;
    const today = getVNDate();

    const sql = `
      SELECT *
      FROM attendance
      WHERE employee_id = ?
      AND work_date = ?
      LIMIT 1
    `;

    connection.query(sql, [employee_id, today], (err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          message: "Lỗi lấy attendance",
        });
      }

      if (results.length === 0) {
        return res.json(null);
      }

      return res.json(results[0]);
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
    const { employee_id, status = "present", reason = null } = req.body;

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

      let finalStatus = status;

      if (status === "present") {
        finalStatus = time > "08:00:00" ? "late" : "present";
      }

      if (status === "leave") {
        finalStatus = "leave";
      }

      const insertSql = `
        INSERT INTO attendance
        (employee_id, work_date, check_in, status, reason, leave_status)
        VALUES (?, ?, ?, ?, ?, ?)
      `;

      connection.query(
        insertSql,
        [
          employee_id,
          today,
          finalStatus === "leave" ? null : time,
          finalStatus,
          reason,
          finalStatus === "leave" ? "pending" : null,
        ],
        (err) => {
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
            status: finalStatus,
          });
        },
      );
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

    const checkSql = `
      SELECT *
      FROM attendance
      WHERE employee_id = ?
      AND work_date = ?
    `;

    connection.query(checkSql, [employee_id, today], (err, results) => {
      if (err) {
        return res.status(500).json(err);
      }

      if (results.length === 0) {
        return res.status(400).json({
          message: "Bạn chưa check in",
        });
      }

      if (results[0].status === "leave") {
        return res.status(400).json({
          message: "Đang nghỉ phép",
        });
      }

      if (results[0].check_out) {
        return res.status(400).json({
          message: "Đã check out",
        });
      }

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
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Server Error",
    });
  }
};

// =====================================
// APPROVE LEAVE
// =====================================

export const approveLeave = (req, res) => {
  const { id } = req.params;

  const sql = `
    UPDATE attendance
    SET leave_status = 'approved'
    WHERE id = ?
  `;

  connection.query(sql, [id], (err) => {
    if (err) {
      return res.status(500).json({
        message: "Duyệt thất bại",
      });
    }

    return res.json({
      message: "Đã duyệt đơn nghỉ",
    });
  });
};

// =====================================
// REJECT LEAVE
// =====================================

export const rejectLeave = (req, res) => {
  const { id } = req.params;

  const sql = `
    UPDATE attendance
    SET leave_status = 'rejected'
    WHERE id = ?
  `;

  connection.query(sql, [id], (err) => {
    if (err) {
      return res.status(500).json({
        message: "Từ chối thất bại",
      });
    }

    return res.json({
      message: "Đã từ chối đơn nghỉ",
    });
  });
};
