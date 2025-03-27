"use client";
import React, { useEffect } from 'react';
import { useCheckout } from '@/context/CheckoutContext';
import CheckoutFlightCard from '@/components/checkout/CheckoutFlightCard';
import CheckoutHeader from '@/components/checkout/CheckoutHeader';
import FlightCredentials from '@/components/checkout/Credentials';
import BillingAddress from '@/components/checkout/BillingAddress';
import CreditCardInfo from '@/components/checkout/CreditCardInfo';
import withCheckoutProvider from '@/HOC/withCheckoutProvider';

const Page = () => {
    const { state, dispatch } = useCheckout();

    useEffect(() => {
        // will NEED to check if hotels are also not filled in
        if (state.selectedOutboundFlights.length === 0) {
            window.location.href = '/itinerary';
        }
    }, [state.selectedOutboundFlights]);

    return(
        <div>
            <CheckoutHeader />
            <h1>Order Overview</h1>
            {state.selectedOutboundFlights.length > 0 ?
            <>
            <CheckoutFlightCard legs={state.selectedOutboundFlights.length} flights={state.selectedOutboundFlights} type={"Departure Flight"} /> 
            </>
            : null}
            {state.selectedReturnFlights.length > 0? 
            <>
                <CheckoutFlightCard legs={state.selectedReturnFlights.length} flights={state.selectedReturnFlights} type={"Return Flight"} /> 
            </>
            : null}

            {state.selectedOutboundFlights.length > 0 ? <FlightCredentials /> : null}
            <BillingAddress />
            <CreditCardInfo />
        </div>
    );
}

export default withCheckoutProvider(Page);