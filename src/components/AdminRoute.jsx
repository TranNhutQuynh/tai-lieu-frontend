import { Navigate } from "react-router-dom";
import { isAdmin, isLoggedIn } from "../utils/auth";

export default function AdminRoute({ children }) {
  if (!isLoggedIn()) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin()) {
    return <Navigate to="/" replace />;
  }

  return children;
}
