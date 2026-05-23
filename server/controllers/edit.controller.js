import db from "../config/db.js";
import bcrypt from "bcrypt";
import connection from "../config/db.js";

// =========================
// GET DETAIL
// =========================
const getEmployeeByCode = async (req, res) => {
  try {
    const { code } = req.params;

    const employee = await db.Employee.findOne({
      where: { code },
      include: [
        { model: db.Department, attributes: ["id", "name"] },
        { model: db.Position, attributes: ["id", "name"] },
      ],
    });

    if (!employee) {
      return res.status(404).json({ message: "Không tìm thấy nhân viên" });
    }

    return res.json({
      name: employee.name,
      code: employee.code,
      dob: employee.dob
        ? new Date(employee.dob).toISOString().split("T")[0]
        : "",
      gender: employee.gender,
      birthPlace: employee.birthPlace,
      ethnicity: employee.ethnicity,
      nationality: employee.nationality,
      idCard: employee.idCard,
      phone: employee.phone,
      email: employee.email,

      // 🔥 QUAN TRỌNG: trả luôn ID
      department_id: employee.Department?.id || "",
      position_id: employee.Position?.id || "",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Lỗi server" });
  }
};

// =========================
// UPDATE
// =========================
const updateEmployee = async (req, res) => {
  try {
    const { code } = req.params;
    const { department_id, position_id } = req.body;

    console.log("UPDATE INPUT:", { code, department_id, position_id });

    if (!department_id || !position_id) {
      return res.status(400).json({
        message: "Thiếu department_id hoặc position_id",
      });
    }

    const deptId = Number(department_id);
    const posId = Number(position_id);

    if (isNaN(deptId) || isNaN(posId)) {
      return res.status(400).json({
        message: "ID không hợp lệ",
      });
    }

    const [result] = await connection.promise().query(
      `
      UPDATE employees
      SET department_id=?, position_id=?
      WHERE code=?
      `,
      [deptId, posId, code],
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Không tìm thấy employee",
      });
    }

    return res.json({
      message: "Update OK",
      affectedRows: result.affectedRows,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server error" });
  }
};

// =========================
// RESET PASSWORD
// =========================
const resetPassword = async (req, res) => {
  try {
    const { code } = req.params;

    const employee = await db.Employee.findOne({ where: { code } });

    if (!employee) {
      return res.status(404).json({
        message: "Không tìm thấy nhân viên",
      });
    }

    const hashPassword = await bcrypt.hash("123456", 10);

    await employee.update({ password: hashPassword });

    return res.json({
      message: "Reset mật khẩu thành công",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Lỗi reset password" });
  }
};

export default {
  getEmployeeByCode,
  updateEmployee,
  resetPassword,
};
