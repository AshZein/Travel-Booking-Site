"use client";
import React, { useEffect, useState } from 'react';
import {useRouter} from "next/navigation";
import Footer from '@/components/Footer';
import HomeHeader from '@/components/HomeHeader';
import { Room } from '@/types/Room';
import { Hotel } from '@/types/Hotel';
import  RoomCard  from '@/components/hotel/roomCard';
import HotelInfoCard from '@/components/hotel/hotelInfoCard';
import withHotelProvider from '@/HOC/withHotelProvider';

const Page: React.FC = () =>{
    const [room, setRoom] = useState<Room[]>([]);
    const [hotel, setHotel] = useState<Hotel>({
        hotelId: 0,
        name: '',
        address: '',
        city: '',
        country: '',
        latitude: 0,
        longitude: 0,
        starRating: 0,
        amenities: [],
        startingPrice: 0
    });
    const [hotelImg, setHotelImg] = useState<string>('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const fetchRooms = async (hotelId: number) => {
        if (startDate && endDate){
        const response = await fetch(`/api/hotel/room/info?hotelId=${hotelId}&checkIn=${startDate}&checkOut=${endDate}`);
        const data = await response.json();
        setRoom(Object.values(data) || []);
        }
    };

    const fetchHotel = async (hotelId: number) => {
        const response = await fetch(`/api/hotel/info?hotelId=${hotelId}`);
        const data = await response.json();
        setHotel(data);
    };  

    const fetchHotelImg = async (hotelId: number) => {
        const response = await fetch(`/api/hotel/images?hotelId=${hotelId}`);
        const data = await response.json();
        setHotelImg(data.image || '');
    }

    useEffect(() => {
        const searchParams = new URLSearchParams(window.location.search);
        const hotelId = Number(searchParams.get('hotelId'));
        const checkin = searchParams.get('checkIn') || '';
        const checkout = searchParams.get('checkOut') || '';
        
        setStartDate(checkin);
        setEndDate(checkout);
      
        if (hotelId) {
          fetchHotel(hotelId);
          fetchHotelImg(hotelId);
          // Use the directly obtained dates
          fetchRooms(hotelId);
        }
      }, []);
      
      // Then add another useEffect to fetch rooms when dates change
      useEffect(() => {
        if (hotel.hotelId && startDate && endDate) {
          fetchRooms(hotel.hotelId);
        }
      }, [startDate, endDate, hotel.hotelId]);

    return (
        <div>
            <HomeHeader />
            <main>
                <h1 className="ml-4 text-lg font-bold">Hotel Info</h1>
                <HotelInfoCard hotel={hotel} hotelImg={hotelImg}/>
                <h1 className="ml-4 text-lg font-bold">Rooms</h1>
                {room.length > 0 ? (
  room
    .filter(roomItem => roomItem.roomAvailability !== 0)
    .map(roomItem => (
      <RoomCard
        key={roomItem.roomId}
        room={roomItem}
        hotel={hotel}
        checkinDate={startDate}
        checkoutDate={endDate}
        roomAvailability={roomItem.roomAvailability.toString()}
      />
    ))
) : (
  <p>No rooms available for the selected dates.</p>
)}
            </main>
            <Footer />
        </div>
    );
};

export default withHotelProvider(Page);