import { body } from "express-validator";

const basketItemsValidator = [
  body("basketItems").isArray().withMessage("Basket items must be an array."),
  body("basketItems.*.id")
    .isString()
    .withMessage("Basket item ID must be a string."),
  body("basketItems.*.name")
    .isString()
    .withMessage("Basket item name must be a string."),
  body("basketItems.*.category1")
    .isString()
    .withMessage("Basket item category1 must be a string."),
  body("basketItems.*.category2")
    .optional()
    .isString()
    .withMessage("Basket item category2 must be a string."),
  body("basketItems.*.price")
    .isFloat({ gt: 0 })
    .withMessage("Basket item price must be a positive number."),
  body("basketItems.*.itemType")
    .isString()
    .withMessage("Basket item type must be a string."),
];

export default basketItemsValidator;
