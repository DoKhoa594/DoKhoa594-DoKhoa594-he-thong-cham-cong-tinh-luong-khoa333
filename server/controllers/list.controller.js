const db = require("../config/db");

// ================= GET LIST =================
exports.getEmployees = (req, res) => {
  const keyword = req.query.keyword || "";

  console.log("GET /employees | keyword:", keyword);

  let sql = `
  SELECT 
    e.id,
    e.name,
    e.code,
    DATE_FORMAT(e.dob, '%Y-%m-%d') AS dob,
    TIMESTAMPDIFF(YEAR, e.dob, CURDATE()) AS age,
    e.gender,
    p.name AS position,        -- ✅ lấy tên
    d.name AS department,      -- ✅ lấy tên
    e.email,
    e.phone,
    e.birthPlace,
    e.ethnicity,
    e.nationality
  FROM employees e
  LEFT JOIN positions p ON e.position_id = p.id
  LEFT JOIN departments d ON e.department_id = d.id
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
    e.id,
    e.name,
    e.code,
    DATE_FORMAT(e.dob, '%Y-%m-%d') AS dob,
    TIMESTAMPDIFF(YEAR, e.dob, CURDATE()) AS age,
    e.gender,
    p.name AS position,        -- ✅ lấy tên
    d.name AS department,      -- ✅ lấy tên
    e.email,
    e.phone,
    e.idCard,
    e.birthPlace,
    e.ethnicity,
    e.nationality
  FROM employees e
  LEFT JOIN positions p ON e.position_id = p.id
  LEFT JOIN departments d ON e.department_id = d.id
  WHERE e.code = ?
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
