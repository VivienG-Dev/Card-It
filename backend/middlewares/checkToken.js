const jwt = require("jsonwebtoken");

const { AuthenticationError } = require("../helpers/errors/customError");

const checkTokenMiddleware = (req, res, next) => {
  let token = req.cookies.authToken;

  // Check for token in Authorization header if not found in cookies
  if (!token && req.headers.authorization) {
    const authHeader = req.headers.authorization;
    const bearerToken = authHeader.split(" ");
    if (bearerToken[0] === "Bearer") {
      token = bearerToken[1];
    }
  }

  if (!token) {
    throw new AuthenticationError("No token provided");
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
    if (err) {
      throw new AuthenticationError("Invalid token");
    }

    if (!decodedToken.id) {
      throw new AuthenticationError("Invalid token - ID not found");
    }

    req.userId = decodedToken.id;
    req.username = decodedToken.username;
    req.email = decodedToken.email;
    req.emailVerified = decodedToken.emailVerified;

    next();
  });
};

module.exports = checkTokenMiddleware;
