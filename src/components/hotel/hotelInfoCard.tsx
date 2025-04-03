import React, { useEffect } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import { useItinerary } from '@/context/ItineraryContext';
import { Hotel } from '@/types/Hotel';

interface HotelInfoCardProps {
    hotel: Hotel
}

const HotelInfoCard: React.FC<HotelInfoCardProps> = ({ hotel }) => {
    return(
        <div></div>
    );
}

export default HotelInfoCard;