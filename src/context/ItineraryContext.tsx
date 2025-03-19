import React, { createContext, useContext, useReducer, ReactNode } from 'react';

interface Flight {
    id: string;
    flightNumber: string;
    departureTime: string;
    arrivalTime: string;
    origin: {
        code: string;
        name: string;
        city: string;
        country: string;
    };
    destination: {
        code: string;
        name: string;
        city: string;
        country: string;
    };
    duration: number;
    price: number;
    currency: string;
    availableSeats: number;
    status: string;
    airline: {
        code: string;
        name: string;
    };
}

interface ItineraryState {
    flights: Flight[];
    selectedFlight: Flight | null;
}

interface ItineraryAction {
    type: 'ADD_FLIGHT' | 'REMOVE_FLIGHT' | 'SELECT_FLIGHT';
    payload: Flight | null;
}

const initialState: ItineraryState = {
    flights: [],
    selectedFlight: null,
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
        case 'ADD_FLIGHT':
            if (action.payload) {
                return { ...state, flights: [...state.flights, action.payload] };
            }
            return state;
        case 'REMOVE_FLIGHT':
            if (action.payload) {
                if (action.payload) {
                    return { ...state, flights: state.flights.filter(flight => flight.id !== action.payload.id) };
                }
                return state;
            }
            return state;
        case 'SELECT_FLIGHT':
            return { ...state, selectedFlight: action.payload };
        default:
            return state;
    }
};

export const ItineraryProvider = ({ children }: { children: ReactNode }) => {
    const [state, dispatch] = useReducer(itineraryReducer, initialState);

    return (
        <ItineraryContext.Provider value={{ state, dispatch }}>
            {children}
        </ItineraryContext.Provider>
    );
};

export const useItinerary = () => useContext(ItineraryContext);