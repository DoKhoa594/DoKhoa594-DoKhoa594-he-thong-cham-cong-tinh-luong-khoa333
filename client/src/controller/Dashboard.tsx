import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState<any>(null);
  const [avatar, setAvatar] = useState<string | null>(null);

  const [showProfile, setShowProfile] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  const [openEmployeeMenu, setOpenEmployeeMenu] = useState(false);

  const [searchEmployee, setSearchEmployee] = useState("");
  const [search, setSearch] = useState("");

  const [editName, setEditName] = useState("");

  const [form, setForm] = useState({
    name: "",
    code: "",
    dob: "",
    gender: "Nam",
    email: "",
    position: "",
  });

  // ❌ BỎ DATA MẪU → bắt đầu rỗng
  const [employees, setEmployees] = useState<any[]>([]);

  // LOGIN CHECK
  useEffect(() => {
    const data = localStorage.getItem("user");
    if (!data) return navigate("/");

    const parsed = JSON.parse(data);
    if (parsed.role !== "admin") return navigate("/user");

    setUser(parsed);
    setEditName(parsed.username);

    const savedAvatar = localStorage.getItem("avatar");
    if (savedAvatar) setAvatar(savedAvatar);
  }, []);

  const handleAvatarChange = (e: any) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      setAvatar(base64);
      localStorage.setItem("avatar", base64);
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = () => {
    const updated = { ...user, username: editName };
    setUser(updated);
    localStorage.setItem("user", JSON.stringify(updated));
    setShowProfile(false);
  };

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    setEmployees([
      ...employees,
      {
        ...form,
        late: 0,
        ontime: 0,
        leave: 0,
        salary: 0,
      },
    ]);

    setShowAdd(false);

    setForm({
      name: "",
      code: "",
      dob: "",
      gender: "Nam",
      email: "",
      position: "",
    });
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  const filteredEmployees = employees.filter(
    (e) =>
      e.name.toLowerCase().includes(searchEmployee.toLowerCase()) ||
      e.code.toLowerCase().includes(searchEmployee.toLowerCase()),
  );

  return (
    <div className="flex h-screen bg-gray-100">
      {/* SIDEBAR */}
      <div className="w-64 bg-blue-700 text-white p-5 flex flex-col">
        <h2 className="text-2xl font-bold mb-6">Quản trị hệ thống</h2>

        {/* AVATAR */}
        <div
          onClick={() => setShowProfile(true)}
          className="flex items-center gap-3 mb-6 cursor-pointer hover:bg-blue-600 p-2 rounded"
        >
          <div className="w-12 h-12 rounded-full overflow-hidden bg-white flex items-center justify-center">
            {avatar ? (
              <img src={avatar} className="w-full h-full object-cover" />
            ) : (
              <span className="text-blue-700 font-bold">
                {user?.username?.charAt(0).toUpperCase()}
              </span>
            )}
          </div>

          <div>
            <p className="font-semibold">{user?.username}</p>
            <p className="text-xs text-blue-200">Bấm để chỉnh sửa</p>
          </div>
        </div>

        {/* MENU */}
        <nav className="flex-1 space-y-3">
          <p className="p-2 hover:bg-blue-600 rounded">Tổng quan</p>
          <p className="p-2 hover:bg-blue-600 rounded">Chấm công</p>

          <div>
            <p
              onClick={() => setOpenEmployeeMenu(!openEmployeeMenu)}
              className="p-2 hover:bg-blue-600 rounded font-semibold cursor-pointer"
            >
              Nhân viên ▾
            </p>

            {openEmployeeMenu && (
              <div className="ml-4 space-y-2">
                <p
                  onClick={() => setShowAdd(true)}
                  className="p-2 bg-blue-600 rounded text-sm cursor-pointer"
                >
                  ➕ Thêm nhân viên
                </p>

                <p
                  onClick={() => setShowSearch(true)}
                  className="p-2 bg-blue-600 rounded text-sm cursor-pointer"
                >
                  🔍 Tìm kiếm nhân viên
                </p>
              </div>
            )}
          </div>
        </nav>

        <button onClick={handleLogout} className="bg-red-500 py-2 rounded mt-4">
          Đăng xuất
        </button>
      </div>

      {/* CONTENT */}
      <div className="flex-1 p-6 overflow-y-auto">
        <h1 className="text-3xl font-bold mb-4">Tổng quan</h1>

        <div className="bg-white p-4 rounded shadow mb-6">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border p-2 rounded"
            placeholder="Tìm nhanh..."
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-6 rounded shadow">Lương</div>
          <div className="bg-white p-6 rounded shadow">Đi đúng giờ</div>
          <div className="bg-white p-6 rounded shadow">Đi muộn</div>
          <div className="bg-white p-6 rounded shadow">Nghỉ</div>
        </div>
      </div>

      {/* PROFILE */}
      {showProfile && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 w-[350px] rounded-xl relative animate-in fade-in zoom-in">
            <button
              onClick={() => setShowProfile(false)}
              className="absolute top-2 right-3 text-xl hover:text-red-500"
            >
              ✕
            </button>

            <input type="file" onChange={handleAvatarChange} />

            <input
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="border p-2 w-full mt-3 rounded"
            />

            <button
              onClick={handleSaveProfile}
              className="w-full bg-blue-500 text-white py-2 mt-3 rounded hover:scale-[1.02] transition"
            >
              Lưu
            </button>
          </div>
        </div>
      )}

      {/* ADD */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          {/* click outside */}
          <div className="absolute inset-0" onClick={() => setShowAdd(false)} />

          <div className="relative bg-white w-[600px] p-6 rounded-xl animate-in fade-in zoom-in">
            <div className="flex justify-between mb-4">
              <h2 className="font-bold text-xl">Thêm nhân viên</h2>

              <button
                onClick={() => setShowAdd(false)}
                className="text-xl hover:text-red-500"
              >
                ✕
              </button>
            </div>

            <input
              name="name"
              onChange={handleChange}
              placeholder="Tên"
              className="border p-2 w-full mb-2 rounded"
            />
            <input
              name="code"
              onChange={handleChange}
              placeholder="Mã NV"
              className="border p-2 w-full mb-2 rounded"
            />
            <input
              name="email"
              onChange={handleChange}
              placeholder="Email"
              className="border p-2 w-full mb-2 rounded"
            />
            <input
              name="position"
              onChange={handleChange}
              placeholder="Chức vụ"
              className="border p-2 w-full mb-2 rounded"
            />

            <button
              onClick={handleSave}
              className="bg-green-500 text-white w-full py-2 rounded hover:scale-[1.02] transition"
            >
              Lưu
            </button>
          </div>
        </div>
      )}

      {/* SEARCH (RESIZE 4 GÓC + CLOSE + FULL) */}
      {showSearch && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div
            className="bg-white p-6 rounded-xl shadow-2xl overflow-auto resize relative"
            style={{
              width: "700px",
              height: "500px",
              minWidth: "400px",
              minHeight: "300px",
            }}
          >
            {/* HEADER */}
            <div className="flex justify-between mb-4">
              <h2 className="font-bold text-xl">Danh sách nhân viên</h2>

              <button
                onClick={() => setShowSearch(false)}
                className="text-xl hover:text-red-500 hover:rotate-90 transition"
              >
                ✕
              </button>
            </div>

            <input
              value={searchEmployee}
              onChange={(e) => setSearchEmployee(e.target.value)}
              className="border p-2 w-full mb-4 rounded"
              placeholder="Tìm kiếm..."
            />

            <div className="space-y-3">
              {filteredEmployees.length === 0 ? (
                <p className="text-gray-400">Không có nhân viên</p>
              ) : (
                filteredEmployees.map((e, i) => (
                  <div key={i} className="border p-3 rounded bg-gray-50">
                    <p>
                      <b>Tên:</b> {e.name}
                    </p>
                    <p>
                      <b>Mã:</b> {e.code}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
