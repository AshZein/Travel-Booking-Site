"use client"
import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { Flight } from '@/types/flight';
import {Billing} from '@/types/Billing';
import {CreditCard} from '@/types/CreditCard';
import {FlightCred} from '@/types/FlightCred';
import { Hotel } from '@/types/Hotel';
import { Room } from '@/types/Room';

interface CheckoutState {
    selectedOutboundFlights: Flight[];
    selectedReturnFlights: Flight[];
    billingAddress: Billing | null;
    creditCardInfo: CreditCard | null;
    flightCredentials: FlightCred | null;
    selectedHotel: Hotel | null;
    selectedRoom: Room | null;
    selectedHotelCheckIn: string | null;
    selectedHotelCheckOut: string | null;
    selectedHotelPrice: number;
}

type CheckoutAction =
    | { type: 'SELECT_OUTBOUND_FLIGHT'; payload: Flight }
    | { type: 'UNSELECT_OUTBOUND_FLIGHT'; payload: Flight }
    | { type: 'SELECT_RETURN_FLIGHT'; payload: Flight }
    | { type: 'UNSELECT_RETURN_FLIGHT'; payload: Flight }
    | { type: 'SET_BILLING_ADDRESS'; payload: Billing }
    | { type: 'SET_CREDIT_CARD_INFO'; payload: CreditCard }
    | { type: 'SET_FLIGHT_CREDENTIALS'; payload: FlightCred }
    | { type: 'SELECT_HOTEL'; payload: Hotel | null}
    | { type: 'SELECT_ROOM'; payload: Room | null }
    | { type: 'SET_HOTEL_CHECK_IN'; payload: string | null }
    | { type: 'SET_HOTEL_CHECK_OUT'; payload: string | null}
    | { type: 'SET_HOTEL_PRICE'; payload: number };

const initialState: CheckoutState = {
    selectedOutboundFlights: [],
    selectedReturnFlights: [],
    billingAddress: null,
    creditCardInfo: null,
    flightCredentials: null,
    selectedHotel: null,
    selectedRoom: null,
    selectedHotelCheckIn: null,
    selectedHotelCheckOut: null,
    selectedHotelPrice: 0,
};

const CheckoutContext = createContext<{
    state: CheckoutState;
    dispatch: React.Dispatch<CheckoutAction>;
}>({
    state: initialState,
    dispatch: () => null,
});

const checkoutReducer = (state: CheckoutState, action: CheckoutAction): CheckoutState => {
    switch (action.type) {
        case 'SELECT_OUTBOUND_FLIGHT':
            return { ...state, selectedOutboundFlights: [...state.selectedOutboundFlights, action.payload] };
        case 'UNSELECT_OUTBOUND_FLIGHT':
            return {
                ...state,
                selectedOutboundFlights: state.selectedOutboundFlights.filter(
                    (flight) => flight.id !== action.payload.id
                ),
            };
        case 'SELECT_RETURN_FLIGHT':
            return { ...state, selectedReturnFlights: [...state.selectedReturnFlights, action.payload] };
        case 'UNSELECT_RETURN_FLIGHT':
            return {
                ...state,
                selectedReturnFlights: state.selectedReturnFlights.filter(
                    (flight) => flight.id !== action.payload.id
                ),
            };
        case 'SET_BILLING_ADDRESS':
            return { ...state, billingAddress: action.payload };
        case 'SET_CREDIT_CARD_INFO':
            return { ...state, creditCardInfo: action.payload };
        case 'SET_FLIGHT_CREDENTIALS':
            return { ...state, flightCredentials: action.payload };
        case 'SELECT_HOTEL': // Handle selecting a hotel
            return { ...state, selectedHotel: action.payload };
        case 'SELECT_ROOM': // Handle selecting a room
            return { ...state, selectedRoom: action.payload };
        case 'SET_HOTEL_CHECK_IN': // Handle setting the check-in date
            return { ...state, selectedHotelCheckIn: action.payload };
        case 'SET_HOTEL_CHECK_OUT': // Handle setting the check-out date
            return { ...state, selectedHotelCheckOut: action.payload };
        case 'SET_HOTEL_PRICE': // Handle setting the hotel price
            return { ...state, selectedHotelPrice: action.payload };
        default:
            return state;
    }
};

export const CheckoutProvider = ({ children }: { children: ReactNode }) => {
    const [state, dispatch] = useReducer(checkoutReducer, initialState, (initial) => {
        if (typeof window !== 'undefined') {
            const persistedState = localStorage.getItem('checkoutState');
            return persistedState ? JSON.parse(persistedState) : initial;
        }
        return initial;
    });

    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('checkoutState', JSON.stringify(state));
        }
    }, [state]);

    return (
        <CheckoutContext.Provider value={{ state, dispatch }}>
            {children}
        </CheckoutContext.Provider>
    );
};

export const useCheckout = () => useContext(CheckoutContext);