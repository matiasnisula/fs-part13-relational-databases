const jwt = require("jsonwebtoken");
const { User, Session } = require("../models");
const { SECRET } = require("./config");

const errorHandler = (error, req, res, next) => {
  console.log("error.name:", error.name);
  console.log(error);
  if (
    error.name === "SequelizeValidationError" ||
    error.name === "SequelizeDatabaseError"
  ) {
    return res.status(400).json({ error: error.message });
  } else if (error.name === "JsonWebTokenError") {
    return res.status(401).json({ error: error.message });
  }

  next(error);
};

const tokenExtractor = (req, res, next) => {
  const auth = req.get("authorization");

  if (auth && auth.toLowerCase().startsWith("bearer ")) {
    req.token = auth.substring(7);
  }
  next();
};

const userExtractor = async (req, res, next) => {
  const token = req.token;
  const decodedToken = jwt.verify(token, SECRET);

  if (!token || !decodedToken.id) {
    return res.status(401).json({
      error: "token missing or invalid",
    });
  }

  const user = await User.findByPk(decodedToken.id);
  if (!user) {
    return res.status(400).json({
      error: "User doesnt exists",
    });
  }
  const result = await Session.findOne({
    where: {
      userId: user.id,
      token: token,
    },
  });
  console.log("resultSessions:", JSON.stringify(result, null, 2));
  if (!result) {
    return res
      .status(401)
      .json({ error: "Session has expired. Please login again." });
  }

  req.user = user;
  next();
};

module.exports = {
  errorHandler,
  tokenExtractor,
  userExtractor,
};
