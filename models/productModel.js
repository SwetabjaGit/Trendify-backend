const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please Enter product Name"],
  },
  category: {
    type: String,
    required: [true, "Please Enter Product Category"],
  },
  company: {
    type: String,
    required: [true, "Please Enter Product Company"],
  },
  description: {
    type: String,
    required: [true, "Please Enter product Description"],
  },
  image:{
    type: String,
    required: true,
  },
  original_price: {
    type: Number,
    required: [true, "Please Enter original Price"],
    maxLength: [8, "Price cannot exceed 8 characters"],
  },
  current_price: {
    type: Number,
    required: [true, "Please Enter current Price"],
    maxLength: [8, "Price cannot exceed 8 characters"],
  },
  discount_percentage: {
    type: Number,
    required: true
  },
  stock: {
    type: Number,
    required: [true, "Please Enter product Stock"],
    maxLength: [4, "Stock cannot exceed 4 characters"],
    default: 1,
  },
  rating: {
    stars: {
      type: Number,
      required: true
    },
    count: {
      type: Number,
      required: true
    }
  },
  reviews: [
    {
      userId: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
      },
      userName: {
        type: String,
        required: true,
      },
      rating: {
        type: Number,
        required: true,
      },
      title: {
        type: String,
        required: true,
      },
      comment: {
        type: String,
        required: true,
      },
      verified_purchase: {
        type: Boolean,
        default: false
      },
      date: {
        type: Date,
        default: Date.now
      }
    },
  ],
  return_period: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Product", productSchema);
