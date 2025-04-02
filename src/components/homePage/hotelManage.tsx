import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from "next/navigation";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { searchSuggestCities } from '@/utils/cleanSearch';
import { ChevronDownIcon } from "@heroicons/react/24/solid";


const HotelManage: React.FC = () => {
    const hotelRouter = useRouter();
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const countries = [
      "Canada",
      "United States",
      "China",
      "India",
      "Russia",
      "South Korea",
      "Singapore",
      "Prefer not to share",
    ];
    const [selectedCountry, setSelectedCountry] = useState("Select Country");
    const dropdownRef = useRef<HTMLDivElement>(null);
  
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
  
    const submit = () => {
      if (firstName === '' || lastName === '' || email === '' || username === '' || selectedCountry === "Select Country") {
        alert('Please fill in all fields');
        return;
      }
  
      alert('submission successful!');
    };
    return(
    <div className="relative w-72" ref={dropdownRef}>
    <button 
  onClick={() => setIsOpen((prev) => !prev)}
  className="w-70 p-2 border border-[#393A4B] text-left pl-3 rounded-lg placeholder-text-secondary text-[15px] focus:placeholder:opacity-0 focus:outline-none bg-#1DB4B0 focus:border-[#393A4B] caret-white focus:shadow-[0_0_0_2px_black] cursor-pointer flex justify-between items-center"
>
  <span className="text-secondary">{selectedCountry}</span>
  { <ChevronDownIcon
    className={`w-5 h-5 text-white ml-2 transition-transform duration-200 ${isOpen ? 'rotate-180' : 'rotate-0'}`}
  /> }

        </button>
        {isOpen && (
          <ul className="absolute w-full mt-2 bg-[#151621] border border-[#393A4B] rounded-lg text-secondary">
            {countries.map((country, index) => (
              <li
                key={index}
                className="p-2 hover:bg-gray-700 cursor-pointer text-secondary"
                onClick={() => {
                  setSelectedCountry(country);
                  setIsOpen(false);
                }}
              >
                {country}
              </li>
            ))}
          </ul>
        )}
      </div>
    );
    }

export default HotelManage;