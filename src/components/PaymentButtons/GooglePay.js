import React from 'react'
import { useCheckout } from '../../context/CheckoutContext'

// Google button and payment functionality
import GooglePayButton from '@google-pay/button-react';
import { buildPaymentRequest, getUpdatedPaymentData } from '../../store/google-pay-configuration';

export default function GooglePay() {

    const [paymentRequest, setPaymentRequest] = React.useState(buildPaymentRequest([]));
    const { productDetails, setSuccessMessage, setErrorMessage } = useCheckout();

    const [{
        productName: productName = '',
        productCost: productCost = 0,
        productQuantity: productQuantity = 0,
    } = {}] = productDetails;

    React.useEffect(() => {
        Object.assign(
            paymentRequest,
            buildPaymentRequest(
                productDetails[0]
                    ? [
                        {
                            label: `${productName} x ${productQuantity}`,
                            price: (productCost * productQuantity).toFixed(2),
                            type: 'LINE_ITEM',
                        },
                    ]
                    : [],
                ),
            );
        setPaymentRequest(paymentRequest);
    }, [productDetails, paymentRequest]);

    const handleLoadPaymentData = (paymentData: google.payments.api.PaymentData) => {
        setSuccessMessage(paymentData);
    };

    const handleError = (err: any) => {
        setErrorMessage(err)
    }

  return <GooglePayButton
        environment="TEST"
        buttonSizeMode="fill"
        paymentRequest={paymentRequest}
        onLoadPaymentData={handleLoadPaymentData}
        onError={error => handleError(error)}
        onPaymentDataChanged={paymentData => getUpdatedPaymentData(paymentRequest, paymentData)}
    />
}