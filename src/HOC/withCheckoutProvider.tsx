import React from 'react';
import { CheckoutProvider } from '@/context/CheckoutContext';

const withCheckoutProvider = (Component: React.ComponentType) => {
    return (props: any) => (
        <CheckoutProvider>
            <Component {...props} />
        </CheckoutProvider>
    );
};

export default withCheckoutProvider;