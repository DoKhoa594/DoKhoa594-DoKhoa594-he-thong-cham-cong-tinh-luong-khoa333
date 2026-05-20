import { useState } from "react";
import axios from "axios";

export default function Attendance() {
  const [checkIn, setCheckIn] = useState<string | null>(null);
  const [checkOut, setCheckOut] = useState<string | null>(null);

  // lấy user login
  const employee = JSON.parse(localStorage.getItem("user") || "{}");

  // =========================
  // CHECK IN
  // =========================
  const handleCheckIn = async () => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/attendance/checkin",
        {
          employee_id: 11,
        },
      );

      setCheckIn(res.data.time);

      alert("Check In Success");
    } catch (err: any) {
      alert(err.response?.data?.message || "Check In Failed");
    }
  };
  // =========================
  // CHECK OUT
  // =========================
  const handleCheckOut = async () => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/attendance/checkout",
        {
          employee_id: employee.id || 11,
        },
      );

      setCheckOut(res.data.time);

      alert("Check Out Thành công");
    } catch (err) {
      console.log(err);

      alert("Check Out Thành công");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-[400px]">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
          Chấm Công
        </h1>

        {/* USER INFO */}
        <div className="mb-6 bg-gray-50 rounded-xl p-4">
          <p className="text-gray-700">
            <span className="font-semibold">Nhân viên:</span>{" "}
            {employee.username || "Unknown"}
          </p>

          <p className="text-gray-700">
            <span className="font-semibold">ID:</span> {employee.id || 2}
          </p>
        </div>

        {/* BUTTON */}
        <div className="flex gap-4">
          <button
            onClick={handleCheckIn}
            className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-xl transition"
          >
            Check In
          </button>

          <button
            onClick={handleCheckOut}
            className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-3 rounded-xl transition"
          >
            Check Out
          </button>
        </div>

        {/* RESULT */}
        <div className="mt-6 bg-gray-50 rounded-xl p-4">
          <p className="text-gray-700 mb-2">
            <span className="font-semibold">Check In:</span>{" "}
            {checkIn || "--:--:--"}
          </p>

          <p className="text-gray-700">
            <span className="font-semibold">Check Out:</span>{" "}
            {checkOut || "--:--:--"}
          </p>
        </div>
      </div>
    </div>
  );
}
