"use client";
import React, { useEffect, useRef, useState } from 'react';
import {useRouter} from "next/navigation";
import Footer from '@/components/Footer';
import { ChevronDownIcon } from '@heroicons/react/24/solid';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

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

              interface HotelBooking{
                id: Number;
                userId: Number;         
                referenceId: String;
                hotelId: Number;         
                roomId: Number;          
                checkIn: Date;
                checkOut: Date;        
                bookingMade: Date;
                bookingCanceled: Boolean;
              }

              const [hotels, setHotels] = useState<Hotel[]>([]);
              const [room, setRoom] = useState<Room[]>([]);
              const[bookings, setBookings] = useState<HotelBooking[]>([]);
        const [filterDate, setFilterDate] = useState<Date | null>();

                const [hotelId, setHotelId] = useState('');
                const [hotelName, setHotelName] = useState('');
                const [endDate, setEndDate] = useState('');
                const [minRating, setMinRating] = useState('');
                const [maxRating, setMaxRating] = useState('');
                const [name, setName] = useState('');
                const [filterRoom, setFilterRoom] = useState('');
                const [minPrice, setMinPrice] = useState('');
                const [maxPrice, setMaxPrice] = useState('');
                const [detailedInfo, setDetailedInfo] = useState(false);
                const dropdownRef = useRef<HTMLDivElement>(null);
                    const [isOpen, setIsOpen] = useState(false);
                        const [selectedRoom, setSelectedRoom] = useState("Select Room");
                    
                
                
                
            
                useEffect(() => {
                    const searchParams = new URLSearchParams(window.location.search);
                    const hotelIdstr = searchParams.get('hotelId');
                    setHotelId(hotelIdstr || '');
                    setEndDate(searchParams.get('endDate') || '');
                    setHotelName(searchParams.get('hotelName') || '');
                    setMinRating(searchParams.get('minStarRating') || '');
                    setMaxRating(searchParams.get('maxStarRating') || '');
                    setName(searchParams.get('name') || '');
                    setMinPrice(searchParams.get('startPrice') || '');
                    setMaxPrice(searchParams.get('endPrice') || '');
                    
                }, []); 

                useEffect(() => {
                    if (hotelId) {  
                        fetchBookings();
                    }
                }, [hotelId, filterDate, filterRoom]);

            const getRoomTypeById = (roomId: Number) => {
                const foundRoom = room.find(r => r.roomId === roomId);
                return foundRoom ? foundRoom.roomType : 'Unknown Room Type';
            };
            const fetchRooms = async (hotelId: String) => {

                const response = await fetch(`http://localhost:3000/api/hotel/room/info?hotelId=${hotelId}`);
                const data = await response.json();
                console.log("API response data:", data);
                setRoom(Object.values(data) || []);
                        }

            const fetchBookings = async () => {




                if (filterDate && (filterRoom !== '')){
                    const formattedDate = filterDate.toISOString().split('T')[0];

                    const accessToken = localStorage.getItem("accessToken"); // Retrieve token
     
                    const response = await fetch(`/api/hotel/booking?hotelId=${hotelId}&roomType=${filterRoom}&date=${formattedDate}`, {
                        method: "GET",
                        headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${accessToken}`, // Add token here
                        },
                    });
                    
                    const data = await response.json();
                    console.log("API response data:", data);
                    setBookings(Object.values(data) || []);
                }
                 else if  (!filterDate && (filterRoom !== '')){
                    const accessToken = localStorage.getItem("accessToken"); // Retrieve token
     
                    const response = await fetch(`/api/hotel/booking?hotelId=${hotelId}&roomType=${filterRoom}`, {
                        method: "GET",
                        headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${accessToken}`, // Add token here
                        },
                    });
                    
                    const data = await response.json();
                    console.log("API response data:", data);
                    setBookings(Object.values(data) || []);
                }
                 else if  (filterDate && !(filterRoom !== '')){
                    const formattedDate = filterDate.toISOString().split('T')[0];

                    const accessToken = localStorage.getItem("accessToken"); // Retrieve token
     
                    const response = await fetch(`/api/hotel/booking?hotelId=${hotelId}&date=${formattedDate}`, {
                        method: "GET",
                        headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${accessToken}`, // Add token here
                        },
                    });
                    
                    const data = await response.json();
                    console.log("API response data:", data);
                    setBookings(Object.values(data) || []);
                } else{
                const accessToken = localStorage.getItem("accessToken"); // Retrieve token
     
                const response = await fetch(`/api/hotel/booking?hotelId=${hotelId}`, {
                    method: "GET",
                    headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`, // Add token here
                    },
                });
                
                const data = await response.json();
                console.log("API response data:", data);
                setBookings(Object.values(data) || []);
            }
                };
            
            const handleCancelBooking = async (referenceId: String) => {
                console.log("test here" + hotelId);
                
                const accessToken = localStorage.getItem("accessToken"); // Retrieve token
                
                const response = await fetch(`/api/hotel/booking?referenceId=${referenceId}`, {
                    method: "PATCH",
                    headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`, // Add token here
                    },
                });
                
                const data = await response.json();
                console.log("API response data:", data);
                fetchBookings();

            } 

            const handleDateChange = (date: Date) => {
                setFilterDate(date);
            }

            const handleFilterRoom = (roomType: String) => {
                    setFilterRoom(roomType.toString());
            }
            
                useEffect(() => {

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

                useEffect(() => {

                    if (hotelId){
                        fetchRooms(hotelId);
                        }
                }, [hotelId]);

                          
              
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
                        <h1 className="text-3xl font-bold mb-4">Booking List For {hotelName} </h1>
                        <h2 className="text-3xl font-bold mb-4">Filter by: </h2>
                        <div className="flex items-center gap-4">
               <div className="search-box">
                   <label htmlFor="end-date" className="text-white">Date:</label>
                   <DatePicker
                       selected={filterDate}
                       onChange={(date) => date && handleDateChange(date)}
                       className="text-black p-2 rounded"
                       id="end-date"
                   />
               </div>
                    <div className="relative w-72" ref={dropdownRef}>
                    <button 
                        onClick={() => setIsOpen((prev) => !prev)}
                        className="w-70 p-2 mb-5 border border-[#393A4B] text-left pl-3 rounded-lg placeholder-text-secondary text-[15px] focus:placeholder:opacity-0 focus:outline-none bg-#1DB4B0 focus:border-[#393A4B] caret-white focus:shadow-[0_0_0_2px_black] cursor-pointer flex justify-between items-center"
                    >
                        <span className="text-secondary">{selectedRoom}</span>
                        <ChevronDownIcon
                            className={`w-5 h-5 text-white ml-2 transition-transform duration-200 ${isOpen ? 'rotate-180' : 'rotate-0'}`}
                        />
                    </button>
                    {isOpen && (
                        <ul className="absolute w-full mt-2 bg-[#151621] border border-[#393A4B] rounded-lg text-secondary">
                            {room.map((room) => (
                                <li
                                    key={room.roomId}
                                    className="p-2 hover:bg-gray-700 cursor-pointer text-secondary"
                                    onClick={() => {
                                        handleFilterRoom(room.roomType);
                                        setIsOpen(false);
                                    }}
                                >
                                    {room.roomType}
                                </li>
                            ))}
                        </ul>
                    )}
                        </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {bookings.length > 0 && 
                        bookings.map((booking) => (
                            <div
                                key={booking.id.toString()}
                                
                                className="border p-4 rounded-lg shadow-md bg-white"
                            >
                                <h2 className="text-xl font-semibold text-gray-800">{booking.referenceId}</h2>
                                <div className="flex justify-between">
                                <div>
                                <p className="text-gray-600">Room: {getRoomTypeById(booking.roomId)}</p>
                                <p className="text-gray-600">Check-In Time: {booking.checkIn.toString().split('T')[0]}</p>
                                <p className="text-gray-600">Check-Out Time: {booking.checkOut.toString().split('T')[0]}</p>
                                <p className="text-gray-600">Cancelled: {booking.bookingCanceled ? "Cancelled" : "Not Cancelled"}</p>
                                </div>
                                <div>
                                <button className=" bg-red-500 mr-3" onClick={() => handleCancelBooking(booking.referenceId)}>Cancel <br></br> Booking </button>
                                </div>
                                </div>
                            </div>
                            
                            ))}
                            
                            </div>
                    </main>
                    <Footer />
                </div>
    );
}

export default Page;