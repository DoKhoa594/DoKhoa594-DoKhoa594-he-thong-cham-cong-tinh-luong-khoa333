import express from "express";
import employeeController from "../controllers/employee.controller.js";
import listController from "../controllers/list.controller.js";
import { getDashboard } from "../controllers/Dashboard.controller.js";

import {
  getAttendances,
  getAttendanceById,
  createAttendance,
  updateAttendance,
  deleteAttendance,
} from "../controllers/attendance.controller.js";

const router = express.Router();

const initEmployeeRoutes = (app) => {
  // EMPLOYEE
  router.post("/api/create-employee", employeeController.createEmployee);

  router.get("/api/get-employees", listController.getEmployees);

  router.get(
    "/api/get-employee-by-code/:code",
    employeeController.getEmployeeByCode,
  );

  router.put("/api/update-employee/:code", employeeController.updateEmployee);

  router.put("/api/reset-password/:code", employeeController.resetPassword);

  // DASHBOARD
  router.get("/api/dashboard", getDashboard);

  // ATTENDANCE
  router.get("/api/attendance", getAttendances);
  router.get("/api/attendance/:id", getAttendanceById);

  router.post("/api/attendance", createAttendance);
  router.put("/api/attendance/:id", updateAttendance);
  router.delete("/api/attendance/:id", deleteAttendance);

  return app.use("/", router);
};

export default initEmployeeRoutes;
