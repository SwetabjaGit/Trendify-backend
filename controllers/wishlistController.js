const Wishlist = require("../models/wishlistModel");



exports.addToWishlist = async (req, res, next) => {
  try {
    const wishlistSchema = await Wishlist.findOne({ userId: req.userId });
    const wishlistDetails = req.body;

    if(!wishlistSchema){
      const wishlistObj = {
        userId: req.userId,
        wishlist: [wishlistDetails]
      }
      const wishlistItem = await new Wishlist(wishlistObj).save();
      console.log("Wishlist item added");
      return res.status(200).send({
        success: true,
        message: `WishlistItem Added Successfully, WishlistId: ${wishlistItem._id}`
      });
    }

    const itemExists = wishlistSchema.wishlist.some((item) => {
      return item.productId.toString() === wishlistDetails.productId
    });
    if(itemExists){
      console.log("WishlistItem Already Exists");
      return res.status(400).send({
        success: false,
        message: "WishlistItem Already Exists" 
      });
    }

    wishlistSchema.wishlist.push(req.body);
    await wishlistSchema.save();
    console.log("WishlistItem Added");

    res.status(200).send({
      success: true,
      message: `WishlistItem Added Successfully, WishlistId: ${wishlistSchema._id}`
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: error.message });
  }
};

exports.removeFromWishlist = async (req, res, next) => {
  try {
    const wishlistSchema = await Wishlist.findOne({ userId: req.userId });
    const productId = req.body.productId;

    if(!wishlistSchema){
      console.log("Wishlist Not Found");
      return res.status(400).send({ success: false, message: "Wishlist Not Found" });
    }

    const itemExists = wishlistSchema.wishlist.some((item) => {
      return item.productId.toString() === productId
    });
    if(!itemExists){
      console.log("WishlistItem Not Found");
      return res.status(400).send({ success: false, message: "WishlistItem Not Found" });
    }

    wishlistSchema.wishlist = wishlistSchema.wishlist.filter(
      (item) => item.productId.toString() !== productId
    );
    await wishlistSchema.save();
    console.log("WishlistItem Removed");

    if(wishlistSchema.wishlist.length === 0){
      await Wishlist.findOneAndDelete({ userId: req.userId });
    }

    res.status(200).send({
      success: true,
      message: `WishlistItem Removed Successfully, WishlistId: ${wishlistSchema._id}`
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: error.message });
  }
};

exports.getWishlistItems = async (req, res, next) => {
  try {
    const wishlistSchema = await Wishlist.findOne({ userId: req.userId });

    if(!wishlistSchema){
      return res.status(400).send({ message: "Wishlist Not Found" });
    }

    res.status(200).send(wishlistSchema);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: error.message });
  }
};