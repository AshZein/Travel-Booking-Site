"use client";
import React, { useState } from 'react';
import withItineraryProvider from '@/HOC/withItineraryProvider';
import HomeHeader from '@/components/HomeHeader';
import Footer from '@/components/Footer';

const Page = () => {
    return (
        <div>
            <HomeHeader />
            <main>
                <h1>Notifications</h1>
            </main>
            <Footer />
        </div>
    );  
}

export default withItineraryProvider(Page);