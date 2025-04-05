"use client";

import React, { useEffect, useState } from "react";
import FlightCard from "@/components/viewItinerary/FlightCard";
import { Flight } from "@/types/flight";

interface FlightDetails {
    bookingReference: string;
    ticketNumber: string;
    firstName: string;
    lastName: string;
    email: string;
    passportNumber: string;
    status: string;
    agencyId: string;
    createdAt: string;
    flights: Flight[];
}

interface Itinerary {
    itineraryId: number;
    itineraryRef: string;
    userId: number;
    forwardFlightBookingRef?: string;
    returnFlightBookingRef?: string;
    hotelBookingRef?: string;
    outboundFlight?: FlightDetails; // Updated to match the flight data structure
    returnFlight?: FlightDetails;   // Updated to match the flight data structure
}

const Page: React.FC = () => {
    const [itineraries, setItineraries] = useState<Itinerary[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchFlightDetails = async (flightRef: string): Promise<FlightDetails | null> => {
        try {
            const token = localStorage.getItem("accessToken");
            if (!token) {
                setError("User is not authenticated.");
                return null;
            }

            const response = await fetch(`/api/flight/booking?bookingReference=${flightRef}`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            console.log("API response:", response);

            if (!response.ok) {
                const errorData = await response.json();
                console.error("Error response from API:", errorData);
                setError(errorData.message || "Failed to fetch flight details.");
                return null;
            }

            const responseData = await response.json();
            const flightDetails: FlightDetails = responseData.data; // Access the `data` object
            console.log("Flight details:", flightDetails);

            if (!flightDetails.flights || flightDetails.flights.length === 0) {
                console.warn(`No flights found for booking reference: ${flightRef}`);
                return null;
            }

            return flightDetails;
        } catch (err) {
            console.error("Error fetching flight details:", err);
            setError("An unexpected error occurred.");
            return null;
        }
    };

    useEffect(() => {
        const fetchItineraries = async () => {
            try {
                const token = localStorage.getItem("accessToken");
                if (!token) {
                    setError("User is not authenticated.");
                    setLoading(false);
                    return;
                }

                const response = await fetch("/api/itinerary/list", {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    setError(errorData.message || "Failed to fetch itineraries.");
                    setLoading(false);
                    return;
                }

                const data: Itinerary[] = await response.json();

                // Fetch flight details for each itinerary
                const updatedItineraries = await Promise.all(
                    data.map(async (itinerary) => {
                        if (itinerary.forwardFlightBookingRef) {
                            itinerary.outboundFlight = (await fetchFlightDetails(itinerary.forwardFlightBookingRef)) || undefined;
                        }
                        if (itinerary.returnFlightBookingRef) {
                            itinerary.returnFlight = (await fetchFlightDetails(itinerary.returnFlightBookingRef)) || undefined;
                        }
                        return itinerary;
                    })
                );
                console.log("Updated itineraries:", updatedItineraries);
                setItineraries(updatedItineraries);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching itineraries:", err);
                setError("An unexpected error occurred.");
                setLoading(false);
            }
        };

        fetchItineraries();
    }, []);

    if (loading) {
        return <div>Loading itineraries...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            <h1>User Itineraries</h1>
            {itineraries.length === 0 ? (
                <p>No itineraries found.</p>
            ) : (
                <ul>
                    {itineraries.map((itinerary) => (
                        <li key={itinerary.itineraryId} className="itinerary-item">
                            <p><strong>Itinerary Reference:</strong> {itinerary.itineraryRef}</p>
                            {itinerary.forwardFlightBookingRef && (
                                <div>
                                    <p><strong>Forward Flight Booking Reference:</strong> {itinerary.forwardFlightBookingRef}</p>
                                    {itinerary.outboundFlight && (
                                        <FlightCard
                                            legs={itinerary.outboundFlight.flights?.length || 0}
                                            flights={itinerary.outboundFlight.flights || []}
                                            onClick={() => {}}
                                            type="outbound"
                                        />
                                    )}
                                </div>
                            )}
                            {itinerary.returnFlightBookingRef && (
                                <div>
                                    <p><strong>Return Flight Booking Reference:</strong> {itinerary.returnFlightBookingRef}</p>
                                    {itinerary.returnFlight && (
                                        <FlightCard
                                            legs={itinerary.returnFlight.flights?.length || 0}
                                            flights={itinerary.returnFlight.flights || []}
                                            onClick={() => {}}
                                            type="return"
                                        />
                                    )}
                                </div>
                            )}
                            {itinerary.hotelBookingRef && (
                                <p><strong>Hotel Booking Reference:</strong> {itinerary.hotelBookingRef}</p>
                            )}
                            <hr />
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Page;