import { BiChevronLeft } from 'react-icons/bi';

export default function Empty({close}: any) {

    return (
        <div className="flex h-full flex-col">
            <span className="w-full">
                <button onClick={ close } className="flex items-center mt-6">
                    <BiChevronLeft className="text-3xl" />
                    <p className="text-lg font-semibold">Back To Store</p>
                </button>
                <hr className="border-0 ml-2 mt-2 border-t border-gray-200" />
            </span>
            <div className="m-auto">
                <img src="/assets/checkout_images/emptyImg.png" width="100" className="m-auto" alt="empty image" />
                <p className="text-center mt-2 font-semibold text-2xl">Empty Cart</p>
            </div>
        </div>
    )
}