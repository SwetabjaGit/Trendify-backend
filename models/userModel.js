const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please Enter Your Name"],
    maxLength: [30, "Name cannot exceed 30 characters"],
    minLength: [4, "Name should have more than 4 characters"],
  },
  email: {
    type: String,
    required: [true, "Please Enter Your Email"],
    unique: true,
    //validate: [validator.isEmail, "Please Enter a valid Email"],
  },
  password: {
    type: String,
    required: [true, "Please Enter Your Password"],
    minLength: [8, "Password should be greater than 8 characters"],
    select: false
  },
  imageUrl: {
    type: String,
    required: false
  },
  mobileNo: {
    type: String,
    required: false,
  },
  gender: {
    type: String,
    required: false,
    enum: ["Male", "Female"]
  },
  dateOfBirth: {
    type: Date,
    required: false,
  },
  alternateMobile: {
    type: String,
    required: false,
  },
  location: {
    type: String,
    required: false,
  },
  activated: { 
    type: Boolean, 
    default: false 
  },
  address: [
    {
      contactName: {
        type: String,
        required: true
      },
      phoneNo: {
        type: String,
        required: true
      },
      pinCode: {
        type: Number,
        required: true
      },
      addressLine: {
        type: String,
        required: true
      },
      locality: {
        type: String,
        required: true
      },
      city: {
        type: String,
        required: true
      },
      state: {
        type: String,
        required: true
      },
      type: {
        type: String,
        required: false,
        enum: ["Home", "Office"],
        default: "Home"
      },
      default: {
        type: Boolean,
        required: true
      }
    }
  ],
  payment: {
    cardNumber: String,
    cardName: String,
    expiry: {
      month: Number,
      year: Number
    },
    cardCvv: Number
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },

  resetPasswordToken: String,
  resetPasswordExpire: Date,
});


userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    { _id: this._id }, 
    process.env.JWTPRIVATEKEY, 
    {
      expiresIn: "7d",
    }
  );
  return token;
};



module.exports = mongoose.model("User", userSchema);
