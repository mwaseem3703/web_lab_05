require("dotenv").config();
const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const rateLimit = require("express-rate-limit");
const passport = require("passport");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");

require("./config/passportSetup");

const authRoutes = require("./routes/authRoutes");
const verifyToken = require("./middleware/authMiddleware");
const checkRole = require("./middleware/roleMiddleware");

const app = express();

// 1. OWASP: Secure Headers
app.use(helmet());

// 2. OWASP: Strict CORS Policy (FIXED for Vercel)
const allowedOrigins = [
  "http://localhost:5173",
  "https://web-lab-05.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // MUST be true to allow httpOnly cookies
    methods: ["GET", "POST", "PUT", "DELETE"],
  }),
);

// 3. Parsers
app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());

// 4. OWASP: Payload Sanitization
app.use(mongoSanitize());
app.use(xss());

// 5. OWASP: Rate Limiting
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50, // Keep at 50 for testing, change to 5 for assignment submission
  message: {
    error: "Too many login attempts. Please try again after 15 minutes.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// 6. Routes
app.use("/api/v1/auth", authLimiter, authRoutes);

// Welcome Route for visitors hitting the Render URL
app.get("/", (req, res) => {
  res.send(`
        <div style="font-family: system-ui, sans-serif; text-align: center; margin-top: 10vh; color: #333;">
            <h2> Enterprise Gateway is Online</h2>
            <p>This is the backend server. To view the application, please visit the frontend portal:</p>
            <a href="https://web-lab-05.vercel.app" 
               style="display: inline-block; margin-top: 20px; padding: 10px 20px; background: #4f46e5; color: white; text-decoration: none; border-radius: 8px; font-weight: bold;">
               Go to Frontend Portal
            </a>
        </div>
    `);
});

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

// 7. Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Security Gateway running on port ${PORT}`);
});
