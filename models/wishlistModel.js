const mongoose = require("mongoose");

const wishlistSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true
  },
  wishlist: [
    {
      productId: {
        type: mongoose.Schema.ObjectId,
        ref: "Product",
        required: true
      },
      name: {
        type: String,
        required: true
      },
      category: {
        type: String,
        required: true
      },
      company: {
        type: String,
        required: true,
      },
      image:{
        type: String,
        required: true,
      },
      original_price: {
        type: Number,
        required: true
      },
      current_price: {
        type: Number,
        required: true
      },
      discount_percentage: {
        type: Number,
        required: true
      }
    }
  ]
});

module.exports = mongoose.model("Wishlist", wishlistSchema);