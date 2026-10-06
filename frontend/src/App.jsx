import { Toaster } from "react-hot-toast";
import { Route, Routes } from "react-router-dom";
import Footer from "./components/Footer";
import Header from "./components/Header";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Payroll from "./pages/Payroll";
import Register from "./pages/Register";

function App() {
  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFC]">
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: { background: "#333", color: "#fff", borderRadius: "10px" },
        }}
      />
      <Header /> {/* Appears on every page */}
      <main className="flex-grow">
        {" "}
        {/* Pushes footer to the bottom */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute
                allowedRoles={["Employee", "Manager", "SuperAdmin"]}
              >
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/payroll"
            element={
              <ProtectedRoute allowedRoles={["Manager", "SuperAdmin"]}>
                <Payroll />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
      <Footer /> {/* Appears on every page */}
    </div>
  );
}

export default App;
