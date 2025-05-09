import React, { useEffect, useState } from 'react';
import { useCheckout } from '@/context/CheckoutContext'; // Import the CheckoutContext
import { FlightCred } from '@/types/FlightCred'; // Import the FlightCred type

const FlightCredentials: React.FC = () => {
    const { dispatch } = useCheckout(); // Access the CheckoutContext dispatch function
    const [flightCred, setFlightCred] = useState<FlightCred>({
        firstName: '',
        middleName: '',
        lastName: '',
        passportNumber: '',
    });

    // Fetch user profile data
    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const token = localStorage.getItem('accessToken');
                if (!token) {
                    console.error('Access token not found');
                    return;
                }

                const response = await fetch('/api/user/profile', {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    console.error('Failed to fetch user profile');
                    return;
                }

                const data = await response.json();
                const { firstName, lastName } = data.user;

                // Update flightCred state with fetched data
                const updatedFlightCred = {
                    ...flightCred,
                    firstName: firstName || '',
                    lastName: lastName || '',
                };
                setFlightCred(updatedFlightCred);

                // Dispatch the updated flight credentials to the CheckoutContext
                dispatch({ type: 'SET_FLIGHT_CREDENTIALS', payload: updatedFlightCred });
            } catch (error) {
                console.error('Error fetching user profile:', error);
            }
        };

        fetchUserProfile();
    }, []); // Empty dependency array ensures this runs only once on component mount

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const updatedFlightCred = {
            ...flightCred,
            [name]: value,
        };
        setFlightCred(updatedFlightCred);

        // Dispatch the updated flight credentials to the CheckoutContext
        dispatch({ type: 'SET_FLIGHT_CREDENTIALS', payload: updatedFlightCred });
    };

    return (
        <div>
            <h1 className="text-black bg-white">Booking Information</h1>
            <form className="flex flex-col gap-6 p-6 shadow-md bg-white">
                <div>
                    <label htmlFor="firstName" className="block mb-1 font-medium text-black">First Name:</label>
                    <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={flightCred.firstName}
                        onChange={handleChange}
                        className="w-full p-2 border border-black rounded text-black"
                    />
                </div>
                <div>
                    <label htmlFor="middleName" className="block mb-1 font-medium text-black">Middle Name:</label>
                    <input
                        type="text"
                        id="middleName"
                        name="middleName"
                        value={flightCred.middleName}
                        onChange={handleChange}
                        className="w-full p-2 border border-black rounded text-black"
                    />
                </div>
                <div>
                    <label htmlFor="lastName" className="block mb-1 font-medium text-black">Last Name:</label>
                    <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={flightCred.lastName}
                        onChange={handleChange}
                        className="w-full p-2 border border-black rounded text-black"
                    />
                </div>
                <div>
                    <label htmlFor="passportNumber" className="block mb-1 font-medium text-black">Passport Number:</label>
                    <input
                        type="text"
                        id="passportNumber"
                        name="passportNumber"
                        value={flightCred.passportNumber}
                        onChange={handleChange}
                        className="w-full p-2 border border-black rounded text-black"
                    />
                </div>
            </form>
        </div>
    );
};

export default FlightCredentials;