import React from 'react';

const FlightCredentials: React.FC = () => {
    return (
        <div>
            <h1 className="text-black bg-white">Booking Information</h1>
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
                    <label htmlFor="middleName" className="block mb-1 font-medium text-black">Middle Name:</label>
                    <input
                        type="text"
                        id="middleName"
                        name="middleName"
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
                    <label htmlFor="passportNumber" className="block mb-1 font-medium text-black">Passport Number:</label>
                    <input
                        type="text"
                        id="passportNumber"
                        name="passportNumber"
                        className="w-full p-2 border border-black rounded text-black"
                    />
                </div>
            </form>
        </div>
    );
};

export default FlightCredentials;