const express = require("express");
const {
  getAllProducts,
  getProductById,
  createProduct,
  deleteProduct,
  uploadImage
} = require("../controllers/productController");


const router = express.Router();


router.get("/allproducts", getAllProducts);

router.get("/product/:id", getProductById);

router.post("/product/create", createProduct);

router.delete("/product/delete", deleteProduct);

router.post("/product/uploadimage", uploadImage);



module.exports = router;
