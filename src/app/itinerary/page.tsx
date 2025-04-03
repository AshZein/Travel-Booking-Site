"use client";
import React, { useState } from 'react';
import HomeHeader from '@/components/HomeHeader';
import Footer from '@/components/Footer';
import FlightBooking from '@/components/itinerary/FlightBooking';
import HotelBooking from '@/components/itinerary/HotelBooking';
import { useItinerary } from '@/context/ItineraryContext';
import { useCheckout } from '@/context/CheckoutContext'; // Import CheckoutContext
import withItineraryProvider from '@/HOC/withItineraryProvider';
import withCheckoutProvider from '@/HOC/withCheckoutProvider'; // Import CheckoutProvider HOC
import { Flight } from '@/types/flight';
import FlightDetailPopUp from '@/components/flightSearch/FlightDetailPopUp';
import { useRouter } from 'next/navigation';
import { Hotel } from '@/types/Hotel';

const Page = () => {
    const { state: itineraryState, dispatch: itineraryDispatch } = useItinerary(); // Access ItineraryContext state and dispatch
    const { state: checkoutState, dispatch: checkoutDispatch } = useCheckout(); // Access CheckoutContext state and dispatch
    const [showPopup, setShowPopup] = useState(false);
    const [selectedFlight, setSelectedFlight] = useState<Flight[] | null>(null);
    const router = useRouter();

    const handleFlightClick = (flights: Flight[]) => {
        setSelectedFlight(flights);
        setShowPopup(true);
    };

    const closePopup = () => {
        setShowPopup(false);
    };

    const handleCheckout = () => {
        if (itineraryState.selectedOutboundFlights.length > 0) {
            // Update the CheckoutContext with selected flights
            checkoutDispatch({
                type: 'SELECT_OUTBOUND_FLIGHT',
                payload: itineraryState.selectedOutboundFlights[0], // Example: Add the first outbound flight
            });

            if (itineraryState.selectedReturnFlights.length > 0) {
                checkoutDispatch({
                    type: 'SELECT_RETURN_FLIGHT',
                    payload: itineraryState.selectedReturnFlights[0], // Example: Add the first return flight
                });
            }
        }
        //  Add hotel to checkout context HERE!!!
        if (itineraryState.selectedHotel){
            checkoutDispatch({
                type: 'SELECT_HOTEL',
                payload: itineraryState.selectedHotel,
            });
            checkoutDispatch({
                type: 'SELECT_ROOM',
                payload: itineraryState.selectedRoom,
            });
            checkoutDispatch({
                type: 'SET_HOTEL_CHECK_IN',
                payload: itineraryState.selectedHotelCheckIn,
            });
            checkoutDispatch({
                type: 'SET_HOTEL_CHECK_OUT',
                payload: itineraryState.selectedHotelCheckOut,
            });
            checkoutDispatch({
                type: 'SET_HOTEL_PRICE',
                payload: itineraryState.selectedRoom?.price ? itineraryState.selectedRoom.price : 0,
            });
        }
        router.push('/checkout'); // Redirect to the checkout page
    };

    const handleRemoveHotel = () => {
        const data = {
            hotel: itineraryState.selectedHotel,
            room: itineraryState.selectedRoom,
            checkin: itineraryState.selectedHotelCheckIn,
            checkout: itineraryState.selectedHotelCheckOut,
            price: itineraryState.selectedRoom?.price ? itineraryState.selectedRoom.price : 0,
        };
        itineraryDispatch({ type: 'UNSELECT_HOTEL_ROOM', payload: data });
    };

    return (
        <div>
            <HomeHeader />

            <main>
                {itineraryState.selectedOutboundFlights && (
                    <FlightBooking
                        flights={itineraryState.selectedOutboundFlights}
                        legs={itineraryState.selectedOutboundFlights.length}
                        outBoundFlight={true}
                        onClick={() => handleFlightClick(itineraryState.selectedOutboundFlights)}
                    />
                )}

                {itineraryState.selectedOutboundFlights.length > 0 && (
                    <FlightBooking
                        flights={itineraryState.selectedReturnFlights}
                        legs={itineraryState.selectedReturnFlights.length}
                        outBoundFlight={false}
                        onClick={() => handleFlightClick(itineraryState.selectedReturnFlights)}
                    />
                )}
                {itineraryState.selectedHotel && (
                    <HotelBooking
                        hotel={itineraryState.selectedHotel}
                        checkinDate={itineraryState.selectedHotelCheckIn}
                        checkoutDate={itineraryState.selectedHotelCheckOut}
                        onRemove={handleRemoveHotel}
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

                {/* Checkout Button */}
                <div className="flex justify-center mt-6">
                    <button
                        onClick={handleCheckout}
                        disabled={itineraryState.selectedOutboundFlights.length === 0} // Disable if no outbound flights
                        className={`px-6 py-3 rounded-lg font-semibold ${
                            itineraryState.selectedOutboundFlights.length === 0
                                ? 'bg-gray-400 text-gray-700 cursor-not-allowed' // Grayed out and unclickable
                                : 'bg-blue-600 text-white hover:bg-blue-700 cursor-pointer' // Active and clickable
                        }`}
                    >
                        Checkout
                    </button>
                </div>
            </main>

            <Footer />
        </div>
    );
};

// Wrap the component with both ItineraryProvider and CheckoutProvider
export default withItineraryProvider(withCheckoutProvider(Page));