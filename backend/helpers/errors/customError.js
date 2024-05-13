class MainError extends Error {
  constructor(errorMessage, errorType = "") {
    super();

    this.name = this.constructor.name;
    this.message = errorMessage;

    switch (this.constructor.name) {
      case "RequestError":
        this.statusCode = 400;
        this.name = "Request Error";
        this.type = "request";
        break;
      case "DatabaseError":
        this.statusCode = 500;
        this.name = "Database Error";
        this.type = "database";
        break;
      case "AuthenticationError":
        this.statusCode = 401;
        this.name = "Authentication Error";
        this.type = "authentication";
        break;
      case "AuthorizationError":
        this.statusCode = 403;
        this.name = "Authorization Error";
        this.type = "authorization";
        break;
      case "NotFoundError":
        this.statusCode = 404;
        this.name = "Not Found Error";
        this.type = "notFound";
        break;
      case "UserError":
        this.statusCode = 400;
        this.name = "User Error";
        this.type = "user";
        break;
      case "ValidationError":
        this.statusCode = 400;
        this.name = "Validation Error";
        this.type = "validation";
        break;
      default:
        this.statusCode = 500;
        this.name = "Server Error";
        this.type = "server";
        break;
    }
  }
}

class RequestError extends MainError {}
class DatabaseError extends MainError {}
class AuthenticationError extends MainError {}
class AuthorizationError extends MainError {}
class NotFoundError extends MainError {}
class UserError extends MainError {}
class ValidationError extends MainError {}

module.exports = {
  MainError,
  RequestError,
  DatabaseError,
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
  UserError,
  ValidationError,
};
