"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Footer from '@/components/Footer';
import Flight from '@/components/homePage/flight';
import HomeHeader from '@/components/HomeHeader';
import FlightResults from '@/components/flightSearch/FlightResults';

const Page = () => {
    const router = useRouter();
    const [sourceLocation, setSourceLocation] = useState('');
    const [destinationLocation, setDestinationLocation] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    useEffect(() => {
        const searchParams = new URLSearchParams(window.location.search);
        setSourceLocation(searchParams.get('sourceLocation') || '');
        setDestinationLocation(searchParams.get('destinationLocation') || '');
        setStartDate(searchParams.get('startDate') || '');
        setEndDate(searchParams.get('endDate') || '');
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
                />
                < FlightResults />
            </main>
            <Footer />
        </div>
    );
}

export default Page;