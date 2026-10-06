// TODO: Implement ProtectedRoute.jsx
import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <div>Loading Security Gateway...</div>;

  // 1. Not logged in
  if (!user) return <Navigate to="/login" replace />;

  // 2. Logged in, but wrong role
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  // 3. Authorized
  return children;
};

export default ProtectedRoute;
