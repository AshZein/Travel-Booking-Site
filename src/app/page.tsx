"use client";
import React, { useEffect } from 'react';
import {useRouter} from "next/navigation";

const Page = () => {
    const router = useRouter();

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
            <header className="header flex justify-between items-center bg-blue-800 text-white p-4">
                <div className="items-center flex gap-2">
                    <img src="logo_no_back.png" alt="FlyNext Logo" className="h-8" onClick={handleLogoClick}/>
                    <h1 className="text-2xl" onClick={handleLogoClick}>FlyNext</h1>
                </div>
                
                <div className="auth-buttons flex gap-4">
                    <button 
                        className="login-button bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        onClick={handleLoginClick}
                    >
                        Login
                    </button>
                    <button className="register-button bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        onClick={handleRegisterClick}
                    >
                        Register
                    </button>
                </div>
            </header>
            <main>
                <div>
                    <h1 className="text-2xl text-center mt-4">Welcome to FlyNext</h1>
                    <p className="text-center mt-4">The best place to book your next flight.</p>
                </div>
            </main>
            <footer className="footer bg-white text-white p-4 text-center">
                <p className="text-black">&copy; 2025 FlyNext</p>
            </footer>
        </div>
    );
}

export default Page;