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

// LIST
export const getAttendances = async (req, res) => {
  try {
    const rows = await query(`
SELECT
a.id,
e.name,
e.code,
DATE_FORMAT(a.work_date,'%Y-%m-%d') work_date,
TIME_FORMAT(a.check_in,'%H:%i') check_in,
TIME_FORMAT(a.check_out,'%H:%i') check_out,
IFNULL(
TIMESTAMPDIFF(HOUR,a.check_in,a.check_out),
0
) hours,
a.status
FROM attendance a
JOIN employees e
ON a.employee_id=e.id
`);

    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DETAIL
export const getAttendanceById = async (req, res) => {
  try {
    const rows = await query("SELECT * FROM attendance WHERE id=?", [
      req.params.id,
    ]);

    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// CREATE
export const createAttendance = async (req, res) => {
  try {
    res.json({
      message: "attendance created",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE
export const updateAttendance = async (req, res) => {
  try {
    res.json({
      message: "attendance updated",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE
export const deleteAttendance = async (req, res) => {
  try {
    res.json({
      message: "attendance deleted",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
