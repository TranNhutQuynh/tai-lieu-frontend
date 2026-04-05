import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import http from "../api/http";
import { saveAuth } from "../utils/auth";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    username: "",
    password: "",
    role: "student",
    faculty: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await http.post("/auth/register", form);
      saveAuth(res.data);
      navigate("/");
    } catch (error) {
      setMessage(error.response?.data?.message || "Đăng ký thất bại");
    }
  };

  return (
    <div className="page">
      <div className="container">
        <div className="form-wrap">
          <div className="card form-card">
            <h2 className="form-title">Đăng ký tài khoản</h2>
            <p className="form-subtitle">
              Tạo tài khoản mới để tham gia chia sẻ tài liệu học tập.
            </p>

            <form onSubmit={handleSubmit} className="form">
              <div className="form-group">
                <label className="form-label">Họ tên</label>
                <input
                  className="form-input"
                  name="fullName"
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email</label>
                <input
                  className="form-input"
                  name="email"
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Tên đăng nhập</label>
                <input
                  className="form-input"
                  name="username"
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Mật khẩu</label>
                <input
                  className="form-input"
                  name="password"
                  type="password"
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Khoa</label>
                <input
                  className="form-input"
                  name="faculty"
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Vai trò</label>
                <select
                  className="form-select"
                  name="role"
                  onChange={handleChange}
                  value={form.role}
                >
                  <option value="student">Sinh viên</option>
                  <option value="lecturer">Giảng viên</option>
                </select>
              </div>

              <button type="submit" className="btn btn-primary">
                Đăng ký
              </button>
            </form>

            {message && <div className="alert alert-error">{message}</div>}

            <p className="form-note">
              Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
