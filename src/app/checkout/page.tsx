"use client";
import React, { useEffect } from 'react';
import { useCheckout } from '@/context/CheckoutContext';
import CheckoutFlightCard from '@/components/checkout/CheckoutFlightCard';
import CheckoutHeader from '@/components/checkout/CheckoutHeader';
import FlightCredentials from '@/components/checkout/Credentials';
import BillingAddress from '@/components/checkout/BillingAddress';
import CreditCardInfo from '@/components/checkout/CreditCardInfo';
import withCheckoutProvider from '@/HOC/withCheckoutProvider';

const Page = () => {
    const { state } = useCheckout();

    useEffect(() => {
        // Redirect to itinerary page if no outbound flights are selected
        if (state.selectedOutboundFlights.length === 0) {
            window.location.href = '/itinerary';
        }
    }, [state.selectedOutboundFlights]);

    const handleSubmit = async () => {
        // Validate all required fields
        if (!state.flightCredentials || !state.billingAddress || !state.creditCardInfo) {
            alert('Please fill in all required fields.');
            return;
        }

        // Example: Log the collected data
        console.log('Submitting checkout data:', {
            flightCredentials: state.flightCredentials,
            billingAddress: state.billingAddress,
            creditCardInfo: state.creditCardInfo,
            selectedOutboundFlights: state.selectedOutboundFlights,
            selectedReturnFlights: state.selectedReturnFlights,
        });

        // Example: Send the data to an API endpoint
        try {
            const response = await fetch('/api/checkout/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    flightCredentials: state.flightCredentials,
                    billingAddress: state.billingAddress,
                    creditCardInfo: state.creditCardInfo,
                    selectedOutboundFlights: state.selectedOutboundFlights,
                    selectedReturnFlights: state.selectedReturnFlights,
                }),
            });

            if (response.ok) {
                alert('Checkout successful!');
                window.location.href = '/confirmation'; // Redirect to confirmation page
            } else {
                alert('Checkout failed. Please try again.');
            }
        } catch (error) {
            console.error('Error submitting checkout:', error);
            alert('An error occurred. Please try again.');
        }
    };

    return (
        <div>
            <CheckoutHeader />
            <h1>Order Overview</h1>

            {/* Display selected outbound flight */}
            {state.selectedOutboundFlights.length > 0 && (
                <CheckoutFlightCard
                    legs={state.selectedOutboundFlights.length}
                    flights={state.selectedOutboundFlights}
                    type="Departure Flight"
                />
            )}

            {/* Display selected return flight */}
            {state.selectedReturnFlights.length > 0 && (
                <CheckoutFlightCard
                    legs={state.selectedReturnFlights.length}
                    flights={state.selectedReturnFlights}
                    type="Return Flight"
                />
            )}

            {/* Flight Credentials Form */}
            {state.selectedOutboundFlights.length > 0 && <FlightCredentials />}

            {/* Billing Address Form */}
            <BillingAddress />

            {/* Credit Card Info Form */}
            <CreditCardInfo />

            {/* Submit Button */}
            <div className="flex justify-center mt-6">
                <button
                    onClick={handleSubmit}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                    Submit Order
                </button>
            </div>
        </div>
    );
};

export default withCheckoutProvider(Page);