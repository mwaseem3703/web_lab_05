require("dotenv").config();
const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const rateLimit = require("express-rate-limit");
require("dotenv").config();
const authRoutes = require("./routes/authRoutes");

const app = express();
app.use(helmet());

// 2. OWASP: Strict CORS Policy
app.use(
  cors({
    origin: "http://localhost:5173", // Frontend URL
    credentials: true, // MUST be true to allow httpOnly cookies
    methods: ["GET", "POST", "PUT", "DELETE"],
  }),
);

// 3. Parsers
app.use(express.json());
app.use(cookieParser());

// 4. OWASP: Rate Limiting (Max 5 requests per 15 mins for auth)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  message: {
    error: "Too many login attempts. Please try again after 15 minutes.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Add this near the top of server.js
const passport = require("passport");
require("./config/passportSetup"); // Load the Google Strategy

// Add this below app.use(cookieParser());
app.use(passport.initialize());

// 5. Routes
app.use("/api/v1/auth", authLimiter, authRoutes);

app.get("/", (req, res) => {
  res.send("Enterprise Security Gateway Active");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Security Gateway running on port ${PORT}`);
});
const verifyToken = require("./middleware/authMiddleware");
const checkRole = require("./middleware/roleMiddleware");

// Route 1: GET /api/v1/employee/profile → All authenticated roles
app.get("/api/v1/employee/profile", verifyToken, (req, res) => {
  res.json({ message: "Profile data accessed", user: req.user });
});

// Route 2: POST /api/v1/payroll/approve → Manager and SuperAdmin only
app.post(
  "/api/v1/payroll/approve",
  verifyToken,
  checkRole(["Manager", "SuperAdmin"]),
  (req, res) => {
    res.json({
      message: "Payroll approved successfully",
      approvedBy: req.user.id,
    });
  },
);

// Route 3: DELETE /api/v1/users/:id → SuperAdmin only
app.delete(
  "/api/v1/users/:id",
  verifyToken,
  checkRole(["SuperAdmin"]),
  (req, res) => {
    res.json({ message: `User ${req.params.id} deleted successfully` });
  },
);
