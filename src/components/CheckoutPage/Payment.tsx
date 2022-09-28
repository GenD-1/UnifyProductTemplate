import React from 'react'
import { buildPaymentRequest, getUpdatedPaymentData } from '../../store/google-pay-configuration';
import Button from '../layout/Button';
import { useCheckout } from '../../context/CheckoutContext'
import GooglePayButton from '@google-pay/button-react';
import "./index.scss"

export default function Payment(payOption: any) {

    const { paymentType } = payOption;
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

    return (() => {
        switch (paymentType?.payment_id) {
            case 1:
                return <GooglePayButton
                        environment="TEST"
                        buttonSizeMode="fill"
                        paymentRequest={paymentRequest}
                        onLoadPaymentData={handleLoadPaymentData}
                        onError={error => handleError(error)}
                        onPaymentDataChanged={paymentData => getUpdatedPaymentData(paymentRequest, paymentData)}
                    />;
            default:
                return <Button disabled text='Select Card' />;
        }
    })();
}