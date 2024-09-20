const express = require("express");
const {
  addToCart,
  removeFromCart,
  getCartDetails,
  incrementCartItemQuantity,
  decrementCartItemQuantity
} = require("../controllers/cartController");
const { isAuthenticatedUser } = require("../middlewares/auth");

const router = express.Router();


router.post("/cart/add", isAuthenticatedUser, addToCart);

router.post("/cart/remove",isAuthenticatedUser, removeFromCart);

router.get("/cart/get", isAuthenticatedUser, getCartDetails);

router.post("/cart/increment", isAuthenticatedUser, incrementCartItemQuantity);

router.post("/cart/decrement", isAuthenticatedUser, decrementCartItemQuantity);


module.exports = router;