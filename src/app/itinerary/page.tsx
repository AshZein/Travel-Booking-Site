"use client";
import React, { useState } from 'react';
import HomeHeader from '@/components/HomeHeader';
import Footer from '@/components/Footer';
import FlightBooking from '@/components/itinerary/FlightBooking';
import HotelBooking from '@/components/itinerary/HotelBooking';
import { useItinerary } from '@/context/ItineraryContext';
import withItineraryProvider from '@/HOC/withItineraryProvider';
import { Flight } from '@/types/flight';
import FlightDetailPopUp from '@/components/flightSearch/FlightDetailPopUp';

const Page = () => {
    const { state, dispatch } = useItinerary();
    const [showPopup, setShowPopup] = useState(false); // State for showing popup
    const [selectedFlight, setSelectedFlight] = useState<Flight[] | null>(null); // State for selected flight
    
    const handleFlightClick = (flights: Flight[]) => {
        setSelectedFlight(flights);
        setShowPopup(true);
    };

    const closePopup = () => {
        setShowPopup(false);
    };

    return (
        <div>
            
            <HomeHeader />

            <main>
                {state.selectedOutboundFlights && (
                    <FlightBooking 
                    flights={state.selectedOutboundFlights}
                    legs={state.selectedOutboundFlights.length}
                    outBoundFlight={true}
                    onClick={() => handleFlightClick(state.selectedOutboundFlights)}
                    />
                )}

            {showPopup && selectedFlight && (
                <div className="popup">
                    <div className="popup-content">
                        <button onClick={closePopup} className="tripType-button p-2">✕</button>
                        <FlightDetailPopUp legs={selectedFlight.length} flights={selectedFlight} />
                    </div>
                </div>
            )}
            </main>

            <Footer />
        </div>
    );
}

export default withItineraryProvider(Page);