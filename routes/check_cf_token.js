import dotenv from "dotenv";
import express from "express";
import Iyzipay from "iyzipay";
import DOMPurify from "dompurify";
import { JSDOM } from "jsdom";

dotenv.config();
const router = express.Router();
const window = new JSDOM("").window;
const purify = DOMPurify(window);

var iyzipay = new Iyzipay({
  apiKey: process.env.IYZICO_API_KEY,
  secretKey: process.env.IYZICO_SECRET_KEY,
  uri: process.env.IYZICO_BASE_URL,
});

router.post("/check_cf_token", async (req, res) => {
    try {
      const {
        token
      } = req.body;
  
      const request = {
        token: purify.sanitize(token),
      };    
  
      iyzipay.checkoutForm.retrieve(request, function (err, result) {
        if (err) {
          console.error("Payment Error:", err);
          res.status(500).json({ message: "Payment failed", error: err.message });
        } else {
          console.log("Payment Success:", result);
          res.status(200).json({ message: "Payment success", result: result });
        }
      });
    } catch (error) {
      console.error("Payment Error:", error);
      res.status(500).json({ message: "Payment failed", error: error.message });
    }
  });
  
export default router;