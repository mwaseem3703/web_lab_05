import { motion } from "framer-motion";
import { Activity, AlertCircle, CheckCircle2, Wallet } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import api from "../services/api";

const Payroll = () => {
  const [isApproving, setIsApproving] = useState(false);

  const handleApprove = async () => {
    setIsApproving(true);
    try {
      await api.post("/payroll/approve");
      toast.success("Payroll approved successfully.", { duration: 4000 });
    } catch (err) {
      toast.error(
        err.response?.data?.error || "Action denied. Insufficient permissions.",
        { duration: 4000 },
      );
    } finally {
      setIsApproving(false);
    }
  };

  return (
    <div className="p-4 sm:p-8 max-w-4xl mx-auto h-full flex flex-col justify-center min-h-[75vh]">
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="bg-slate-50 border-b border-slate-200 p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="bg-indigo-100 p-3 rounded-lg border border-indigo-200">
                <Wallet className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Payroll Management
                </h2>
                <p className="text-slate-500 text-sm mt-1">
                  Review and approve company payroll
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-700 rounded-md border border-amber-200 w-fit">
              <AlertCircle className="w-4 h-4" />
              <span className="text-xs font-semibold uppercase tracking-wider">
                Admin Only
              </span>
            </div>
          </div>

          <div className="p-6 sm:p-12 text-center">
            <div className="max-w-lg mx-auto mb-8">
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                Approve Payroll Run
              </h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                You are about to approve the payroll for the current billing
                cycle. This action uses your JWT token to verify your
                administrative clearance and will be logged in the system.
              </p>
            </div>

            <button
              onClick={handleApprove}
              disabled={isApproving}
              className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-8 rounded-lg shadow-sm transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed w-full sm:w-auto"
            >
              {isApproving ? (
                <Activity className="w-5 h-5 animate-spin" />
              ) : (
                <CheckCircle2 className="w-5 h-5" />
              )}
              {isApproving ? "Processing..." : "Approve Payroll"}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Payroll;
