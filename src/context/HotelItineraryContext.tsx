"use client"
import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { Flight } from '@/types/flight';
import { Hotel } from '@/types/Hotel';
import { Room } from '@/types/Room';

interface HotelItineraryState {
    selectedHotel: Hotel | null;
    selectedRoom: Room | null;
    selectedHotelCheckIn: string | null;
    selectedHotelCheckOut: string | null;
    selectedHotelPrice: number | null;
}

type HotelItineraryAction = 
    { type: 'SELECT_HOTEL_ROOM'; payload: {
        hotel: Hotel | null;
        room: Room | null;
        checkin: string | null;
        checkout: string | null;
        price: number;
    }}  
| { type: 'UNSELECT_HOTEL_ROOM' };

const initialHotelState: HotelItineraryState = {
    selectedHotel: null,
    selectedRoom: null,
    selectedHotelCheckIn: null,
    selectedHotelCheckOut: null,
    selectedHotelPrice: 0
};

const HotelItineraryContext = createContext<{
    state: HotelItineraryState;
    dispatch: React.Dispatch<HotelItineraryAction>;
}>({
    state: initialHotelState,
    dispatch: () => null,
});

const hotelItineraryReducer = (state: HotelItineraryState, action: HotelItineraryAction): HotelItineraryState => {
    switch (action.type) {
        case 'SELECT_HOTEL_ROOM':
            return {
                ...state,
                selectedHotel: action.payload.hotel,
                selectedRoom: action.payload.room,
                selectedHotelCheckIn: action.payload.checkin,
                selectedHotelCheckOut: action.payload.checkout,
                selectedHotelPrice: action.payload.price
            };
        case 'UNSELECT_HOTEL_ROOM':
            return {
                ...state,
                selectedHotel: null,
                selectedRoom: null,
                selectedHotelCheckIn: null,
                selectedHotelCheckOut: null,
                selectedHotelPrice: 0
            };
        default:
            return state;
    }
};

export const HotelItineraryProvider = ({ children }: { children: ReactNode }) => {
    const [state, dispatch] = useReducer(hotelItineraryReducer, initialHotelState, (initial) => {
        if (typeof window !== 'undefined') {
            const persistedState = localStorage.getItem('hotelItineraryState');
            return persistedState ? JSON.parse(persistedState) : initial;
        }
        return initial;
    });

    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('hotelItineraryState', JSON.stringify(state));
        }
    }, [state]);

    return (
        <HotelItineraryContext.Provider value={{ state, dispatch }}>
            {children}
        </HotelItineraryContext.Provider>
    );
};

export const useHotelItinerary = () => useContext(HotelItineraryContext);