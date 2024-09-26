const Order = require("../models/orderModel");


exports.checkVerifiedPurchase = async (productId, userId) => {
  const orders = await Order.find({ userId: userId });
  if(!orders) {
    return false;
  }
  
  const ordersCount = await Order.countDocuments({ userId: userId });
  for(let i = 0; i < ordersCount; i++){
    orders[i].orderItems.forEach((item) => {
      if(item.productId === productId) {
        return true;
      }
    });
  }
  return false;
};