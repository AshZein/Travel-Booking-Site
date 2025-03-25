import React from 'react';

interface NotificationPopupProps {
    message: string;
    date: string;
    onClose: () => void;
}

const NotificationPopup: React.FC<NotificationPopupProps> = ({ message, date, onClose }) => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <div className="text-right">
                    <button
                        className="tripType-button text-gray-500 hover:text-gray-700"
                        onClick={onClose}
                    >
                        ✖
                    </button>
                </div>
                <div className="text-sm text-gray-400 mb-2">{date}</div>
                <div className="text-lg text-black font-semibold">{message}</div>
            </div>
        </div>
    );
};

export default NotificationPopup;