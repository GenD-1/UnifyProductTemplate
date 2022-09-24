import React from 'react'

export interface PayOptionInterface {
    payment_id: number;
    image: string;
    name: string;
}

export default function PaymentRadio({setPaymentType}: any ) {

    const [open, setOpen] = React.useState<Boolean>(false);
    const [checked, setChecked] = React.useState<PayOptionInterface>();

    const handleSelected = (pay: PayOptionInterface) => {
        setOpen(false);
        setChecked(pay);
        setPaymentType(pay);
    };

    const paymentOptions = [
        {
            payment_id: 1,
            image: '/assets/checkout_images/googleImg.png',
            name: 'Google Pay',
        },        
        {
            payment_id: 2,
            image: '/assets/checkout_images/appleImg.png',
            name: 'Apple Pay',
        },
    ]

    return (
        <div className="mt-6">
            {
                (!checked || open) && paymentOptions.map((pay, i) => (
                    <React.Fragment key={i}>
                        <button onClick={() => handleSelected(pay)} className="flex w-full items-center justify-between">
                            <span className="flex items-center">
                            <img src={pay.image} alt={pay.name} width='50' />
                                <label className='ml-3'>{pay.name}</label>
                            </span>
                            <input type="radio" name={pay.name} value={pay.payment_id} />
                        </button>
                        <hr className="border-0 my-3 border-t border-gray-300" />
                    </React.Fragment>
                ))
            }
            {
                checked && !open && (
                    <React.Fragment>
                        <button onClick={() => setOpen(true)} className="flex w-full items-center justify-between">
                            <span className="flex items-center">
                            <img src={checked?.image} alt={checked?.name} width='50' />
                                <label className='ml-3'>{checked?.name}</label>
                            </span>
                            <input type="radio" name={checked?.name} defaultChecked value={checked?.name} />
                        </button>
                        <hr className="border-0 my-3 border-t border-gray-300" />
                    </React.Fragment>
                )
            }
        </div>
    )
}