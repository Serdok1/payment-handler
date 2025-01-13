import { router } from "../utils/init.js";
import iyzipay from "../iyzipay/createIyzipay.js";
import { validationResult } from "express-validator";
import initValidator from "../validators/initValidator.js";
import { checkoutQuery } from "../graphql/functions/checkoutQueryFunc.js";
import { prepareIyzicoPayload } from "../utils/prepareIyzicoPayload.js";

router.post("/init_cf_payment", initValidator, async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { checkoutId, accessToken, ip, locale } = req.body;

  try {
    //verify access token
    const checkoutData = await checkoutQuery(checkoutId);
    const paymentRequest = prepareIyzicoPayload(checkoutData, ip, locale);
    console.log("Payment request:", paymentRequest);
  } catch (error) {
    console.error("Error:", error);
    return res.status(400).json({
      message: "Checkout form failed",
    });
  }

  iyzipay.checkoutFormInitialize.create(paymentRequest, (err, result) => {
    console.log("Checkout Form Success:", result);
    if (err) {
      console.error("Error:", err);
      return res.status(400).json({
        message: "Checkout form failed",
      });
    }
    res.status(200).json({
      message: "Checkout Form success",
      status: result.status,
      token: result.token,
      paymentPageUrl: result.paymentPageUrl,
    });
  });
});

export default router;
