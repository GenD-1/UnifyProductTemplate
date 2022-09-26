const stripe = require('stripe')(process.env.REACT_APP_STRIPE_SECRET_KEY, {
  apiVersion: '2020-03-02',
  maxNetworkRetries: 2,
});

const inventory = require('./data/products.json');

exports.handler = async (event) => {

  try {
    const cartItems = JSON.parse(event.body);

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      billing_address_collection: 'auto',
      shipping_address_collection: {
        allowed_countries: ['US', 'CA'],
      },
      success_url: `${process.env.URL}/success`,
      cancel_url: process.env.URL,
      line_items: [
        {
          price_data: {
            unit_amount: 350,
            currency: 'USD',
            product_data: {
              name: 'Shipping fee',
              description: 'Handling and shipping fee for global delivery',
            },
          },
          quantity: 1,
        },
      ],
      payment_intent_data: {
        metadata: {
          items: JSON.stringify(
            Object.keys(cartItems).map((sku) => ({
              sku,
              quantity: cartItems[sku].quantity,
            }))
          ),
        },
      },
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ sessionId: session.id }),
    };
  } catch (error) {
    console.log({ error });

    return {
      statusCode: 400,
      body: JSON.stringify(error),
    };
  }
};
