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
    const [flightCredentials, setFlightCredentials] = React.useState<FlightCred | null>(null);
    const [billingAddress, setBillingAddress] = React.useState<Billing | null>(null);
    const [creditCardInfo, setCreditCardInfo] = React.useState<CreditCard | null>(null);
    const [selectedOutboundFlights, setSelectedOutboundFlights] = React.useState<Flight[]>([]);
    const [selectedReturnFlights, setSelectedReturnFlights] = React.useState<Flight[]>([]);
    const [selectedHotel, setSelectedHotel] = React.useState<Hotel | null>(null);
    const [selectedRoom, setSelectedRoom] = React.useState<Room | null>(null);
    const [selectedHotelCheckIn, setSelectedHotelCheckIn] = React.useState<string | null>(null);
    const [selectedHotelCheckOut, setSelectedHotelCheckOut] = React.useState<string | null>(null);
    const [selectedHotelPrice, setSelectedHotelPrice] = React.useState(0);
    const { state: itineraryState, dispatch: itineraryDispatch} = useItinerary(); // Access ItineraryContext state
    const { state: hotelState, dispatch: hotelDispatch } = useHotelItinerary(); // Access HotelItineraryContext state
    const { state: checkoutState, dispatch: checkoutDispatch} = useCheckout(); // Access CheckoutContext state

    useEffect(() => {
        setFlightCredentials(checkoutState.flightCredentials);
        setBillingAddress(checkoutState.billingAddress);
        setCreditCardInfo(checkoutState.creditCardInfo);
        setSelectedOutboundFlights(checkoutState.selectedOutboundFlights);
        setSelectedReturnFlights(checkoutState.selectedReturnFlights);
        setSelectedHotel(checkoutState.selectedHotel);
        setSelectedRoom(checkoutState.selectedRoom);
        setSelectedHotelCheckIn(checkoutState.selectedHotelCheckIn);
        setSelectedHotelCheckOut(checkoutState.selectedHotelCheckOut);
        setSelectedHotelPrice(checkoutState.selectedHotelPrice);

        // clear the checkout state
        checkoutDispatch({ type: 'CLEAR_CHECKOUT' });
        // clear the itinerary state
        itineraryDispatch({ type: 'CLEAR_ITINERARY' });
        // clear the hotel state
        hotelDispatch({ type: 'CLEAR_HOTEL_ITINERARY' });
    }, [checkoutState, itineraryState, hotelState, checkoutDispatch, itineraryDispatch, hotelDispatch]);


    return (
        <div>
            <CheckoutHeader />
        </div>
    );
}

export default withCheckoutProvider(Page);