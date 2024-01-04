const mongoose = require("mongoose");
const User = require("../models/User");

const authenticate = async (res, req, next) => {
  const { sessionid } = req.headers;
  if (!sessionid || !mongoose.isValidObjectId(sessionid)) return next();
  const user = await User.findOne({ "session._id": sessionid });
  if (!user) return next();
  req.user = user;
  return next();
};

module.exports = { authenticate };
