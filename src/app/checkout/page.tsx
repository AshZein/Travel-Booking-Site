"use client";
import React, { useState, useEffect } from 'react';
import withItineraryProvider from '@/HOC/withItineraryProvider';
import { useItinerary } from '@/context/ItineraryContext';
import CheckoutFlightCard from '@/components/Checkout/CheckoutFlightCard';

const Page = () => {
    const { state, dispatch } = useItinerary();

    return(
        <div>
            <h1>Order Overview</h1>
            {state.selectedOutboundFlights.length > 0 ?
            <>
            <p>Departure Flight</p>
            <CheckoutFlightCard legs={state.selectedOutboundFlights.length} flights={state.selectedOutboundFlights} /> 
            </>
            : null}
            {state.selectedReturnFlights.length > 0? 
            <>
                <p>Return Flight</p>
                <CheckoutFlightCard legs={state.selectedReturnFlights.length} flights={state.selectedReturnFlights} /> 
            </>
            : null}
        </div>
    );
}

export default withItineraryProvider(Page);