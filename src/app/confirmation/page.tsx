"use client";
import React, { useEffect } from 'react';
import { useCheckout } from '@/context/CheckoutContext';
import CheckoutFlightCard from '@/components/checkout/checkoutFlightCard';
import CheckoutHeader from '@/components/checkout/CheckoutHeader';
import FlightCredentials from '@/components/checkout/Credentials';
import BillingAddress from '@/components/checkout/BillingAddress';
import CreditCardInfo from '@/components/checkout/CreditCardInfo';
import withCheckoutProvider from '@/HOC/withCheckoutProvider';

const Page = () => {
    return (
        <div>
            <CheckoutHeader />
        </div>
    );
}

export default withCheckoutProvider(Page);