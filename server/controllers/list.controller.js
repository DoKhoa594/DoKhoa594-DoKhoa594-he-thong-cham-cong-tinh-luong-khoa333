const db = require("../config/db");

// ================= GET LIST =================
exports.getEmployees = (req, res) => {
  const keyword = req.query.keyword || "";

  console.log("GET /employees | keyword:", keyword);

  let sql = `
    SELECT 
      id,
      name,
      code,
      DATE_FORMAT(dob, '%Y-%m-%d') AS dob,
      TIMESTAMPDIFF(YEAR, dob, CURDATE()) AS age,
      gender,
      position,
      department,
      email,
      phone,
      birthPlace,
      ethnicity,
      nationality
    FROM employees
  `;

  let params = [];

  if (keyword) {
    sql += `
      WHERE 
        name LIKE ? OR
        code LIKE ? OR
        phone LIKE ? OR
        email LIKE ?
    `;
    params = [`%${keyword}%`, `%${keyword}%`, `%${keyword}%`, `%${keyword}%`];
  }

  sql += " ORDER BY id DESC";

  db.query(sql, params, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Lỗi server" });
    }

    res.json(results);
  });
};

// ================= GET DETAIL =================
exports.getEmployeeByCode = (req, res) => {
  const { code } = req.params;

  console.log("GET /employees/" + code);

  const sql = `
    SELECT 
      id,
      name,
      code,
      DATE_FORMAT(dob, '%Y-%m-%d') AS dob,
      TIMESTAMPDIFF(YEAR, dob, CURDATE()) AS age,
      gender,
      position,
      department,
      email,
      phone,
      idCard,
      birthPlace,
      ethnicity,
      nationality
    FROM employees
    WHERE code = ?
  `;

  db.query(sql, [code], (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Lỗi server" });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "Không tìm thấy nhân viên" });
    }

    res.json(results[0]);
  });
};
