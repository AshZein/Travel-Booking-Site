import React, { useState } from 'react';
import { useCheckout } from '@/context/CheckoutContext'; // Import the CheckoutContext
import { CreditCard } from '@/types/CreditCard'; // Import the CreditCard type

const CreditCardInfo: React.FC = () => {
    const { dispatch } = useCheckout(); // Access the CheckoutContext dispatch function
    const [creditCard, setCreditCard] = useState<CreditCard>({
        cardName: '',
        cardNumber: '',
        cvcNumber: '',
        expiryMonth: '',
        expiryYear: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        // Allow only numeric input for CVC and card number fields
        if (name === 'cvcNumber' || name === 'cardNumber') {
            if (!/^\d*$/.test(value)) return; // Prevent non-numeric input
        }

        const updatedCreditCard = {
            ...creditCard,
            [name]: value,
        };
        setCreditCard(updatedCreditCard);

        // Dispatch the updated credit card info to the CheckoutContext
        dispatch({ type: 'SET_CREDIT_CARD_INFO', payload: updatedCreditCard });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // Validate all fields
        if (!creditCard.cardName || !creditCard.cardNumber || !creditCard.cvcNumber || !creditCard.expiryMonth || !creditCard.expiryYear) {
            alert('Please fill in all fields');
            return;
        }

        const token = localStorage.getItem('accessToken'); // Retrieve the token from localStorage
        const response = await fetch('/api/checkout/creditCard', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`, // Add the token to the Authorization header
            },
            body: JSON.stringify({
            cardName: String(creditCard.cardName),
            cardNumber: String(creditCard.cardNumber),
            cvcNumber: String(creditCard.cvcNumber),
            expiryMonth: String(creditCard.expiryMonth),
            expiryYear: String(creditCard.expiryYear),
            }),
        });

        if (response.ok) {
            dispatch({ type: 'SET_CREDIT_CARD_INFO', payload: creditCard });
            alert('Credit card information saved to checkout!');
        } else {
            const errorData = await response.json();
            alert(`Error: ${errorData.message}`);
        }
    };

    return (
        <div>
            <h1 className="text-black bg-white">Credit Card Information</h1>
            <form
                className="flex flex-col gap-6 p-6 shadow-md bg-white"
                onSubmit={handleSubmit}
            >
                <div>
                    <label htmlFor="cardName" className="block mb-1 font-medium text-black">Name on Card:</label>
                    <input
                        type="text"
                        id="cardName"
                        name="cardName"
                        value={creditCard.cardName}
                        onChange={handleChange}
                        className="w-full p-2 border border-black rounded text-black"
                    />
                </div>
                <div>
                    <label htmlFor="cardNumber" className="block mb-1 font-medium text-black">Card Number:</label>
                    <input
                        type="text"
                        id="cardNumber"
                        name="cardNumber"
                        value={creditCard.cardNumber}
                        onChange={handleChange}
                        className="w-full p-2 border border-black rounded text-black"
                    />
                </div>
                <div>
                    <label htmlFor="cvc" className="block mb-1 font-medium text-black">CVC Number:</label>
                    <input
                        type="text"
                        id="cvc"
                        name="cvcNumber"
                        value={creditCard.cvcNumber}
                        onChange={handleChange}
                        className="w-full p-2 border border-black rounded text-black"
                    />
                </div>
                <div>
                    <label htmlFor="expiryDate" className="block mb-1 font-medium text-black">Expiry Date:</label>
                    <div className="flex gap-2">
                        <select
                            id="expiryMonth"
                            name="expiryMonth"
                            value={creditCard.expiryMonth}
                            onChange={handleChange}
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
                            value={creditCard.expiryYear}
                            onChange={handleChange}
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
                <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                    Save Credit Card Info
                </button>
            </form>
        </div>
    );
};

export default CreditCardInfo;