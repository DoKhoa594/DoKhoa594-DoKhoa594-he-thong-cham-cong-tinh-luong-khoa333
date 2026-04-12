import { BrowserRouter, Routes, Route } from "react-router-dom";

// pages chung

import Login from "./page/Login";
import Attendance from "./page/Attendance";
import Profile from "./page/Profile";

// admin (controller)
import Dashboard from "./controller/Dashboard";
import Employees from "./controller/Employees";
import EmployeesSearch from "./controller/EmployeesSearch";
import Salary from "./controller/Salary";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* LOGIN */}
        <Route path="/" element={<Login />} />

        {/* ADMIN */}
        <Route path="/admin" element={<Dashboard />} />
        <Route path="/admin/employees/add" element={<Employees />} />
        <Route path="/admin/employees/search" element={<EmployeesSearch />} />
        <Route path="/admin/salary" element={<Salary />} />

        {/* USER */}
        <Route path="/user" element={<Attendance />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
