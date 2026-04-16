const connection = require("../config/db");
const bcrypt = require("bcrypt");

exports.createEmployee = async (req, res) => {
  const data = req.body;

  try {
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // 🔥 1. LẤY position_id
    function getPositionId() {
      return new Promise((resolve, reject) => {
        connection.query(
          "SELECT id FROM positions WHERE name = ?",
          [data.position],
          (err, results) => {
            if (err) return reject(err);
            if (results.length === 0) return reject("Không tìm thấy chức vụ");
            resolve(results[0].id);
          },
        );
      });
    }

    // 🔥 2. LẤY department_id
    const getDepartmentId = () => {
      return new Promise((resolve, reject) => {
        connection.query(
          "SELECT id FROM departments WHERE name = ?",
          [data.department],
          (err, results) => {
            if (err) return reject(err);
            if (results.length === 0) return reject("Không tìm thấy phòng ban");
            resolve(results[0].id);
          },
        );
      });
    };

    // 🔥 lấy id
    const position_id = await getPositionId();
    const department_id = await getDepartmentId();

    // 🔥 3. INSERT
    const sql = `
      INSERT INTO employees 
      (name, code, dob, age, gender, position_id, department_id, email, idCard, password, phone, birthPlace, ethnicity, nationality)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      data.name,
      data.code,
      data.dob,
      data.age,
      data.gender,
      position_id,
      department_id,
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
    console.error("❌ ERROR:", error);
    return res.status(500).json({
      message: typeof error === "string" ? error : "Lỗi xử lý dữ liệu",
    });
  }
};
