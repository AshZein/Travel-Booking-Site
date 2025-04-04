"use client";
import React, { use, useEffect } from 'react';
import CheckoutFlightCard from '@/components/checkout/checkoutFlightCard';
import CheckoutHeader from '@/components/checkout/CheckoutHeader';
import withCheckoutProvider from '@/HOC/withCheckoutProvider';
import withItineraryProvider from '@/HOC/withItineraryProvider';
import withHotelProvider from '@/HOC/withHotelProvider';
import { useItinerary } from '@/context/ItineraryContext';
import { useCheckout } from '@/context/CheckoutContext'; // Import CheckoutContext
import { useHotelItinerary } from '@/context/HotelItineraryContext';
import { Flight } from '@/types/flight';
import { Hotel } from '@/types/Hotel';
import { FlightCred } from '@/types/FlightCred';
import { Billing } from '@/types/Billing';
import { CreditCard } from '@/types/CreditCard';
import { Room } from '@/types/Room';

const Page = () => {
    const [confirmationData, setConfirmationData] = React.useState<{
        flightCredentials: FlightCred | null;
        billingAddress: Billing | null;
        creditCardInfo: CreditCard | null;
        selectedOutboundFlights: Flight[];
        selectedReturnFlights: Flight[];
        selectedHotel: Hotel | null;
        selectedRoom: Room | null;
        selectedHotelCheckIn: string | null;
        selectedHotelCheckOut: string | null;
        selectedHotelPrice: number;
    }>({
        flightCredentials: null,
        billingAddress: null,
        creditCardInfo: null,
        selectedOutboundFlights: [],
        selectedReturnFlights: [],
        selectedHotel: null,
        selectedRoom: null,
        selectedHotelCheckIn: null,
        selectedHotelCheckOut: null,
        selectedHotelPrice: 0,
    });

    const { state: itineraryState, dispatch: itineraryDispatch} = useItinerary(); // Access ItineraryContext state
    const { state: hotelState, dispatch: hotelDispatch } = useHotelItinerary(); // Access HotelItineraryContext state
    const { state: checkoutState, dispatch: checkoutDispatch} = useCheckout(); // Access CheckoutContext state

    useEffect(() => {
        // Set confirmation data only once when the component mounts
        setConfirmationData({
            flightCredentials: checkoutState.flightCredentials,
            billingAddress: checkoutState.billingAddress,
            creditCardInfo: checkoutState.creditCardInfo,
            selectedOutboundFlights: checkoutState.selectedOutboundFlights,
            selectedReturnFlights: checkoutState.selectedReturnFlights,
            selectedHotel: checkoutState.selectedHotel,
            selectedRoom: checkoutState.selectedRoom,
            selectedHotelCheckIn: checkoutState.selectedHotelCheckIn,
            selectedHotelCheckOut: checkoutState.selectedHotelCheckOut,
            selectedHotelPrice: checkoutState.selectedHotelPrice,
        });

        // Clear global states after setting confirmation data
        checkoutDispatch({ type: 'CLEAR_CHECKOUT' });
        itineraryDispatch({ type: 'CLEAR_ITINERARY' });
        hotelDispatch({ type: 'CLEAR_HOTEL_ITINERARY' });
    }, []); // Run only once when the component mounts

    return (
        <div>
            <CheckoutHeader />
            <div>
                <h1>Confirmation</h1>
                <h2>Flight Credentials</h2>
                {confirmationData.flightCredentials && (
                    <div>
                        <p>Name: {confirmationData.flightCredentials.firstName} {confirmationData.flightCredentials.middleName} {confirmationData.flightCredentials.lastName}</p>
                        <p>Email: {confirmationData.billingAddress?.email}</p>
                        <p>Phone: {confirmationData.billingAddress?.phoneNumber}</p>
                    </div>
                )}
                <h2>Billing Address</h2>
                {confirmationData.billingAddress && (
                    <div>
                        <p>Street: {confirmationData.billingAddress.streetAddress}</p>
                        <p>City: {confirmationData.billingAddress.city}</p>
                        <p>State: {confirmationData.billingAddress.province}</p>
                        <p>Zip: {confirmationData.billingAddress.postalCode}</p>
                    </div>
                )}
                <h2>Credit Card Info</h2>
                {confirmationData.creditCardInfo && (
                    <div>
                        <p>Card Number: {confirmationData.creditCardInfo.cardNumber}</p>
                        <p>Expiry Date: {confirmationData.creditCardInfo.expiryMonth}/{confirmationData.creditCardInfo.expiryYear}</p>
                    </div>
                )}
                <h2>Selected Outbound Flights</h2>
                {confirmationData.selectedOutboundFlights.map((flight, index) => (
                    <CheckoutFlightCard key={index} legs={confirmationData.selectedOutboundFlights.length} flights={[flight]} type="Outbound Flight" />
                ))}
                <h2>Selected Return Flights</h2>
                {confirmationData.selectedReturnFlights.map((flight, index) => (
                    <CheckoutFlightCard key={index} legs={confirmationData.selectedReturnFlights.length} flights={[flight]} type="Return Flight" />
                ))}
                <h2>Selected Hotel</h2>
                {confirmationData.selectedHotel && (
                    <div>
                        <p>Name: {confirmationData.selectedHotel.name}</p>
                        <p>Price: ${confirmationData.selectedHotelPrice.toFixed(2)}</p>
                        <p>Check-in: {confirmationData.selectedHotelCheckIn}</p>
                        <p>Check-out: {confirmationData.selectedHotelCheckOut}</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default withHotelProvider(withItineraryProvider(withCheckoutProvider(Page)));