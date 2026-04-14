const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "", // XAMPP mặc định
  database: "employee_db",
});

connection.connect((err) => {
  if (err) {
    console.error("❌ Lỗi kết nối DB:", err);
    return;
  }
  console.log("✅ Kết nối MySQL thành công!");
});

module.exports = connection;
