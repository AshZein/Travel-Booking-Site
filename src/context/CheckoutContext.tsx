"use client"
import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { Flight } from '@/types/flight';
import {Billing} from '@/types/Billing';
import {CreditCard} from '@/types/CreditCard';
import {FlightCred} from '@/types/FlightCred';

interface CheckoutState {
    selectedOutboundFlights: Flight[];
    selectedReturnFlights: Flight[];
    billingAddress: Billing | null;
    creditCardInfo: CreditCard | null;
    flightCredentials: FlightCred | null;
}

type CheckoutAction =
    | { type: 'SELECT_OUTBOUND_FLIGHT'; payload: Flight }
    | { type: 'UNSELECT_OUTBOUND_FLIGHT'; payload: Flight }
    | { type: 'SELECT_RETURN_FLIGHT'; payload: Flight }
    | { type: 'UNSELECT_RETURN_FLIGHT'; payload: Flight }
    | { type: 'SET_BILLING_ADDRESS'; payload: Billing }
    | { type: 'SET_CREDIT_CARD_INFO'; payload: CreditCard }
    | { type: 'SET_FLIGHT_CREDENTIALS'; payload: FlightCred };

const initialState: CheckoutState = {
    selectedOutboundFlights: [],
    selectedReturnFlights: [],
    billingAddress: null,
    creditCardInfo: null,
    flightCredentials: null,
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