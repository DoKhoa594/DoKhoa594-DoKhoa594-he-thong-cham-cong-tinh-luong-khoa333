import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

type FormType = {
  name: string;
  code: string;
  dob: string;
  gender: string;
  position: string;
  department: string;
  idCard: string;
  password: string;
  phone: string;
  birthPlace: string;
  ethnicity: string;
  nationality: string;
  email: string;
};

export default function AddEmployee() {
  const navigate = useNavigate();
  const [openEmployeeMenu, setOpenEmployeeMenu] = useState(false);
  const [loading, setLoading] = useState(false);

  const user = JSON.parse(localStorage.getItem("user") ?? "{}");

  const positions = [
    "Giám đốc",
    "Phó giám đốc",
    "Trưởng phòng",
    "Nhân viên",
    "Thực tập sinh",
  ];

  const departments = [
    "CNTT",
    "Kinh doanh",
    "Marketing",
    "Tài chính - Kế toán",
    "Sản xuất",
  ];

  const [form, setForm] = useState<FormType>({
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

  const validate = () => {
    if (!form.name.trim()) return "Vui lòng nhập tên";
    if (!form.code.trim()) return "Vui lòng nhập mã nhân viên";
    if (!form.password.trim()) return "Vui lòng nhập mật khẩu";
    if (!form.position) return "Vui lòng chọn chức vụ";
    if (!form.department) return "Vui lòng chọn phòng ban";

    if (!/^[0-9]{9,11}$/.test(form.phone)) return "Số điện thoại không hợp lệ";

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      return "Email không hợp lệ";

    return null;
  };

  const handleSave = async () => {
    const error = validate();
    if (error) return alert(error);

    const newEmployee = {
      ...form,
      age: calculateAge(form.dob),
    };

    try {
      setLoading(true);

      const res = await axios.post(
        "http://localhost:5000/api/create-employee",
        newEmployee,
      );

      alert(res.data.message || "Thêm nhân viên thành công!");

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
    } catch (err: any) {
      alert(err?.response?.data?.message || "Lỗi khi thêm nhân viên!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      {/* SIDEBAR */}
      <div className="w-64 bg-blue-700 text-white p-5 flex flex-col">
        <h2 className="text-2xl font-bold mb-6 tracking-wide">Admin Panel</h2>

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

        <button className="mt-auto bg-red-500 hover:bg-red-600 py-2 rounded transition">
          Đăng xuất
        </button>
      </div>

      {/* CONTENT */}
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">➕ Thêm nhân viên</h1>

          <button
            onClick={() => navigate("/admin")}
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded transition"
          >
            ← Quay lại
          </button>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-lg grid grid-cols-2 gap-4">
          <h2 className="col-span-2 font-bold text-lg">Thông tin cơ bản</h2>

          {/* INPUT COMPONENT */}
          {[
            { name: "name", label: "Họ và tên" },
            { name: "code", label: "Mã NV" },
            { name: "idCard", label: "CMND / CCCD" },
            { name: "phone", label: "Số điện thoại" },
            { name: "email", label: "Email", type: "email" },
          ].map((field) => (
            <div key={field.name}>
              <label className="text-sm font-medium">{field.label}</label>
              <input
                type={field.type || "text"}
                name={field.name}
                value={(form as any)[field.name]}
                onChange={handleChange}
                className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          ))}

          <div>
            <label className="text-sm font-medium">Ngày sinh</label>
            <input
              type="date"
              name="dob"
              value={form.dob}
              onChange={handleChange}
              className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Giới tính</label>
            <select
              name="gender"
              value={form.gender}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            >
              <option value="Nam">Nam</option>
              <option value="Nữ">Nữ</option>
            </select>
          </div>

          <div className="col-span-2 p-3 bg-gray-100 rounded">
            👤 Tuổi: <b>{calculateAge(form.dob) || "--"}</b>
          </div>

          <h2 className="col-span-2 font-bold text-lg">Thông tin công việc</h2>

          <div>
            <label className="text-sm font-medium">Phòng ban</label>
            <select
              name="department"
              value={form.department}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            >
              <option value="">-- Chọn phòng ban --</option>
              {departments.map((d, i) => (
                <option key={i} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium">Chức vụ</label>
            <select
              name="position"
              value={form.position}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            >
              <option value="">-- Chọn chức vụ --</option>
              {positions.map((p, i) => (
                <option key={i} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          <h2 className="col-span-2 font-bold text-lg">Thông tin thêm</h2>

          {[
            { name: "birthPlace", label: "Nơi sinh" },
            { name: "ethnicity", label: "Dân tộc" },
            { name: "nationality", label: "Quốc tịch" },
            { name: "password", label: "Mật khẩu", type: "password" },
          ].map((field) => (
            <div key={field.name}>
              <label className="text-sm font-medium">{field.label}</label>
              <input
                type={field.type || "text"}
                name={field.name}
                value={(form as any)[field.name]}
                onChange={handleChange}
                className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500"
              />
            </div>
          ))}

          <button
            onClick={handleSave}
            disabled={loading}
            className="col-span-2 bg-blue-600 hover:bg-blue-700 transition text-white py-2 rounded disabled:bg-gray-400"
          >
            {loading ? "Đang lưu..." : "Lưu nhân viên"}
          </button>
        </div>
      </div>
    </div>
  );
}
