import db from "../config/db.js";

// =========================
// GET DETAIL
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

    return res.json(employee);
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

    const {
      name,
      dob,
      gender,
      birthPlace,
      ethnicity,
      nationality,
      idCard,
      phone,
      email,
      department,
      position,
    } = req.body;

    const employee = await db.Employee.findOne({
      where: { code },
    });

    if (!employee) {
      return res.status(404).json({
        message: "Nhân viên không tồn tại",
      });
    }

    await employee.update({
      name,
      dob,
      gender,
      birthPlace,
      ethnicity,
      nationality,
      idCard,
      phone,
      email,
      department,
      position,
    });

    return res.json({
      message: "Cập nhật thành công",
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Lỗi cập nhật",
    });
  }
};

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
