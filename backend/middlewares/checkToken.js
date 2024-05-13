const jwt = require("jsonwebtoken");

const { AuthenticationError } = require("../helpers/errors/customError");

const checkTokenMiddleware = (req, res, next) => {
  const token = req.cookies.authToken;

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
