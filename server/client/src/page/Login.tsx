import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    setLoading(true);

    setTimeout(() => {
      // giả lập user
      const user = {
        username: username || "admin",
        role: username === "admin" ? "admin" : "user",
      };

      localStorage.setItem("user", JSON.stringify(user));

      setLoading(false);

      if (user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/user");
      }
    }, 800);
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600">
      <div className="w-[380px] bg-white rounded-2xl shadow-2xl p-8">
        {/* Title */}
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">
          Welcome Back 👋
        </h1>
        <p className="text-center text-gray-500 mb-6">Login to continue</p>

        {/* Input */}
        <div className="mb-4">
          <label className="text-sm text-gray-600">Username</label>
          <input
            type="text"
            placeholder="Enter username (admin/user)"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full mt-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Password fake (UI only) */}
        <div className="mb-6">
          <label className="text-sm text-gray-600">Password</label>
          <input
            type="password"
            placeholder="••••••••"
            className="w-full mt-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Button */}
        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition duration-200 flex items-center justify-center"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {/* hint */}
        <p className="text-xs text-gray-400 text-center mt-4">
          Try username: <b>admin</b> or anything else
        </p>
      </div>
    </div>
  );
}
