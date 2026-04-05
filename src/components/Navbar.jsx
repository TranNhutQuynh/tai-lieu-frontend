import { Link, useNavigate } from "react-router-dom";
import { clearAuth, getUser, isLoggedIn } from "../utils/auth";

export default function Navbar() {
  const navigate = useNavigate();
  const user = getUser();

  const handleLogout = () => {
    clearAuth();
    navigate("/login");
  };

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <div className="nav-left">
          <Link to="/" className="brand">
            Tài Liệu Học Tập
          </Link>
          <Link to="/" className="nav-link">
            Trang chủ
          </Link>
          {isLoggedIn() && (
            <Link to="/upload" className="nav-link">
              Tải lên
            </Link>
          )}
          {isLoggedIn() && (
            <Link to="/profile" className="nav-link">
              Hồ sơ cá nhân
            </Link>
          )}
          {user?.role === "admin" && (
            <Link to="/admin" className="nav-link">
              Quản trị
            </Link>
          )}
        </div>

        <div className="nav-right">
          {!isLoggedIn() ? (
            <>
              <Link to="/login" className="nav-link">
                Đăng nhập
              </Link>
              <Link to="/register" className="btn btn-primary">
                Đăng ký
              </Link>
            </>
          ) : (
            <>
              <span className="user-chip">
                {user?.username || user?.fullName}
              </span>
              <button className="btn btn-secondary" onClick={handleLogout}>
                Đăng xuất
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
