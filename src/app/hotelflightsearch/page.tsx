"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Footer from '@/components/Footer';
import HotelFlight from '@/components/homePage/hotelFlight';
import HomeHeader from '@/components/HomeHeader';
import HotelFlightResults from '@/components/hotelFlightSearch/HotelFlightResults';
import withItineraryProvider from '@/HOC/withItineraryProvider';
import HotelSuggestions from '@/components/hotelFlightSearch/HotelSuggestions';
import { useItinerary } from '@/context/ItineraryContext';
const Page = () => {
    const router = useRouter();
    const { state, dispatch } = useItinerary();
    const [sourceLocation, setSourceLocation] = useState('');
    const [destinationLocation, setDestinationLocation] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [tripType, setTripType] = useState('one-way');
    const [direction, setDirection] = useState('outbound');

    useEffect(() => {
        const searchParams = new URLSearchParams(window.location.search);
        setSourceLocation(searchParams.get('sourceLocation') || '');
        setDestinationLocation(searchParams.get('destinationLocation') || '');
        setStartDate(searchParams.get('startDate') || '');
        setEndDate(searchParams.get('endDate') || '');
        setTripType(searchParams.get('tripType') || 'one-way');
        setDirection(searchParams.get('direction') || 'outbound');
    }, []);

    return (
        <div className="page-container">
            <HomeHeader />
            <main>
                <HotelFlight 
                    sourceLocation={sourceLocation}
                    destinationLocation={destinationLocation}
                    startDate={startDate}
                    endDate={endDate}
                    tType={tripType}
                    direction={direction}
                />
                <HotelFlightResults 
                    sourceLocation={sourceLocation}
                    destinationLocation={destinationLocation}
                    startDate={startDate}
                    endDate={endDate}
                    tripType={tripType}
                    direction={direction}
                />
            </main>
            <Footer />
        </div>
    );
}

export default withItineraryProvider(Page);