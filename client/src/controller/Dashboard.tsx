import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

type User = {
  username: string;
  role: string;
};

type Stats = {
  totalEmployees: number;
  todayPresent: number;
  lateOrAbsent: number;
  totalHours: number;

  salaryToday: number;
  salaryMonth: number;

  hoursByDate: number;
  hoursByMonth: number;
};

export default function Dashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState<User | null>(null);
  const [openEmployeeMenu, setOpenEmployeeMenu] = useState(false);
  const [loading, setLoading] = useState(false);

  const [chartData, setChartData] = useState<any[]>([]);

  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0],
  );

  const [selectedMonth, setSelectedMonth] = useState(
    new Date().toISOString().slice(0, 7),
  );

  const [stats, setStats] = useState<Stats>({
    totalEmployees: 0,
    todayPresent: 0,
    lateOrAbsent: 0,
    totalHours: 0,
    salaryToday: 0,
    salaryMonth: 0,
    hoursByDate: 0,
    hoursByMonth: 0,
  });

  // CHECK LOGIN
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

  // CALL API (stats + chart)
  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);

        const res = await axios.get("/api/dashboard", {
          params: {
            date: selectedDate,
            month: selectedMonth,
          },
        });

        // 👇 backend nên trả dạng { stats, chart }
        setStats(res.data.stats || {});
        setChartData(res.data.chart || []);
      } catch (err) {
        console.error("Dashboard error:", err);
        setChartData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [selectedDate, selectedMonth]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  const show = (value: number) => (value === 0 ? "--" : value);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* SIDEBAR */}
      <div className="w-64 bg-blue-700 text-white p-5 flex flex-col">
        <h2 className="text-2xl font-bold mb-6">Admin Panel</h2>

        <div className="flex items-center gap-3 mb-6 p-2 rounded bg-blue-600">
          <div className="w-10 h-10 bg-white text-blue-700 flex items-center justify-center rounded-full font-bold">
            {user?.username?.charAt(0)?.toUpperCase() || "?"}
          </div>

          <div>
            <p className="font-semibold">{user?.username}</p>
            <p className="text-xs text-blue-200">Administrator</p>
          </div>
        </div>

        <nav className="flex flex-col gap-2">
          <button className="text-left p-2 bg-blue-600 rounded">
            Tổng quan
          </button>

          <button
            onClick={() => navigate("/admin/attendance")}
            className="text-left p-2 hover:bg-blue-600 rounded"
          >
            Chấm công
          </button>

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

        <button
          onClick={handleLogout}
          className="mt-auto bg-red-500 py-2 rounded"
        >
          Đăng xuất
        </button>
      </div>

      {/* CONTENT */}
      <div className="flex-1 p-6 overflow-auto">
        <h1 className="text-3xl font-bold mb-4">Tổng quan</h1>

        <div className="bg-white min-h-full rounded shadow p-6">
          {/* FILTER */}
          <div className="flex gap-6 mb-6">
            <div>
              <label className="text-sm">Ngày:</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="border p-2 rounded ml-2"
              />
            </div>

            <div>
              <label className="text-sm">Tháng:</label>
              <input
                type="month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="border p-2 rounded ml-2"
              />
            </div>
          </div>

          {loading ? (
            <p>Đang tải dữ liệu...</p>
          ) : (
            <>
              {/* STATS */}
              <div className="grid grid-cols-4 gap-4 mb-6">
                <Box
                  title="Tổng nhân viên"
                  value={show(stats.totalEmployees)}
                />
                <Box title="Đi làm hôm nay" value={show(stats.todayPresent)} />
                <Box title="Trễ / nghỉ" value={show(stats.lateOrAbsent)} />
                <Box title="Tổng giờ hôm nay" value={show(stats.totalHours)} />
              </div>

              {/* LƯƠNG */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <Box
                  title="Lương hôm nay"
                  value={
                    stats.salaryToday
                      ? stats.salaryToday.toLocaleString() + " đ"
                      : "--"
                  }
                />
                <Box
                  title="Lương tháng"
                  value={
                    stats.salaryMonth
                      ? stats.salaryMonth.toLocaleString() + " đ"
                      : "--"
                  }
                />
              </div>

              {/* GIỜ */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <Box
                  title="Giờ theo ngày chọn"
                  value={show(stats.hoursByDate) + " giờ"}
                />
                <Box
                  title="Giờ theo tháng chọn"
                  value={show(stats.hoursByMonth) + " giờ"}
                />
              </div>

              {/* BAR CHART */}
              <div className="bg-gray-100 h-72 rounded p-4">
                <h3 className="mb-2 font-semibold">
                  Giờ làm trong tháng {selectedMonth}
                </h3>

                {chartData.length === 0 ? (
                  <p className="text-center text-gray-500 mt-20">
                    Chưa có dữ liệu biểu đồ
                  </p>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="hours" fill="#2563eb" />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function Box({ title, value }: any) {
  return (
    <div className="bg-gray-100 p-4 rounded shadow">
      <p className="text-sm text-gray-600">{title}</p>
      <h2 className="text-2xl font-bold">{value}</h2>
    </div>
  );
}
