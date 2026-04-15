const express = require("express");
const router = express.Router();

const { createEmployee } = require("../controllers/employee.controller");

const {
  getEmployees,
  getEmployeeByCode,
} = require("../controllers/List.controller");

// ================= CREATE =================
router.post("/", createEmployee);

// ================= LIST =================
router.get("/", getEmployees);

// ================= DETAIL =================
router.get("/:code", getEmployeeByCode);

module.exports = router;
