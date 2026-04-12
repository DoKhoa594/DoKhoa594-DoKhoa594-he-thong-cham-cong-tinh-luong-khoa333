import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function AddEmployee() {
  const navigate = useNavigate();
  const [openEmployeeMenu, setOpenEmployeeMenu] = useState(false);

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const [form, setForm] = useState({
    name: "",
    code: "",
    dob: "",
    gender: "Nam",
    position: "",
    department: "",
    idCard: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const calculateAge = (dob: string) => {
    if (!dob) return "";
    const birth = new Date(dob);
    const ageDif = Date.now() - birth.getTime();
    const ageDate = new Date(ageDif);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

  const handleSave = () => {
    const newEmployee = {
      ...form,
      age: calculateAge(form.dob),
    };

    console.log("Employee:", newEmployee);

    alert("Thêm nhân viên thành công!");
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
          <h1 className="text-2xl font-bold">➕ Thêm nhân viên</h1>

          <button
            onClick={() => navigate("/admin")}
            className="bg-gray-600 text-white px-4 py-2 rounded"
          >
            ← Quay lại
          </button>
        </div>

        {/* FORM */}
        <div className="bg-white p-6 rounded-xl shadow-md grid grid-cols-2 gap-4">
          <input
            name="name"
            onChange={handleChange}
            placeholder="Họ và tên"
            className="border p-2 rounded"
          />
          <input
            name="code"
            onChange={handleChange}
            placeholder="Mã NV"
            className="border p-2 rounded"
          />
          <input
            name="idCard"
            onChange={handleChange}
            placeholder="CMND / CCCD"
            className="border p-2 rounded"
          />

          <input
            type="date"
            name="dob"
            onChange={handleChange}
            className="border p-2 rounded"
          />

          <select
            name="gender"
            onChange={handleChange}
            className="border p-2 rounded"
          >
            <option value="Nam">Nam</option>
            <option value="Nữ">Nữ</option>
          </select>

          <input
            name="department"
            onChange={handleChange}
            placeholder="Phòng ban"
            className="border p-2 rounded"
          />

          <input
            name="position"
            onChange={handleChange}
            placeholder="Chức vụ"
            className="border p-2 rounded col-span-2"
          />

          <div className="col-span-2 p-3 bg-gray-100 rounded">
            👤 Tuổi: <b>{calculateAge(form.dob) || "--"}</b>
          </div>

          <button
            onClick={handleSave}
            className="col-span-2 bg-blue-600 text-white py-2 rounded"
          >
            Lưu nhân viên
          </button>
        </div>
      </div>
    </div>
  );
}
