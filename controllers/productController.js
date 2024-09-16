const Product = require("../models/productModel");
const cloudinary = require("cloudinary");



exports.getAllProducts = async (req, res, next) => {
  try {
    const productsList = await Product.find({});

    const newProductsList = productsList.map((product) => {
      let newProduct = {
        _id: product._id,
        name: product.name,
        category: product.category,
        company: product.company,
        description: product.description,
        image: product.image,
        original_price: product.original_price,
        current_price: product.current_price,
        discount_percentage: product.discount_percentage,
        stock: product.stock,
        rating: product.rating,
        return_period: product.return_period,
        createdAt: product.createdAt
      };
      return newProduct;
    });

    console.log("All Products Fetched");
    res.status(200).send({ products: newProductsList });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: error.message });
  }
};


exports.getProductById = async (req, res, next) => {
  try {
    let productId = req.params.id;
    const product = await Product.findOne({ _id: productId });
    if (!product) {
      return res.status(400).send({ message: "Product Not Found" });
    }
    console.log(product);

    res.status(200).send(product);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: error.message });
  }
};


exports.createProduct = async (req, res, next) => {
  try {
    const productObj = req.body;
    const product = await new Product(productObj).save();
    console.log("Product Saved", product);

    res.status(200).send({
      success: true,
      message: `Product saved successfully. ProductId: ${product._id}`
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: error.message });
  }
};


exports.deleteProduct = async (req, res, next) => {
  try {
    await Product.findOneAndDelete({ id: req.params.id });
    console.log("Removed");
    res.status(200).send({
      success: true,
      name: req.body.name
    })
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: error.message });
  }
};


exports.uploadImage = async (req, res, next) => {
  try {
    console.log("Uploading Image");
    res.status(200).send({ message: "Uploading Image" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: error.message });
  }
};


exports.getProductReviews = async (req, res, next) => {
  try {
    const product = Product.findOne({ _id: req.params.id });
    if (!product) {
      return res.status(400).send({ message: "Product Not Found" });
    }

    const reviews = product.reviews;
    res.status(200).send({
      success: true,
      reviews
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: error.message });
  }
};


exports.addProductReview = async (req, res, next) => {
  try {
    const product = Product.findOne({ _id: req.params.id });
    if (!product) {
      return res.status(400).send({ message: "Product Not Found" });
    }

    console.log("req.userId", req.userId);

    product.reviews.push(req.body);
    await product.save();
    console.log("Review Published");
    
    res.status(200).send({ message: "Review Posted Successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Failed to post review" });
  }
};