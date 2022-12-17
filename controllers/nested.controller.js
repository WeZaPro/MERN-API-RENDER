exports.loopData = async (req, res, next) => {
    const user = await User.findById(req.user.id);
    //const user = await User.find({ email: req.user.email });
    console.log("user id ---> ", user);
    res.status(200).json({
      sucess: true,
      user,
    });
  };