const { clearHash } = require("../services/cash");

module.exports = async (req, res, next) => {
  await next();

  clearHash(req.user._id);
};
