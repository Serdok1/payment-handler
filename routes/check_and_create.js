import { router, purify } from "../utils/init.js";
import iyzipay from "../iyzipay/createIyzipay.js";
import { createTransaction } from "../graphql/functions/createTransactionFunc.js";


router.post("/check_and_create", async (req, res) => {
  const { token, conversationId } = req.body;

  const request = {
    token: purify.sanitize(token),
    conversationId: purify.sanitize(conversationId),
  };

  try {
    iyzipay.checkoutForm.retrieve(request, async (err, result) => {
      if (err || result.status !== "success") {
        console.error("Payment Error:", err || result);
        return res.status(500).json({ message: "Payment verification failed." });
      }

      try {
        await createTransaction(result);
        res.status(200).json({ message: "Transaction created successfully.", result });
      } catch (graphqlError) {
        console.error("Transaction Creation Error:", graphqlError);
        res.status(500).json({ message: "Transaction creation failed." });
      }
    });
  } catch (error) {
    console.error("Unexpected Error:", error);
    res.status(500).json({ message: "An unexpected error occurred." });
  }
});

export default router;
