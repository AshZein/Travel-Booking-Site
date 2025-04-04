import React, { useEffect } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import { useItinerary } from '@/context/ItineraryContext';
import { Hotel } from '@/types/Hotel';

interface HotelInfoCardProps {
    hotel: Hotel;
    hotelImg: string;
}

const HotelInfoCard: React.FC<HotelInfoCardProps> = ({ hotel, hotelImg }) => {
    return(
        <div className="hotel-info-card">
            <div>
                <img 
                src={hotelImg ? `/${hotelImg}` : '/images/hotel/image-not-found.png'} 
                alt="Hotel Image" 
                className="max-h-1/2 object-cover" 
                />
                {/* Hotel location on map here*/}
            </div>
            <div className="text-left overflow-hidden text-ellipsis ml-4">
            <h3 className="m-0.5 text-lg font-bold">{hotel.name}</h3>
            <p className="m-0.5 text-sm">Rating: {hotel.starRating}</p>
            <p className="m-0.5 text-sm">Address: {hotel.address}</p>
            {hotel.amenities && hotel.amenities.length > 0 && (
                <p className="m-0.5 text-sm">Amenities: {hotel.amenities.join(', ')}</p>
            )}
            </div>
        </div>
    );
}

export default HotelInfoCard;