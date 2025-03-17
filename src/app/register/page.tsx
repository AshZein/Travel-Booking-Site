"use client";
import React from 'react';
import Footer from '@/components/Footer';
import AuthHeader from '@/components/AuthHeader';

const Page = () => {
    return (
        <div className="page-container">
            <AuthHeader />
            <main>
                <div className="loginBox">
                    {/* login form box goes here */}
                </div>
            </main>
            <Footer />
        </div>
    );
}

export default Page;