import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./page/Login";
import Attendance from "./page/Attendance";
import Profile from "./page/Profile";
import { Toaster } from "react-hot-toast";

import Dashboard from "./controller/Dashboard";
import Employees from "./controller/Employees";
import EmployeesSearch from "./controller/EmployeesList";
import EditEmployee from "./controller/EditEmployees";
import Salary from "./controller/Salary";
import AttendancePage from "./controller/Attendance";

// =====================================
// PRIVATE ROUTE
// =====================================

const PrivateRoute = ({ children }: any) => {
  const token = localStorage.getItem("token");

  return token ? children : <Navigate to="/" />;
};

function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#333",
            color: "#fff",
            borderRadius: "10px",
          },
        }}
      />
      <Routes>
        {/* ===================================== */}
        {/* LOGIN */}
        {/* ===================================== */}

        <Route path="/" element={<Login />} />

        {/* ===================================== */}
        {/* ADMIN */}
        {/* ===================================== */}

        {/* dashboard */}
        <Route
          path="/admin"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />

        {/* add employee */}
        <Route
          path="/admin/employees/add"
          element={
            <PrivateRoute>
              <Employees />
            </PrivateRoute>
          }
        />

        {/* employee list */}
        <Route
          path="/admin/employees/list"
          element={
            <PrivateRoute>
              <EmployeesSearch />
            </PrivateRoute>
          }
        />

        {/* edit employee */}
        <Route
          path="/admin/employees/edit/:code"
          element={
            <PrivateRoute>
              <EditEmployee />
            </PrivateRoute>
          }
        />

        {/* attendance management */}
        <Route
          path="/admin/attendance"
          element={
            <PrivateRoute>
              <AttendancePage />
            </PrivateRoute>
          }
        />

        {/* salary */}
        <Route
          path="/admin/salary"
          element={
            <PrivateRoute>
              <Salary />
            </PrivateRoute>
          }
        />

        {/* ===================================== */}
        {/* USER */}
        {/* ===================================== */}

        {/* attendance */}
        <Route
          path="/user"
          element={
            <PrivateRoute>
              <Attendance />
            </PrivateRoute>
          }
        />

        {/* profile */}
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />

        {/* ===================================== */}
        {/* 404 */}
        {/* ===================================== */}

        <Route
          path="*"
          element={
            <h1 className="text-3xl font-bold text-center mt-10">
              404 Not Found
            </h1>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
