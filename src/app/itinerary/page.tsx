"use client";
import React, { useState } from 'react';
import HomeHeader from '@/components/HomeHeader';
import Footer from '@/components/Footer';
import FlightBooking from '@/components/itinerary/FlightBooking';
import HotelBooking from '@/components/itinerary/HotelBooking';
import { useItinerary } from '@/context/ItineraryContext';
import withItineraryProvider from '@/HOC/withItineraryProvider';

const Page = () => {
    const { state, dispatch } = useItinerary();

    return (
        <div>
            
            <HomeHeader />

            <main>
                {state.selectedOutboundFlights && (
                    <FlightBooking 
                    flights={state.selectedOutboundFlights}
                    legs={state.selectedOutboundFlights.length}
                    outBoundFlight={true}
                    onClick={() => {}}
                    />
                )}
            </main>

            <Footer />
        </div>
    );
}

export default withItineraryProvider(Page);