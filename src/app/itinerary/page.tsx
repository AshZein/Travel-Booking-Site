"use client";
import React, { useState } from 'react';
import HomeHeader from '@/components/HomeHeader';
import Footer from '@/components/Footer';
import FlightBooking from '@/components/itinerary/FlightBooking';
import HotelBooking from '@/components/itinerary/HotelBooking';

const Page = () => {
    return (
        <div>
            
            <HomeHeader />

            <main>
                <FlightBooking />
            </main>

            <Footer />
        </div>
    );
}

export default Page;