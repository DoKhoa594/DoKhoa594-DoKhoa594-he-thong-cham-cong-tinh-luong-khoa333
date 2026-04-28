import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./page/Login";
import Attendance from "./page/Attendance";
import Profile from "./page/Profile";

import Dashboard from "./controller/Dashboard";
import Employees from "./controller/Employees";
import EmployeesSearch from "./controller/EmployeesList";
import EditEmployee from "./controller/EditEmployees";
import Salary from "./controller/Salary";
import AttendancePage from "./controller/Attendance";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route path="/admin" element={<Dashboard />} />

        {/* Add employee */}
        <Route path="/admin/employees/add" element={<Employees />} />

        {/* List employee */}
        <Route path="/admin/employees/list" element={<EmployeesSearch />} />

        {/* Edit employee */}
        <Route path="/admin/employees/edit/:code" element={<EditEmployee />} />

        <Route path="/admin/attendance" element={<AttendancePage />} />

        <Route path="/admin/salary" element={<Salary />} />

        <Route path="/user" element={<Attendance />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
