"use client";
import React, { useState } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import HomeHeader from '@/components/HomeHeader';
import Footer from '@/components/Footer';
import Flight from '@/components/homePage/flight';
import Hotel from '@/components/homePage/hotel';
import HotelFlight from '@/components/homePage/hotelFlight';
import HotelCreate from '@/components/homePage/hotelCreate';
import HotelManage from '@/components/homePage/hotelManage';

import { ItineraryProvider } from '@/context/ItineraryContext';
import withItineraryProvider from '@/HOC/withItineraryProvider';

const Page = () => {
    const [selectedOption, setSelectedOption] = useState('hotel');

    return (
        <ItineraryProvider>
            <div className="page-container">
                <HomeHeader />
                <main>
                    <div className="home-center w-full h-[66vh]">
                        <div className="search-box-container">
                            <ul className="flex items-left gap-4 pb-8">
                                <li className={`hotel-flight-button flex items-center justify-center ${selectedOption === 'hotel' ? 'selected border border-white' : 'border border-black'}`} onClick={() => setSelectedOption('hotel')}>
                                    <img src="hotel.png" className="h-8"/>Hotel
                                </li>
                                <li className={`hotel-flight-button flex items-center justify-center ${selectedOption === 'flight' ? 'selected border border-white' : ''}`} onClick={() => setSelectedOption('flight')}>
                                    <img src="airplane.png" className="h-8"/>Flight
                                </li>
                                <li className={`hotel-flight-button flex items-center justify-center ${selectedOption === 'hotel-flight' ? 'selected border border-white' : ''}`} onClick={() => setSelectedOption('hotel-flight')}>
                                    <img src="hotelplane.png" className="h-8"/>Hotel + Flight
                                </li>
                                <li className={`hotel-flight-button flex items-center justify-center ${selectedOption === 'create-hotel' ? 'selected border border-white' : ''}`} onClick={() => setSelectedOption('create-hotel')}>
                                    <img src="hotel.png" className="h-8"/>Create a Hotel
                                </li>
                                <li className={`hotel-flight-button flex items-center justify-center ${selectedOption === 'manage-hotel' ? 'selected border border-white' : ''}`} onClick={() => setSelectedOption('manage-hotel')}>
                                    <img src="hotel.png" className="h-8"/>Manage Your Hotels
                                </li>
                            </ul>
                            {selectedOption === 'flight' && (
                                <Flight 
                                    direction="outbound"
                                    sourceLocation="" 
                                    destinationLocation="" 
                                    startDate={new Date().toISOString()} 
                                    endDate={new Date().toISOString()} 
                                    tType="" 
                                />
                            )}
                            {selectedOption === 'hotel' && (
                                <Hotel />
                            )}
                            {selectedOption === 'hotel-flight' && (
                                <HotelFlight 
                                direction="outbound"
                                sourceLocation="" 
                                destinationLocation="" 
                                startDate={new Date().toISOString()} 
                                endDate={new Date().toISOString()} 
                                tType=""
                                />
                            )}
                            {selectedOption === 'create-hotel' && (
                                <HotelCreate />
                            )}
                            {selectedOption === 'manage-hotel' && (
                                <HotelManage />
                            )}
                        </div>
                    </div>
                </main>
                <Footer />
            </div>
        </ItineraryProvider> 
    );
}

export default withItineraryProvider(Page);