const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {
  sendVerificationEmail,
  sendPasswordResetEmail,
} = require("../helpers/mailer");

const db = require("../db.config");
const User = db.User;

const {
  NotFoundError,
  RequestError,
  AuthenticationError,
} = require("../helpers/errors/customError");

exports.register = async (req, res, next) => {
  let { email, username, password } = req.body;

  try {
    if (!email || !username || !password) {
      throw new RequestError("Missing required information");
    }

    username = username.toLowerCase();

    let userWithSameUsername = await User.findOne({
      where: { username: username },
      raw: true,
    });
    let userWithSameEmail = await User.findOne({
      where: { email: email },
      raw: true,
    });

    if (userWithSameUsername) {
      throw new AuthenticationError(`User ${username} already exists`);
    }

    if (userWithSameEmail) {
      throw new AuthenticationError(`Email already exists`);
    }

    let hashedPassword = await bcryptjs.hash(
      password,
      parseInt(process.env.BCRYPT_SALT_ROUNDS)
    );

    // Create verification token
    const { v4: uuidv4 } = require("uuid");
    const emailVerificationToken = uuidv4();
    // const emailVerificationToken = require('crypto').randomBytes(64).toString('hex');
    let newUser = await User.create({
      email,
      username,
      password: hashedPassword,
      emailVerificationToken,
    });

    // Send verification email
    const verificationLink = `${process.env.APP_URL}/verify/${emailVerificationToken}`;
    sendVerificationEmail(email, verificationLink);

    return res.status(201).json({
      message: "User created. Verification email sent.",
      data: newUser,
    });
  } catch (err) {
    next(err);
  }
};

exports.signIn = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      throw new RequestError("Missing required information");
    }

    let user = await User.findOne({ where: { email: email }, raw: true });
    if (!user) {
      throw new NotFoundError("User not found");
    }

    let match = await bcryptjs.compare(password, user.password);
    if (!match) {
      throw new AuthenticationError("Wrong password");
    }

    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        email: user.email,
        emailVerified: user.emailVerified,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN,
      }
    );

    const refreshToken = jwt.sign(
      {
        id: user.id,
        username: user.username,
        email: user.email,
        emailVerified: user.emailVerified,
      },
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN,
      }
    );

    res.cookie("authToken", token, {
      httpOnly: true,
      secure: true, // Use Secure in production
      sameSite: "None", // Helps prevent CSRF
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true, // Use Secure in production
      sameSite: "None", // Helps prevent CSRF
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({
      message: "User logged in",
      user: {
        username: user.username,
        emailVerified: user.emailVerified,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.logout = (req, res) => {
  res.clearCookie("authToken", { path: "/", sameSite: "None", secure: true });
  res.clearCookie("refreshToken", {
    path: "/",
    sameSite: "None",
    secure: true,
  });
  return res.status(200).json({ message: "Logged out" });
};

exports.checkToken = (req, res) => {
  const username = req.username;
  return res.status(200).json({ message: "Authenticated", username: username });
};

exports.refreshToken = (req, res) => {
  const token = req.cookies.refreshToken;

  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, decodedToken) => {
    if (err) {
      return res.status(401).json({ error: "Invalid token" });
    }

    const newToken = jwt.sign(
      {
        id: decodedToken.id,
        username: decodedToken.username,
        email: decodedToken.email,
        emailVerified: decodedToken.emailVerified,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN,
      }
    );

    res.cookie("authToken", newToken, {
      httpOnly: true,
      secure: true, // Use Secure in production
      sameSite: "lax", // Helps prevent CSRF
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.json({
      message: "Token refreshed",
      user: {
        username: decodedToken.username,
        emailVerified: decodedToken.emailVerified,
      },
    });
  });
};

exports.verifyEmail = async (req, res, next) => {
  const { token } = req.params;

  try {
    if (!token) {
      throw new RequestError("Missing required information");
    }

    let user = await User.findOne({
      where: { emailVerificationToken: token },
      raw: true,
    });
    if (!user) {
      throw new NotFoundError("User not found");
    }

    await User.update(
      { emailVerificationToken: null, emailVerified: true },
      { where: { emailVerificationToken: token } }
    );

    return res.status(200).json({ message: "Email verified" });
  } catch (err) {
    next(err);
  }
};

exports.sendEmailToResetPassword = async (req, res, next) => {
  const { email } = req.body;

  try {
    if (!email) {
      throw new RequestError("Missing required information");
    }

    let user = await User.findOne({ where: { email: email }, raw: true });
    if (!user) {
      throw new NotFoundError("User not found");
    }

    // Create password reset token
    const { v4: uuidv4 } = require("uuid");
    const passwordResetToken = uuidv4();
    await User.update({ passwordResetToken }, { where: { email: email } });

    // Send password reset email
    const passwordResetLink = `${process.env.APP_URL}/forgot-password/${passwordResetToken}`;
    sendPasswordResetEmail(email, passwordResetLink);

    return res.status(200).json({ message: "Password reset email sent" });
  } catch (err) {
    next(err);
  }
};

exports.resetPassword = async (req, res, next) => {
  const { newPassword, confirmPassword } = req.body;
  const token = req.params.token;

  try {
    if (!newPassword || !confirmPassword) {
      throw new RequestError("Missing required information");
    }

    if (newPassword !== confirmPassword) {
      throw new RequestError("Passwords do not match");
    }

    let user = await User.findOne({
      where: { passwordResetToken: token },
      raw: true,
    });
    if (!user) {
      throw new NotFoundError("This link is invalid or expired");
    }

    const hashedPassword = await bcryptjs.hash(
      newPassword,
      parseInt(process.env.BCRYPT_SALT_ROUNDS)
    );
    await User.update(
      { password: hashedPassword, passwordResetToken: null },
      { where: { passwordResetToken: token } }
    );

    return res.status(200).json({ message: "Password reset successful" });
  } catch (err) {
    next(err);
  }
};
