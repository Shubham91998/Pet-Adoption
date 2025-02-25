const User = require("../models/user");
const Nutrition = require("../models/nutrition");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Secret key for signing tokens
const secret = process.env.SECRET || "$uperman@1234"; // Use environment variable or fallback

// User signup function
const signup = async (req, res) => {
  try {
    const { fullname, address, phone, email, password, userType, secretKey } = req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Validate admin secret key
    if (userType === "admin") {
      const ADMIN_SECRET_KEY = process.env.ADMIN_SECRET_KEY; // Use environment variable
      if (secretKey !== ADMIN_SECRET_KEY) {
        return res.status(400).json({ message: "Invalid admin secret key" });
      }
    }

    // Hash the password
    const hashPassword = await bcrypt.hash(password, 10);

    // Create the user
    const createdUser = new User({
      fullname,
      address,
      phone,
      email,
      password: hashPassword,
      userType: userType || "user", // Default to 'user' if not provided
    });

    // Save the user to the database
    await createdUser.save();

    // Return success response
    res.status(201).json({
      message: "User created successfully",
      user: {
        _id: createdUser._id,
        fullname: createdUser.fullname,
        email: createdUser.email,
        userType: createdUser.userType, // Include userType in the response
      },
    });
  } catch (error) {
    console.error("Error during signup:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Nutrition user creation function
const nutrition = async (req, res) => {
  try {
    const { fullname, email, password } = req.body;
    const existingNutritionUser  = await Nutrition.findOne({ email });

    if (existingNutritionUser ) {
      return res.status(400).json({ message: "Nutrition user already exists, please try another email!" });
    }

    const hashPassword = await bcryptjs.hash(password, 10);
    const createdNutritionUser  = new Nutrition({
      fullname,
      email,
      password: hashPassword,
    });

    await createdNutritionUser .save();
    res.status(201).json({
      message: "Nutrition user created successfully",
      user: {
        _id: createdNutritionUser ._id,
        fullname: createdNutritionUser .fullname,
        email: createdNutritionUser .email,
      },
    });
  } catch (error) {
    console.error("Error during nutrition user creation:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// User login function
const login = async (req, res) => {
  try {
    const { email, password, userType, secretKey } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Validate password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Validate admin secret key (if userType is admin)
    if (userType === "admin") {
      const ADMIN_SECRET_KEY = process.env.ADMIN_SECRET_KEY; // Use environment variable for secret key
      if (secretKey !== ADMIN_SECRET_KEY) {
        return res.status(400).json({ message: "Invalid admin secret key" });
      }
    }

    // Create a token for the user
    const token = createTokenForUser(user); // Use the token creation function

    // Set the token in a cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Ensure secure cookies in production
      sameSite: "strict", // Prevent CSRF attacks
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    // Return success response
    res.status(200).json({
      message: "Login successful",
      user: {
        _id: user._id,
        fullname: user.fullname,
        email: user.email,
        userType: user.userType, // Include userType in the response
      },
      token, // Optionally return the token in the response (if needed for frontend)
    });
  } catch (error) {
    console.error("Error during login:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Middleware to check for authentication token in the Authorization header
const isAuthentication = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Get the token from the header

  if (!token) {
    return res.status(401).json({ message: "Access token is missing." });
  }

  jwt.verify(token, secret, (err, user) => {
    if (err) {
      console.error("Token verification failed:", err);
      return res.status(403).json({ message: "Invalid token." });
    }

    req.user = user; // Attach the user information to the request
    next(); // Proceed to the next middleware or route handler
  });
};

// Middleware to check for authentication cookie
function checkForAuthenticationCookie(cookieName) {
  return (req, res, next) => {
    const tokenCookieValue = req.cookies[cookieName];
    if (!tokenCookieValue) {
      res.locals.user = null;
      return next();
    }
    try {
      const userPayload = validateToken(tokenCookieValue);
      req.user = userPayload;
      res.locals.user = userPayload;
    } catch (error) {
      console.error("Failed to validate token:", error);
      req.user = null;
      res.locals.user = null;
    }
    return next();
  };
}

// Function to create a token for a user
function createTokenForUser (user) {
  const payload = {
    _id: user._id,
    fullname: user.fullname,
    email: user.email,
    userType: user.userType,
  };

  return jwt.sign(payload, secret, { expiresIn: "1d" }); // Return the token
}

// Function to validate a token
function validateToken(token) {
  return jwt.verify(token, secret); // Return the payload directly
}

// Exporting the functions and middleware
module.exports = {
  signup,
  login,
  nutrition,
  isAuthentication,
  checkForAuthenticationCookie,
  createTokenForUser ,
  validateToken,
};