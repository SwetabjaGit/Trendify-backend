const mongoose = require("mongoose");


const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true
  },
  address: {
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
    }
  },
  orderItems: [
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
      company: {
        type: String,
        required: true,
      },
      image:{
        type: String,
        required: true,
      },
      current_price: {
        type: Number,
        required: true
      },
      quantity: {
        type: Number,
        required: true
      }
    }
  ],
  paymentInfo: {
    mode: {
      type: String,
      required: true,
      trim: true,
      enum: ["COD", "UPI", "Card", "NetBanking"],
    },
    status: {
      type: String,
      enum: ["Paid", "Unpaid"],
      required: true
    },
    paidAt: {
      type: Date,
      required: true
    }
  },
  billingInfo: {
    totalMrp: {
      type: Number,
      required: true
    },
    totalDiscount: {
      type: Number,
      required: true
    },
    tax: {
      type: Number,
      required: true,
      default: 0
    },
    platformFee: {
      type: Number,
      required: true,
      default: 0
    },
    shippingFee: {
      type: Number,
      required: true,
      default: 0
    },
    totalAmount: {
      type: Number,
      required: true
    },
  },
  orderStatus: {
    type: String,
    required: true,
    trim: true,
    enum: ["Ordered", "Shipped", "OutForDelivery", "Delivered", "Cancelled"]
  },
  estimatedDeliveryDate: {
    type: Date,
    required: true
  },
  deliveredAt: Date,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Order", orderSchema);