"use client";
import React, { useEffect, useState } from 'react';
import {useRouter} from "next/navigation";
import Footer from '@/components/Footer';

const Page = () =>{
    const router = useRouter();

    const handleLogoClick = () => {
        router.push('/');
    };

    

            interface Hotel {
                hotelId: number;
                name: string;
                address: string;
                starRating: number;
                startingPrice: number;
              }

              interface Room {
                roomId: number;
                roomType: string;
                price: number;
                roomAvailability: number;
              }

              const [hotels, setHotels] = useState<Hotel[]>([]);
              const [room, setRoom] = useState<Room[]>([]);
              const [roomAvailability, setRoomAvailability] = useState<Record<string, number>>({});
                const [hotelId, setHotelId] = useState('');

                const [destinationLocation, setDestinationLocation] = useState('');
                const [startDate, setStartDate] = useState('');
                const [endDate, setEndDate] = useState('');
                const [hotelName, setHotelName] = useState('');
                const [minRating, setMinRating] = useState('');
                const [maxRating, setMaxRating] = useState('');
                const [name, setName] = useState('');
                const [minPrice, setMinPrice] = useState('');
                const [maxPrice, setMaxPrice] = useState('');
                const [detailedInfo, setDetailedInfo] = useState(false);
            
                useEffect(() => {
                    const searchParams = new URLSearchParams(window.location.search);
                    const hotelIdstr = searchParams.get('hotelId');
                    setHotelId(hotelIdstr || '');
                    console.log("fefaef "+ (searchParams.get('startDate')))
                    setStartDate(searchParams.get('startDate') || '');
                    console.log("jioeafj "+ (searchParams.get('endDate')))
                    setEndDate(searchParams.get('endDate') || '');
                    setHotelName(searchParams.get('hotelName') || '')
                }, []);
        

            const fetchRooms = async (hotelId: number) => {
                const response = await fetch(`http://localhost:3000/api/hotel/room/info?hotelId=${hotelId}`);
                const data = await response.json();
                console.log("API response data:", data);
                setRoom(Object.values(data) || []);
                        }

            const fetchAvailability = async (hotelId: number) => {
                const accessToken = localStorage.getItem("accessToken"); // Retrieve token
     
                const response = await fetch(`http://localhost:3000/api/hotel/room?hotelId=${hotelId}&checkin=${startDate}&checkOut=${endDate}`, {
                    method: "GET",
                    headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`, // Add token here
                    },
                });

                const data = await response.json();
                console.log("API response data:", data);
                setRoomAvailability(data.rooms || {});

            }

            useEffect(() => {
                if (hotelId){
                fetchRooms(Number(hotelId));
                fetchAvailability(Number(hotelId));
                }
              }, [hotelId]);

              const handeHotelSearch = (hotelId: number) => {
                console.log("hello" + hotelId)
                setDetailedInfo(!detailedInfo);
                fetchRooms(hotelId);
            }
              
            console.log("Hotels array length: " + hotels.length);
            return (
        <div className="page-container">
            <header className="header flex justify-between items-center bg-blue-800 text-white p-4">
                <div className="items-center flex gap-2">
                    <img src="logo_no_back.png" alt="FlyNext Logo" className="h-8" onClick={handleLogoClick}/>
                    <h1 className="text-2xl" onClick={handleLogoClick}>FlyNext</h1>
                </div>
            </header>
            <main>
                <div className="loginBox">
                    {/* login form box goes here */}
                </div>
                <h1 className="text-4xl font-bold mb-4 mt-4">Room Availability For {hotelName}</h1>
                {/* Check if no hotels found */}
                {room.length === 0 ? (
                <p className="text-red-500">No rooms found.</p>
                ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {room.map((rooms) => (
                    <div
                        key={rooms.roomType}
                        
                        className="border p-4 rounded-lg shadow-md bg-white"
                    >
                        <h2 className="text-xl font-semibold text-gray-800">Room: {rooms.roomType}</h2>
                        <div className="flex justify-between">
                        <div>
                        <p className="text-gray-600">General Availability: {rooms.roomAvailability}</p>
                        <p className="text-black font-bold">Availability for Date Range: {roomAvailability[rooms.roomId]} </p>
 
                        </div>
                        <div>
                        </div>
                        </div>
                    </div>
                    
                    ))}

                    
                </div>
                )}
                <div>
                </div>
            </main>
            <Footer />
        </div>
    );
}

export default Page;