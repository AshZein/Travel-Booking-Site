"use client";

import React, { useEffect, useState } from "react";

interface Itinerary {
    itineraryId: number;
    itineraryRef: string;
    userId: number;
    forwardFlightBookingRef?: string;
    returnFlightBookingRef?: string;
    hotelBookingRef?: string;
}

const Page: React.FC = () => {
    const [itineraries, setItineraries] = useState<Itinerary[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchItineraries = async () => {
            try {
                const token = localStorage.getItem("accessToken"); // Assuming the token is stored in localStorage
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

                const data = await response.json();
                setItineraries(data);
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
                            <p><strong>User ID:</strong> {itinerary.userId}</p>
                            <p><strong>Forward Flight Booking Reference:</strong> {itinerary.forwardFlightBookingRef || "N/A"}</p>
                            <p><strong>Return Flight Booking Reference:</strong> {itinerary.returnFlightBookingRef || "N/A"}</p>
                            <p><strong>Hotel Booking Reference:</strong> {itinerary.hotelBookingRef || "N/A"}</p>
                            <hr />
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Page;