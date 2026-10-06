import {
  LayoutDashboard,
  LogOut,
  ShieldCheck,
  User,
  Wallet,
} from "lucide-react";
import { useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link
            to={user ? "/dashboard" : "/"}
            className="flex items-center gap-2 group"
          >
            <div className="bg-indigo-600 p-2 rounded-lg group-hover:bg-indigo-700 transition-colors">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-900 tracking-tight">
              SystemHub
            </span>
          </Link>

          <nav className="flex items-center gap-6">
            {!user ? (
              <>
                <Link
                  to="/login"
                  className="text-slate-600 hover:text-indigo-600 font-medium transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg font-medium transition-all shadow-sm active:scale-95"
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/dashboard"
                  className={`flex items-center gap-1.5 font-medium transition-colors ${location.pathname === "/dashboard" ? "text-indigo-600" : "text-slate-600 hover:text-indigo-600"}`}
                >
                  <LayoutDashboard className="w-4 h-4" /> Dashboard
                </Link>

                {(user.role === "Manager" || user.role === "SuperAdmin") && (
                  <Link
                    to="/payroll"
                    className={`flex items-center gap-1.5 font-medium transition-colors ${location.pathname === "/payroll" ? "text-indigo-600" : "text-slate-600 hover:text-indigo-600"}`}
                  >
                    <Wallet className="w-4 h-4" /> Payroll
                  </Link>
                )}

                <div className="h-6 w-px bg-slate-200 mx-2"></div>

                <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 py-1.5 px-3 rounded-full">
                  <User className="w-4 h-4 text-indigo-600" />
                  <span className="text-sm font-bold text-slate-700">
                    {user.role}
                  </span>
                </div>

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 text-slate-500 hover:text-red-600 font-medium transition-colors"
                >
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
