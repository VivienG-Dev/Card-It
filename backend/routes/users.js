const router = require("express").Router();

const userController = require("../controllers/user");

const validateUsernameMiddleware = require("../middlewares/validateUsername");
const validations = require("../middlewares/validation");
const handleValidationErrors = require("../helpers/errors/validationErrorHandler");

router.get("/:username", validateUsernameMiddleware, userController.getUserById);

router.get("/:username/favorites", validateUsernameMiddleware, userController.getFavoriteCards);

router.patch(
  "/:username",
  validateUsernameMiddleware,
  validations.user.updateProfile,
  handleValidationErrors,
  userController.updateUserData
);

router.delete("/:username/trash", validateUsernameMiddleware, userController.addUserInBin);

router.post("/:username/untrash", userController.restoreUserFromBin);

router.delete("/:username/delete", validateUsernameMiddleware, userController.deleteUserPermanently);

module.exports = router;
