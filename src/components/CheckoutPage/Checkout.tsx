import React from 'react'
import "./index.scss"
import { MdDelete } from 'react-icons/md';
import { useCheckout } from '../../context/CheckoutContext'
import { X } from 'react-feather'
import styled from 'styled-components'

// Componenets
import Payment from './Payment'
import PaymentRadio from './PaymentRadio'

const CloseIconWrapper = styled.button`
    position: absolute;
    right: 1rem;
    top: 1rem;
`

export interface PayOptionInterface {
    payment_id: number;
    image: string;
    name: string;
}

export default function Checkout({close}: any) {

    const [payOption, setPayOption] = React.useState<PayOptionInterface>();

    const { productDetails, setProductDetails } = useCheckout();
    const [{
        productName: productName = '',
        productColor: productColor = '',
        productCost: productCost = 0,
        productImage: productImage = null,
        productQuantity: productQuantity = 0,
        productDescription: productDescription = '',
    } = {}] = productDetails;

    const handleDelete = () => setProductDetails([]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setProductDetails(
            [{
                ...productDetails[0],
                productQuantity: e.target.value
            }]
        )
    }

    const tax = 2.75;
    const calcSubtotal = Number((productCost*productQuantity).toFixed(2));
    const calcTotal = (calcSubtotal+tax).toFixed(2);

    return (
        <div className="h-full">
            <CloseIconWrapper onClick={ close }>
                <X size={'24px'} />
            </CloseIconWrapper>
            <div className="h-full flex flex-col justify-between">

                <div className="mt-6">
                    <p className="font-semibold text-xl">Checkout</p>
                    <div className="flex mt-2 items-end justify-between">
                        <p className="text-xs text-gray-500">{productDetails.length} Item(s)</p>
                        <MdDelete className="cursor-pointer text-xl" onClick={handleDelete} />
                    </div>
                    <hr className="border-0 my-5 border-t border-gray-300" />
                    <div className="w-full flex items center justify-between mb-4">
                        <img src={`/assets/${productImage}`} alt={productName} className='product-image-class' />
                        <div className="w-52 sm:w-3/4 h-auto flex flex-col justify-between">
                            <p className="text-sm capitalize font-medium">{productName}</p>
                            <p className="text-xs text-gray-500">{productDescription}</p>
                            <p className="text-xs capitalize text-gray-500">Color: {productColor}</p>
                        </div>
                        <div className="w-12 flex flex-col justify-between items-end">
                            <input
                                onChange={(e) => handleChange(e)}
                                type="number"
                                min="1"
                                max="20"
                                value={productQuantity}
                            />
                            <p className="text-sm">{productCost}</p>
                        </div>
                    </div>
                </div>

                <div className="pt-16 pb-4">
                    <hr className="border-0 my-5 border-t border-gray-300" />
                    <div className="flex justify-between mb-2">
                        <p className="text-sm text-gray-500">Subtotal</p>
                        <p className="text-sm text-gray-500">${calcSubtotal}</p>
                    </div>
                    <div className="flex justify-between mb-4">
                        <p className="text-sm text-gray-500">Tax</p>
                        <p className="text-sm text-gray-500">${tax}</p>
                    </div>
                    <div className="flex justify-between">
                        <p className="font-semibold">Total</p>
                        <p className="font-semibold">${calcTotal}</p>
                    </div>
                    <hr className="border-0 my-5 border-t border-gray-300" />
                    <p className="font-semibold">Payment Mode</p>
                    <PaymentRadio setPaymentType={setPayOption} />
                </div>

                <div className="pb-4">
                    <Payment paymentType={payOption} />
                </div>
            </div>
        </div>
    )
}