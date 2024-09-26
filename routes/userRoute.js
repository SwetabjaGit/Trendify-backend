const express = require("express");
const { 
  registerUser, 
  loginUser,
  getUserDetails,
  updateUserProfile,
  getUserAddresses,
  createNewUserAddress,
  updateUserAddress,
  deleteUserAddress
} = require("../controllers/userController");
const { isAuthenticatedUser } = require("../middlewares/auth");

const router = express.Router();



router.post("/register", registerUser);

router.post("/login", loginUser);

router.get("/userdetails", isAuthenticatedUser, getUserDetails);

router.put("/profile/update", isAuthenticatedUser, updateUserProfile);

router.get("/user/address/get", isAuthenticatedUser, getUserAddresses);

router.post("/user/address/add", isAuthenticatedUser, createNewUserAddress);

router.put("/user/address/edit/:id", isAuthenticatedUser, updateUserAddress);

router.delete("/user/address/delete/:id", isAuthenticatedUser, deleteUserAddress);


module.exports = router;