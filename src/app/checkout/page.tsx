"use client";
import React, { useState, useEffect } from 'react';
import withItineraryProvider from '@/HOC/withItineraryProvider';
import { useItinerary } from '@/context/ItineraryContext';

const Page = () => {
    const { state, dispatch } = useItinerary();

    return(
        <div>
            <h1>Order Overview</h1>
            

        </div>
    );
}

export default withItineraryProvider(Page);