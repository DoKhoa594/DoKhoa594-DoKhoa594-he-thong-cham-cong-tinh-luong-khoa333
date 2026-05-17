import connection from "../config/db.js";

// ======================================
// GET ALL ATTENDANCE
// ======================================

const getAttendances = (req, res) => {
  const sql = `
    SELECT *
    FROM attendance
    ORDER BY id DESC
  `;

  connection.query(sql, (err, result) => {
    if (err) {
      return res.status(500).json(err);
    }

    res.json(result);
  });
};

// ======================================
// CHECK IN
// ======================================

const checkIn = (req, res) => {
  const { employee_id } = req.body;

  const today = new Date().toISOString().split("T")[0];

  const currentTime = new Date().toTimeString().split(" ")[0];

  // =====================================
  // CHECK ĐÃ CHECKIN CHƯA
  // =====================================

  const checkSql = `
    SELECT *
    FROM attendance
    WHERE employee_id=?
    AND work_date=?
  `;

  connection.query(checkSql, [employee_id, today], (err, result) => {
    if (err) {
      return res.status(500).json(err);
    }

    // đã checkin rồi
    if (result.length > 0) {
      return res.status(400).json({
        message: "Bạn đã check in hôm nay rồi",
      });
    }

    // =====================================
    // INSERT CHECKIN
    // =====================================

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

    connection.query(
      insertSql,
      [employee_id, today, currentTime, "present"],
      (err, result) => {
        if (err) {
          return res.status(500).json(err);
        }

        res.json({
          message: "Check In Success",
          time: currentTime,
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

  const today = new Date().toISOString().split("T")[0];

  const currentTime = new Date().toTimeString().split(" ")[0];

  const sql = `
    UPDATE attendance
    SET check_out=?
    WHERE employee_id=?
    AND work_date=?
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
};

export { getAttendances, checkIn, checkOut };
