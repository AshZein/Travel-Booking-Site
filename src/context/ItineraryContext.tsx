"use client"
import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { Flight } from '@/types/flight';
// import { Hotel } from '@/types/Hotel';
// import { Room } from '@/types/Room';

interface ItineraryState {
    selectedOutboundFlights: Flight[];
    selectedReturnFlights: Flight[];
}

type ItineraryAction =
    | { type: 'SELECT_OUTBOUND_FLIGHT'; payload: Flight }
    | { type: 'UNSELECT_OUTBOUND_FLIGHT'; payload: Flight }
    | { type: 'SELECT_RETURN_FLIGHT'; payload: Flight }
    | { type: 'UNSELECT_RETURN_FLIGHT'; payload: Flight }
    | { type: 'CLEAR_ITINERARY' };

const initialState: ItineraryState = {
    selectedOutboundFlights: [],
    selectedReturnFlights: [],
};

const ItineraryContext = createContext<{
    state: ItineraryState;
    dispatch: React.Dispatch<ItineraryAction>;
}>({
    state: initialState,
    dispatch: () => null,
});

const itineraryReducer = (state: ItineraryState, action: ItineraryAction): ItineraryState => {
    switch (action.type) {
        case 'SELECT_OUTBOUND_FLIGHT':
            return { ...state, selectedOutboundFlights: [...state.selectedOutboundFlights, action.payload] };
        case 'UNSELECT_OUTBOUND_FLIGHT':
            return { 
                ...state, 
                selectedOutboundFlights: state.selectedOutboundFlights.filter(flight => 
                    flight.id !== action.payload.id
                ) 
            };
        case 'SELECT_RETURN_FLIGHT':
            return { ...state, selectedReturnFlights: [...state.selectedReturnFlights, action.payload] };
        case 'UNSELECT_RETURN_FLIGHT':
            return { 
                ...state, 
                selectedReturnFlights: state.selectedReturnFlights.filter(flight => 
                    flight.id !== action.payload.id
                ) 
            };
        case 'CLEAR_ITINERARY':
            return { ...state, selectedOutboundFlights: [], selectedReturnFlights: [] };
        default:
            return state;
    }
};

export const ItineraryProvider = ({ children }: { children: ReactNode }) => {
    const [state, dispatch] = useReducer(itineraryReducer, initialState, (initial) => {
        if (typeof window !== 'undefined') {
            const persistedState = localStorage.getItem('itineraryState');
            return persistedState ? JSON.parse(persistedState) : initial;
        }
        return initial;
    });

    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('itineraryState', JSON.stringify(state));
        }
    }, [state]);

    return (
        <ItineraryContext.Provider value={{ state, dispatch }}>
            {children}
        </ItineraryContext.Provider>
    );
};

export const useItinerary = () => useContext(ItineraryContext);