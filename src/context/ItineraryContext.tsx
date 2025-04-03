"use client"
import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { Flight } from '@/types/flight';
import { Hotel } from '@/types/Hotel';
import { Room } from '@/types/Room';

interface ItineraryState {
    selectedOutboundFlights: Flight[];
    selectedReturnFlights: Flight[];
    selectedHotel: Hotel | null;
    selectedRoom: Room | null;
    selectedHotelCheckIn: string | null;
    selectedHotelCheckOut: string | null;
    selectedHotelPrice: number | null;
}

type ItineraryAction =
    | { type: 'SELECT_OUTBOUND_FLIGHT'; payload: Flight }
    | { type: 'UNSELECT_OUTBOUND_FLIGHT'; payload: Flight }
    | { type: 'SELECT_RETURN_FLIGHT'; payload: Flight }
    | { type: 'UNSELECT_RETURN_FLIGHT'; payload: Flight }
    | { type: 'SELECT_HOTEL_ROOM'; payload: {
        hotel: Hotel | null;
        room: Room | null;
        checkin: string | null;
        checkout: string | null;
        price: number;
    }}
    | { type: 'UNSELECT_HOTEL_ROOM' };

const initialState: ItineraryState = {
    selectedOutboundFlights: [],
    selectedReturnFlights: [],
    selectedHotel: null,
    selectedRoom: null,
    selectedHotelCheckIn: null,
    selectedHotelCheckOut: null,
    selectedHotelPrice: 0,
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
        case 'SELECT_HOTEL_ROOM':
            return {
                ...state,
                selectedHotel: action.payload.hotel,
                selectedRoom: action.payload.room,
                selectedHotelCheckIn: action.payload.checkin,
                selectedHotelCheckOut: action.payload.checkout,
                selectedHotelPrice: action.payload.price,
            };
        case 'UNSELECT_HOTEL_ROOM':
            return {
                ...state,
                selectedHotel: null,
                selectedRoom: null,
                selectedHotelCheckIn: null,
                selectedHotelCheckOut: null,
                selectedHotelPrice: null,
            };
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