import dotenv from "dotenv";
import express from "express";
import Iyzipay from "iyzipay";
import DOMPurify from "dompurify";
import { JSDOM } from "jsdom";
import fetch from "node-fetch";
import { gql } from "graphql-request"; // GraphQL isteği için gerekli

dotenv.config();
const router = express.Router();
const window = new JSDOM("").window;
const purify = DOMPurify(window);

const iyzipay = new Iyzipay({
  apiKey: process.env.IYZICO_API_KEY,
  secretKey: process.env.IYZICO_SECRET_KEY,
  uri: process.env.IYZICO_BASE_URL,
});

// GraphQL İsteği Gönderme
async function createTransaction(result) {
  const mutation = gql`
    mutation {
      transactionCreate(
        id: "${result.conversationId}"
        transaction: {
          name: "Credit card"
          message: "Authorized"
          pspReference: "${result.paymentId}"
          availableActions: [REFUND]
          amountCharged: { currency: "${result.currency}", amount: ${result.paidPrice} }
          externalUrl: "${process.env.IYZICO_DETAILS_URL}/transactions/${result.paymentId}"
        }
      ) {
        transaction {
          id
        }
      }
    }
  `;

  try {
    const response = await fetch(process.env.SALEOR_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.SALEOR_ACCESS_TOKEN}`,
      },
      body: JSON.stringify({ query: mutation }),
    });

    const data = await response.json();

    if (response.ok) {
      console.log("Transaction Created:", data.data);
    } else {
      console.error("GraphQL Error:", data.errors);
    }
  } catch (error) {
    console.error("Fetch Error:", error);
  }
}

router.post("/check_and_create", async (req, res) => {
  const { token, conversationId } = req.body;

  const request = {
    token: purify.sanitize(token),
    conversationId: purify.sanitize(conversationId),
  };

  try {
    iyzipay.checkoutForm.retrieve(request, async function (err, result) {
      if (result.status !== "success") {
        console.error("Payment Error:", err);
        res.status(500).json({ message: "Payment failed", error: result });
      } else {
        console.log("Token checked:", result);
        await createTransaction(result);
        res.status(200).json({ message: "Token checked", result: result });
      }
    });
  } catch (error) {
    console.error("Payment Error:", error);
    res.status(500).json({ message: "Payment failed", error: error.message });
  }
});

export default router;
