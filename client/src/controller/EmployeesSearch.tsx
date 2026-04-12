import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

type Employee = {
  name: string;
  code: string;
  idCard: string;
  department: string;
  position: string;
  age?: number;
};

export default function EmployeesSearch() {
  const navigate = useNavigate();
  const [openEmployeeMenu, setOpenEmployeeMenu] = useState(false);

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const [employees] = useState<Employee[]>([
    {
      name: "Nguyen Van A",
      code: "NV001",
      idCard: "123456789",
      department: "IT",
      position: "Developer",
      age: 22,
    },
    {
      name: "Tran Thi B",
      code: "NV002",
      idCard: "987654321",
      department: "HR",
      position: "HR Manager",
      age: 28,
    },
  ]);

  const [keyword, setKeyword] = useState("");
  const [selected, setSelected] = useState<Employee | null>(null);

  const k = keyword.toLowerCase().trim();

  const filtered = useMemo(() => {
    if (!k) return [];
    return employees.filter((e) =>
      Object.values(e).join(" ").toLowerCase().includes(k),
    );
  }, [k, employees]);

  const handleSelect = (emp: Employee) => {
    setSelected(emp);
    setKeyword(emp.name);
  };

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
                  onClick={() => navigate("/admin/employees/search")}
                  className="p-2 bg-blue-600 rounded text-sm text-left"
                >
                  🔍 Tìm kiếm nhân viên
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
      <div className="flex-1 p-6 overflow-y-auto">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">🔍 Tìm kiếm nhân viên</h1>

          <button
            onClick={() => navigate("/admin")}
            className="px-4 py-2 bg-gray-700 text-white rounded-lg"
          >
            ← Quay lại
          </button>
        </div>

        {/* SEARCH */}
        <div className="relative max-w-2xl">
          <input
            value={keyword}
            onChange={(e) => {
              setKeyword(e.target.value);
              setSelected(null);
            }}
            placeholder="Tìm theo tên, mã NV..."
            className="w-full p-4 rounded-xl shadow border"
          />

          {k && !selected && (
            <div className="absolute w-full bg-white mt-2 rounded-xl shadow border max-h-60 overflow-auto z-10">
              {filtered.length > 0 ? (
                filtered.map((e, i) => (
                  <div
                    key={i}
                    onClick={() => handleSelect(e)}
                    className="p-3 hover:bg-blue-50 cursor-pointer"
                  >
                    <p className="font-semibold">{e.name}</p>
                    <p className="text-xs text-gray-500">
                      {e.code} • {e.department}
                    </p>
                  </div>
                ))
              ) : (
                <p className="p-3 text-gray-400">Không tìm thấy</p>
              )}
            </div>
          )}
        </div>

        {/* RESULT */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-white p-4 rounded shadow">
            {(selected
              ? [selected]
              : filtered.length
                ? filtered
                : employees
            ).map((e, i) => (
              <div
                key={i}
                onClick={() => setSelected(e)}
                className="p-3 border rounded mb-2 cursor-pointer"
              >
                {e.name}
              </div>
            ))}
          </div>

          <div className="md:col-span-2 bg-white p-6 rounded shadow">
            {selected ? (
              <>
                <h2 className="text-xl font-bold mb-4">Thông tin nhân viên</h2>

                <p>
                  <b>Tên:</b> {selected.name}
                </p>
                <p>
                  <b>Mã:</b> {selected.code}
                </p>
                <p>
                  <b>CMND:</b> {selected.idCard}
                </p>
                <p>
                  <b>Phòng ban:</b> {selected.department}
                </p>
                <p>
                  <b>Chức vụ:</b> {selected.position}
                </p>
                <p>
                  <b>Tuổi:</b> {selected.age}
                </p>
              </>
            ) : (
              <p className="text-gray-400">Chọn nhân viên để xem</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
