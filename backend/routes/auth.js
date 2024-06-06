const router = require("express").Router();
const checkTokenMiddleware = require("../middlewares/checkToken");
const authController = require("../controllers/auth");
const rateLimit = require("express-rate-limit");

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests
  message: "Too many login attempts, please try again later",
});

router.put("/register", authLimiter, authController.register);

router.get("/verify/:token", authController.verifyEmail);

router.post(
  "/forgot-password",
  authLimiter,
  authController.sendEmailToResetPassword
);

router.patch("/forgot-password/:token", authController.resetPassword);

router.post("/sign-in", authLimiter, authController.signIn);

router.post("/logout", authController.logout);

router.get("/check", checkTokenMiddleware, authController.checkToken);

router.post("/refresh", authController.refreshToken);

router.post("/demo-sign-in", authController.demoSignIn);

module.exports = router;
