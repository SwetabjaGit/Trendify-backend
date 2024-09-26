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


exports.getUserDetails = async (req, res, next) => {
  try {
    const userData = await User.findOne({ _id: req.userId });
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


exports.updateUserProfile = async (req, res, next) => {
  try {
    const newUserData = req.body;
    console.log(newUserData);

    const userData = await User.findByIdAndUpdate(req.userId, newUserData);
    if (!userData) {
      return res.status(400).send({ message: "User not found" });
    }

    res.status(200).send({ 
      message: "Profile Updated Successfully", 
      user: userData
    });
  } catch(error) {
    console.log(error);
    res.status(500).send({ message: error.message });
  }
};


exports.getUserAddresses = async (req, res, next) => {
  try {
    const userData = await User.findOne({ _id: req.userId });
    if (!userData) {
      return res.status(400).send({ success: false, message: "User not found" });
    }

    const address = userData.address;
    res.status(200).send({
      success: true,
      message: "Address Fetched Successfully", 
      address
    });
  } catch(error) {
    res.status(500).send({ success: false, message: error.message });
  }
};


exports.createNewUserAddress = async (req, res, next) => {
  try {
    const userData = await User.findOne({ _id: req.userId });
    if (!userData) {
      return res.status(400).send({ success: false, message: "User not found" });
    }

    const addressObj = {
      ...req.body,
      default: false
    }
    userData.address.push(addressObj);
    const newUserData = await userData.save();
    const numAddress = newUserData.address.length;

    res.status(200).send({
      success: true,
      message: "Address Inserted Successfully",
      address: newUserData.address[numAddress-1],
    });
  } catch(error) {
    console.log(error);
    res.status(500).send({ success: false, message: error.message });
  }
};


exports.updateUserAddress = async (req, res, next) => {
  try {
    const addressId = req.params.id;
    const userData = await User.findOne({
      _id: req.userId,
      address: {
        $elemMatch: { _id: addressId }
      }
    });
    if (!userData) {
      return res.status(400).send({ success: false, message: "Address not found" });
    }

    await User.updateOne(
      { _id: req.userId, 'address._id': addressId },
      { $set: {
          'address.$.contactName': req.body.contactName,
          'address.$.phoneNo': req.body.phoneNo,
          'address.$.pinCode': req.body.pinCode,
          'address.$.addressLine': req.body.addressLine,
          'address.$.locality': req.body.locality,
          'address.$.city': req.body.city,
          'address.$.state': req.body.state,
        }
      }
    );

    const addressData = await User.findOne(
      { _id: req.userId },
      { address: {
          $elemMatch: { _id: addressId }
        }
      }
    );
    console.log('UpdatedAddress: ', addressData.address[0]);
    res.status(200).send({ 
      success: true,
      message: "Address Updated Successfully",
      address: addressData.address[0]
    });
  } catch(error) {
    console.log(error);
    res.status(500).send({ success: false, message: error.message });
  }
};


exports.deleteUserAddress = async (req, res, next) => {
  try {
    const userData = await User.findOne({ _id: req.userId });
    if (!userData) {
      return res.status(400).send({ success: false, message: "User not found" });
    }

    const addressId = req.params.id;
    userData.address = userData.address.filter((address) => {
      return address._id.toString() !== addressId
    });
    await userData.save();

    res.status(200).send({ 
      success: true,
      message: "Address Deleted Successfully",
      addressId
    });
  } catch(error) {
    console.log(error);
    res.status(500).send({ success: false, message: error.message });
  }
};
