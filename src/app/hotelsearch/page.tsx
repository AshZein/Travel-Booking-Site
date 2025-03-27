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

              const [hotels, setHotels] = useState<Hotel[]>([]);

                const [destinationLocation, setDestinationLocation] = useState('');
                const [startDate, setStartDate] = useState('');
                const [endDate, setEndDate] = useState('');
                const [minRating, setMinRating] = useState('');
                const [maxRating, setMaxRating] = useState('');
                const [name, setName] = useState('');
                const [minPrice, setMinPrice] = useState('');
                const [maxPrice, setMaxPrice] = useState('');
            
                useEffect(() => {
                    const searchParams = new URLSearchParams(window.location.search);
                    setDestinationLocation(searchParams.get('destinationLocation')?.split(',')[0] || '');
                    setStartDate(searchParams.get('startDate') || '');
                    setEndDate(searchParams.get('endDate') || '');
                    setMinRating(searchParams.get('minStarRating') || '');
                    setMaxRating(searchParams.get('maxStarRating') || '');
                    setName(searchParams.get('name') || '');
                    setMinPrice(searchParams.get('startPrice') || '');
                    setMaxPrice(searchParams.get('endPrice') || '');
                }, []);
        
            const fetchHotels = async () => {
              const response = await fetch(`http://localhost:3000/api/hotel/list?city=${destinationLocation}&checkin=${startDate}&checkout=${endDate}&minStarRating=${minRating}&maxStarRating=${maxRating}&name=${name}&startPrice=${minPrice}&endPrice=${maxPrice}`);
              const data = await response.json();
              console.log("API response data:", data);
              setHotels(Object.values(data) || []);
              console.log(data.hotels);
              console.log(data);
              console.log(hotels);
            };

            useEffect(() => {
                if (
                  destinationLocation &&
                  startDate &&
                  endDate
                ) {
                  fetchHotels();
                }
              }, [destinationLocation, startDate, endDate, minRating, maxRating, name, minPrice, maxPrice]);
              

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
                <h1 className="text-3xl font-bold mb-4">Available Hotels</h1>

                {/* Check if no hotels found */}
                {hotels.length === 0 ? (
                <p className="text-red-500">No hotels found.</p>
                ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {hotels.map((hotel) => (
                    <div
                        key={hotel.hotelId}
                        className="border p-4 rounded-lg shadow-md bg-white"
                    >
                        <h2 className="text-xl font-semibold text-gray-800">{hotel.name}</h2>
                        <p className="text-gray-600">{hotel.address}</p>
                        <p className="text-yellow-500">⭐ {hotel.starRating} Stars</p>
                        <p className="text-green-600">Price: ${hotel.startingPrice}</p>
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