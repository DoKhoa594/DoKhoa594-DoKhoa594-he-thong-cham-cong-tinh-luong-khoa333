const connection = require("../config/db");
const bcrypt = require("bcrypt");

exports.createEmployee = async (req, res) => {
  const data = req.body;

  try {
    // 🔐 hash password
    const hashedPassword = await bcrypt.hash(data.password, 10);

    const sql = `
  INSERT INTO employees 
  (name, code, dob, age, gender, position, department, email, idCard, password, phone, birthPlace, ethnicity, nationality)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`;

    const values = [
      data.name,
      data.code,
      data.dob,
      data.age,
      data.gender,
      data.position,
      data.department,
      data.email,
      data.idCard,
      hashedPassword,
      data.phone,
      data.birthPlace,
      data.ethnicity,
      data.nationality,
    ];

    connection.query(sql, values, (err, result) => {
      if (err) {
        console.error("❌ Lỗi insert:", err);
        return res.status(500).json({ message: "Lỗi server" });
      }

      return res.status(200).json({
        message: "Thêm nhân viên thành công!",
      });
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Lỗi hash password" });
  }
};
