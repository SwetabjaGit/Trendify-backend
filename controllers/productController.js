const Product = require("../models/productModel");
const cloudinary = require("cloudinary");
const ApiFeatures = require("../utils/ApiFeatures");


exports.getAllProducts = async (req, res, next) => {
  try {
    console.log("Query", req.query);
    //const apiFeature = new ApiFeatures(Product.find(), req.query);

    let queryCriteria = {};

    queryCriteria.name = {
      $regex: req.query.keyword || "",
      $options: "i",
    }

    if(req.query.category){
      queryCriteria.category = req.query.category;
    }

    if(req.query.brand){
      queryCriteria.company = req.query.brand;
    }

    const range = req.query.price ? req.query.price.split(" ") : [0, 1000000];
    queryCriteria.current_price = {
      $gte: parseInt(range[0]),
      $lte: parseInt(range[1])
    };

    let sortBy = {};
    const sortQuery = req.query.sort ? req.query.sort.split(" ") : ['createdAt', 1];
    req.query.sort 
      ? sortBy[sortQuery[0]] = sortQuery[1] ? sortQuery[1] : -1 
      : sortBy['createdAt'] = 1;
    console.log('sortBy', sortBy);

    const pageNo = parseInt(req.query.page)-1 || 0;
    const itemsPerPage = parseInt(req.query.limit) || 500;

    let products = await Product.find(queryCriteria)
      .sort(sortBy)
      .skip(pageNo * itemsPerPage)
      .limit(itemsPerPage);
    
    if (!products) {
      return res.status(400).send({ message: "Products Not Found" });
    }

    const newProductsList = products.map((product) => {
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

    const productsCount = await Product.countDocuments();
    const filteredProductsCount = products.length;

    res.status(200).send({
      success: true,
      productsCount,
      products: newProductsList,
      filteredProductsCount
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: error.message });
  }
};


exports.getAllBrands = async (req, res, next) => {
  try {
    /* const companies = await Product.aggregate([{
      $group: {
        _id: "$company",
        count: { $sum: 1 };
      }
    }]); */
    const allCompanies = await Product.aggregate([
      { $sortByCount: "$company" }
    ]);
    if (!allCompanies) {
      return res.status(400).send({ message: "Companies Not Found" });
    }

    let queryCriteria = {};
    if(req.query.category){
      queryCriteria.category = req.query.category;
    }
    const companyCategory = await Product.distinct("company", queryCriteria);

    const companies = allCompanies.filter((company) => {
      return companyCategory.includes(company._id);
    });

    res.status(200).send({ companies });
  } catch(error) {
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