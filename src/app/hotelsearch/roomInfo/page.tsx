"use client";
import React, { useEffect, useState } from 'react';
import {useRouter} from "next/navigation";
import Footer from '@/components/Footer';
import HomeHeader from '@/components/HomeHeader';
import { Room } from '@/types/Room';
import { Hotel } from '@/types/Hotel';
import  RoomCard  from '@/components/hotel/roomCard';

const Page = () =>{
    const [room, setRoom] = useState<Room[]>([]);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const fetchRooms = async (hotelId: number) => {
        const response = await fetch(`http://localhost:3000/api/hotel/room/info?hotelId=${hotelId}&checkin=${startDate}&checkout=${endDate}`);
        const data = await response.json();
        setRoom(Object.values(data) || []);
    };

    useEffect (() => {
        const searchParams = new URLSearchParams(window.location.search);
        const hotelId = Number(searchParams.get('hotelId'));
        setStartDate(searchParams.get('startDate') || '');
        setEndDate(searchParams.get('endDate') || '');

        if (hotelId) {
            fetchRooms(hotelId);
        }
    }
    , []);

    return(
        <div>
            <HomeHeader />
            <main>
                <h1>Room Info</h1>
                {room.length > 0 ? (
                    room.map((roomItem) => (
                        <RoomCard
                            key={roomItem.roomId}
                            roomId={roomItem.roomId}
                            roomType={roomItem.roomType}
                            price={roomItem.price}
                            roomAvailability={roomItem.roomAvailability}
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

export default Page;