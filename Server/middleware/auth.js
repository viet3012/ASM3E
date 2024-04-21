const User = require("../models/User");
exports.Auth = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(403).json("You are not authenticated!");
    }
    const role = user.role;
    if (role !== "admin") {
      return res.status(401).json("You are not admin!");
    }
    next();
  } catch (err) {
    next(err);
  }
};
