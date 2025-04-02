"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Footer from '@/components/Footer';
import Flight from '@/components/homePage/flight';
import HomeHeader from '@/components/HomeHeader';
import FlightResults from '@/components/flightSearch/FlightResults';
import { ItineraryProvider } from '@/context/ItineraryContext';
import withItineraryProvider from '@/HOC/withItineraryProvider';

const Page = () => {
    const router = useRouter();
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
                <Flight 
                    sourceLocation={sourceLocation}
                    destinationLocation={destinationLocation}
                    startDate={startDate}
                    endDate={endDate}
                    tType={tripType}
                    direction={direction}
                />
                <FlightResults 
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