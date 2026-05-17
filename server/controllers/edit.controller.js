import db from "../config/db.js";
import bcrypt from "bcrypt";

// =========================
// GET DETAIL (TRẢ ID CHO FRONTEND)
// =========================
const getEmployeeByCode = async (req, res) => {
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

    return res.json({
      name: employee.name,
      code: employee.code,

      dob: employee.dob,
      gender: employee.gender,

      birthPlace: employee.birthPlace,
      ethnicity: employee.ethnicity,
      nationality: employee.nationality,

      idCard: employee.idCard,
      phone: employee.phone,
      email: employee.email,

      // 🔥 QUAN TRỌNG: TRẢ ID
      department_id: employee.department_id,
      position_id: employee.position_id,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Lỗi server",
    });
  }
};
//UPDATE

const updateEmployee = (req, res) => {
  const { code } = req.params;
  const data = req.body;

  const sql = `
    UPDATE employees
    SET
      name=?,
      dob=?,
      gender=?,
      birthPlace=?,
      ethnicity=?,
      nationality=?,
      idCard=?,
      phone=?,
      email=?,
      department_id=?,
      position_id=?
    WHERE code=?
  `;

  connection.query(
    sql,
    [
      data.name,
      data.dob,
      data.gender,
      data.birthPlace,
      data.ethnicity,
      data.nationality,
      data.idCard,
      data.phone,
      data.email,

      // 🔥 FIX CỐT LÕI
      data.department_id,
      data.position_id,

      code,
    ],
    (err) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          message: "Update lỗi",
        });
      }

      res.json({
        message: "Cập nhật thành công",
      });
    },
  );
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
