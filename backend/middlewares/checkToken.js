const jwt = require("jsonwebtoken");

const { AuthenticationError } = require("../helpers/errors/customError");

const checkTokenMiddleware = (req, res, next) => {
  let token = req.cookies.authToken;
  let refreshToken = req.cookies.refreshToken;

  if (!token && !refreshToken) {
    throw new AuthenticationError("User not logged in");
  }

  // Check for token in Authorization header if not found in cookies
  if (!token && req.headers.authorization) {
    const authHeader = req.headers.authorization;
    const bearerToken = authHeader.split(" ");
    if (bearerToken[0] === "Bearer") {
      token = bearerToken[1];
    }
  }

  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
      if (err || !decodedToken.id) {
        throw new AuthenticationError("Invalid token");
      } else {
        req.userId = decodedToken.id;
        req.username = decodedToken.username;
        req.email = decodedToken.email;
        req.emailVerified = decodedToken.emailVerified;

        next();
      }
    });
  } else {
    verifyRefreshToken(refreshToken, req, res, next);
  }
};

function verifyRefreshToken(refreshToken, req, res, next) {
  if (refreshToken) {
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decodedRefreshToken) => {
      if (err || !decodedRefreshToken.id) {
        throw new AuthenticationError("Invalid refresh token");
      }

      const token = jwt.sign(
        {
          id: decodedRefreshToken.id,
          username: decodedRefreshToken.username,
          email: decodedRefreshToken.email,
          emailVerified: decodedRefreshToken.emailVerified,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: process.env.JWT_EXPIRES_IN,
        }
      );

      res.cookie("authToken", token, {
        httpOnly: true,
        secure: true,
        sameSite: "None",
        maxAge: 30 * 60 * 1000,
      });

      req.userId = decodedRefreshToken.id;
      req.username = decodedRefreshToken.username;
      req.email = decodedRefreshToken.email;
      req.emailVerified = decodedRefreshToken.emailVerified;

      next();
    });
  } else {
    throw new AuthenticationError("No token provided");
  }
}

module.exports = checkTokenMiddleware;
