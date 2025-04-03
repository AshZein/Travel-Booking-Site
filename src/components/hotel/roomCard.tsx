import React, { useEffect } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import { useItinerary } from '@/context/ItineraryContext';
import { Room } from '@/types/Room';
import { Hotel } from '@/types/Hotel';
interface RoomCardProps {
    room: Room;
    hotel: Hotel;
    checkinDate: string;
    checkoutDate: string;
}

const RoomCard: React.FC<RoomCardProps> = ({ room, hotel, checkinDate, checkoutDate }) => {
    const { state, dispatch } = useItinerary();
    const [images, setImages] = React.useState<string[]>([]);
    var isSelected = false;

    const fetchRoomImages = async () => {
        const response = await fetch(`http://localhost:3000/api/hotel/room/images?roomId=${room.roomId}`);
        const data = await response.json();
        console.log("Room Image Data: ", data);
        console.log("Room Image Response: ", response);
        if (response.ok && Array.isArray(data.images)) {
            setImages(data.images); // Set the images array directly
            console.log("Room Images array (inside fetch):", data.images);
        } else {
            setImages(['../images/hotel/image-not-found.png']); // Fallback image
        }
    }

    useEffect(() => {
        fetchRoomImages();
    }, []);

    useEffect(() => {
        console.log("Room Images array (after state update):", images);
    }, [images]);

    const handleSelectClick = () => {
        if (isSelected && state.selectedHotel && state.selectedHotelCheckIn && state.selectedHotelCheckOut) {
            const data = {
                hotel: state.selectedHotel,
                room: room,
                checkin: state.selectedHotelCheckIn,
                checkout: state.selectedHotelCheckOut,
                price: room.price,
            };
            dispatch({ type: 'UNSELECT_HOTEL_ROOM', payload: data });
        } else{
           const data =  {
                hotel: hotel,
                room: room,
                checkin: checkinDate,
                checkout: checkoutDate,
                price: room.price,
            };
            dispatch({ type: 'SELECT_HOTEL_ROOM', payload: data });
            console.log("Selected Room: ", room); 
            isSelected = true;
        }
    };

    return (
        <div className="hotel-room-card flex items-center p-4 border rounded-lg shadow-md">
            <img 
            src={images[0] ? `/${images[0]}` : '/images/hotel/image-not-found.png'} 
            alt="Room Image" 
            className="w-48 h-36 object-cover rounded-md" 
            />
            <div className="ml-4">
            <h3 className="text-lg font-semibold">{room.roomType}</h3>
            <p className="text-gray-600">Price: ${room.price}</p>
            <button 
                onClick={handleSelectClick} 
                className={`mt-2 px-4 py-2 rounded hover:bg-opacity-80 ${
                    isSelected ? 'bg-green-500 text-white' : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
            >
                {isSelected ? 'Selected' : 'Select Room'}
            </button>
            </div>
        </div>
    );
}
export default RoomCard;