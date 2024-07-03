const { body } = require("express-validator");

const validations = {
  auth: {
    register: [
      body("username")
        .trim()
        .notEmpty()
        .withMessage("Username is required")
        .isLength({ min: 4 })
        .withMessage("Username must be at least 4 characters long")
        .matches(/^[a-zA-Z0-9_]+$/)
        .withMessage("Username can only contain letters, numbers, and underscores"),
      body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Invalid email address")
        .customSanitizer((value) => value.toLowerCase()),
      body("password")
        .notEmpty()
        .withMessage("Password is required")
        .isLength({ min: 8 })
        .withMessage("Password must be at least 8 characters long")
        .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/)
        .withMessage(
          "Password must include one lowercase character, one uppercase character, a number, and a special characterèèèèèè"
        ),
    ],
    signIn: [
      body("email")
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Invalid email address")
        .customSanitizer((value) => value.toLowerCase()),
      body("password").notEmpty().withMessage("Password is required"),
    ],
  },
  user: {
    updateProfile: [
      body("username")
        .optional()
        .trim()
        .isLength({ min: 3 })
        .withMessage("Username must be at least 3 characters long")
        .matches(/^[a-zA-Z0-9_]+$/)
        .withMessage("Username can only contain letters, numbers, and underscores"),
      body("password")
        .optional()
        .isLength({ min: 8 })
        .withMessage("Password must be at least 8 characters long")
        .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/, "i")
        .withMessage(
          "Password must include one lowercase character, one uppercase character, a number, and a special character"
        ),
    ],
  },
  deck: {
    create: [
      body("title")
        .trim()
        .notEmpty()
        .withMessage("Deck title is required")
        .isLength({ min: 1, max: 30 })
        .withMessage("Deck title must be between 1 and 30 characters")
        .matches(/^[a-zA-Z0-9\s\-_]+$/)
        .withMessage("Deck title can only contain alphanumeric characters, spaces, hyphens, and underscores")
        .escape(), // Convert characters like <, >, &, ', " and / to their respective HTML entities (XSS attack)
      body("color")
        .trim()
        .notEmpty()
        .withMessage("Color is required")
        .matches(/^#[0-9A-Fa-f]{6}$/)
        .withMessage("Color must be in hex format (e.g., #141A1F)"),
    ],
    update: [
      body("title")
        .trim()
        .notEmpty()
        .withMessage("Deck title is required")
        .isLength({ min: 1, max: 30 })
        .withMessage("Deck title must be between 1 and 30 characters")
        .matches(/^[a-zA-Z0-9\s\-_]+$/)
        .withMessage("Deck title can only contain alphanumeric characters, spaces, hyphens, and underscores")
        .escape(), // Convert characters like <, >, &, ', " and / to their respective HTML entities (XSS attack)
      body("color")
        .trim()
        .optional()
        .matches(/^#[0-9A-Fa-f]{6}$/)
        .withMessage("Color must be in hex format (e.g., #141A1F)"),
    ],
    acceptSharedDeck: [
      body("token")
        .trim()
        .notEmpty()
        .withMessage("Share token is required")
        .isUUID(4)
        .withMessage("Invalid share token format"),
    ],
  },
  card: {
    create: [
      body("title")
        .trim()
        .notEmpty()
        .withMessage("Front side content is required")
        .isLength({ min: 1, max: 30 })
        .withMessage("Front side content must be between 1 and 30 characters")
        .escape(),
      body("description")
        .trim()
        .notEmpty()
        .withMessage("Back side content is required")
        .isLength({ min: 1, max: 160 })
        .withMessage("Back side content must be between 1 and 160 characters")
        .escape(),
    ],
    update: [
      body("title")
        .trim()
        .notEmpty()
        .withMessage("Front side content is required")
        .isLength({ min: 1, max: 30 })
        .withMessage("Front side content must be between 1 and 30 characters")
        .escape(),
      body("description")
        .trim()
        .notEmpty()
        .withMessage("Back side content is required")
        .isLength({ min: 1, max: 160 })
        .withMessage("Back side content must be between 1 and 160 characters")
        .escape(),
    ],
  },
  forgotPassword: {
    sendEmail: [
      body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Invalid email address")
        .normalizeEmail(),
    ],
    resetPassword: [
      body("newPassword")
        .trim()
        .notEmpty()
        .withMessage("Password is required")
        .isLength({ min: 8 })
        .withMessage("Password must be at least 8 characters long")
        .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/, "i")
        .withMessage(
          "Password must include one lowercase character, one uppercase character, a number, and a special character"
        ),
      body("confirmPassword")
        .trim()
        .notEmpty()
        .withMessage("Confirm password is required")
        .isLength({ min: 8 })
        .withMessage("Confirm password must be at least 8 characters long")
        .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/, "i")
        .withMessage(
          "Confirm password must include one lowercase character, one uppercase character, a number, and a special character"
        ),
    ],
  },
};

module.exports = validations;
