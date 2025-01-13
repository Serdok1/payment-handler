import { configDotenv } from "dotenv";

configDotenv();

export function prepareIyzicoPayload(checkoutData, ipAddress, locale) {
    const checkout = checkoutData.checkout;
    const billAddr = checkoutData.checkout.billingAddress;
    const shipAddr = checkoutData.checkout.shippingAddress;
  
    const buyer = {
      id: "checkout.user.id",
      name: billAddr.firstName,
      surname: billAddr.lastName,
      email: checkout.email,
      identityNumber: "11111111111",
      registrationAddress: billAddr.streetAddress1,
      city: billAddr.city,
      country: billAddr.country.code,
      ip: ipAddress
    };
  
    const shippingAddress = {
      contactName: `${shipAddr.firstName} ${shipAddr.lastName}`,
      city: shipAddr.city,
      country: shipAddr.country.code,
      address: shipAddr.streetAddress1,
    };
  
    const billingAddress = {
      contactName: `${billAddr.firstName} ${billAddr.lastName}`,
      city: billAddr.city,
      country: billAddr.country.code,
      address: billAddr.streetAddress1,
    };
  
    const basketItems = checkout.lines.map((line, index) => ({
      id: line.variant.id,
      name: line.variant.product.name,
      price: line.variant.pricing.price.gross.amount,
      itemType: "PHYSICAL",
      category1: line.variant.product.category.name,
    }));
  
    return {
      locale: locale,
      conversationId: checkout.id,
      price: basketItems
        .reduce((total, item) => total + parseFloat(item.price), 0)
        .toFixed(2),
      paidPrice: basketItems
        .reduce((total, item) => total + parseFloat(item.price), 0)
        .toFixed(2),
      currency: checkout.lines[0].variant.pricing.price.gross.currency,
      callbackUrl: `${process.env.APP_URL}/iyzico_callback`,
      buyer,
      shippingAddress,
      billingAddress,
      basketItems,
    };
  }
  