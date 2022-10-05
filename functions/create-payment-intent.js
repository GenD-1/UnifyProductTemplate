const stripe = require('stripe')(process.env.REACT_APP_STRIPE_SECRET_KEY, {
  apiVersion: '2020-03-02',
  maxNetworkRetries: 2,
});

exports.handler = async (event) => {

  try {
    const { cartDetails: cartItems, paymentDetails } = JSON.parse(event.body);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: 400,
      currency: 'usd',
      ...paymentDetails,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ paymentIntent }),
    };
  } catch (error) {
    console.log({ error });

    return {
      statusCode: 400,
      body: JSON.stringify({ error }),
    };
  }
};
