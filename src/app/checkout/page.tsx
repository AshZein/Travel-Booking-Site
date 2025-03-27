"use client";
import React, { useState, useEffect } from 'react';
import withItineraryProvider from '@/HOC/withItineraryProvider';
import { useItinerary } from '@/context/ItineraryContext';
import CheckoutFlightCard from '@/components/checkout/CheckoutFlightCard';
import CheckoutHeader from '@/components/checkout/CheckoutHeader';
import FlightCredentials from '@/components/checkout/Credentials';
import BillingAddress from '@/components/checkout/BillingAddress';
import CreditCardInfo from '@/components/checkout/CreditCardInfo';

const Page = () => {
    const { state, dispatch } = useItinerary();

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

export default withItineraryProvider(Page);