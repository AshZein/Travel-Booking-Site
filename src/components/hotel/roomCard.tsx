import React, { useEffect } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import { useHotelItinerary } from '@/context/HotelItineraryContext';
import { Room } from '@/types/Room';
import { Hotel } from '@/types/Hotel';


interface Amenity {
  id: number;
  amenity: string;
}


interface RoomCardProps {
  room: Room;
  hotel: Hotel;
  checkinDate: string;
  checkoutDate: string;
  roomAvailability: string;
}

const RoomCard: React.FC<RoomCardProps> = ({ room, hotel, checkinDate, checkoutDate, roomAvailability }) => {
  const { state, dispatch } = useHotelItinerary();
  const [images, setImages] = React.useState<string[]>([]);
  const [isSelected, setIsSelected] = React.useState(false);

  const fetchRoomImages = async () => {
    try {
      const response = await fetch(`/api/hotel/room/images?roomId=${room.roomId}`);
      const data = await response.json();

      if (response.ok && Array.isArray(data.images)) {
        setImages(data.images);
      } else {
        setImages(['/images/hotel/image-not-found.png']);
      }
    } catch (error) {
      console.error("Error fetching room images:", error);
      setImages(['/images/hotel/image-not-found.png']);
    }
  };

  useEffect(() => {
    fetchRoomImages();
  }, [room.roomId]);

  const handleSelectClick = () => {
    if (isSelected) {
      dispatch({ type: 'UNSELECT_HOTEL_ROOM' });
      setIsSelected(false);
    } else {
      if (state.selectedRoom) {
        dispatch({ type: 'UNSELECT_HOTEL_ROOM' });
      }

      dispatch({ 
        type: 'SELECT_HOTEL_ROOM', 
        payload: {
          hotel: hotel,
          room: room,
          checkin: checkinDate,
          checkout: checkoutDate,
          price: room.price,
        }
      });
      setIsSelected(true);
    }
  };

  useEffect(() => {
    setIsSelected(state.selectedRoom?.roomId === room.roomId);
  }, [state.selectedRoom, room.roomId]);

  const formatAmenities = () => {
    if (!room.amenities || room.amenities.length === 0) {
      return 'None';
    }
    
    // Handle both string and Amenity object types
    const amenitiesList = room.amenities.map(item => {
      if (typeof item === 'string') {
        return item;
      } else if (typeof item === 'object' && 'amenity' in item) {
        return (item as Amenity).amenity;
      }
      return ''; // fallback for unexpected types
    });
    
    return amenitiesList.filter(Boolean).join(', ');
  };

  return (
    <div className="hotel-room-card flex items-start p-4 border rounded-lg shadow-md mb-4 bg-white">
      <img 
        src={images[0] || '/images/hotel/image-not-found.png'} 
        alt="Room Image" 
        className="w-48 h-36 object-cover rounded-md mr-4" 
      />
      
      <div className="flex-1">
        <h3 className="text-lg font-semibold text-gray-800">
          {room.roomType.charAt(0).toUpperCase() + room.roomType.slice(1)}
        </h3>
        
        <div className="space-y-1 mt-2">
          <p className="text-gray-600">
            <span className="font-medium">Price:</span> ${room.price.toFixed(2)} per night
          </p>
          
          <p className="text-gray-600">
            <span className="font-medium">Availability:</span> {roomAvailability} rooms left
          </p>
          
          <p className="text-gray-600">
            <span className="font-medium">Amenities:</span> {formatAmenities()}
          </p>
        </div>

        <button 
          onClick={handleSelectClick} 
          className={`mt-4 px-4 py-2 rounded-md font-medium transition-colors ${
            isSelected 
              ? 'bg-green-500 text-white hover:bg-green-600' 
              : 'bg-blue-500 text-white hover:bg-blue-600'
          }`}
        >
          {isSelected ? '✓ Selected' : 'Select Room'}
        </button>
      </div>
    </div>
  );
};

export default RoomCard;