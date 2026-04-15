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
  phone: string;
};

export default function EmployeesList() {
  const navigate = useNavigate();
  const [openEmployeeMenu, setOpenEmployeeMenu] = useState(false);

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [keyword, setKeyword] = useState("");
  const [selected, setSelected] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(false);

  // ✅ LOAD DATA TỪ BACKEND
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setLoading(true);

        const res = await axios.get("http://localhost:5000/api/employees");

        setEmployees(res.data || []);
      } catch (err) {
        console.error("Load employees error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  // SEARCH
  const filtered = useMemo(() => {
    const k = keyword.toLowerCase();
    return employees.filter((e) =>
      `${e.name} ${e.code} ${e.phone}`.toLowerCase().includes(k),
    );
  }, [keyword, employees]);

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

        <button className="mt-auto bg-red-500 py-2 rounded">Đăng xuất</button>
      </div>

      {/* CONTENT */}
      <div className="flex-1 p-6 overflow-hidden min-h-0">
        <h1 className="text-3xl font-bold mb-6">
          📋 Danh sách nhân viên {loading && "⏳"}
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full min-h-0">
          {/* LEFT */}
          <div className="bg-white rounded-xl shadow p-4 h-full flex flex-col min-h-0">
            <h2 className="font-bold mb-3">Employees</h2>

            <input
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Tìm nhân viên..."
              className="w-full p-3 border rounded-lg mb-3"
            />

            <div className="flex-1 overflow-y-auto pr-2 border rounded">
              {filtered.map((e) => (
                <div
                  key={e.code}
                  onClick={() => setSelected(e)}
                  className={`p-3 rounded-lg mb-2 cursor-pointer border hover:bg-blue-50 ${
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
                  <h2 className="text-xl font-bold mb-4">
                    👤 Chi tiết nhân viên
                  </h2>

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <Info label="Họ tên" value={selected.name} />
                    <Info label="Mã NV" value={selected.code} />
                    <Info label="Ngày sinh" value={selected.dob} />
                    <Info label="Tuổi" value={selected.age} />
                    <Info label="Giới tính" value={selected.gender} />
                    <Info label="Chức vụ" value={selected.position} />
                    <Info label="Phòng ban" value={selected.department} />
                    <Info label="Email" value={selected.email} />
                    <Info label="SĐT" value={selected.phone} />
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
      <p className="font-semibold text-gray-800">{value}</p>
    </div>
  );
}
