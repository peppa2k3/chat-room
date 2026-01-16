// src/components/Register.jsx
import { useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:5000/api";

export default function Register({ onRegister, onSwitchToLogin }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Mật khẩu không khớp");
      return;
    }

    setLoading(true);

    try {
      const { data } = await axios.post(`${API_URL}/auth/register`, {
        username,
        email,
        password,
      });
      onRegister({ ...data.user, token: data.token });
    } catch (err) {
      setError(err.response?.data?.message || "Đăng ký thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-dark border border-primary/30 rounded-lg shadow-2xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-white mb-6 text-center">
          Đăng Ký
        </h1>

        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-300 mb-2">Tên người dùng</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-darker border border-primary/30 text-white px-4 py-3 rounded focus:outline-none focus:border-secondary"
              required
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-darker border border-primary/30 text-white px-4 py-3 rounded focus:outline-none focus:border-secondary"
              required
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-2">Mật khẩu</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-darker border border-primary/30 text-white px-4 py-3 rounded focus:outline-none focus:border-secondary"
              required
              minLength="6"
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-2">
              Xác nhận mật khẩu
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full bg-darker border border-primary/30 text-white px-4 py-3 rounded focus:outline-none focus:border-secondary"
              required
              minLength="6"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-secondary hover:bg-primary text-white font-semibold py-3 rounded transition duration-200 disabled:opacity-50"
          >
            {loading ? "Đang xử lý..." : "Đăng Ký"}
          </button>
        </form>

        <p className="text-gray-400 text-center mt-6">
          Đã có tài khoản?{" "}
          <button
            onClick={onSwitchToLogin}
            className="text-secondary hover:text-primary font-semibold"
          >
            Đăng nhập
          </button>
        </p>
      </div>
    </div>
  );
}
