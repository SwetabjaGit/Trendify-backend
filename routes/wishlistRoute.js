const express = require("express");
const {
  addToWishlist,
  removeFromWishlist,
  getWishlistItems
} = require("../controllers/wishlistController");
const { isAuthenticatedUser } = require("../middlewares/auth");

const router = express.Router();



router.post("/wishlist/add", isAuthenticatedUser, addToWishlist);

router.post("/wishlist/remove",isAuthenticatedUser, removeFromWishlist);

router.get("/wishlist/get", isAuthenticatedUser, getWishlistItems);



module.exports = router;