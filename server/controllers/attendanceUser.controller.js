import connection from "../config/db.js";

// ======================================
// GET ALL ATTENDANCE
// ======================================

const getAttendances = (req, res) => {
  const sql = `
    SELECT
      attendance.*,
      employees.name AS employee_name
    FROM attendance
    JOIN employees
      ON attendance.employee_id = employees.id
    ORDER BY attendance.id DESC
  `;

  connection.query(sql, (err, result) => {
    if (err) {
      return res.status(500).json(err);
    }

    res.json(result);
  });
};

// ======================================
// GET MY ATTENDANCE
// ======================================

const getMyAttendance = (req, res) => {
  const { employee_id } = req.params;

  const today = new Date().toLocaleDateString("en-CA", {
    timeZone: "Asia/Ho_Chi_Minh",
  });

  const sql = `
    SELECT *
    FROM attendance
    WHERE employee_id = ?
    AND work_date = ?
    LIMIT 1
  `;

  connection.query(sql, [employee_id, today], (err, result) => {
    if (err) {
      return res.status(500).json(err);
    }

    if (result.length === 0) {
      return res.json(null);
    }

    res.json(result[0]);
  });
};

// ======================================
// CHECK IN
// ======================================

const checkIn = (req, res) => {
  const { employee_id, status = "present", reason = null } = req.body;

  const today = new Date().toLocaleDateString("en-CA", {
    timeZone: "Asia/Ho_Chi_Minh",
  });

  const currentTime = new Date().toLocaleTimeString("en-GB", {
    timeZone: "Asia/Ho_Chi_Minh",
    hour12: false,
  });

  // =====================================
  // CHECK ĐÃ CHẤM CÔNG CHƯA
  // =====================================

  const checkSql = `
    SELECT *
    FROM attendance
    WHERE employee_id = ?
    AND work_date = ?
  `;

  connection.query(checkSql, [employee_id, today], (err, result) => {
    if (err) {
      return res.status(500).json(err);
    }

    // đã chấm công rồi
    if (result.length > 0) {
      return res.status(400).json({
        message: "Bạn đã chấm công hôm nay rồi",
      });
    }

    // =====================================
    // INSERT ATTENDANCE
    // =====================================

    const insertSql = `
      INSERT INTO attendance
      (
        employee_id,
        work_date,
        check_in,
        status,
        reason,
        leave_status
      )
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    connection.query(
      insertSql,
      [
        employee_id,
        today,

        // nghỉ thì không có giờ checkin
        status === "leave" ? null : currentTime,

        status,
        reason,

        // leave mặc định pending
        status === "leave" ? "pending" : null,
      ],
      (err, result) => {
        if (err) {
          return res.status(500).json(err);
        }

        res.json({
          message: "Check In Success",
          time: currentTime,
          status,
          reason,
        });
      },
    );
  });
};

// ======================================
// CHECK OUT
// ======================================

const checkOut = (req, res) => {
  const { employee_id } = req.body;

  const now = new Date();

  now.setHours(now.getHours() + 7);

  const today = now.toISOString().split("T")[0];

  const currentTime = now.toTimeString().split(" ")[0];

  // =====================================
  // CHECK CÓ CHECKIN CHƯA
  // =====================================

  const checkSql = `
    SELECT *
    FROM attendance
    WHERE employee_id = ?
    AND work_date = ?
  `;

  connection.query(checkSql, [employee_id, today], (err, result) => {
    if (err) {
      return res.status(500).json(err);
    }

    // chưa checkin
    if (result.length === 0) {
      return res.status(400).json({
        message: "Bạn chưa check in",
      });
    }

    // nghỉ phép thì không được checkout
    if (result[0].status === "leave") {
      return res.status(400).json({
        message: "Bạn đang nghỉ phép hôm nay",
      });
    }

    // đã checkout rồi
    if (result[0].check_out) {
      return res.status(400).json({
        message: "Bạn đã check out rồi",
      });
    }

    // =====================================
    // UPDATE CHECKOUT
    // =====================================

    const sql = `
      UPDATE attendance
      SET check_out = ?
      WHERE employee_id = ?
      AND work_date = ?
    `;

    connection.query(sql, [currentTime, employee_id, today], (err, result) => {
      if (err) {
        console.log(err);

        return res.status(500).json(err);
      }

      res.json({
        message: "Check Out Success",
        time: currentTime,
      });
    });
  });
};

// ======================================
// APPROVE LEAVE
// ======================================

const approveLeave = (req, res) => {
  const { id } = req.params;

  const sql = `
    UPDATE attendance
    SET leave_status = 'approved'
    WHERE id = ?
  `;

  connection.query(sql, [id], (err) => {
    if (err) {
      return res.status(500).json({
        message: "Duyệt đơn thất bại",
      });
    }

    res.json({
      message: "Đã duyệt đơn nghỉ",
    });
  });
};

// ======================================
// REJECT LEAVE
// ======================================

const rejectLeave = (req, res) => {
  const { id } = req.params;

  const sql = `
    UPDATE attendance
    SET leave_status = 'rejected'
    WHERE id = ?
  `;

  connection.query(sql, [id], (err) => {
    if (err) {
      return res.status(500).json({
        message: "Từ chối đơn thất bại",
      });
    }

    res.json({
      message: "Đã từ chối đơn nghỉ",
    });
  });
};

export {
  getAttendances,
  getMyAttendance,
  checkIn,
  checkOut,
  approveLeave,
  rejectLeave,
};
