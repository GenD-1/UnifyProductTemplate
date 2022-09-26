const stripe = require('stripe')(process.env.REACT_APP_STRIPE_SECRET_KEY, {
  apiVersion: '2020-03-02',
  maxNetworkRetries: 2,
});
const validateCartItems = require('use-shopping-cart/src/serverUtil')
  .validateCartItems;

/*
 * Product data can be loaded from anywhere. In this case, we’re loading it from
 * a local JSON file, but this could also come from an async call to your
 * inventory management service, a database query, or some other API call.
 *
 * The important thing is that the product info is loaded from somewhere trusted
 * so you know the pricing information is accurate.
 */
const inventory = require('./data/products.json');

/*
 * Product data can be loaded from anywhere. In this case, we’re loading it from
 * a local JSON file, but this could also come from an async call to your
 * inventory management service, a database query, or some other API call.
 *
 * The important thing is that the product info is loaded from somewhere trusted
 * so you know the pricing information is accurate.
 */

exports.handler = async (event) => {
  console.log(JSON.parse(event.body))
  try {
    const { cartDetails: cartItems, paymentDetails } = JSON.parse(event.body);

    const line_items = validateCartItems(inventory, cartItems);
    const amount = line_items.reduce(
      (sum, { price_data: { unit_amount }, quantity }) =>
        sum + unit_amount * quantity,
      350 // Shipping fee
    );

    const paymentIntent = await stripe.paymentIntents.create({
      amount: 400,
      currency: 'usd',
      // ...paymentDetails,
      // We are using the metadata to track which items were purchased.
      // We can access this meatadata in our webhook handler to then handle
      // the fulfillment process.
      // In a real application you would track this in an order object in your database.
      // metadata: {
      //   attribution: "Photo by Priscilla Du Preez on Unsplash",
      //   currency: "USD",
      //   description: "Yummy yellow fruit",
      //   formattedValue: "$4.00",
      //   id: "sku_GBJ2Ep8246qeeT",
      //   image: "https://images.unsplash.com/photo-1574226516831-e1dff420e562?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=225&q=80",
      //   name: "Bananas",
      //   price: 400,
      //   quantity: 1,
      //   sku: "sku_GBJ2Ep8246qeeT",
      //   value: 400,
      // },
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
