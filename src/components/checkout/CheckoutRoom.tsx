import React, { useEffect } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import { useHotelItinerary } from '@/context/HotelItineraryContext';
import { Room } from '@/types/Room';
import { Hotel } from '@/types/Hotel';
import { dateSplitter } from '@/utils/flight'; 
interface RoomCardProps {
    room: Room;
    hotel: Hotel;
    checkinDate: string;
    checkoutDate: string;
}

const CheckoutRoomCard: React.FC<RoomCardProps> = ({ room, hotel, checkinDate, checkoutDate }) => {
    const { state, dispatch } = useHotelItinerary();
    const [images, setImages] = React.useState<string[]>([]);
    const [isSelected, setIsSelected] = React.useState(false);
    
    const dateCache: { [key: string]: { [key: string]: string } } = {};
    const checkinPieces = checkinDate ? dateSplitter(checkinDate, dateCache) : null;
    const checkoutPieces = checkoutDate ? dateSplitter(checkoutDate, dateCache) : null;

    const fetchRoomImages = async () => {
        const response = await fetch(`http://localhost:3000/api/hotel/room/images?roomId=${room.roomId}`);
        const data = await response.json();

        if (response.ok && Array.isArray(data.images)) {
            setImages(data.images); // Set the images array directly
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
    

    useEffect(() => {
        // Update the selection state if the selected room changes
        setIsSelected(state.selectedRoom?.roomId === room.roomId);
    }, [state.selectedRoom, room.roomId]);

    return (
        <div className="hotel-room-card flex items-center p-4 border rounded-lg shadow-md">
            <img 
            src={images[0] ? `/${images[0]}` : '/images/hotel/image-not-found.png'} 
            alt="Room Image" 
            className="w-48 h-36 object-cover rounded-md" 
            />
            <div className="ml-4">
            <h3 className="text-lg font-semibold">{room.roomType.charAt(0).toUpperCase() + room.roomType.slice(1)}</h3>
            <p className="text-gray-600">Price Per Night: ${room.price}</p>
            <p>
                <strong>Check-in:</strong> {checkinPieces ? `${checkinPieces.day} ${checkinPieces.month} ${checkinPieces.year} at ${checkinPieces.hour}:${checkinPieces.minute}` : 'N/A'}
            </p>
            <p>
                <strong>Check-out:</strong> {checkoutPieces ? `${checkoutPieces.day} ${checkoutPieces.month} ${checkoutPieces.year} at ${checkoutPieces.hour}:${checkoutPieces.minute}` : 'N/A'}
            </p>
            <p>
                Total Cost: ${checkinDate && checkoutDate ? 
                    room.price * Math.ceil((new Date(checkoutDate).getTime() - 
                    new Date(checkinDate).getTime()) / (1000 * 60 * 60 * 24)) 
                    : 'N/A'}
            </p>
            </div>
        </div>
    );
}
export default CheckoutRoomCard;