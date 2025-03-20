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
    selectedFlights: Flight[];
}

interface ItineraryAction {
    type: 'ADD_FLIGHT' | 'REMOVE_FLIGHT' | 'SELECT_FLIGHT' | 'UNSELECT_FLIGHT';
    payload: Flight;
}

const initialState: ItineraryState = {
    flights: [],
    selectedFlights: [],
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
            return { ...state, flights: [...state.flights, action.payload] };
        case 'REMOVE_FLIGHT':
            return { ...state, flights: state.flights.filter(flight => flight.id !== action.payload.id) };
        case 'SELECT_FLIGHT':
            return { ...state, selectedFlights: [...state.selectedFlights, action.payload] };
        case 'UNSELECT_FLIGHT':
            return { ...state, selectedFlights: state.selectedFlights.filter(flight => flight.id !== action.payload.id) };
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