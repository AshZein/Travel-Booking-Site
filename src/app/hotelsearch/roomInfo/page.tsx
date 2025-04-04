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
        const response = await fetch(`http://localhost:3000/api/hotel/room/info?hotelId=${hotelId}&checkin=${startDate}&checkout=${endDate}`);
        const data = await response.json();
        setRoom(Object.values(data) || []);
    };

    const fetchHotel = async (hotelId: number) => {
        const response = await fetch(`http://localhost:3000/api/hotel/info?hotelId=${hotelId}`);
        const data = await response.json();
        setHotel(data);
    };  

    const fetchHotelImg = async (hotelId: number) => {
        const response = await fetch(`http://localhost:3000/api/hotel/images?hotelId=${hotelId}`);
        const data = await response.json();
        setHotelImg(data.image || '');
    }

    useEffect (() => {
        const searchParams = new URLSearchParams(window.location.search);
        const hotelId = Number(searchParams.get('hotelId'));
        setStartDate(searchParams.get('startDate') || '');
        setEndDate(searchParams.get('endDate') || '');

        if (hotelId) {
            fetchHotel(hotelId);
            fetchRooms(hotelId);
            fetchHotelImg(hotelId);
        }
    }
    , []);

    return (
        <div>
            <HomeHeader />
            <main>
                <h1 className="ml-4 text-lg font-bold">Hotel Info</h1>
                <HotelInfoCard hotel={hotel} hotelImg={hotelImg}/>
                <h1 className="ml-4 text-lg font-bold">Rooms</h1>
                {room.length > 0 ? (
                    room.map((roomItem) => (
                        <RoomCard
                            key={roomItem.roomId // Use a unique identifier as the key
                            }
                            room={roomItem}
                            hotel={hotel}
                            checkinDate={startDate}
                            checkoutDate={endDate}
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