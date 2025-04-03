"use client";
import React, { useEffect, useState } from 'react';
import {useRouter} from "next/navigation";
import Footer from '@/components/Footer';
import HomeHeader from '@/components/HomeHeader';

const Page = () =>{

    const fetchRooms = async (hotelId: number) => {
        const response = await fetch(`http://localhost:3000/api/hotel/room/info?hotelId=${hotelId}&checkin=${startDate}&checkout=${endDate}`);
        const data = await response.json();
        setRoom(Object.values(data) || []);
        const [room, setRoom] = useState<Room[]>([]);
    };

    return(
        <div>
            <HomeHeader />
            <main>
                <h1>Room Info</h1>
                <p>Details about the selected room will be displayed here.</p>
            </main>
            <Footer />
        </div>
    );
};

export default Page;