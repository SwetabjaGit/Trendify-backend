const Order = require("../models/orderModel");


exports.createOrder = async (req, res, next) => {
  try {
    const orderObj = req.body;

    const order = await new Order(orderObj).save();
    console.log("Order Saved: ", order);

    res.status(200).send({
      success: true,
      message: "Order Created Successfully",
      orderId: order._id,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: error.message });
  }
};


exports.getAllOrdersOfUser = async (req, res, next) => {
  try {
    const orders = await Order.find({ userId: req.userId });
    if(!orders) {
      return res.status(400).send({ message: "No Orders by this user" });
    }

    res.status(200).send({
      success: true,
      orders
    })
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: error.message });
  }
};