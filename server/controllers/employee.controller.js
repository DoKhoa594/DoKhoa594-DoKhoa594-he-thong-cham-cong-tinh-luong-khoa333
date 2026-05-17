import connection from "../config/db.js";

// ================= CREATE =================
const createEmployee = async (req, res) => {
  const data = req.body;

  try {
    function getPositionId() {
      return new Promise((resolve, reject) => {
        connection.query(
          "SELECT id FROM positions WHERE name=?",
          [data.position],
          (err, results) => {
            if (err) return reject(err);

            if (!results.length) {
              return reject("Không tìm thấy chức vụ");
            }

            resolve(results[0].id);
          },
        );
      });
    }

    const getDepartmentId = () => {
      return new Promise((resolve, reject) => {
        connection.query(
          "SELECT id FROM departments WHERE name=?",
          [data.department],
          (err, results) => {
            if (err) return reject(err);

            if (!results.length) {
              return reject("Không tìm thấy phòng ban");
            }

            resolve(results[0].id);
          },
        );
      });
    };

    const position_id = await getPositionId();
    const department_id = await getDepartmentId();

    const sql = `
 INSERT INTO employees
 (
  name,code,dob,age,gender,
  position_id,
  department_id,
  email,idCard,password,
  phone,birthPlace,ethnicity,nationality
 )
 VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?)
 `;

    connection.query(
      sql,
      [
        data.name,
        data.code,
        data.dob,
        data.age,
        data.gender,
        position_id,
        department_id,
        data.email,
        data.idCard,
        data.password,
        data.phone,
        data.birthPlace,
        data.ethnicity,
        data.nationality,
      ],
      (err) => {
        if (err) {
          console.log(err);
          return res.status(500).json({
            message: "Lỗi server",
          });
        }

        res.json({
          message: "Thêm nhân viên thành công",
        });
      },
    );
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Lỗi xử lý",
    });
  }
};

// ================= DETAIL =================
const getEmployeeByCode = (req, res) => {
  const { code } = req.params;

  connection.query(
    "SELECT * FROM employees WHERE code=?",
    [code],
    (err, result) => {
      if (err) {
        return res.status(500).json({
          message: "Lỗi server",
        });
      }

      if (!result.length) {
        return res.status(404).json({
          message: "Không tìm thấy nhân viên",
        });
      }

      res.json(result[0]);
    },
  );
};

// ================= UPDATE =================
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
 email=?
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
      code,
    ],
    (err) => {
      if (err) {
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

// ================= RESET PASSWORD =================
const resetPassword = async (req, res) => {
  const { code } = req.params;

  const newPass = "123456";

  connection.query(
    "UPDATE employees SET password=? WHERE code=?",
    [newPass, code],
    (err) => {
      if (err) {
        return res.status(500).json({
          message: "Reset lỗi",
        });
      }

      res.json({
        message: "Reset thành công",
      });
    },
  );
};

export default {
  createEmployee,
  getEmployeeByCode,
  updateEmployee,
  resetPassword,
};
