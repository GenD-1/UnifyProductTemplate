import React from 'react'
import "./index.scss"
import Button from '../layout/Button';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

// Components
import GooglePay from '../PaymentButtons/GooglePay';
import ApplePay from '../PaymentButtons/ApplePay';

const stripePromise = loadStripe('pk_test_51LlL41DfQvyRGV9Dkmd8hFSOC4jdfUl1LzsE3cmiUmbhOriPKHMbvLpCdRVzGn4PVtn9oNR3qp42Hm30CtK2EMUZ00B7YAXSq5');

export default function Payment(payOption: any) {

    const { paymentType } = payOption;

    return (() => {
        switch (paymentType?.payment_id) {
            case 1:
                return <GooglePay />;
            case 2:
                return (
                    <Elements stripe={stripePromise}>
                        <ApplePay />
                    </Elements>
                )
            default:
                return <Button disabled text='Select Card' />;
        }
    })();
}