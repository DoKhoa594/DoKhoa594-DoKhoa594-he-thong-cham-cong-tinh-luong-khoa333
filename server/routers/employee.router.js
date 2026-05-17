import express from "express";

import employeeController from "../controllers/employee.controller.js";
import listController from "../controllers/list.controller.js";

import { getDashboard } from "../controllers/Dashboard.controller.js";

import {
  getAttendances,
  checkIn,
  checkOut,
} from "../controllers/attendanceUser.controller.js";

const router = express.Router();

const initEmployeeRoutes = (app) => {
  // =====================================
  // EMPLOYEE
  // =====================================

  router.post("/api/create-employee", employeeController.createEmployee);

  router.get("/api/get-employees", listController.getEmployees);

  router.get(
    "/api/get-employee-by-code/:code",
    employeeController.getEmployeeByCode,
  );

  router.put("/api/update-employee/:code", employeeController.updateEmployee);

  router.put("/api/reset-password/:code", employeeController.resetPassword);

  // =====================================
  // DASHBOARD
  // =====================================

  router.get("/api/dashboard", getDashboard);

  // =====================================
  // ATTENDANCE
  // =====================================

  // get all attendance
  router.get("/api/attendance", getAttendances);

  // check in
  router.post("/api/attendance/checkin", checkIn);

  // check out
  router.post("/api/attendance/checkout", checkOut);

  return app.use("/", router);
};

export default initEmployeeRoutes;
