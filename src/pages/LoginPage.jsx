import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import http from "../api/http";
import { saveAuth } from "../utils/auth";

export default function LoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    emailOrUsername: "",
    password: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await http.post("/auth/login", form);
      saveAuth(res.data);
      navigate("/");
    } catch (error) {
      setMessage(error.response?.data?.message || "Đăng nhập thất bại");
    }
  };

  return (
    <div className="page">
      <div className="container">
        <div className="form-wrap">
          <div className="card form-card">
            <h2 className="form-title">Đăng nhập</h2>
            <p className="form-subtitle">
              Truy cập hệ thống để tải lên, tải về và quản lý tài liệu của bạn.
            </p>

            <form onSubmit={handleSubmit} className="form">
              <div className="form-group">
                <label className="form-label">Email hoặc username</label>
                <input
                  className="form-input"
                  name="emailOrUsername"
                  placeholder="Nhập email hoặc username"
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
                  placeholder="Nhập mật khẩu"
                  onChange={handleChange}
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary">
                Đăng nhập
              </button>
            </form>

            {message && <div className="alert alert-error">{message}</div>}

            <p className="form-note">
              Chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
