import React from 'react';
import { useCheckout } from '../../context/CheckoutContext'

// Components
import Checkout from './Checkout'
import Empty from './Empty'
import Success from './Success'
import Failed from './Failed'

export default function Index({close}: any ) {

    const { productDetails, successMessage, errorMessage } = useCheckout();
    const [pageView, setPageView] = React.useState(<Checkout close={close} />)

    // Update page to empty state
    React.useEffect(() => {
        productDetails.length === 0 && setPageView(<Empty close={close} />)
    }, [productDetails])


    // Check to display success and failed message
    React.useEffect(() => {
        if (Object.keys(successMessage).length) {
            setPageView(<Success close={close} />)
        } else if (Object.keys(errorMessage).length) {
            setPageView(<Failed />)
        } else {
            setPageView(<Checkout close={close} />)
        }
    }, [successMessage, errorMessage])

    return (
        <React.Fragment>
            {pageView}
        </React.Fragment>
    )
}