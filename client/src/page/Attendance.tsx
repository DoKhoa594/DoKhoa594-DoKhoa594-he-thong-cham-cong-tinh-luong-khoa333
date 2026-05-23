import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export default function Attendance() {
  const [checkIn, setCheckIn] = useState<string | null>(null);

  const [checkOut, setCheckOut] = useState<string | null>(null);

  // modal reason
  const [showReasonModal, setShowReasonModal] = useState(false);

  const [reasonType, setReasonType] = useState<"late" | "leave" | null>(null);

  const [reason, setReason] = useState("");

  // lấy user login
  const employee = {
    id: 38,
    username: "Khoa Test",
  };

  // =========================
  // CHECK IN
  // =========================
  const handleCheckIn = async () => {
    try {
      const currentTime = new Date().toTimeString().split(" ")[0];

      // đi trễ => mở modal nhập lý do
      if (currentTime > "08:00:00") {
        setReasonType("late");

        setShowReasonModal(true);

        return;
      }

      const res = await axios.post(
        "http://localhost:5000/api/attendance/checkin",
        {
          employee_id: employee.id || 11,
          status: "present",
          reason: "",
        },
      );

      setCheckIn(res.data.time);

      toast.success("Check in thành công 🎉");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Check in thất bại");
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

      toast.success("Check out thành công 👋");
    } catch (err) {
      console.log(err);

      toast.error("Check out thất bại");
    }
  };

  // =========================
  // LEAVE
  // =========================
  const handleLeave = async () => {
    setReasonType("leave");

    setShowReasonModal(true);
  };

  // =========================
  // SUBMIT REASON
  // =========================
  const submitReason = async () => {
    try {
      if (!reason.trim()) {
        toast.error("Vui lòng nhập lý do");

        return;
      }

      // đi trễ
      if (reasonType === "late") {
        const res = await axios.post(
          "http://localhost:5000/api/attendance/checkin",
          {
            employee_id: employee.id || 11,
            status: "late",
            reason,
          },
        );

        setCheckIn(res.data.time);

        toast.success("Check in thành công 🎉");
      }

      // nghỉ phép
      if (reasonType === "leave") {
        await axios.post("http://localhost:5000/api/attendance/checkin", {
          employee_id: employee.id || 11,
          status: "leave",
          reason,
        });

        toast.success("Đã gửi đơn nghỉ phép 📝");
      }

      setReason("");

      setShowReasonModal(false);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Có lỗi xảy ra");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center px-4 font-sans">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
        {/* TITLE */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-gray-800 tracking-tight">
            Chấm Công
          </h1>

          <p className="text-gray-500 mt-2 text-sm">
            Hệ thống quản lý nhân viên
          </p>
        </div>

        {/* USER INFO */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl p-5 mb-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-gray-500 font-medium">Nhân viên</span>

            <span className="bg-blue-500 text-white text-xs px-3 py-1 rounded-full">
              Online
            </span>
          </div>

          <h2 className="text-2xl font-bold text-gray-800">
            {employee.username || "Unknown"}
          </h2>

          <p className="text-gray-500 mt-1">ID: {employee.id || 11}</p>
        </div>

        {/* BUTTON */}
        <div className="grid grid-cols-3 gap-4">
          <button
            onClick={handleCheckIn}
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-4 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300"
          >
            Check In
          </button>

          <button
            onClick={handleCheckOut}
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-4 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300"
          >
            Check Out
          </button>

          <button
            onClick={handleLeave}
            className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-4 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300"
          >
            Nghỉ
          </button>
        </div>

        {/* RESULT */}
        <div className="mt-8 bg-gray-50 border border-gray-100 rounded-2xl p-5">
          <h3 className="text-lg font-bold text-gray-700 mb-4">
            Kết quả hôm nay
          </h3>

          <div className="space-y-3">
            <div className="flex items-center justify-between bg-white rounded-xl px-4 py-3 shadow-sm">
              <span className="font-medium text-gray-600">Check In</span>

              <span className="font-bold text-green-600">
                {checkIn || "--:--:--"}
              </span>
            </div>

            <div className="flex items-center justify-between bg-white rounded-xl px-4 py-3 shadow-sm">
              <span className="font-medium text-gray-600">Check Out</span>

              <span className="font-bold text-red-600">
                {checkOut || "--:--:--"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL */}
      {showReasonModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl animate-in fade-in zoom-in">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              {reasonType === "late" ? "Lý do đi trễ" : "Lý do nghỉ phép"}
            </h2>

            <p className="text-gray-500 mb-4">Vui lòng nhập lý do bên dưới</p>

            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Nhập lý do..."
              className="w-full h-32 border border-gray-300 rounded-2xl p-4 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <div className="flex justify-end gap-3 mt-5">
              <button
                onClick={() => {
                  setShowReasonModal(false);

                  setReason("");
                }}
                className="px-5 py-2 rounded-xl bg-gray-200 hover:bg-gray-300"
              >
                Hủy
              </button>

              <button
                onClick={submitReason}
                className="px-5 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700"
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
