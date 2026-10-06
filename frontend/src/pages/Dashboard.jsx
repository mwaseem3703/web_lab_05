import { motion } from "framer-motion";
import { Activity, Server, ShieldCheck, Users } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import api from "../services/api";

const Dashboard = () => {
  const [isPinging, setIsPinging] = useState(false);

  const testEmployeeRoute = async () => {
    setIsPinging(true);
    try {
      const res = await api.get("/employee/profile");
      toast.success("Connection successful. API is reachable.");
    } catch (err) {
      toast.error("Connection failed. Unauthorized access.");
    } finally {
      setIsPinging(false);
    }
  };

  const stats = [
    {
      label: "Active Users",
      value: "1,284",
      icon: Users,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "System Uptime",
      value: "99.9%",
      icon: Activity,
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      label: "API Requests",
      value: "45.2k",
      icon: Server,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
    {
      label: "Security Logs",
      value: "12",
      icon: ShieldCheck,
      color: "text-indigo-600",
      bg: "bg-indigo-50",
    },
  ];

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <header className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Dashboard Overview
          </h1>
          <p className="text-slate-500 mt-1">
            View system metrics and test your API connections.
          </p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-5 shadow-sm border border-slate-200 flex items-center gap-4"
            >
              <div className={`p-3 rounded-lg ${stat.bg}`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">
                  {stat.label}
                </p>
                <p className="text-xl font-bold text-slate-900">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl p-6 sm:p-8 shadow-sm border border-slate-200">
          <h2 className="text-lg font-bold text-slate-900 mb-2">
            API Connection Test
          </h2>
          <p className="text-slate-500 text-sm mb-6 max-w-xl">
            Verify your authorization status by sending a request to the
            protected employee endpoint. This requires a valid JWT access token.
          </p>

          <button
            onClick={testEmployeeRoute}
            disabled={isPinging}
            className="flex items-center justify-center sm:justify-start gap-2 w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white px-6 py-2.5 rounded-lg font-medium transition-all shadow-sm active:scale-95 disabled:opacity-70"
          >
            {isPinging ? (
              <Activity className="w-4 h-4 animate-spin" />
            ) : (
              <Server className="w-4 h-4" />
            )}
            Test API Connection
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
