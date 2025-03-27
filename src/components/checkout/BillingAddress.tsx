import React from 'react';

const BillingAddress: React.FC = () => {
    return (
        <div>
            <h1 className="text-black bg-white">Billing Address</h1>
            <form className='flex flex-col gap-6 p-6 shadow-md bg-white'>
                <div>
                    <label htmlFor="firstName" className="block mb-1 font-medium text-black">First Name:</label>
                    <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        className="w-full p-2 border border-black rounded text-black"
                    />
                </div>
                <div>
                    <label htmlFor="lastName" className="block mb-1 font-medium text-black">Last Name:</label>
                    <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        className="w-full p-2 border border-black rounded text-black"
                    />
                </div>
                <div>
                    <label htmlFor="streetAddress" className="block mb-1 font-medium text-black">Street Address:</label>
                    <input
                        type="text"
                        id="streetAddress"
                        name="streetAddress"
                        className="w-full p-2 border border-black rounded text-black"
                    />
                </div>
                <div>
                    <label htmlFor="city" className="block mb-1 font-medium text-black">City:</label>
                    <input
                        type="text"
                        id="city"
                        name="city"
                        className="w-full p-2 border border-black rounded text-black"
                    />
                </div>
                <div>
                    <label htmlFor="province" className="block mb-1 font-medium text-black">Province:</label>
                    <select
                        id="province"
                        name="province"
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
                        {/* Add more provinces as needed */}
                    </select>
                </div>
                <div>
                    <label htmlFor="postalCode" className="block mb-1 font-medium text-black">Postal Code:</label>
                    <input
                        type="text"
                        id="postalCode"
                        name="postalCode"
                        className="w-full p-2 border border-black rounded text-black"
                    />
                </div>
                <div>
                    <label htmlFor="phoneNumber" className="block mb-1 font-medium text-black">Phone Number:</label>
                    <input
                        type="text"
                        id="phoneNumber"
                        name="phoneNumber"
                        className="w-full p-2 border border-black rounded text-black"
                    />
                </div>
            </form>
        </div>
    );
};

export default BillingAddress;