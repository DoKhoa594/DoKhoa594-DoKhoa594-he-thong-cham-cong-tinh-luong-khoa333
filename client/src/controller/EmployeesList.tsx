import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FiEye, FiEyeOff } from "react-icons/fi";
import toast from "react-hot-toast";

type Employee = {
  name: string;
  code: string;

  dob: string;
  age: number;
  gender: string;

  birthPlace: string;
  ethnicity: string;
  nationality: string;

  idCard: string;

  phone: string;
  email: string;

  department: string;
  position: string;

  password: string;
};

type User = {
  username: string;
  role: string;
};

export default function EmployeesList() {
  const navigate = useNavigate();

  const [openEmployeeMenu, setOpenEmployeeMenu] = useState(false);

  const [user, setUser] = useState<User | null>(null);

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [keyword, setKeyword] = useState("");
  const [selected, setSelected] = useState<Employee | null>(null);

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // ================= AUTH =================
  useEffect(() => {
    try {
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
    } catch {
      navigate("/");
    }
  }, [navigate]);

  // ================= SERVER SIDE SEARCH =================
  useEffect(() => {
    const timer = setTimeout(() => {
      const fetchEmployees = async () => {
        try {
          setLoading(true);

          const res = await axios.get(
            "http://localhost:5000/api/get-employees",
            {
              params: {
                keyword,
                page: 1,
                limit: 50,
              },
            },
          );

          console.log(res.data);

          setEmployees(res.data.data || res.data || []);
        } catch (err) {
          console.error("Load employees error:", err);
        } finally {
          setLoading(false);
        }
      };

      fetchEmployees();
    }, 500);

    return () => clearTimeout(timer);
  }, [keyword]);

  // RESET PASSWORD MOCK
  const handleResetPassword = async () => {
    if (!selected) return;

    const ok = window.confirm(
      `Bạn có chắc muốn reset mật khẩu của ${selected.name} về mặc định không?`,
    );

    if (!ok) return;

    try {
      await axios.put(
        `http://localhost:5000/api/reset-password/${selected.code}`,
      );

      // cập nhật pass mới luôn ở UI
      setSelected({
        ...selected,
        password: "123456",
      });

      toast.success(
        `Đã reset mật khẩu cho ${selected.name}\nMật khẩu mới: 123456`,
        {
          duration: 4000,
        },
      );
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Reset mật khẩu thất bại");
    }
  };

  if (!user) return null;

  return (
    <div className="flex h-screen bg-gray-100">
      {/* SIDEBAR */}
      <div className="w-64 bg-blue-700 text-white p-5 flex flex-col">
        <h2 className="text-2xl font-bold mb-6">Admin Panel</h2>

        <div className="flex items-center gap-3 mb-6 p-2 rounded bg-blue-600">
          <div className="w-10 h-10 bg-white text-blue-700 flex items-center justify-center rounded-full font-bold">
            {user.username?.charAt(0)?.toUpperCase() || "?"}
          </div>

          <div>
            <p className="font-semibold">{user.username}</p>

            <p className="text-xs text-blue-200">Administrator</p>
          </div>
        </div>

        <nav className="flex flex-col gap-2">
          <button
            onClick={() => navigate("/admin")}
            className="p-2 hover:bg-blue-600 rounded text-left"
          >
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
              className="p-2 hover:bg-blue-600 rounded w-full text-left"
            >
              Nhân viên ▾
            </button>

            {openEmployeeMenu && (
              <div className="ml-4 mt-2 flex flex-col gap-2">
                <button
                  onClick={() => navigate("/admin/employees/add")}
                  className="p-2 bg-blue-600 rounded text-sm text-left"
                >
                  ➕ Thêm nhân viên
                </button>

                <button
                  onClick={() => navigate("/admin/employees/list")}
                  className="p-2 bg-blue-600 rounded text-sm text-left"
                >
                  📋 Danh sách nhân viên
                </button>
              </div>
            )}
          </div>

          <button className="p-2 hover:bg-blue-600 rounded text-left">
            Lương
          </button>
        </nav>

        <button
          onClick={() => {
            localStorage.removeItem("user");
            navigate("/");
          }}
          className="mt-auto bg-red-500 py-2 rounded"
        >
          Đăng xuất
        </button>
      </div>

      {/* CONTENT */}
      <div className="flex-1 p-6 overflow-hidden min-h-0">
        <h1 className="text-3xl font-bold mb-6">
          📋 Danh sách nhân viên
          {loading && " ⏳"}
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full min-h-0">
          {/* LEFT */}
          <div className="bg-white rounded-xl shadow p-4 h-full flex flex-col min-h-0">
            <h2 className="font-bold mb-3">Employees</h2>

            <input
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Tìm tên, phòng ban, chức vụ..."
              className="w-full p-3 border rounded-lg mb-3"
            />

            <div className="flex-1 overflow-y-auto pr-2 border rounded">
              {!loading && employees.length === 0 && (
                <p className="p-3 text-gray-400">Không có dữ liệu</p>
              )}

              {employees.map((e) => (
                <div
                  key={e.code}
                  onClick={() => setSelected(e)}
                  className={`p-3 rounded-lg mb-2 cursor-pointer border hover:bg-blue-50
                  ${
                    selected?.code === e.code
                      ? "bg-blue-100 border-blue-400"
                      : ""
                  }`}
                >
                  <p className="font-semibold">{e.name}</p>

                  <p className="text-xs text-gray-500">
                    {e.code} • {e.department}
                  </p>

                  <p className="text-xs text-gray-400">{e.phone}</p>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT */}
          <div className="lg:col-span-2 flex flex-col min-h-0">
            <div className="bg-white p-6 rounded-xl shadow flex-1 overflow-y-auto">
              {selected ? (
                <>
                  <div className="flex justify-between items-center mb-5">
                    <h2 className="text-xl font-bold">👤 Hồ sơ nhân viên</h2>

                    <div className="flex gap-3">
                      <button
                        onClick={handleResetPassword}
                        className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg"
                      >
                        🔑 Reset Password
                      </button>

                      <button
                        onClick={() => {
                          if (!selected) return;
                          navigate(`/admin/employees/edit/${selected.code}`);
                        }}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                      >
                        ✏ Sửa hồ sơ
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <Info label="Họ tên" value={selected.name} />
                    <Info label="Mã NV" value={selected.code} />

                    <Info label="Ngày sinh" value={selected.dob} />
                    <Info label="Tuổi" value={selected.age} />

                    <Info label="Giới tính" value={selected.gender} />
                    <Info label="Nơi sinh" value={selected.birthPlace} />

                    <Info label="Dân tộc" value={selected.ethnicity} />
                    <Info label="Quốc tịch" value={selected.nationality} />

                    <Info label="CMND/CCCD" value={selected.idCard} />
                    <Info label="SĐT" value={selected.phone} />

                    <Info label="Email" value={selected.email} />
                    <Info label="Phòng ban" value={selected.department} />

                    <Info label="Chức vụ" value={selected.position} />

                    <div className="p-4 bg-gray-50 rounded-xl border">
                      <p className="text-xs text-gray-500 mb-1">
                        Password hiện tại
                      </p>

                      <div className="flex items-center justify-between">
                        <p className="font-semibold text-gray-800 break-words">
                          {user.role === "admin"
                            ? showPassword
                              ? selected.password
                              : "••••••••"
                            : "Không có quyền"}
                        </p>

                        {user.role === "admin" && (
                          <button
                            onClick={() => setShowPassword(!showPassword)}
                            className="text-blue-600 hover:text-blue-800 transition"
                          >
                            {showPassword ? (
                              <FiEyeOff size={20} />
                            ) : (
                              <FiEye size={20} />
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <p className="text-gray-400">
                  👉 Chọn nhân viên để xem chi tiết
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: any }) {
  return (
    <div className="p-4 bg-gray-50 rounded-xl border">
      <p className="text-xs text-gray-500 mb-1">{label}</p>

      <p className="font-semibold text-gray-800 break-words">
        {value || "Chưa có dữ liệu"}
      </p>
    </div>
  );
}
