const errorHandler = (err, req, res, next) => {
  let message = { message: err.message, error: err };

  if (err.name === "SequelizeDatabaseError") {
    message = { message: `Sequelize error: ${err.message}` };
  }

  return res.status(err.statusCode || 500).json(message);
};

module.exports = errorHandler;
