"use client"
import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { Flight } from '@/types/flight';

interface CheckoutState {
    selectedOutboundFlights: Flight[];
    selectedReturnFlights: Flight[];
    
}