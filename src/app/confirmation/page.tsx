"use client";
import React, { use, useEffect } from 'react';
import CheckoutFlightCard from '@/components/checkout/checkoutFlightCard';
import CheckoutHeader from '@/components/checkout/CheckoutHeader';
import FlightCredentials from '@/components/checkout/Credentials';
import BillingAddress from '@/components/checkout/BillingAddress';
import CreditCardInfo from '@/components/checkout/CreditCardInfo';
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
    }, [checkoutState]);

    useEffect(() => {
        checkoutDispatch({ type: 'CLEAR_CHECKOUT' });
        itineraryDispatch({ type: 'CLEAR_ITINERARY' });
        hotelDispatch({ type: 'CLEAR_HOTEL_ITINERARY' });
        console.log("Cleared states");
    }, []);

    return (
        <div>
            <CheckoutHeader />
        </div>
    );
}

export default withCheckoutProvider(Page);