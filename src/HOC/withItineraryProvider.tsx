import React from 'react';
import { ItineraryProvider } from '@/context/ItineraryContext';

const withItineraryProvider = (Component: React.ComponentType) => {
    return (props: any) => (
        <ItineraryProvider>
            <Component {...props} />
        </ItineraryProvider>
    );
};

export default withItineraryProvider;