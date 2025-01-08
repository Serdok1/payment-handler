import dotenv from "dotenv";
import Iyzipay from "iyzipay";
dotenv.config();

const iyzipay = new Iyzipay({
    apiKey: process.env.IYZICO_API_KEY,
    secretKey: process.env.IYZICO_SECRET_KEY,
    uri: process.env.IYZICO_BASE_URL,
  });

export default iyzipay;