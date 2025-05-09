"use client";
import React, { useEffect, useState } from 'react';
import {useRouter} from "next/navigation";
import Footer from '@/components/Footer';
import HomeHeader from '@/components/HomeHeader';
import { Room } from '@/types/Room';
import { Hotel } from '@/types/Hotel';

const Page = () =>{
    const router = useRouter();


    const [hotels, setHotels] = useState<Hotel[]>([]);
    const [hotelImgs, setHotelImgs] = useState<string[]>([]);
    const [room, setRoom] = useState<Room[]>([]);
      const [destinationLocation, setDestinationLocation] = useState('');
      const [startDate, setStartDate] = useState('');
      const [endDate, setEndDate] = useState('');
      const [minRating, setMinRating] = useState('');
      const [maxRating, setMaxRating] = useState('');
      const [name, setName] = useState('');
      const [minPrice, setMinPrice] = useState('');
      const [maxPrice, setMaxPrice] = useState('');
      const [detailedInfo, setDetailedInfo] = useState(false);
      const [detailedName, setDetailedName] = useState('');

      useEffect(() => {
          const searchParams = new URLSearchParams(window.location.search);
          setDestinationLocation(searchParams.get('destinationLocation')?.split(',')[0] || '');
          setStartDate(searchParams.get('startDate') || '');
          console.log("fjiwef " + searchParams.get('startDate'));
          setEndDate(searchParams.get('endDate') || '');
          setMinRating(searchParams.get('minStarRating') || '');
          setMaxRating(searchParams.get('maxStarRating') || '');
          setName(searchParams.get('name') || '');
          setMinPrice(searchParams.get('startPrice') || '');
          setMaxPrice(searchParams.get('endPrice') || '');
      }, []);

    const fetchHotelImages = async (hotelId: number) => {
      const response = await fetch(`/api/hotel/images?hotelId=${hotelId}`);
      const data = await response.json();
      if (response.ok && data.image) {
          setHotelImgs((prev) => ({
              ...prev,
              [hotelId]: data.image, // Set the hotelId as the key and the image path as the value
          }));
      } else {
        setHotelImgs((prev) => ({
          ...prev,
          [hotelId]: "images/hotel/itself/image-not-found.png", // Set the hotelId as the key and the image path as the value
      }));
      }
    };

  const fetchHotels = async () => {
    const response = await fetch(`/api/hotel/list?city=${destinationLocation}&checkin=${startDate}&checkout=${endDate}&minStarRating=${minRating}&maxStarRating=${maxRating}&name=${name}&startPrice=${minPrice}&endPrice=${maxPrice}`);
    const data = await response.json();
    
    setHotels(Object.values(data) || []);
  };

  const fetchRooms = async (hotelId: number) => {
    console.log("im here " + startDate);
    console.log("im also here" + endDate);
      const response = await fetch(`/api/hotel/room/info?hotelId=${hotelId}&checkIn=${startDate}&checkOut=${endDate}`);
      const data = await response.json();
      setRoom(Object.values(data) || []);
  };

  const handleHotelClick = (hotelId: number, name: string) => {
    console.log("im here " + startDate);
    console.log("im also here" + endDate);
      router.push(`/hotelsearch/roomInfo?hotelId=${hotelId}&name=${name}&checkIn=${startDate}&checkOut=${endDate}`);
  }


  useEffect(() => {
      if (
        destinationLocation &&
        startDate &&
        endDate
      ) {
        fetchHotels();
      }
    }, [destinationLocation, startDate, endDate]);

    useEffect(() => {
      if (hotels.length > 0) {
          hotels.forEach((hotel) => {
              fetchHotelImages(hotel.hotelId);
          });
      }
  }, [hotels]);

    const handeHotelSearch = (hotelId: number, name: string) => {
      setDetailedInfo(!detailedInfo);
      fetchRooms(hotelId);
      setDetailedName(name);
  }
    
  return (
  <div className="page-container">
  <HomeHeader />
  <main className='hotel-results p-3'>
      <h1 className="text-3xl font-bold mb-4">Available Hotels</h1>
      {/* Check if no hotels found */}
      {hotels.length === 0 ? (
      <p className="text-red-500">No hotels found.</p>
      ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hotels.map((hotel) => (
            <div
    key={hotel.hotelId}
    onClick={() => handleHotelClick(hotel.hotelId, hotel.name)}
    className="border p-4 rounded-lg shadow-md bg-white relative cursor-pointer group"
>
    <img
        src={hotelImgs[hotel.hotelId]} // Use default image if not available
        alt={hotel.name}
        className="w-full h-48 object-cover rounded-lg mb-4"
    />
    <h2 className="text-xl font-semibold text-gray-800">{hotel.name}</h2>
    <div className="flex justify-between">
        <div>
            <p className="text-gray-600">Address: {hotel.address}</p>
            <p className="text-yellow-500">⭐ {hotel.starRating} Stars</p>
            <p className="text-green-600">Starting Price: ${hotel.startingPrice}</p>
        </div>
    </div>
    
    {/* Text in Bottom Right Corner */}
    <div className="absolute bottom-8 right-10 text-blue-500 text-lg group-hover:font-bold">
        Click to see <br></br>available rooms
    </div>
</div>

          
          ))}

  {detailedInfo && (
    <div 
    className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-50"
    style={{
      backdropFilter: "blur(10px)", // Blur everything behind
    }}
    onClick={() => setDetailedInfo(false)}
    >
      <div 
        className="border p-4 pr-10 pl-10 rounded-lg shadow-md bg-white "
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the popup
      >
          <h1 className="text-[25px] font-semibold text-gray-800 mb-5">{detailedName + " Rooms"}</h1>
              {room.map((rooms) => (
                      <div
                          key={rooms.roomId}
                          
                      >
                          <h2 className="text-xl font-semibold text-gray-800">Room Name: {rooms.roomType}</h2>
                          <div className="flex justify-between">
                          <div>
                          <p className="text-yellow-500">Price: ${rooms.price}</p>
                          <p className="text-green-600">Room Availability: {rooms.roomAvailability}</p>

                          </div>
                          <div>                        </div>
                          </div>
                      </div>
                      
                      ))}
        <button 
          className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md cursor-pointer"
          onClick={() => setDetailedInfo(false)}
        >
          Close
        </button>
      </div>
    </div>
)}
                    
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