import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

type User = {
  username: string;
  role: string;
};

type Attendance = {
  id: number;
  employee_id: number;
  employee_name: string;
  check_in: string;
  check_out: string;
  status: string;
};

export default function AttendancePage() {
  const navigate = useNavigate();

  const [user, setUser] = useState<User | null>(null);

  const [openEmployeeMenu, setOpenEmployeeMenu] = useState(false);

  const [loading, setLoading] = useState(false);

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

      setAttendanceList(res.data || []);

      setSummary({
        present: res.data.length,
        late: 0,
        absent: 0,
      });
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

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
        <div className="grid grid-cols-3 gap-4 mb-6">
          <SummaryCard
            title="Đi làm"
            value={summary.present}
            color="bg-green-500"
          />

          <SummaryCard
            title="Đi trễ"
            value={summary.late}
            color="bg-yellow-500"
          />

          <SummaryCard title="Nghỉ" value={summary.absent} color="bg-red-500" />
        </div>

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
                </tr>
              </thead>

              <tbody>
                {attendanceList.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center p-10 text-gray-400">
                      Không có dữ liệu
                    </td>
                  </tr>
                ) : (
                  attendanceList.map((item) => (
                    <tr
                      key={item.id}
                      className="border-b hover:bg-gray-50 transition"
                    >
                      <td className="p-4">{item.id}</td>
                      <td className="p-4">{item.employee_name}</td>
                      <td className="p-4 text-center">
                        {item.check_in || "--"}
                      </td>
                      <td className="p-4 text-center">
                        {item.check_out || "--"}
                      </td>
                      <td className="p-4 text-center">
                        <span
                          className={`px-3 py-1 rounded-full text-sm text-white
                            ${
                              item.status === "present"
                                ? "bg-green-500"
                                : item.status === "late"
                                  ? "bg-yellow-500"
                                  : "bg-red-500"
                            }`}
                        >
                          {item.status}
                        </span>
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
    <div className={`${color} text-white rounded-2xl p-5 shadow`}>
      <p className="text-sm opacity-90">{title}</p>

      <h2 className="text-4xl font-bold mt-2">{value}</h2>
    </div>
  );
}
