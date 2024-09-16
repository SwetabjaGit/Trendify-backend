const express = require("express");
const {
  getAllProducts,
  getProductById,
  createProduct,
  deleteProduct,
  uploadImage,
  getProductReviews,
  addProductReview
} = require("../controllers/productController");
const { isAuthenticatedUser } = require("../middlewares/auth");


const router = express.Router();


router.get("/allproducts", getAllProducts);

router.get("/product/:id", getProductById);

router.post("/product/create", createProduct);

router.delete("/product/delete/:id", deleteProduct);

router.post("/product/uploadimage", uploadImage);

router.post("/product/review/get/:id", getProductReviews);

router.post("/product/review/post/:id", isAuthenticatedUser, addProductReview);


module.exports = router;
