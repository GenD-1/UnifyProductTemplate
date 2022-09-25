import React from 'react';
import ReactDOM from 'react-dom';
import { useCheckout } from '../../context/CheckoutContext'
import { PaymentRequestButtonElement, useStripe } from '@stripe/react-stripe-js';
import { paymentIntent } from '../../store/apple-pay-configuration';

export default function ApplePay() {
  const stripe = useStripe();
  const [paymentRequest, setPaymentRequest] = React.useState(null);
  const { productDetails, setSuccessMessage, setErrorMessage } = useCheckout();

  const [{
    productName: productName = '',
    productCost: productCost = 0,
    productQuantity: productQuantity = 0,
  } = {}] = productDetails;

  React.useEffect(() => {
    if (stripe) {
      const pr = stripe.paymentRequest({
        country: 'US',
        currency: 'usd',
        total: {
          label: productName,
          amount: Number((productCost*productQuantity).toFixed(0)),
        },
        requestPayerName: true,
        requestPayerEmail: true,
      });

      // Check the availability of the Payment Request API.
      pr.canMakePayment().then(result => {
        if (result) {
          setPaymentRequest(pr);
        }
      });
    }
  }, [stripe]);

  if (paymentRequest) {
    return <PaymentRequestButtonElement options={{ paymentRequest }} />
  }

  // Use a traditional checkout form.
  return <></>;
};

