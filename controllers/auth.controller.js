const User = require("../models/user");
const ErrorResponse = require("../utils/errorResponse");

// exports.signup = async (req, res, next) => {
//   try {
//     const { email } = req.body;
//     const userExist = await User.findOne({ email });
//     if (userExist) {
//       //return next(new ErrorResponse("E-mail already exists", 400));
//       //res.send("E-mail already exists");
//       return res.status(400).json({
//         message: "E-mail already exists",
//       });
//     } else {
//       const user = await User.create(req.body);
//       res.status(201).json({
//         success: true,
//         user,
//       });
//     }
//   } catch (err) {
//     console.log(err);
//     // res.send(
//     //   "Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number and a special characters"
//     // );
//     return res.status(500).json({
//       message:
//         "Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number and a special characters",
//     });
//   }
// };

// exports.signup = async (req, res, next) => {
//   try {
//     const { email, name, password } = req.body;
//     if (email === "" || name === "" || password === "") {
//       // return res.status(401).json({
//       //   message: "Require All Field",
//       // });
//       return res.status(401).send("Require All Field");
//     } else {
//       const userExist = await User.findOne({ email });
//       if (userExist) {
//         return next(new ErrorResponse("E-mail already exists", 400));
//         //return res.status(400).send("E-mail already exists");
//         // return res.status(400).json({
//         //   message: "E-mail already exists",
//         // });
//       } else {
//         const user = await User.create(req.body);
//         return res.status(201).json({
//           success: true,
//           user,
//         });
//       }
//     }
//   } catch (err) {
//     console.log(err);
//     // res.send(
//     //   "Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number and a special characters"
//     // );
//     return res.status(500).json({
//       message:
//         "Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number and a special characters",
//     });
//   }
// };

exports.signup = async (req, res, next) => {
  try {
    const { email, name, password } = req.body;
    if (email === "" || name === "" || password === "") {
      return res.status(401).send("Require All Field");
    }
    //
    const userExist = await User.findOne({ email });
    if (userExist) {
      return res.status(400).send("E-mail already exists");
    } else {
      const user = await User.create(req.body);
      return res.status(201).json({
        success: true,
        user,
      });
    }
  } catch (err) {
    console.log(err);
    // return res.status(500).json({
    //   message:
    //     "Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number and a special characters",
    // });
    return res
      .status(500)
      .send(
        "Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number and a special characters"
      );
  }
};

exports.signin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      //return next(new ErrorResponse("E-mail and password are required", 400));
      res.send("E-mail and password are required");
    } else {
      // check user e-mail
      const user = await User.findOne({ email });
      if (!user) {
        //return next(new ErrorResponse("your email Invalid credentials", 400));
        //res.send("your email Invalid credentials");
        return res
          .status(400)
          .json({ message: "your email Invalid credentials" });
      }

      // verify user password
      const isMatched = await user.comparePassword(password);
      if (!isMatched) {
        // return next(
        //   new ErrorResponse("your password Invalid credentials", 400)
        // );
        return res
          .status(400)
          .json({ message: "your password Invalid credentials" });
      }

      generateToken(user, 200, res);
    }
  } catch (error) {
    console.log(error);

    next(new ErrorResponse("Cannot log in, check your credentials", 400));
  }
};

const generateToken = async (user, statusCode, res) => {
  const token = await user.jwtGenerateToken();

  const options = {
    httpOnly: true,
    // expires: new Date(Date.now() + process.env.EXPIRE_TOKEN),
    //expires: process.env.EXPIRE_TOKEN,
    expiresIn: "1d",
  };

  res
    .status(statusCode)
    // .cookie("token", token, options)
    .cookie("token", token, options)
    // .json({ success: true, token });
    .json({ success: true, token, user });
};

//LOG OUT USER
exports.logout = (req, res, next) => {
  res.clearCookie("token");
  res.status(200).json({
    success: true,
    message: "Logged out",
  });
};

// USESR PROFILE
exports.userProfile = async (req, res, next) => {
  const user = await User.findById(req.user.id);
  //const user = await User.find({ email: req.user.email });
  console.log("user id ---> ", user);
  res.status(200).json({
    sucess: true,
    user,
  });
};

exports.allUserProfile = async (req, res, next) => {
  const user = await User.find();
  //const user = await User.find({ email: req.user.email });
  console.log("user id ---> ", user);
  res.status(200).json({
    user,
  });
};

exports.singleUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    res.status(200).json({
      sucess: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};

exports.public = async (req, res, next) => {
  res.status(200).send("PUBLIC");
};
