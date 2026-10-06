const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { users } = require("../config/mockDB"); // Import the array

const generateAccessToken = (user) => {
  return jwt.sign(
    { id: user.id, role: user.role },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "15m" },
  );
};

const generateRefreshToken = (user) => {
  return jwt.sign({ id: user.id }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });
};

exports.register = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (users.find((u) => u.email === email)) {
      return res.status(400).json({ error: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = {
      id: Date.now().toString(),
      email,
      password: hashedPassword,
      role: role || "Employee",
    };

    users.push(newUser); // Save to array

    // NEW: Instantly generate tokens for auto-login
    const accessToken = generateAccessToken(newUser);
    const refreshToken = generateRefreshToken(newUser);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      message: "Registered and logged in",
      accessToken,
      role: newUser.role,
    });
  } catch (error) {
    res.status(500).json({ error: "Server error during registration" });
  }
};

// ... the rest of the file (login, refresh, logout, googleCallback) stays exactly the same ...

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = users.find((u) => u.email === email);
    if (!user || !user.password)
      return res.status(401).json({ error: "Invalid credentials" });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword)
      return res.status(401).json({ error: "Invalid credentials" });

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: "Logged in successfully",
      accessToken,
      role: user.role,
    });
  } catch (error) {
    res.status(500).json({ error: "Server error during login" });
  }
};

exports.refresh = (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken)
    return res.status(401).json({ error: "No refresh token provided" });

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (err)
      return res
        .status(403)
        .json({ error: "Invalid or expired refresh token" });

    const user = users.find((u) => u.id === decoded.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    const newAccessToken = generateAccessToken(user);
    res.status(200).json({ accessToken: newAccessToken });
  });
};

exports.logout = (req, res) => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
  });
  res.status(200).json({ message: "Logged out successfully" });
};

exports.googleCallback = (req, res) => {
  const user = req.user;

  // FIXED: Redirect to Vercel on failure
  if (!user)
    return res.redirect(
      "https://web-lab-05-teal.vercel.app/login?error=OAuthFailed",
    );

  const refreshToken = generateRefreshToken(user);

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true, // MUST be true for production
    sameSite: "None", // MUST be 'None' for cross-domain
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  // FIXED: Redirect to Vercel dashboard on success
  res.redirect("https://web-lab-05-teal.vercel.app/dashboard");
};
