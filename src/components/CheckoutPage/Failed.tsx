import { BiChevronLeft } from 'react-icons/bi';
import { useCheckout } from '../../context/CheckoutContext'

export default function Failed() {

    const { setErrorMessage } = useCheckout();

    const handleClose = () => {
        setErrorMessage({})
    }

    return (
        <div className="flex h-full flex-col">
            <span className="w-full">
                <button onClick={handleClose} className="flex items-center mt-6">
                    <BiChevronLeft className="text-3xl" />
                    <p className="text-lg font-semibold">Try Another Card</p>
                </button>
                <hr className="border-0 ml-2 mt-2 border-t border-gray-200" />
            </span>
            <div className="m-auto">
                <img src="/assets/checkout_images/errorImg.png" width="100" className="m-auto" alt="sucess image" />
                <p className="text-center my-2 font-semibold text-2xl">Payment failed</p>
            </div>
        </div>
    )
}