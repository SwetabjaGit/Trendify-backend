const express = require("express");
const { 
  registerUser, 
  loginUser,
  getUserDetails
} = require("../controllers/userController");
const { isAuthenticatedUser } = require("../middlewares/auth");

const router = express.Router();



router.post("/register", registerUser);

router.post("/login", loginUser);

router.get("/userdetails", isAuthenticatedUser, getUserDetails);


module.exports = router;