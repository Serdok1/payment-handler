import { body } from "express-validator";

const billingAddressValidator = [
  body("billingAddress")
    .isObject()
    .withMessage("Billing address must be an object."),
  body("billingAddress.contactName")
    .isString()
    .withMessage("Billing contact name must be a string."),
  body("billingAddress.city")
    .isString()
    .withMessage("Billing city must be a string."),
  body("billingAddress.country")
    .isString()
    .withMessage("Billing country must be a string."),
  body("billingAddress.address")
    .isString()
    .withMessage("Billing address must be a string."),
  body("billingAddress.zipCode")
    .isString()
    .withMessage("Billing zip code must be a string."),
];

export default billingAddressValidator;
