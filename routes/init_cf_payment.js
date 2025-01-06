import dotenv from "dotenv";
import express from "express";
import Iyzipay from "iyzipay";
import DOMPurify from "dompurify";
import { JSDOM } from "jsdom";
import { validationResult } from "express-validator";
import paymentValidator from "../validators/paymentValidator.js";

dotenv.config();
const router = express.Router();
const window = new JSDOM("").window;
const purify = DOMPurify(window);

// İyzico API yapılandırması
const iyzipay = new Iyzipay({
  apiKey: process.env.IYZICO_API_KEY,
  secretKey: process.env.IYZICO_SECRET_KEY,
  uri: process.env.IYZICO_BASE_URL,
});

// Ödeme başlatma endpoint'i
router.post("/init_cf_payment", paymentValidator, async (req, res) => {
  // Doğrulama sonuçlarını kontrol et
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const {
    locale,
    price,
    buyer,
    billingAddress,
    shippingAddress,
    basketItems,
    currency,
    paidPrice,
    conversationId,
  } = req.body;

  // Girdi verilerini temizleme
  const sanitizedBuyer = Object.fromEntries(
    Object.entries(buyer).map(([key, value]) => [key, purify.sanitize(value)])
  );

  const sanitizedBillingAddress = Object.fromEntries(
    Object.entries(billingAddress).map(([key, value]) => [
      key,
      purify.sanitize(value),
    ])
  );

  const sanitizedShippingAddress = Object.fromEntries(
    Object.entries(shippingAddress).map(([key, value]) => [
      key,
      purify.sanitize(value),
    ])
  );

  const sanitizedBasketItems = basketItems.map((item) =>
    Object.fromEntries(
      Object.entries(item).map(([key, value]) => [key, purify.sanitize(value)])
    )
  );

  // İyzico ödeme isteği için yapılandırma
  const request = {
    locale: purify.sanitize(locale),
    price: purify.sanitize(price),
    currency: purify.sanitize(currency),
    paidPrice: purify.sanitize(paidPrice),
    conversationId: purify.sanitize(conversationId),
    buyer: sanitizedBuyer,
    billingAddress: sanitizedBillingAddress,
    shippingAddress: sanitizedShippingAddress,
    basketItems: sanitizedBasketItems,
    callbackUrl: `${process.env.APP_URL}:${process.env.PORT}/callback`,
  };

  try {
    // İyzico API ödeme çağrısı
    iyzipay.checkoutFormInitialize.create(request, (err, result) => {
      if (err) {
        console.error("Checkout Form Error:", err);
        return res.status(500).json({
          message: "Checkout Form failed",
          error: err.message,
        });
      }

      console.log("Checkout Form Success:", result);
      res.status(200).json({
        message: "Checkout Form success",
        result,
      });
    });
  } catch (error) {
    console.error("Checkout Form Error:", error);
    res.status(500).json({
      message: "Checkout Form failed",
      error: error.message,
    });
  }
});

export default router;
