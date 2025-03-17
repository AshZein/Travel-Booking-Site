"use client";
import React from 'react';
import Footer from "@/components/Footer";
import AuthHeader from '@/components/AuthHeader';

const Page = () =>{

    return (
        <div className="page-container">
            {/* <header className="header flex justify-between items-center bg-blue-800 text-white p-4">
                <div className="items-center flex gap-2">
                    <img src="logo_no_back.png" alt="FlyNext Logo" className="h-8" onClick={handleLogoClick}/>
                    <h1 className="text-2xl" onClick={handleLogoClick}>FlyNext</h1>
                </div>
            </header> */}
            <AuthHeader />
            <main>
                <div className="loginBox">
                    {/* login form box goes here */}
                </div>
            </main>
            <Footer/>
        </div>
    );
}

export default Page;