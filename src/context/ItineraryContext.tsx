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

interface ItineraryAction {
    type: 'SELECT_OUTBOUND_FLIGHT' | 'UNSELECT_OUTBOUND_FLIGHT' | 'SELECT_RETURN_FLIGHT' | 'UNSELECT_RETURN_FLIGHT' | 'SELECT_HOTEL_ROOM' | 'UNSELECT_HOTEL_ROOM';  
    payload: Flight | ({
        hotel: Hotel | null;
        room: Room | null;
        checkin: string | null;
        checkout: string | null;
        price: number;
    });
}

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
            if ('id' in action.payload) {
                return { ...state, selectedOutboundFlights: [...state.selectedOutboundFlights, action.payload] };
            }
            return state;
        case 'UNSELECT_OUTBOUND_FLIGHT':
            return { 
                ...state, 
                selectedOutboundFlights: state.selectedOutboundFlights.filter(flight => 
                    'id' in action.payload && flight.id !== action.payload.id
                ) 
            };
        case 'SELECT_RETURN_FLIGHT':
            if ('id' in action.payload) {
                return { ...state, selectedReturnFlights: [...state.selectedReturnFlights, action.payload] };
            }
            return state;
        case 'UNSELECT_RETURN_FLIGHT':
            return { 
                ...state, 
                selectedReturnFlights: state.selectedReturnFlights.filter(flight => 
                    'id' in action.payload && flight.id !== action.payload.id
                ) 
            };
        case 'SELECT_HOTEL_ROOM':
            return {
                ...state,
                selectedHotel: 'hotel' in action.payload ? action.payload.hotel : null,
                selectedRoom: 'hotel' in action.payload ? action.payload.room : null,
                selectedHotelCheckIn: 'hotel' in action.payload ? action.payload.checkin : null,
                selectedHotelCheckOut: 'hotel' in action.payload ? action.payload.checkout : null,
                selectedHotelPrice: 'hotel' in action.payload ? action.payload.price : null,
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