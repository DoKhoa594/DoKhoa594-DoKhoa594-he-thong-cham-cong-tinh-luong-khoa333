import express from "express";
import cors from "cors";
import initEmployeeRoutes from "./routers/employee.router.js";

const app = express();

app.use(cors());
app.use(express.json());

// gọi trực tiếp
initEmployeeRoutes(app);

app.listen(5000, () => {
  console.log("Server chạy tại http://localhost:5000");
});
