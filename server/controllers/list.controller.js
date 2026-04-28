import db from "../config/db.js";
import bcrypt from "bcrypt";
// ================= GET EMPLOYEE LIST =================
const getEmployees = (req, res) => {
  const keyword = (req.query.keyword || "").trim();

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 50;

  const offset = (page - 1) * limit;

  let sql = `
    SELECT
      e.id,
      e.name,
      e.code,

      DATE_FORMAT(
        e.dob,
        '%Y-%m-%d'
      ) AS dob,

      TIMESTAMPDIFF(
        YEAR,
        e.dob,
        CURDATE()
      ) AS age,

      e.gender,
      e.birthPlace,
      e.ethnicity,
      e.nationality,

      e.idCard,

      e.phone,
      e.email,

      e.password,

      p.name as position,
      d.name as department

    FROM employees e

    LEFT JOIN positions p
      ON e.position_id=p.id

    LEFT JOIN departments d
      ON e.department_id=d.id
  `;

  let params = [];

  if (keyword) {
    sql += `
   WHERE
      e.name LIKE ?
   OR e.code LIKE ?
   OR e.phone LIKE ?
   OR e.email LIKE ?
   OR d.name LIKE ?
   OR p.name LIKE ?
  `;

    const search = `%${keyword}%`;

    params.push(search, search, search, search, search, search);
  }

  sql += `
   ORDER BY e.id DESC
   LIMIT ?
   OFFSET ?
 `;

  params.push(limit, offset);

  db.query(sql, params, (err, results) => {
    if (err) {
      console.error(err);

      return res.status(500).json({
        message: "Lỗi server",
      });
    }

    return res.json({
      page,
      limit,
      total: results.length,
      data: results,
    });
  });
};

// ================= DETAIL =================
const getEmployeeByCode = (req, res) => {
  const code = req.query.code;

  const sql = `
 SELECT
   e.*,

   DATE_FORMAT(
      e.dob,
      '%Y-%m-%d'
   ) as dob,

   TIMESTAMPDIFF(
      YEAR,
      e.dob,
      CURDATE()
   ) as age,

   p.name as position,
   d.name as department

 FROM employees e

 LEFT JOIN positions p
   ON e.position_id=p.id

 LEFT JOIN departments d
   ON e.department_id=d.id

 WHERE e.code=?
 `;

  db.query(sql, [code], (err, results) => {
    if (err) {
      return res.status(500).json({
        message: "Lỗi server",
      });
    }

    if (!results.length) {
      return res.status(404).json({
        message: "Không tìm thấy",
      });
    }

    return res.json(results[0]);
  });
};

export default {
  getEmployees,
  getEmployeeByCode,
};
