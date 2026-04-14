import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

export default function AddEmployee() {
  const navigate = useNavigate();
  const [openEmployeeMenu, setOpenEmployeeMenu] = useState(false);
  const [loading, setLoading] = useState(false);

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const [form, setForm] = useState({
    name: "",
    code: "",
    dob: "",
    gender: "Nam",
    position: "",
    department: "",
    idCard: "",
    password: "",
    phone: "",
    birthPlace: "",
    ethnicity: "",
    nationality: "",
    email: "",
  });

  // ✅ handle change
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ tính tuổi
  const calculateAge = (dob: string) => {
    if (!dob) return "";
    const birth = new Date(dob);
    const ageDif = Date.now() - birth.getTime();
    const ageDate = new Date(ageDif);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

  // ✅ VALIDATE (fix an toàn)
  const validate = () => {
    if (!form.name.trim()) return "Vui lòng nhập tên";
    if (!form.code.trim()) return "Vui lòng nhập mã nhân viên";
    if (!form.password.trim()) return "Vui lòng nhập mật khẩu";

    if (!form.phone || !form.phone.match(/^[0-9]{9,11}$/))
      return "Số điện thoại không hợp lệ";

    if (!form.email || !form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/))
      return "Email không hợp lệ";

    return null;
  };

  // ✅ HANDLE SAVE
  const handleSave = async () => {
    const error = validate();
    if (error) {
      alert(error);
      return;
    }

    const newEmployee = {
      ...form,
      age: calculateAge(form.dob),
    };

    try {
      setLoading(true);

      console.log("DATA SEND:", newEmployee); // 🔥 debug

      const res = await axios.post(
        "http://localhost:5000/api/employees",
        newEmployee,
      );

      alert(res.data.message || "Thêm nhân viên thành công!");

      // ✅ reset form
      setForm({
        name: "",
        code: "",
        dob: "",
        gender: "Nam",
        position: "",
        department: "",
        idCard: "",
        password: "",
        phone: "",
        birthPlace: "",
        ethnicity: "",
        nationality: "",
        email: "",
      });

      // 👉 nếu muốn quay lại dashboard
      // navigate("/admin");
    } catch (err: any) {
      console.error("ERROR:", err);

      // 👉 show lỗi backend nếu có
      alert(err?.response?.data?.message || "Lỗi khi thêm nhân viên!");
    } finally {
      setLoading(false);
    }
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
          <h2 className="col-span-2 font-bold text-lg">Thông tin cơ bản</h2>

          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Họ và tên"
            className="border p-2 rounded"
          />

          <input
            name="code"
            value={form.code}
            onChange={handleChange}
            placeholder="Mã NV"
            className="border p-2 rounded"
          />

          <input
            name="idCard"
            value={form.idCard}
            onChange={handleChange}
            placeholder="CMND / CCCD"
            className="border p-2 rounded"
          />

          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="Số điện thoại"
            className="border p-2 rounded"
          />

          <input
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            className="border p-2 rounded"
          />

          <input
            type="date"
            name="dob"
            value={form.dob}
            onChange={handleChange}
            className="border p-2 rounded"
          />

          <select
            name="gender"
            value={form.gender}
            onChange={handleChange}
            className="border p-2 rounded"
          >
            <option value="Nam">Nam</option>
            <option value="Nữ">Nữ</option>
          </select>

          <div className="col-span-2 p-3 bg-gray-100 rounded">
            👤 Tuổi: <b>{calculateAge(form.dob) || "--"}</b>
          </div>

          <h2 className="col-span-2 font-bold text-lg">Thông tin công việc</h2>

          <input
            name="department"
            value={form.department}
            onChange={handleChange}
            placeholder="Phòng ban"
            className="border p-2 rounded"
          />

          <input
            name="position"
            value={form.position}
            onChange={handleChange}
            placeholder="Chức vụ"
            className="border p-2 rounded"
          />

          <h2 className="col-span-2 font-bold text-lg">Thông tin thêm</h2>

          <input
            name="birthPlace"
            value={form.birthPlace}
            onChange={handleChange}
            placeholder="Nơi sinh"
            className="border p-2 rounded"
          />

          <input
            name="ethnicity"
            value={form.ethnicity}
            onChange={handleChange}
            placeholder="Dân tộc"
            className="border p-2 rounded"
          />

          <input
            name="nationality"
            value={form.nationality}
            onChange={handleChange}
            placeholder="Quốc tịch"
            className="border p-2 rounded"
          />

          <input
            name="password"
            value={form.password}
            type="password"
            onChange={handleChange}
            placeholder="Mật khẩu"
            className="border p-2 rounded"
          />

          <button
            onClick={handleSave}
            disabled={loading}
            className="col-span-2 bg-blue-600 text-white py-2 rounded disabled:bg-gray-400"
          >
            {loading ? "Đang lưu..." : "Lưu nhân viên"}
          </button>
        </div>
      </div>
    </div>
  );
}
