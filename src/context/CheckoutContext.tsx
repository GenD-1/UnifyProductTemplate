import React from 'react';

interface CheckoutArray {
  productName: string;
  productColor?: string;
  productCost: number;
  productImage: any;
  productQuantity: number;
  productDescription: string;
}

interface CheckoutContextInterface {
  productDetails: CheckoutArray[] | any;
  setProductDetails: (productDetails: CheckoutArray[]) => void;
  successMessage: Object;
  setSuccessMessage: (msg: Object) => void;
  errorMessage: Object;
  setErrorMessage: (msg: Object) => void;
}

type Props = {
  children: JSX.Element;
};

const CheckoutContext = React.createContext<CheckoutContextInterface>({
  productDetails: [],
  setProductDetails: (productDetails: CheckoutArray[]) => {},
  successMessage: {},
  setSuccessMessage: (msg: Object) => {},
  errorMessage: {},
  setErrorMessage: (msg: Object) => {},
});

export function useCheckout() {
  return React.useContext(CheckoutContext);
}

const CheckoutProvider: React.FC<Props> = ({ children }) => {

  const [successMessage, setSuccessMessage] = React.useState<Object>({});
  const [errorMessage, setErrorMessage] = React.useState<Object>({});
  const [productDetails, setProductDetails] = React.useState<CheckoutArray[]>([]);

  return (
    <CheckoutContext.Provider
      value={{
        productDetails,
        setProductDetails,
        successMessage,
        setSuccessMessage,
        errorMessage,
        setErrorMessage,
      }}
    >
      {children}
    </CheckoutContext.Provider>
  );
};

export { CheckoutProvider, CheckoutContext };
