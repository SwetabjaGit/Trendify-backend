const Cart = require("../models/cartModel");



exports.addToCart = async (req, res, next) => {
  try {
    const cartSchema = await Cart.findOne({ userId: req.userId });
    const cartDetails = req.body;

    if(!cartSchema){
      const cartObj = {
        userId: req.userId,
        cart: [cartDetails]
      }
      const cartItem = await new Cart(cartObj).save();
      console.log("CartItem added");
      return res.status(200).send({
        success: true,
        message: `CartItem Added Successfully, CartId: ${cartItem._id}`
      });
    }

    const itemExists = cartSchema.cart.some((item) => {
      return item.productId.toString() === cartDetails.productId
    });
    if(itemExists){
      console.log("CartItem Already Exists");
      return res.status(400).send({
        success: false,
        message: "CartItem Already Exists" 
      });
    }

    cartSchema.cart.push(req.body);
    await cartSchema.save();
    console.log("CartItem Added");

    res.status(200).send({
      success: true,
      message: `CartItem Added Successfully, CartId: ${cartSchema._id}`
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, message: error.message });
  }
};

exports.removeFromCart = async (req, res, next) => {
  try {
    const cartSchema = await Cart.findOne({ userId: req.userId });
    const productId = req.body.productId;

    if(!cartSchema){
      console.log("Cart Not Found");
      return res.status(400).send({ success: false, message: "Cart Not Found" });
    }

    const itemExists = cartSchema.cart.some((item) => {
      return item.productId.toString() === productId
    });
    if(!itemExists){
      console.log("CartItem Not Found");
      return res.status(400).send({ success: false, message: "CartItem Not Found" });
    }

    cartSchema.cart = cartSchema.cart.filter(
      (item) => item.productId.toString() !== productId
    );
    await cartSchema.save();
    console.log("CartItem Removed");

    if(cartSchema.cart.length === 0){
      await Cart.findOneAndDelete({ userId: req.userId });
    }

    res.status(200).send({
      success: true,
      message: `CartItem Removed Successfully, CartId: ${cartSchema._id}`
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, message: error.message });
  }
};

exports.getCartDetails = async (req, res, next) => {
  try {
    const cartSchema = await Cart.findOne({ userId: req.userId });

    if(!cartSchema){
      const responseObj = {
        userId: req.userId,
        cart: []
      }
      return res.status(200).send(responseObj);
    }

    res.status(200).send(cartSchema);
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, message: error.message });
  }
};

exports.incrementCartItemQuantity = async (req, res, next) => {
  try {
    const cartSchema = await Cart.findOne({ userId: req.userId });
    const productId = req.body.productId;

    if(!cartSchema){
      console.log("Cart Not Found");
      return res.status(400).send({ success: false, message: "Cart Not Found" });
    }

    let itemIndex;
    const itemExists = cartSchema.cart.some((item, index) => {
      if(item.productId.toString() === productId){
        itemIndex = index;
        return true
      } else {
        return false;
      }
    });
    if(!itemExists){
      console.log("CartItem Not Found");
      return res.status(400).send({ success: false, message: "CartItem Not Found" });
    }

    cartSchema.cart[itemIndex].quantity += 1;
    await cartSchema.save();
    console.log("CartItem Incremented");
    
    res.status(200).send({
      success: true,
      productId: req.body.productId,
      message: `Quantity Incremented Successfully, CartId: ${cartSchema._id}`
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, message: error.message });
  }
};

exports.decrementCartItemQuantity = async (req, res, next) => {
  try {
    const cartSchema = await Cart.findOne({ userId: req.userId });
    const productId = req.body.productId;

    if(!cartSchema){
      console.log("Cart Not Found");
      return res.status(400).send({ success: false, message: "Cart Not Found" });
    }

    let itemIndex;
    const itemExists = cartSchema.cart.some((item, index) => {
      if(item.productId.toString() === productId){
        itemIndex = index;
        return true;
      } else {
        return false;
      }
    });
    if(!itemExists){
      console.log("CartItem Not Found");
      return res.status(400).send({ success: false, message: "CartItem Not Found" });
    }

    if(cartSchema.cart[itemIndex].quantity === 1){
      cartSchema.cart = cartSchema.cart.filter(
        (item) => item.productId.toString() !== productId
      );
    } else {
      cartSchema.cart[itemIndex].quantity -= 1;
    }
    
    await cartSchema.save();
    console.log("CartItem Decremented");
    res.status(200).send({
      success: true,
      productId: req.body.productId,
      message: `Quantity Decremented Successfully, CartId: ${cartSchema._id}`
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, message: error.message });
  }
};