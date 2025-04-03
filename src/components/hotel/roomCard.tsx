import React, { useEffect } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import { useItinerary } from '@/context/ItineraryContext';
import { Room } from '@/types/Room';
interface RoomCardProps {
    room: Room;
}

const RoomCard: React.FC<RoomCardProps> = ({ room }) => {
    const { state, dispatch } = useItinerary();
    const [images, setImages] = React.useState<string[]>([]);

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
        console.log("NO ROOM SELECT YET!!");
        // dispatch({ type: 'SELECT_ROOM', payload: { roomId, roomType, price, roomAvailability } });
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
                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
                Select Room
            </button>
            </div>
        </div>
    );
}
export default RoomCard;