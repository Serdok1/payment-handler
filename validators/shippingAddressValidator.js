import { body } from "express-validator";

const shippingAddressValidator = [
  body("shippingAddress")
    .isObject()
    .withMessage("Shipping address must be an object."),
  body("shippingAddress.contactName")
    .isString()
    .withMessage("Shipping contact name must be a string."),
  body("shippingAddress.city")
    .isString()
    .withMessage("Shipping city must be a string."),
  body("shippingAddress.country")
    .isString()
    .withMessage("Shipping country must be a string."),
  body("shippingAddress.address")
    .isString()
    .withMessage("Shipping address must be a string."),
  body("shippingAddress.zipCode")
    .isString()
    .withMessage("Shipping zip code must be a string."),
];

export default shippingAddressValidator;
