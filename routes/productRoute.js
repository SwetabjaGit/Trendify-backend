const express = require("express");
const {
  getAllProducts,
  getAllBrands,
  getProductById,
  createProduct,
  deleteProduct,
  uploadImage,
  getProductReviews,
  addProductReview,
  deleteProductReview
} = require("../controllers/productController");
const { isAuthenticatedUser } = require("../middlewares/auth");


const router = express.Router();


router.get("/products", getAllProducts);

router.get("/products/brands", getAllBrands);

router.get("/product/:id", getProductById);

router.post("/product/create", createProduct);

router.delete("/product/delete/:id", deleteProduct);

router.post("/product/uploadimage", uploadImage);

router.post("/product/review/get/:id", getProductReviews);

router.post("/product/review/add/:id", isAuthenticatedUser, addProductReview);

router.post("/product/review/delete/:id", isAuthenticatedUser, deleteProductReview);

//router.post("/product/createnewfield", createNewField);


module.exports = router;
