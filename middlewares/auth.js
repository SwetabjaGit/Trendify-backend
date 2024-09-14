const jwt = require("jsonwebtoken");



// Creating middleware to fetch user
exports.isAuthenticatedUser = async (req, res, next) => {
  const token = req.header('auth-token');
  if(!token) {
    res.status(401).send({error: "Please authenticate using valid token"});
  }
  else {
    try {
      const data = jwt.verify(token, process.env.JWTPRIVATEKEY);
      console.log('tokenData: ', data);
      req.userId = data._id;
      next();
      //res.status(200).send({ success: "true", user: data.user });
    } catch(error) {
      console.log(error);
      res.status(401).send({ error: "Please authenticate using a valid token" });
    }
  }
};