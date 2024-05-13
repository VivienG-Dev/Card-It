const { AuthorizationError } = require("../helpers/errors/customError");

const validateUsername = (req, res, next) => {
  const tokenUsername = req.username.toLowerCase();
  const paramUsername = req.params.username.toLowerCase();

  if (tokenUsername !== paramUsername) {
    throw new AuthorizationError("You are not authorized to access this resource");
  }

  next();
};

module.exports = validateUsername;
