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
    // flights: Flight[];
    selectedOutboundFlights: Flight[];
    selectedReturnFlights: Flight[];
}

interface ItineraryAction {
    type:  'SELECT_OUTBOUND_FLIGHT' | 'UNSELECT_OUTBOUND_FLIGHT' | 'SELECT_Return_FLIGHT' | 'UNSELECT_Return_FLIGHT';
    payload: Flight;
}

const initialState: ItineraryState = {
    // flights: [],
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
            return { ...state, selectedOutboundFlights: state.selectedOutboundFlights.filter(flight => flight.id !== action.payload.id) };
        case 'SELECT_Return_FLIGHT':
            return { ...state, selectedReturnFlights: [...state.selectedReturnFlights, action.payload] };
        case 'UNSELECT_Return_FLIGHT':
            return { ...state, selectedReturnFlights: state.selectedReturnFlights.filter(flight => flight.id !== action.payload.id) };
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