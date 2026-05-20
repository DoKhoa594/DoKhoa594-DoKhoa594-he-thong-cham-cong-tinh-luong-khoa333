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
        {
          model: db.Department,
          attributes: ["name"],
        },
        {
          model: db.Position,
          attributes: ["name"],
        },
      ],
    });

    if (!employee) {
      return res.status(404).json({
        message: "Không tìm thấy nhân viên",
      });
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

      department: employee.Department?.name || "",
      position: employee.Position?.name || "",
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Lỗi server",
    });
  }
};

// =========================
// UPDATE
// =========================
const updateEmployee = async (req, res) => {
  try {
    const { code } = req.params;
    const data = req.body;

    console.log("INPUT:", data);

    const deptName = (data.department || "").trim();
    const posName = (data.position || "").trim();

    const [deptRows] = await connection
      .promise()
      .query("SELECT id FROM departments WHERE TRIM(name)=?", [deptName]);

    const [posRows] = await connection
      .promise()
      .query("SELECT id FROM positions WHERE TRIM(name)=?", [posName]);

    console.log("DEPT:", deptRows);
    console.log("POS:", posRows);

    if (!deptRows.length || !posRows.length) {
      return res.status(400).json({
        message: "Sai phòng ban hoặc chức vụ",
      });
    }

    const department_id = deptRows[0].id;
    const position_id = posRows[0].id;

    const [result] = await connection.promise().query(
      `
      UPDATE employees
      SET department_id=?, position_id=?
      WHERE code=?
      `,
      [department_id, position_id, code],
    );

    console.log("AFFECTED:", result.affectedRows);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Không tìm thấy employee (sai code)",
      });
    }

    return res.json({
      message: "Update OK",
      affectedRows: result.affectedRows,
    });
  } catch (err) {
    console.log("ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// =========================
// RESET PASSWORD
// =========================
const resetPassword = async (req, res) => {
  try {
    const { code } = req.params;

    const employee = await db.Employee.findOne({
      where: { code },
    });

    if (!employee) {
      return res.status(404).json({
        message: "Không tìm thấy nhân viên",
      });
    }

    const hashPassword = await bcrypt.hash("123456", 10);

    await employee.update({
      password: hashPassword,
    });

    return res.json({
      message: "Reset mật khẩu thành công",
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Lỗi reset password",
    });
  }
};

export default {
  getEmployeeByCode,
  updateEmployee,
  resetPassword,
};
