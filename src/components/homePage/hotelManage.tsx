import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from "next/navigation";
import { ChevronDownIcon } from "@heroicons/react/24/solid";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Hotel } from '@/types/Hotel';

interface HotelManager {
    managerId: string;
    userId: string;
    hotelId: string;
    hotel: Hotel;
}
interface Room {
    roomId: number;
    roomType: string;
    price: number;
    roomAvailability: number;
  }
const HotelManage: React.FC = () => {
    const hotelRouter = useRouter();
    const [roomName, setRoomName] = useState("");
    const [roomPrice, setRoomPrice] = useState(1);
    const [amenities, setAmenities] = useState<string[]>([]);
    const [roomAvail, setRoomAvail] = useState(1);
    const [isOpen, setIsOpen] = useState(false);
    const [isOpenRoom, setIsOpenRoom] = useState(false);

    const [hotelList, setHotelList] = useState<HotelManager[]>([]);
    const [selectedHotel, setSelectedHotel] = useState("Select Hotel");
    const [selectedHotelId, setSelectedHotelId] = useState(0);
    const [selectedRoomId, setselectedRoomId] = useState(0);

    const [roomAvailBool, setRoomAvailBool] = useState(false);
    const [roomUpdate, setRoomUpdate] = useState(false);
    const [createRoom, setCreateRoom] = useState(false);
    const [startDate, setStartDate] = useState<Date>(new Date());
    const [endDate, setEndDate] = useState<Date>(new Date());
    const dropdownRef = useRef<HTMLDivElement>(null);
    const dropdownRefRoom = useRef<HTMLDivElement>(null);
    const [room, setRoom] = useState<Room[]>([]); 
    const [selectedRoom, setSelectedRoom] = useState("Select Room");
    const [selectedRoomAvail, setSelectedRoomAvail] = useState(0);
    const [newRoomAvail, setNewRoomAvail] = useState(0);
    
    
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
        setRoomAvailBool(false);
        setRoomUpdate(false);
    };

    const handeCreateRoomAPICall = async () => {
        try {
            console.log(amenities)
            const token = localStorage.getItem('accessToken');
            const response = await fetch('http://localhost:3000/api/hotel/room', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    hotelId: selectedHotelId, 
                    roomType: roomName, 
                    price: roomPrice,
                    numberAvailable: roomAvail,
                    amenities: amenities
                }),
            });
    
            if (!response.ok) throw new Error("Failed to create room");
            
            const data = await response.json();
            console.log(data);
        } catch (error) {
            console.error("Error:", error);
        }
    };
    

    const handleAmenities = (newAmenity: string) => {
        setAmenities((prevAmenity) => [...prevAmenity, newAmenity]); // Append new item
    };

    const handleBookingListClick = () => {
        hotelRouter.push(`/hotelBookings?hotelId=${selectedHotelId}&hotelName=${selectedHotel}`);
    };

    const handleRoomAvailabilityAPI = () => {
        const formattedStartDate = startDate.toISOString().split('T')[0];
        const formattedEndDate = endDate.toISOString().split('T')[0];
        console.log("end date " + formattedEndDate);
        hotelRouter.push(`/roomAvailability?hotelId=${selectedHotelId}&hotelName=${selectedHotel}&startDate=${formattedStartDate}&endDate=${formattedEndDate}`);

    };

    const handleRoomAvailabilityClick = () => {
        setRoomAvailBool(!roomAvailBool);
        setCreateRoom(false);
        setRoomUpdate(false);
    };

    const handleRoomUpdateClick = () => {
        setRoomUpdate(!roomUpdate);
        setCreateRoom(false);
        setRoomAvailBool(false);
        fetchRooms();
        console.log("gg " + room.length);
    }

    const fetchRooms = async () => {
        const response = await fetch(`http://localhost:3000/api/hotel/room/info?hotelId=${selectedHotelId}`);
        const data = await response.json();
        console.log("API response data:", data);
        setRoom(Object.values(data) || []);
                }

        const handleRoomUpdate = async () => {
            const token = localStorage.getItem('accessToken');
            console.log("yo " + localStorage.getItem('accessToken'));
    
            const response = await fetch(`http://localhost:3000/api/hotel/room?hotelId=${selectedHotelId}&roomId=${selectedRoomId}`, {
              method: 'PATCH',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify({
                    newRoomCount: Number(newRoomAvail)
    }),
    
            });
        
            setSelectedRoomAvail(newRoomAvail);
            fetchRooms();
            
        }

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
                                setSelectedHotelId(hotelManager.hotel.hotelId);
                                setIsOpen(false);
                            }}
                        >
                            {hotelManager.hotel.name}
                        </li>
                    ))}
                </ul>
            )}

            {selectedHotel !== "Select Hotel" && (
                <div className='grid grid-cols-4 gap-[190px]'>
                <button className='tripType-button w-[160px] h-[65px]' onClick={() => handleCreateRoom()}>Create a Room</button>
                <button className='tripType-button w-[160px] h-[65px]' onClick={() => handleBookingListClick()}>View Bookings List</button>
                <button className='tripType-button w-[160px] h-[65px]' onClick={() => handleRoomAvailabilityClick()}>View Room Availability</button>
                <button className='tripType-button w-[160px] h-[65px]' onClick={() => handleRoomUpdateClick()}>Update Availabile Rooms</button>
                

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
                max="500"
                onChange={(e) => setRoomPrice(Number(e.target.value))}
                value={roomPrice}
                className="w-50 h-3 bg-gray-200 rounded-lg cursor-pointer"
                style={{
                    background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${(roomPrice - 1) / 9999 * 100}%, #e5e7eb ${(roomPrice - 1) / 9999 * 100}%, #e5e7eb 100%)`,
                }}
            />
            <label htmlFor="roomPrice" className="text-white">${roomPrice}</label>
        </div>
        <div className="flex flex-col space-y-3 mt-6">
            <label htmlFor="roomAvail" className="text-white">Room Availability:</label>
            <input
                type="range"
                id="roomAvail"
                min="1"
                max="100"
                onChange={(e) => setRoomAvail(Number(e.target.value))}
                value={roomAvail}
                className="w-50 h-3 bg-gray-200 rounded-lg cursor-pointer"
                style={{
                    background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${(roomAvail - 1) / 99 * 100}%, #e5e7eb ${(roomAvail - 1) / 99 * 100}%, #e5e7eb 100%)`,
                }}
            />
            <label htmlFor="roomPrice" className="text-white">{roomAvail} Rooms</label>
        </div>
        <div>
        <button className="tripType-button mt-10" onClick={() => handeCreateRoomAPICall()}>Create Room</button>
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
    <div className={`overflow-y-auto max-h-40 rounded p-2 ${
        amenities.length === 0 ? "bg-#1DB4B0" : "bg-white"
    }`}>
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
        {roomAvailBool && (
        <div className="flex items-center gap-4">

            <div className="search-box">
                <label htmlFor="start-date" className="text-white">Start Date:</label>
                <DatePicker
                    selected={startDate}
                    onChange={(date) => date && setStartDate(date)}
                    className="text-black p-2 rounded"
                    id="start-date"
                />
            </div>
            <div className="search-box">
                <label htmlFor="end-date" className="text-white">End Date:</label>
                <DatePicker
                    selected={endDate}
                    onChange={(date) => date && setEndDate(date)}
                    className="text-black p-2 rounded"
                    id="end-date"
                />
            </div>
            <button className="tripType-button mt-10" onClick={() => handleRoomAvailabilityAPI()}>Check Availability</button>
            </div>

            )}
                    {roomUpdate && (
        <div className="flex items-center gap-4">

            <div className="relative w-72 mt-5" ref={dropdownRefRoom}>
                    <button 
                        onClick={() => setIsOpenRoom((prev) => !prev)}
                        className="w-70 p-2 mb-5 border border-[#393A4B] text-left pl-3 rounded-lg placeholder-text-secondary text-[15px] focus:placeholder:opacity-0 focus:outline-none bg-#1DB4B0 focus:border-[#393A4B] caret-white focus:shadow-[0_0_0_2px_black] cursor-pointer flex justify-between items-center"
                    >
                        <span className="text-secondary">{selectedRoom}</span>
                        <ChevronDownIcon
                            className={`w-5 h-5 text-white ml-2 transition-transform duration-200 ${isOpenRoom ? 'rotate-180' : 'rotate-0'}`}
                        />
                    </button>
                    {isOpenRoom && (
                        <ul className="absolute w-full mt-2 bg-[#151621] border border-[#393A4B] rounded-lg text-secondary">
                            {room.map((room) => (
                                <li
                                    key={room.roomId}
                                    className="p-2 hover:bg-gray-700 cursor-pointer text-secondary"
                                    onClick={() => {
                                        setSelectedRoom(room.roomType);
                                        setSelectedRoomAvail(room.roomAvailability);
                                        setselectedRoomId(room.roomId);
                                        setIsOpenRoom(false);
                                    }}
                                >
                                    {room.roomType}
                                </li>
                            ))}
                        </ul>
                    )}
        {selectedRoom !== "Select Room" && (
            
            <div className="flex items-center gap-2">


            <div className="flex flex-col space-y-3 mt-6">
                <label htmlFor="newRoomAvail" className="text-white">Old Room Availability: {selectedRoomAvail}</label>
                <input
                    type="range"
                    id="newRoomAvail"
                    min="0"
                    max="100"
                    onChange={(e) => setNewRoomAvail(Number(e.target.value))}
                    value={newRoomAvail}
                    className="w-50 h-3 bg-gray-200 rounded-lg cursor-pointer"
                    style={{
                        background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${(newRoomAvail - 1) / 99 * 100}%, #e5e7eb ${(newRoomAvail - 1) / 99 * 100}%, #e5e7eb 100%)`,
                    }}
                />
                <label htmlFor="roomPrice" className="text-white">New Room Availability: {newRoomAvail}</label>
            </div>
            <div>
            <button className="tripType-button mt-10" onClick={() => handleRoomUpdate()}>Update Room</button>
            </div>
        </div>               
)}
            </div>
            </div>

            )}
            
        </div>
    );
}

export default HotelManage;