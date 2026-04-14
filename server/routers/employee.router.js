const express = require("express");
const router = express.Router();

const { createEmployee } = require("../controllers/employee.controller");

router.post("/", createEmployee);

module.exports = router;
