"use client";
import React, { useEffect } from 'react';
import { useCheckout } from '@/context/CheckoutContext';
import CheckoutFlightCard from '@/components/checkout/checkoutFlightCard';
import CheckoutHeader from '@/components/checkout/CheckoutHeader';
import FlightCredentials from '@/components/checkout/Credentials';
import BillingAddress from '@/components/checkout/BillingAddress';
import CreditCardInfo from '@/components/checkout/CreditCardInfo';
import withCheckoutProvider from '@/HOC/withCheckoutProvider';
import HotelInfoCard from '@/components/hotel/hotelInfoCard';
import CheckoutRoomCard from '@/components/checkout/CheckoutRoom';
import {totalFlightCost} from '@/utils/flight';

const Page = () => {
    const { state } = useCheckout();
    const [hotelImg, setHotelImg] = React.useState<string>('');

    const fetchHotelImg = async (hotelId: number) => {
        const response = await fetch(`/api/hotel/images?hotelId=${hotelId}`);
        const data = await response.json();
        setHotelImg(data.image || '');
    }


    useEffect(() => {
        // Redirect to itinerary page if no outbound flights are selected
        if (state.selectedOutboundFlights.length === 0) {
            window.location.href = '/itinerary';
        }
        fetchHotelImg(state.selectedHotel?.hotelId || 0);
    }, [state.selectedOutboundFlights]);



    const handleSubmit = async () => {
        // Validate all required fields
        if (
            (state.selectedOutboundFlights.length > 0 && !state.flightCredentials) ||
            !state.billingAddress ||
            !state.creditCardInfo
        ) {
            alert('Please fill in all required fields.');
            return;
        }

        // Example: Log the collected data
        console.log('Submitting checkout data:', {
            flightCredentials: state.flightCredentials,
            billingAddress: state.billingAddress,
            creditCardInfo: state.creditCardInfo,
            selectedOutboundFlights: state.selectedOutboundFlights,
            selectedReturnFlights: state.selectedReturnFlights,
            selectedHotel: state.selectedHotel,
            selectedRoom: state.selectedRoom,
            selectedHotelCheckIn: state.selectedHotelCheckIn,
            selectedHotelCheckOut: state.selectedHotelCheckOut,
            selectedHotelPrice: state.selectedHotelPrice,
        });

        const token = localStorage.getItem('accessToken'); // Retrieve the token from localStorage
        // Example: Send the data to an API endpoint
        try {
            const response = await fetch('/api/checkout/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`, // Add the token to the Authorization header
                    },
                body: JSON.stringify({
                    flightCredentials: state.flightCredentials,
                    billingAddress: state.billingAddress,
                    creditCardInfo: state.creditCardInfo,
                    selectedOutboundFlights: state.selectedOutboundFlights,
                    selectedReturnFlights: state.selectedReturnFlights,
                    selectedHotel: state.selectedHotel,
                    selectedRoom: state.selectedRoom,
                    selectedHotelCheckIn: state.selectedHotelCheckIn,
                    selectedHotelCheckOut: state.selectedHotelCheckOut,
                    selectedHotelPrice: state.selectedHotelPrice,
                    
                }),
            });

            if (response.ok) {
                alert('Checkout successful!');
                window.location.href = '/confirmation'; // Redirect to confirmation page
            } else {
                alert('Checkout failed. Please try again.');
            }
        } catch (error) {
            console.error('Error submitting checkout:', error);
            alert('An error occurred. Please try again.');
        }
    };

    return (
        <div>
            <CheckoutHeader />
            <h1>Order Overview</h1>
            {state.selectedHotel && (
                <div>
                    <HotelInfoCard hotel={state.selectedHotel} hotelImg={hotelImg} />
                    {state.selectedRoom && (
                        <CheckoutRoomCard
                            key={state.selectedRoom.roomId || 'defaultKey' // Use a unique identifier as the key
                            }
                            room={state.selectedRoom}
                            hotel={state.selectedHotel}
                            checkinDate={state.selectedHotelCheckIn || ''}
                            checkoutDate={state.selectedHotelCheckOut || ''}
                        />
                    )}
                </div>
            )}
            {/* Display selected outbound flight */}
            {state.selectedOutboundFlights.length > 0 && (
                <CheckoutFlightCard
                    legs={state.selectedOutboundFlights.length}
                    flights={state.selectedOutboundFlights}
                    type="Departure Flight"
                />
            )}

            {/* Display selected return flight */}
            {state.selectedReturnFlights.length > 0 && (
                <CheckoutFlightCard
                    legs={state.selectedReturnFlights.length}
                    flights={state.selectedReturnFlights}
                    type="Return Flight"
                />
            )}

            {/* Flight Credentials Form */}
            {state.selectedOutboundFlights.length > 0 && <FlightCredentials />}

            {/* total breakdown */}
            <div>
                {state.selectedOutboundFlights.length > 0 && (
                    <div className="flex justify-between items-center mt-4">
                        <p className="text-lg font-semibold">Departure Flight Cost: {totalFlightCost(state.selectedOutboundFlights)}</p>
                        </div>
                )}
                {state.selectedReturnFlights.length > 0 && (
                    <div className="flex justify-between items-center mt-4">
                        <p className="text-lg font-semibold">Departure Flight Cost: {totalFlightCost(state.selectedReturnFlights)}</p>
                        </div>
                )}
                {state.selectedHotelPrice && (
                    <div>
                        <p className="text-lg font-semibold">Hotel Cost: ${state.selectedHotelCheckIn && state.selectedHotelCheckOut ? 
                            state.selectedHotelPrice * Math.ceil((new Date(state.selectedHotelCheckOut).getTime() - 
                            new Date(state.selectedHotelCheckIn).getTime()) / (1000 * 60 * 60 * 24)) 
                            : 'N/A'}
                        </p>
                    </div>
                )}

            </div>

            {/* Billing Address Form */}
            <BillingAddress />

            {/* Credit Card Info Form */}
            <CreditCardInfo />

            {/* Submit Button */}
            <div className="flex justify-center mt-6">
                <button
                    onClick={handleSubmit}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                    Submit Order
                </button>
            </div>
        </div>
    );
};

export default withCheckoutProvider(Page);