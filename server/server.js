const express = require("express");
const cors = require("cors");

const app = express();

// middleware
app.use(cors());
app.use(express.json());

// routes
const employeeRoute = require("./routers/employee.router");
app.use("/api/employees", employeeRoute);

app.listen(5000, () => {
  console.log("Server chạy tại http://localhost:5000");
});
