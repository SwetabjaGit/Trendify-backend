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
    res.status(200).send({
      products: newProductsList
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal Server Error" });
  }
}


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
    res.status(500).send({ message: "Internal Server Error" });
  }
}


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
    res.status(500).send({ message: "Internal Server Error" });
  }
}


exports.deleteProduct = async (req, res, next) => {
  try {
    await Product.findOneAndDelete({ id: req.body.id });
    console.log("Removed");
    res.status(200).send({
      success: true,
      name: req.body.name
    })
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal Server Error" });
  }
}


exports.uploadImage = async (req, res, next) => {
  try {
    console.log("Uploading Image");
    res.status(200).send({ message: "Uploading Image" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal Server Error" });
  }
}