import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

type User = {
  username: string;
  role: string;
};

type Attendance = {
  attendance_id: number;
  employee_id: number;
  employee_name: string;
  work_date: string;
  check_in: string;
  check_out: string;
  status: string;
  reason?: string;
  leave_status?: "pending" | "approved" | "rejected";
};

export default function AttendancePage() {
  const navigate = useNavigate();

  const [user, setUser] = useState<User | null>(null);

  const [openEmployeeMenu, setOpenEmployeeMenu] = useState(false);

  const [loading, setLoading] = useState(false);

  const [filterStatus, setFilterStatus] = useState("all");

  const [showTable, setShowTable] = useState(false);

  const getVNDate = () => {
    const now = new Date();
    const vn = new Date(now.getTime() + 7 * 60 * 60 * 1000);

    return vn.toISOString().split("T")[0];
  };

  const [selectedDate, setSelectedDate] = useState(getVNDate());

  const [attendanceList, setAttendanceList] = useState<Attendance[]>([]);

  const [summary, setSummary] = useState({
    present: 0,
    late: 0,
    absent: 0,
    leave: 0,
  });

  // =====================================
  // CHECK LOGIN
  // =====================================

  useEffect(() => {
    const data = localStorage.getItem("user");

    if (!data) {
      navigate("/");
      return;
    }

    const parsed: User = JSON.parse(data);

    if (parsed.role !== "admin") {
      navigate("/user");
      return;
    }

    setUser(parsed);
  }, [navigate]);

  // =====================================
  // FETCH ATTENDANCE
  // =====================================

  useEffect(() => {
    fetchAttendance();
  }, [selectedDate]);

  const fetchAttendance = async () => {
    try {
      setLoading(true);

      const res = await axios.get("http://localhost:5000/api/attendance", {
        params: {
          date: selectedDate,
        },
      });

      const attendanceData = Array.isArray(res.data.attendance)
        ? res.data.attendance
        : [];

      setAttendanceList(attendanceData);

      setSummary({
        present: res.data.summary?.present || 0,
        late: res.data.summary?.late || 0,
        absent: res.data.summary?.absent || 0,
        leave: res.data.summary?.leave || 0,
      });
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  // =====================================
  // APPROVE / REJECT LEAVE
  // =====================================

  const approveLeave = async (id: number) => {
    try {
      await axios.put(`http://localhost:5000/api/attendance/approve/${id}`);

      fetchAttendance();
    } catch (err) {
      console.log(err);
    }
  };

  const rejectLeave = async (id: number) => {
    try {
      await axios.put(`http://localhost:5000/api/attendance/reject/${id}`);

      fetchAttendance();
    } catch (err) {
      console.log(err);
    }
  };

  // =====================================
  // FILTER
  const handleFilter = (status: string) => {
    setFilterStatus(status);
    setShowTable(true);
  };
  // =====================================

  const filteredAttendance = attendanceList.filter((item) => {
    if (filterStatus === "all") return true;

    return item.status?.trim().toLowerCase() === filterStatus;
  });

  // =====================================
  // LOGOUT
  // =====================================

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    navigate("/");
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* SIDEBAR */}
      <div className="w-64 bg-blue-700 text-white p-5 flex flex-col">
        <h2 className="text-2xl font-bold mb-6">Admin Panel</h2>

        {/* USER */}
        <div className="flex items-center gap-3 mb-6 p-2 rounded bg-blue-600">
          <div className="w-10 h-10 bg-white text-blue-700 flex items-center justify-center rounded-full font-bold">
            {user?.username?.charAt(0)?.toUpperCase() || "?"}
          </div>

          <div>
            <p className="font-semibold">{user?.username}</p>

            <p className="text-xs text-blue-200">Administrator</p>
          </div>
        </div>

        {/* MENU */}
        <nav className="flex flex-col gap-2">
          <button
            onClick={() => navigate("/admin")}
            className="text-left p-2 hover:bg-blue-600 rounded"
          >
            Tổng quan
          </button>

          <button
            onClick={() => navigate("/admin/attendance")}
            className="text-left p-2 hover:bg-blue-600 rounded"
          >
            Chấm công
          </button>

          {/* EMPLOYEE */}
          <div>
            <button
              onClick={() => setOpenEmployeeMenu(!openEmployeeMenu)}
              className="text-left p-2 hover:bg-blue-600 rounded w-full"
            >
              Nhân viên ▾
            </button>

            {openEmployeeMenu && (
              <div className="ml-4 mt-2 flex flex-col gap-2">
                <button
                  onClick={() => navigate("/admin/employees/add")}
                  className="text-left p-2 bg-blue-600 rounded text-sm"
                >
                  ➕ Thêm nhân viên
                </button>

                <button
                  onClick={() => navigate("/admin/employees/list")}
                  className="text-left p-2 bg-blue-600 rounded text-sm"
                >
                  📋 Danh sách nhân viên
                </button>
              </div>
            )}
          </div>

          <button className="text-left p-2 hover:bg-blue-600 rounded">
            Lương
          </button>
        </nav>

        {/* LOGOUT */}
        <button
          onClick={handleLogout}
          className="mt-auto bg-red-500 py-2 rounded"
        >
          Đăng xuất
        </button>
      </div>

      {/* CONTENT */}
      <div className="flex-1 p-6 overflow-auto">
        {/* HEADER */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Quản lý chấm công
            </h1>

            <p className="text-gray-500 mt-1">Theo dõi nhân viên đi làm</p>
          </div>

          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="border px-4 py-2 rounded-xl shadow-sm"
          />
        </div>

        {/* SUMMARY */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div
            onClick={() => handleFilter("present")}
            className="cursor-pointer"
          >
            <SummaryCard
              title={`Đi làm (${summary.present}/${attendanceList.length})`}
              value={summary.present}
              color="bg-green-500"
            />
          </div>

          <div onClick={() => handleFilter("late")} className="cursor-pointer">
            <SummaryCard
              title={`Đi trễ (${summary.late}/${attendanceList.length})`}
              value={summary.late}
              color="bg-yellow-500"
            />
          </div>

          <div
            onClick={() => handleFilter("absent")}
            className="cursor-pointer"
          >
            <SummaryCard
              title={`Vắng (${summary.absent}/${attendanceList.length})`}
              value={summary.absent}
              color="bg-red-500"
            />
          </div>

          <div onClick={() => handleFilter("leave")} className="cursor-pointer">
            <SummaryCard
              title={`Nghỉ phép (${summary.leave}/${attendanceList.length})`}
              value={summary.leave}
              color="bg-purple-500"
            />
          </div>
        </div>

        {/* RESET FILTER */}
        {showTable && (
          <button
            onClick={() => {
              setFilterStatus("all");
              setShowTable(false);
            }}
            className="mb-4 px-4 py-2 bg-gray-300 rounded"
          >
            Ẩn danh sách
          </button>
        )}

        {/* TABLE */}
        <div className="bg-white rounded-2xl shadow overflow-hidden">
          <div className="p-5 border-b">
            <h2 className="text-xl font-semibold">Danh sách chấm công</h2>
          </div>

          {loading ? (
            <div className="p-10 text-center">Đang tải dữ liệu...</div>
          ) : (
            <table className="w-full">
              <thead className="bg-blue-600 text-white">
                <tr>
                  <th className="p-4 text-left">ID</th>

                  <th className="p-4 text-left">Nhân viên</th>

                  <th className="p-4 text-center">Check In</th>

                  <th className="p-4 text-center">Check Out</th>

                  <th className="p-4 text-center">Trạng thái</th>

                  <th className="p-4 text-center">Lý do</th>

                  <th className="p-4 text-center">Duyệt nghỉ</th>
                </tr>
              </thead>

              <tbody>
                {filteredAttendance.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center p-10 text-gray-400">
                      Không có dữ liệu
                    </td>
                  </tr>
                ) : (
                  filteredAttendance.map((item) => (
                    <tr
                      key={item.employee_id}
                      className="border-b hover:bg-gray-50"
                    >
                      <td className="p-4">{item.attendance_id}</td>

                      <td className="p-4">{item.employee_name || "NO NAME"}</td>

                      <td className="p-4 text-center">
                        {item.check_in || "--"}
                      </td>

                      <td className="p-4 text-center">
                        {item.check_out || "--"}
                      </td>

                      <td className="p-4 text-center">
                        <span
                          className={`px-3 py-1 rounded-full text-white
                          ${
                            item.status === "present"
                              ? "bg-green-500"
                              : item.status === "late"
                                ? "bg-yellow-500"
                                : item.status === "leave"
                                  ? "bg-purple-500"
                                  : "bg-red-500"
                          }`}
                        >
                          {item.status === "present"
                            ? "Đi làm"
                            : item.status === "late"
                              ? "Đi trễ"
                              : item.status === "leave"
                                ? "Nghỉ phép"
                                : "Vắng"}
                        </span>
                      </td>

                      <td className="p-4 text-center">{item.reason || "--"}</td>

                      <td className="p-4 text-center">
                        {item.status === "leave" &&
                        item.leave_status === "pending" ? (
                          <div className="flex gap-2 justify-center">
                            <button
                              onClick={() => approveLeave(item.attendance_id)}
                              className="bg-green-500 text-white px-3 py-1 rounded"
                            >
                              Duyệt
                            </button>

                            <button
                              onClick={() => rejectLeave(item.attendance_id)}
                              className="bg-red-500 text-white px-3 py-1 rounded"
                            >
                              Từ chối
                            </button>
                          </div>
                        ) : item.status === "leave" ? (
                          <div className="flex gap-2 justify-center">
                            {item.leave_status === "approved" ? (
                              <>
                                <span className="bg-green-500 text-white px-3 py-1 rounded">
                                  Đã duyệt
                                </span>

                                <button
                                  onClick={() =>
                                    rejectLeave(item.attendance_id)
                                  }
                                  className="bg-red-500 text-white px-3 py-1 rounded"
                                >
                                  Đổi sang từ chối
                                </button>
                              </>
                            ) : (
                              <>
                                <span className="bg-red-500 text-white px-3 py-1 rounded">
                                  Đã từ chối
                                </span>

                                <button
                                  onClick={() =>
                                    approveLeave(item.attendance_id)
                                  }
                                  className="bg-green-500 text-white px-3 py-1 rounded"
                                >
                                  Đổi sang duyệt
                                </button>
                              </>
                            )}
                          </div>
                        ) : (
                          "--"
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

function SummaryCard({ title, value, color }: any) {
  return (
    <div
      className={`${color} text-white rounded-2xl p-5 shadow hover:scale-105 transition`}
    >
      <p className="text-sm opacity-90">{title}</p>

      <h2 className="text-4xl font-bold mt-2">{value}</h2>
    </div>
  );
}
