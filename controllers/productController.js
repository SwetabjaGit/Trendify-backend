const Product = require("../models/productModel");
const cloudinary = require("cloudinary");
const { checkVerifiedPurchase } = require("../utils/verifiedPurchase");


exports.getAllProducts = async (req, res, next) => {
  try {
    console.log("Query", req.query);

    let queryCriteria = {};

    if(req.query.keyword){
      queryCriteria.$text = {
        $search: req.query.keyword,
      }
    }

    /* queryCriteria.name = {
      $regex: req.query.keyword || "",
      $options: "i",
    } */

    if(req.query.category){
      queryCriteria.category = req.query.category;
    }

    let brandsList = req.query.brand ? req.query.brand.split(",") : [];
    if(req.query.brand){
      queryCriteria.company = {
        $in: brandsList
      }
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

    //const totalCount = await Product.countDocuments(queryCriteria, { hint: "_id_"});
    const totalCount = await Product.countDocuments(queryCriteria);
    const pageLength = products.length;

    res.status(200).send({
      success: true,
      totalCount,
      pageLength,
      products: newProductsList,
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
    const productId = req.params.id;
    const product = await Product.findOne({ _id: productId });
    if (!product) {
      return res.status(400).send({ message: "Product Not Found" });
    }

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
    res.status(500).send({ success: false, message: error.message });
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
    const product = await Product.findOne({ _id: req.params.id });
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
    const productId = req.params.id;
    const product = await Product.findOne({ _id: productId });
    if (!product) {
      return res.status(400).send({ message: "Product Not Found" });
    }

    console.log("req.userId", req.userId);
    const userReviewIndex = product.reviews.findIndex(
      (review) => review.userId.toString() === req.userId
    );

    if(userReviewIndex !== -1){
      product.reviews[userReviewIndex].rating = Number(req.body.rating);
      product.reviews[userReviewIndex].title = req.body.title;
      product.reviews[userReviewIndex].comment = req.body.comment;
    }
    else {
      const reviewObj = {
        userId: req.userId,
        verified_purchase: await checkVerifiedPurchase(productId, req.userId),
        ...req.body
      }
      product.reviews.push(reviewObj);
    }

    //TODO: Calculate the new rating
    
    await product.save();
    console.log("Review Published");
    
    res.status(200).send({ 
      success: true, 
      message: "Review Posted Successfully" 
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Failed to post review" });
  }
};


exports.deleteProductReview = async (req, res, next) => {
  try {
    const product = await Product.findOne({ _id: req.params.id });
    if (!product) {
      return res.status(400).send({ message: "Product Not Found" });
    }

    product.reviews = product.reviews.filter(
      (review) => review.userId.toString() !== req.userId
    );

    //TODO: Calculate the new rating

    await product.save();
    console.log("Review Deleted");
    
    res.status(200).send({
      success: true,
      message: "Review Deleted Successfully" 
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Failed to delete review" });
  }
};


/* exports.createNewField = async (req, res, next) => {
  try {
    const products = await Product.find();
    if (!products) {
      return res.status(400).send({ message: "Products Not Found" });
    }

    const productsCount = await Product.countDocuments();
    let responseList = [];
    for(let i = 0; i < productsCount; i++){
      const productSchema = await Product.findOne({ _id: products[i]._id });
      await productSchema.save();
      responseList.push(productSchema._id);
    }

    res.status(200).send(responseList);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: error.message });
  }
} */