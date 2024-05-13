const router = require("express").Router();

const userController = require("../controllers/user");

const validateUsernameMiddleware = require("../middlewares/validateUsername");

router.get("/", userController.getAllUsers); // ROUTE TO DELETE

router.get("/:username", validateUsernameMiddleware, userController.getUserById);

router.get("/:username/favorites", validateUsernameMiddleware, userController.getAllFavoriteCards);

router.patch("/:username", validateUsernameMiddleware, userController.updateUserData);

router.delete("/:username/trash", validateUsernameMiddleware, userController.addUserInBin);

router.post("/:username/untrash", userController.restoreUserFromBin);

router.delete("/:username/delete", validateUsernameMiddleware, userController.deleteUserPermanently);

module.exports = router;
