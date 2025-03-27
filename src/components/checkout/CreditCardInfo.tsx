import React from 'react';

const CreditCardInfo: React.FC = () => {
    return (
        <div>
            <h1 className="text-black bg-white">Credit Card Information</h1>
            <form className='flex flex-col gap-6 p-6 shadow-md bg-white'>
                <div>
                    <label htmlFor="cardName" className="block mb-1 font-medium text-black">Name on Card:</label>
                    <input
                        type="text"
                        id="cardName"
                        name="cardName"
                        className="w-full p-2 border border-black rounded text-black"
                    />
                </div>
                <div>
                    <label htmlFor="cardNumber" className="block mb-1 font-medium text-black">Card Number:</label>
                    <input
                        type="text"
                        id="cardNumber"
                        name="cardNumber"
                        className="w-full p-2 border border-black rounded text-black"
                    />
                </div>
                <div>
                    <label htmlFor="cvc" className="block mb-1 font-medium text-black">CVC Number:</label>
                    <input
                        type="text"
                        id="cvc"
                        name="cvc"
                        className="w-full p-2 border border-black rounded text-black"
                    />
                </div>
                <div>
                    <label htmlFor="expiryDate" className="block mb-1 font-medium text-black">Expiry Date:</label>
                    <div className="flex gap-2">
                        <select
                            id="expiryMonth"
                            name="expiryMonth"
                            className="w-1/2 p-2 border border-black rounded text-black"
                        >
                            <option value="">Month</option>
                            {Array.from({ length: 12 }, (_, i) => (
                                <option key={i + 1} value={i + 1}>
                                    {i + 1}
                                </option>
                            ))}
                        </select>
                        <select
                            id="expiryYear"
                            name="expiryYear"
                            className="w-1/2 p-2 border border-black rounded text-black"
                        >
                            <option value="">Year</option>
                            {Array.from({ length: 10 }, (_, i) => (
                                <option key={i} value={new Date().getFullYear() + i}>
                                    {new Date().getFullYear() + i}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default CreditCardInfo;