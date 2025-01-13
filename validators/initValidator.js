import { body } from "express-validator";

const initValidator = [
  body("checkoutId").isString(),
  body("accessToken").isString(),
];

export default initValidator;
