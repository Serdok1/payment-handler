import { router, purify } from "../utils/init.js";
import iyzipay from "../iyzipay/createIyzipay.js";


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