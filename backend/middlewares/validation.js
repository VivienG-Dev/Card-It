const { body } = require("express-validator");

const validations = {
  auth: {
    register: [
      body("username")
        .trim()
        .notEmpty()
        .withMessage("Username is required")
        .isLength({ min: 3 })
        .withMessage("Username must be at least 3 characters long")
        .matches(/^[a-zA-Z0-9_]+$/)
        .withMessage("Username can only contain letters, numbers, and underscores"),
      body("email").trim().notEmpty().withMessage("Email is required").isEmail().withMessage("Invalid email address"),
      body("password")
        .notEmpty()
        .withMessage("Password is required")
        .isLength({ min: 8 })
        .withMessage("Password must be at least 8 characters long")
        .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/, "i")
        .withMessage(
          "Password must include one lowercase character, one uppercase character, a number, and a special character"
        ),
    ],
    login: [
      body("email").trim().notEmpty().withMessage("Email is required").isEmail().withMessage("Invalid email address"),
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
      body("email").optional().trim().isEmail().withMessage("Invalid email address"),
    ],
  },
  deck: {
    create: [
      body("name")
        .trim()
        .notEmpty()
        .withMessage("Deck name is required")
        .isLength({ max: 100 })
        .withMessage("Deck name must not exceed 100 characters"),
      body("description")
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage("Description must not exceed 500 characters"),
    ],
    // Add more deck-related validations as needed
  },
  card: {
    create: [
      body("front").trim().notEmpty().withMessage("Front side content is required"),
      body("back").trim().notEmpty().withMessage("Back side content is required"),
      body("deckId").isInt().withMessage("Valid deck ID is required"),
    ],
    // Add more card-related validations as needed
  },
};

module.exports = validations;
