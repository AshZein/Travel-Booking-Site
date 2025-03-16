"use client";
import React, { useState, useEffect } from 'react';
import {useRouter} from "next/navigation";

const Page = () => {
    const router = useRouter();
    const [selectedOption, setSelectedOption] = useState('hotel');

    const handleLoginClick = () => {
        router.push('/login');
    };

    const handleRegisterClick = () => {
        router.push('/register');
    };

    const handleLogoClick = () => {
        router.push('/');
    };

    return (
        <div className="page-container">
            <header className="header flex justify-between items-center text-white p-4">
                <div className="items-center flex gap-2">
                    <img src="logo_no_back.png" alt="FlyNext Logo" className="h-8" onClick={handleLogoClick}/>
                    <h1 className="text-2xl" onClick={handleLogoClick}>FlyNext</h1>
                </div>
                
                <div className="auth-buttons flex gap-4">
                    <button 
                        className="auth-button text-white font-bold py-2 px-4 rounded"
                        onClick={handleLoginClick}
                    >
                        Login
                    </button>
                    <button className="auth-button text-white font-bold py-2 px-4 rounded"
                        onClick={handleRegisterClick}
                    >
                        Register
                    </button>
                </div>
            </header>
            <main>
                <div>
                    <div> 
                        <ul className="flex items-center gap-4">
                            <li className={`hotel-flight-button flex items-center justify-center ${selectedOption === 'hotel' ? 'border border-white' : ''}`} onClick={() => setSelectedOption('hotel')}>
                                <img src="hotel.png" className="h-8"/>Hotel
                            </li>
                            <li className={`hotel-flight-button flex items-center justify-center ${selectedOption === 'flight' ? 'border border-white' : ''}`} onClick={() => setSelectedOption('flight')}>
                                <img src="airplane.png" className="h-8"/>Flight
                            </li>
                            <li className={`hotel-flight-button flex items-center justify-center ${selectedOption === 'hotel-flight' ? 'border border-white' : ''}`} onClick={() => setSelectedOption('hotel-flight')}>
                                <img src="hotelplane.png" className="h-8"/>Hotel + Flight
                            </li>
                        </ul>
                    </div>
                    <div> {/* search boxes  should update based on booking selection type*/}</div>
                </div>
            </main>
            <footer className="footer bg-white text-white p-4 text-center">
                <p className="text-black">&copy; 225 FlyNext</p>
            </footer>
        </div>
    );
}

export default Page;