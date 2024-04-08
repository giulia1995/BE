const jwt = require("jsonwebtoken");

// Middleware function to verify JWT token from request headers
module.exports = function (req, res, next) {
  try {
    const token = req.headers["authorization"];

    // Check if token exists in request headers
    if (!token) {
      return res.status(401).send({
        message: "Your token is not valid",
        statusCode: 401,
      });
    }

    const verified = jwt.verify(token, process.env.SECRET_KEY);

    // If token is verified, attach the decoded user information to the request object
    req.user = verified;

    next();
  } catch (e) {
    res.status(403).send({
      statusCode: 403,
      message: "Your token is not valid or expired!",
    });
  }
};
