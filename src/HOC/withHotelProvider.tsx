import React from 'react';
import { HotelItineraryProvider } from '@/context/HotelItineraryContext';

const withHotelProvider = (Component: React.ComponentType) => {
    return (props: any) => (
        <HotelItineraryProvider>
            <Component {...props} />
        </HotelItineraryProvider>
    );
};

export default withHotelProvider;