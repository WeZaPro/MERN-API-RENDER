const jwt = require("jsonwebtoken");
const User = require("../models/user");
const ErrorResponse = require("../utils/errorResponse");

// check if user is authenticated
exports.isAuthenticated = async (req, res, next) => {
  const { token } = req.cookies;

  // make sure token exists
  if (!token) {
    return next(
      new ErrorResponse("You must log in to access this ressource", 401)
    );
  }

  try {
    //verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);
    next();
  } catch (error) {
    return next(
      new ErrorResponse("You must log in to access this ressource", 401)
    );
  }
};

// admin middleware
// exports.isAdmin = (req, res, next) =>{
//     if (req.user.role === 0){
//         return next (new ErrorResponse('Access denied, you must be an admin', 401));
//     }
//     next();

// }

exports.isAdmin = (req, res, next) => {
  console.log("role---> ", req.user.role);
  if (req.user.role === 0 || req.user.role === 1) {
    next();
  } else {
    res.send("require Admin role");
  }
};

exports.isEditor = (req, res, next) => {
  console.log("role---> ", req.user.role);
  if (req.user.role === 1) {
    next();
  } else {
    res.send("require Admin Or Editor role");
  }
};
