import mysql from "mysql2";

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "employee_db",
  timezone: "+07:00",
});

connection.connect((err) => {
  if (err) {
    console.error("❌ Lỗi kết nối DB:", err);
    return;
  }
  console.log("✅ Kết nối MySQL thành công!");
});

export default connection;
