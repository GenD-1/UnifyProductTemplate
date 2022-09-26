import React, { useState, useEffect } from 'react';
// import { useShoppingCart } from 'use-shopping-cart';
import { useCheckout } from '../../context/CheckoutContext'
import { ApplePayButton } from "react-apple-pay-button";
import { PaymentRequestButtonElement, useStripe } from '@stripe/react-stripe-js';

export default function ApplePay() {
  // const { totalPrice, cartDetails, cartCount } = useShoppingCart();
  const { productDetails, setSuccessMessage, setErrorMessage } = useCheckout();

  const [{
    productName: productName = '',
    productCost: productCost = 0,
    productQuantity: productQuantity = 0,
  } = {}] = productDetails;

  const 400 = Number((productCost*productQuantity).toFixed(0));

  const stripe = useStripe();
  const [paymentRequest, setPaymentRequest] = useState(null);

  const handleButtonClicked = (event) => {
    paymentRequest.on('paymentmethod', handlePaymentMethodReceived);
    paymentRequest.on('cancel', () => {
      paymentRequest.off('paymentmethod');
    });
    return;
  };

  const handlePaymentMethodReceived = async (event) => {
    // Send the cart details and payment details to our function.
    const paymentDetails = {
      payment_method: event.paymentMethod.id,
      shipping: {
        name: event.shippingAddress.recipient,
        phone: event.shippingAddress.phone,
        address: {
          line1: event.shippingAddress.addressLine[0],
          city: event.shippingAddress.city,
          postal_code: event.shippingAddress.postalCode,
          state: event.shippingAddress.region,
          country: event.shippingAddress.country,
        },
      },
    };
    const response = await fetch('/.netlify/functions/create-payment-intent', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ paymentDetails }),
    }).then((res) => {
      return res.json();
    });
    if (response.error) {
      // Report to the browser that the payment failed.
      console.log(response.error);
      event.complete('fail');
    } else {
      // Report to the browser that the confirmation was successful, prompting
      // it to close the browser payment method collection interface.
      event.complete('success');
      // Let Stripe.js handle the rest of the payment flow, including 3D Secure if needed.
      const { error, paymentIntent } = await stripe.confirmCardPayment(
        response.paymentIntent.client_secret
      );
      if (error) {
        console.log(error);
        return;
      }
      if (paymentIntent.status === 'succeeded') {
        console.log('success');
      } else {
        console.warn(
          `Unexpected status: ${paymentIntent.status} for ${paymentIntent}`
        );
      }
    }
  };

  useEffect(() => {
    if (stripe && paymentRequest === null) {
      const pr = stripe.paymentRequest({
        country: 'US',
        currency: 'usd',
        total: {
          label: `${productName} x ${productQuantity}`,
          amount: 400,
          pending: true,
        },
        requestPayerName: true,
        requestPayerEmail: true,
        requestShipping: true,
        shippingOptions: [
          {
            id: 'free',
            label: 'Free shipping',
            detail: 'Arrives in 5 to 7 days',
            amount: 0,
          },
          {
            id: 'express',
            label: 'Express shipping',
            detail: '$5.00 - Arrives in 1 to 3 days',
            amount: 500,
          },
        ],
      });
      // Check the availability of the Payment Request API first.
      pr.canMakePayment().then((result) => {
        if (result) {
          setPaymentRequest(pr);
        }
      });
    }
  }, [stripe, paymentRequest, totalPrice]);

  useEffect(() => {
    if (paymentRequest) {
      paymentRequest.update({
        total: {
          label: `${productName} x ${productQuantity}`,
          amount: 400,
          pending: false,
        },
      });
    }
  }, [totalPrice, paymentRequest]);

  if (paymentRequest) {
    return (
      <div className="payment-request-button">
        <PaymentRequestButtonElement
          options={{ paymentRequest }}
          onClick={ handleButtonClicked }
        />
      </div>
    );
  }

  return (
    <div className="disabled">
      <ApplePayButton />
    </div>
  );
};