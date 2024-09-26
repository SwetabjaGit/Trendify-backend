const express = require("express");
const {
  createOrder,
  getAllOrdersOfUser
} = require("../controllers/orderController");
const { isAuthenticatedUser } = require("../middlewares/auth");


const router = express.Router();


router.post("/order/create", isAuthenticatedUser, createOrder);

router.get("/orders/get", isAuthenticatedUser, getAllOrdersOfUser);


module.exports = router;