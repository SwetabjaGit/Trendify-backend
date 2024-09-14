const Joi = require("joi");
const passwordComplexity = require("joi-password-complexity");


const validateRegister = (data) => {
  let nameStr = Joi.string().required().label("Name");
  let emailStr = Joi.string().email().required().label("Email");
  let passwordStr = passwordComplexity().required().label("Password");

  const schema = Joi.object({
    name: nameStr,
    email: emailStr,
    password: passwordStr,
  });
  return schema.validate(data);
};

const validateLogin = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().required().label("Email"),
    password: Joi.string().required().label("Password"),
  });
  return schema.validate(data);
};


module.exports = { validateRegister, validateLogin }

