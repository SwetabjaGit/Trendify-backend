const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const { validateRegister, validateLogin } = require("../utils/validateBody");



exports.registerUser = async (req, res, next) => {
  try {
    const { error } = validateRegister(req.body);

    if (error)
      return res.status(400).send({ message: error.details[0].message });

    let user = await User.findOne({ email: req.body.email });
    if (user){
      return res.status(409).send({ message: "User with given email already Exist!" });
    }

    const salt = await bcrypt.genSalt(Number(process.env.SALT));
    const hashPassword = await bcrypt.hash(req.body.password, salt);

    user = await new User({ 
      ...req.body, 
      password: hashPassword
    }).save();

    /* const token = await new Token({
      userId: user._id,
      token: jwt.sign({ data: 'Token Data'}, 'Temp_Token', { expiresIn: '1h' }),
    }).save();
    const url = `${process.env.BASE_URL}users/${user.id}/verify/${token.token}`;
    await sendEmail(user.email, "Activate your account", url); */

    res
      .status(201)
      .send({
        userId: user._id,
        message: "An Email sent to your account please verify" 
      });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: error.message });
  }
};


exports.loginUser = async (req, res, next) => {
  try {
    const { error } = validateLogin(req.body);

    if(error) {
      return res.status(400).send({ message: error.details[0].message });
    }
    
    const user = await User.findOne({ email: req.body.email }).select("+password");
    if(!user) {
      return res.status(401).send({ message: "Invalid Email or Password" });
    }

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if(!validPassword) {
      return res.status(401).send({ message: "Invalid Email or Password" });
    }

    /* if (!user.activated) {
      let token = await Token.findOne({ userId: user._id });
      if (!token) {
        token = await new Token({
          userId: user._id,
          token: jwt.sign({ data: 'Token Data'}, 'Temp_Token', { expiresIn: '10m' }),
        }).save();
        
        const url = `${process.env.BASE_URL}users/${user.id}/verify/${token.token}`;
        await sendEmail(user.email, "Activate your account", url);
      }

      return res
        .status(400)
        .send({ message: "An Email sent to your account please verify" });
    } */

    const token = user.generateAuthToken();
    res.status(200).send({ token: token, message: "logged in successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: error.message });
  }
};


exports.getUserDetails = async (req, res) => {
  try {
    const userData = await User.findOne({ _id: req.userId });
    console.log(userData);
    if (!userData) {
      return res.status(400).send({ message: "User not found" });
    }
    res.status(200).send({ 
      message: "User Retrieved Successfully", 
      user: userData
    });
  } catch(error) {
    res.status(500).send({ message: error.message });
  }
};
