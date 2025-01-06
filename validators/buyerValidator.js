import { body } from "express-validator";

const buyerValidator = [
  body("buyer").isObject().withMessage("Buyer must be an object."),
  body("buyer.id").isString().withMessage("Buyer ID must be a string."),
  body("buyer.name").isString().withMessage("Buyer name must be a string."),
  body("buyer.surname")
    .isString()
    .withMessage("Buyer surname must be a string."),
  body("buyer.email")
    .isEmail()
    .withMessage("Buyer email must be a valid email."),
  body("buyer.identityNumber")
    .isString()
    .withMessage("Buyer identity number must be a string."),
  body("buyer.registrationAddress")
    .isString()
    .withMessage("Buyer registration address must be a string."),
  body("buyer.ip").isString().withMessage("Buyer IP must be a string."),
  body("buyer.city").isString().withMessage("Buyer city must be a string."),
  body("buyer.country")
    .isString()
    .withMessage("Buyer country must be a string."),
];

export default buyerValidator;
