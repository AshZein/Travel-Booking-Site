import React, { useState } from 'react';
import { useCheckout } from '@/context/CheckoutContext'; // Import the CheckoutContext
import { Billing } from '@/types/Billing'; // Import the Billing type

const BillingAddress: React.FC = () => {
    const { dispatch } = useCheckout(); // Access the CheckoutContext dispatch function
    const [billingAddress, setBillingAddress] = useState<Billing>({
        firstName: '',
        lastName: '',
        streetAddress: '',
        city: '',
        province: '',
        postalCode: '',
        phoneNumber: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setBillingAddress((prev: Billing) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Dispatch the billing address to the CheckoutContext
        dispatch({ type: 'SET_BILLING_ADDRESS', payload: billingAddress });
    };

    return (
        <div>
            <h1 className="text-black bg-white">Billing Address</h1>
            <form
                className="flex flex-col gap-6 p-6 shadow-md bg-white"
                onSubmit={handleSubmit}
            >
                <div>
                    <label htmlFor="firstName" className="block mb-1 font-medium text-black">First Name:</label>
                    <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={billingAddress.firstName}
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
                        value={billingAddress.lastName}
                        onChange={handleChange}
                        className="w-full p-2 border border-black rounded text-black"
                    />
                </div>
                <div>
                    <label htmlFor="streetAddress" className="block mb-1 font-medium text-black">Street Address:</label>
                    <input
                        type="text"
                        id="streetAddress"
                        name="streetAddress"
                        value={billingAddress.streetAddress}
                        onChange={handleChange}
                        className="w-full p-2 border border-black rounded text-black"
                    />
                </div>
                <div>
                    <label htmlFor="city" className="block mb-1 font-medium text-black">City:</label>
                    <input
                        type="text"
                        id="city"
                        name="city"
                        value={billingAddress.city}
                        onChange={handleChange}
                        className="w-full p-2 border border-black rounded text-black"
                    />
                </div>
                <div>
                    <label htmlFor="province" className="block mb-1 font-medium text-black">Province:</label>
                    <select
                        id="province"
                        name="province"
                        value={billingAddress.province}
                        onChange={handleChange}
                        className="w-full p-2 border border-black rounded text-black"
                    >
                        <option value="">Select Province/Territory</option>
                        <option value="AB">Alberta</option>
                        <option value="BC">British Columbia</option>
                        <option value="MB">Manitoba</option>
                        <option value="NB">New Brunswick</option>
                        <option value="NL">Newfoundland and Labrador</option>
                        <option value="NS">Nova Scotia</option>
                        <option value="ON">Ontario</option>
                        <option value="PE">Prince Edward Island</option>
                        <option value="QC">Quebec</option>
                        <option value="SK">Saskatchewan</option>
                        <option value="NT">Northwest Territories</option>
                        <option value="NU">Nunavut</option>
                        <option value="YT">Yukon</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="postalCode" className="block mb-1 font-medium text-black">Postal Code:</label>
                    <input
                        type="text"
                        id="postalCode"
                        name="postalCode"
                        value={billingAddress.postalCode}
                        onChange={handleChange}
                        className="w-full p-2 border border-black rounded text-black"
                    />
                </div>
                <div>
                    <label htmlFor="phoneNumber" className="block mb-1 font-medium text-black">Phone Number:</label>
                    <input
                        type="text"
                        id="phoneNumber"
                        name="phoneNumber"
                        value={billingAddress.phoneNumber}
                        onChange={handleChange}
                        className="w-full p-2 border border-black rounded text-black"
                    />
                </div>
                <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                    Save Billing Address
                </button>
            </form>
        </div>
    );
};

export default BillingAddress;