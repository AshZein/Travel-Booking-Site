import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from "next/navigation";
import { ChevronDownIcon } from "@heroicons/react/24/solid";
import { Hotel } from '../../types/hotel'; 


interface HotelManager {
    managerId: string;
    userId: string;
    hotelId: string;
    hotel: Hotel;
}

const HotelManage: React.FC = () => {
    const hotelRouter = useRouter();
    const [roomName, setRoomName] = useState("");
    const [roomPrice, setRoomPrice] = useState(1);
    const [amenities, setAmenities] = useState<string[]>([]);
    const [username, setUsername] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [hotelList, setHotelList] = useState<HotelManager[]>([]);
    const [selectedHotel, setSelectedHotel] = useState("Select Hotel");
    const [createRoom, setCreateRoom] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    
    const getHotelList = async () => {
        const token = localStorage.getItem("accessToken");
        try {
            const response = await fetch(`http://localhost:3000/api/hotel/owner`, {
                method: "GET", 
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
            });
            
            if (!response.ok) {
                throw new Error('Failed to fetch hotels');
            }
            
            const data: HotelManager[] = await response.json();
            setHotelList(data);
        } catch (error) {
            console.error('Error fetching hotels:', error);
            // Handle error appropriately
        }
    }
    
    useEffect(() => {
        getHotelList();
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);
  
    const handleCreateRoom = () => {
        setCreateRoom(!createRoom);
    };

    const handleAmenities = (newAmenity: string) => {
        setAmenities((prevAmenity) => [...prevAmenity, newAmenity]); // Append new item
    };
    return (
        <div className="relative w-72" ref={dropdownRef}>
            <button 
                onClick={() => setIsOpen((prev) => !prev)}
                className="w-70 p-2 mb-5 border border-[#393A4B] text-left pl-3 rounded-lg placeholder-text-secondary text-[15px] focus:placeholder:opacity-0 focus:outline-none bg-#1DB4B0 focus:border-[#393A4B] caret-white focus:shadow-[0_0_0_2px_black] cursor-pointer flex justify-between items-center"
            >
                <span className="text-secondary">{selectedHotel}</span>
                <ChevronDownIcon
                    className={`w-5 h-5 text-white ml-2 transition-transform duration-200 ${isOpen ? 'rotate-180' : 'rotate-0'}`}
                />
            </button>
            {isOpen && (
                <ul className="absolute w-full mt-2 bg-[#151621] border border-[#393A4B] rounded-lg text-secondary">
                    {hotelList.map((hotelManager) => (
                        <li
                            key={hotelManager.hotelId}
                            className="p-2 hover:bg-gray-700 cursor-pointer text-secondary"
                            onClick={() => {
                                setSelectedHotel(hotelManager.hotel.name);
                                setIsOpen(false);
                            }}
                        >
                            {hotelManager.hotel.name}
                        </li>
                    ))}
                </ul>
            )}
            {selectedHotel !== "" && (
                <div className='grid grid-cols-3 gap-[190px]'>
                <button className='tripType-button w-[160px] h-[65px]' onClick={() => handleCreateRoom()}>Create a Room</button>
                <button className='tripType-button w-[160px] h-[65px]'>View Bookings List</button>
                <button className='tripType-button w-[160px] h-[65px]'>View Room Availability</button>

                </div>
            )}
            {createRoom && (
                <div className="flex flex-col space-y-4">
    {/* Fixed Container for Room Name and Price */}
    <div className="flex items-center gap-4">
        <div className="search-box">
            <label htmlFor="name" className="text-white">Room Name:</label>
            <input 
                type="text" 
                id="hotel-location" 
                className="text-black p-2 rounded" 
                placeholder="Enter room name"
                onChange={(e) => setRoomName(e.target.value)}
                value={roomName}
            />
        </div>

        <div className="flex flex-col space-y-3 mt-6">
            <label htmlFor="roomPrice" className="text-white">Room Price:</label>
            <input
                type="range"
                id="roomPrice"
                min="1"
                max="9999"
                onChange={(e) => setRoomPrice(Number(e.target.value))}
                value={roomPrice}
                className="w-50 h-3 bg-gray-200 rounded-lg cursor-pointer"
                style={{
                    background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${(roomPrice - 1) / 9999 * 100}%, #e5e7eb ${(roomPrice - 1) / 9999 * 100}%, #e5e7eb 100%)`,
                }}
            />
            <label htmlFor="roomPrice" className="text-white">${roomPrice}</label>
        </div>
        <div>
        <button className="tripType-button mt-10" >Search</button>
        </div>
    </div>

    {/* Amenities Section */}
    <div className="search-box">
        <label htmlFor="amenities" className="text-white">Amenities:</label>
        <input 
            type="text" 
            id="hotel-location" 
            className="text-black p-2 rounded" 
            placeholder="Enter amenity"
            onKeyDown={(e) => {
                if (e.key === "Enter") {
                    const target = e.target as HTMLInputElement;
                    if (target.value.trim()) {
                        handleAmenities(target.value);
                        target.value = "";
                    }
                }
            }}
        />
    </div>

    {/* Amenities List with Scrollable Feature */}
    <div className="overflow-y-auto max-h-40 border bg-white rounded p-2">
        <ul className="text-black">
            {amenities.map((amenity, index) => (
                <li 
                    key={index} 
                    className="cursor-pointer " 
                    onClick={() => setAmenities(amenities.filter((_, i) => i !== index))}
                >
                    {"- " + amenity}
                </li>
            ))}
        </ul>
    </div>
    </div>

            )}
        </div>
    );
}

export default HotelManage;