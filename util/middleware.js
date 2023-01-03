const errorHandler = (error, req, res, next) => {
  console.log("error.name:", error.name);
  console.log(error);
  if (
    error.name === "SequelizeValidationError" ||
    error.name === "SequelizeDatabaseError"
  ) {
    return res.status(400).json({ error: error.message });
  }

  next(error);
};

module.exports = {
  errorHandler,
};
