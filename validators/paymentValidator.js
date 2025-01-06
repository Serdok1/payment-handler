import { body } from "express-validator";
import buyerValidator from "./buyerValidator.js";
import billingAddressValidator from "./billingAddressValidator.js";
import shippingAddressValidator from "./shippingAddressValidator.js";
import basketItemsValidator from "./basketItemsValidator.js";

const paymentValidator = [
  body("price").isFloat({ gt: 0 }).withMessage("Price must be a positive number."),
  body("currency").isString().withMessage("Currency must be a string."),
  body("paidPrice").isFloat({ gt: 0 }).withMessage("Paid price must be a positive number."),
  ...buyerValidator,
  ...billingAddressValidator,
  ...shippingAddressValidator,
  ...basketItemsValidator,
];

export default paymentValidator;
