import React, { useEffect } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import { useItinerary } from '@/context/ItineraryContext';

interface RoomCardProps {
    roomId: number;
    roomType: string;
    price: number;
    roomAvailability: number;
}

const RoomCard: React.FC<RoomCardProps> = ({ roomId, roomType, price, roomAvailability }) => {
    const { state, dispatch } = useItinerary();
    const [images, setImages] = React.useState<string[]>([]);

    const fetchRoomImages = async () => {
        const response = await fetch(`http://localhost:3000/api/hotel/room/images?roomId=${roomId}`);
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
        <div className="hotel-room-card">
            <img src={`../${images[0]}`}></img>
            <div>
                <h3>{roomType}</h3>
                <p>Price: ${price}</p>
                <button onClick={handleSelectClick}>Select Room</button>
            </div>
        </div>
    );
}
export default RoomCard;