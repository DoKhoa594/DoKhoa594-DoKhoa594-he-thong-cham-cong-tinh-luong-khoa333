import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

type Employee = {
  name: string;
  code: string;
  dob: string;
  age: number;
  gender: string;
  position: string;
  department: string;
  email: string;
  idCard: string;
  password: string;
  phone: string;
  birthPlace: string;
  ethnicity: string;
  nationality: string;
};

export default function EmployeesList() {
  const navigate = useNavigate();
  const [openEmployeeMenu, setOpenEmployeeMenu] = useState(false);

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // ✅ EMPTY DATA (ready API)
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);

  const [keyword, setKeyword] = useState("");
  const [selected, setSelected] = useState<Employee | null>(null);

  // =========================
  // 🔥 CALL API HERE LATER
  // =========================
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setLoading(true);

        // 👉 đổi URL này theo backend của bạn
        const res = await axios.get("http://localhost:8080/api/employees");

        setEmployees(res.data || []);
      } catch (error) {
        console.error("Load employees error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  const k = keyword.toLowerCase().trim();

  const filtered = useMemo(() => {
    if (!k) return employees;

    return employees.filter((e) =>
      `${e.name} ${e.code} ${e.phone} ${e.email}`.toLowerCase().includes(k),
    );
  }, [k, employees]);

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
          <button
            onClick={() => navigate("/admin")}
            className="p-2 hover:bg-blue-600 rounded text-left"
          >
            Tổng quan
          </button>

          <button className="p-2 hover:bg-blue-600 rounded text-left">
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
                  className="p-2 bg-blue-600 rounded text-sm"
                >
                  ➕ Thêm nhân viên
                </button>

                <button
                  onClick={() => navigate("/admin/employees/list")}
                  className="p-2 bg-blue-600 rounded text-sm"
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

        <button className="mt-auto bg-red-500 py-2 rounded">Đăng xuất</button>
      </div>

      {/* CONTENT */}
      <div className="flex-1 p-6 overflow-hidden">
        <h1 className="text-3xl font-bold mb-6">📋 Danh sách nhân viên</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[85vh]">
          {/* LEFT LIST */}
          <div className="bg-white rounded-xl shadow p-4 overflow-y-auto">
            <h2 className="font-bold mb-3">Employees {loading && "⏳"}</h2>

            {filtered.length === 0 && !loading && (
              <p className="text-gray-400 text-sm">Không có dữ liệu</p>
            )}

            {filtered.map((e, i) => (
              <div
                key={i}
                onClick={() => setSelected(e)}
                className={`p-3 rounded-lg mb-2 cursor-pointer border hover:bg-blue-50 ${
                  selected?.code === e.code ? "bg-blue-100 border-blue-400" : ""
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

          {/* RIGHT SIDE */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            {/* SEARCH */}
            <div className="bg-white p-4 rounded-xl shadow">
              <input
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Tìm theo tên, mã NV, SĐT, email..."
                className="w-full p-3 border rounded-lg"
              />
            </div>

            {/* DETAIL */}
            <div className="bg-white p-6 rounded-xl shadow flex-1 overflow-y-auto">
              {selected ? (
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <Info label="Họ Và Tên" value={selected.name} />
                  <Info label="Mã Nhân Viên" value={selected.code} />
                  <Info label="Ngày Sinh" value={selected.dob} />
                  <Info label="Tuổi" value={selected.age} />
                  <Info label="Giới Tính" value={selected.gender} />
                  <Info label="Chức Vụ" value={selected.position} />
                  <Info label="Phòng Ban" value={selected.department} />
                  <Info label="Email" value={selected.email} />
                  <Info label="Số Điện Thoại" value={selected.phone} />
                  <Info label="Số CMND/CCCD" value={selected.idCard} />
                  <Info label="Nơi Sinh" value={selected.birthPlace} />
                  <Info label="Dân Tộc" value={selected.ethnicity} />
                  <Info label="Quốc Tịch" value={selected.nationality} />
                  <Info label="Mật Khẩu" value={selected.password} />
                </div>
              ) : (
                <p className="text-gray-400">Chọn nhân viên để xem chi tiết</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// =========================
// INFO COMPONENT
// =========================
function Info({ label, value }: { label: string; value: any }) {
  return (
    <div className="p-4 bg-gray-50 rounded-xl border hover:shadow-sm transition">
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <p className="font-semibold text-gray-800">{value}</p>
    </div>
  );
}
