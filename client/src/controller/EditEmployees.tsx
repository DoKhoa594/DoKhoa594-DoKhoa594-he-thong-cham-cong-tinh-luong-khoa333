import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

type FormType = {
  name: string;
  code: string;

  dob: string;
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

export default function EditEmployee() {
  const navigate = useNavigate();
  const { code } = useParams();

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState<FormType>({
    name: "",
    code: "",
    dob: "",
    gender: "Nam",

    birthPlace: "",
    ethnicity: "",
    nationality: "",

    idCard: "",
    phone: "",
    email: "",

    department: "",
    position: "",

    password: "",
  });

  // ================= INPUT CHANGE =================
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // ================= AGE =================
  const calculateAge = (dob: string) => {
    if (!dob) return "";

    const birth = new Date(dob);
    const diff = Date.now() - birth.getTime();

    return Math.abs(new Date(diff).getUTCFullYear() - 1970);
  };

  // ================= LOAD EMPLOYEE DETAIL =================
  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        setLoading(true);

        const res = await axios.get(
          `http://localhost:5000/api/get-employee-by-code/${code}`,
        );

        setForm(res.data);
      } catch (err) {
        console.error(err);
        alert("Không tải được hồ sơ nhân viên");
      } finally {
        setLoading(false);
      }
    };

    if (code) {
      fetchEmployee();
    }
  }, [code]);

  // ================= UPDATE =================
  const handleUpdate = async () => {
    try {
      setLoading(true);

      await axios.put(
        `http://localhost:5000/api/update-employee/${code}`,
        form,
      );

      alert("Cập nhật thành công");

      navigate("/admin/employees/list");
    } catch (err: any) {
      alert(err?.response?.data?.message || "Cập nhật thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* SIDEBAR */}
      <div className="w-64 bg-blue-700 text-white p-5 flex flex-col">
        <h2 className="text-2xl font-bold mb-6">Admin Panel</h2>

        <button
          onClick={() => navigate("/admin/employees/list")}
          className="bg-white text-blue-700 py-2 rounded"
        >
          ← Quay danh sách
        </button>
      </div>

      {/* CONTENT */}
      <div className="flex-1 p-6 overflow-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">✏ Chỉnh sửa nhân viên</h1>

          <button
            onClick={() => navigate(-1)}
            className="bg-gray-600 text-white px-4 py-2 rounded"
          >
            Huỷ
          </button>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-lg grid grid-cols-2 gap-5">
          {/* THÔNG TIN CÁ NHÂN */}
          <h2 className="col-span-2 text-xl font-bold">Thông tin cá nhân</h2>

          <Field
            label="Họ tên"
            name="name"
            value={form.name}
            onChange={handleChange}
          />

          <div>
            <label className="text-sm font-medium">Mã nhân viên</label>

            <input
              value={form.code}
              disabled
              className="
                w-full
                border
                p-2
                rounded
                bg-gray-100
              "
            />
          </div>

          <Field
            label="CMND / CCCD"
            name="idCard"
            value={form.idCard}
            onChange={handleChange}
          />

          <Field
            label="Số điện thoại"
            name="phone"
            value={form.phone}
            onChange={handleChange}
          />

          <Field
            label="Email"
            name="email"
            value={form.email}
            onChange={handleChange}
          />

          <div>
            <label>Ngày sinh</label>

            <input
              type="date"
              name="dob"
              value={form.dob}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </div>

          <div>
            <label>Giới tính</label>

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

          <div className="col-span-2 bg-gray-100 p-3 rounded">
            Tuổi:
            <b> {calculateAge(form.dob)}</b>
          </div>

          {/* THÔNG TIN KHÁC */}
          <h2 className="col-span-2 text-xl font-bold mt-4">
            Thông tin bổ sung
          </h2>

          <Field
            label="Nơi sinh"
            name="birthPlace"
            value={form.birthPlace}
            onChange={handleChange}
          />

          <Field
            label="Dân tộc"
            name="ethnicity"
            value={form.ethnicity}
            onChange={handleChange}
          />

          <Field
            label="Quốc tịch"
            name="nationality"
            value={form.nationality}
            onChange={handleChange}
          />

          <Field
            label="Phòng ban"
            name="department"
            value={form.department}
            onChange={handleChange}
          />

          <Field
            label="Chức vụ"
            name="position"
            value={form.position}
            onChange={handleChange}
          />

          {/* chỉ admin xem, không sửa pass ở đây */}
          <div>
            <label>Password hiện tại</label>

            <input
              value={form.password}
              disabled
              className="
                w-full
                border
                p-2
                rounded
                bg-gray-100
              "
            />
          </div>

          {/* ACTION */}
          <div className="col-span-2 flex gap-4 mt-6">
            <button
              onClick={() => navigate(-1)}
              className="
               flex-1
               bg-gray-500
               text-white
               py-3
               rounded
              "
            >
              Huỷ
            </button>

            <button
              onClick={handleUpdate}
              disabled={loading}
              className="
               flex-1
               bg-blue-600
               hover:bg-blue-700
               text-white
               py-3
               rounded
              "
            >
              {loading ? "Đang lưu..." : "💾 Cập nhật nhân viên"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, name, value, onChange }: any) {
  return (
    <div>
      <label className="text-sm font-medium">{label}</label>

      <input
        name={name}
        value={value}
        onChange={onChange}
        className="
          w-full
          border
          p-2
          rounded
        "
      />
    </div>
  );
}
