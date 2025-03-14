import { prisma } from "../utils/db.js";

const AFS_API_URL = process.env.AFS_API_URL;
const API_KEY = process.env.AFS_KEY;

// fill airport table using AFS
export async function fillAirport(){
    try{
        const response = await fetch(`${AFS_API_URL}/api/airports`, {
            method: 'GET',
            headers: {
                'x-api-key': API_KEY
        }});

        if (!response.ok){
            console.log(airpor)
            throw new Error('Failed to fetch airports');
        }

        const airports = await response.json();

        const createAirports = await prisma.Airport.createMany({
            data: airports
        });

    } catch(error){
        console.error('Failed to fetch airports');
    }
}

// fill city table using afs
export async function fillCity(){
    try{
        const response = await fetch(`${AFS_API_URL}/api/cities`, {
            method: 'GET',
            headers: {
                'x-api-key': API_KEY
            }});

            if(!response.ok){
                throw new Error('Failed to fetch cities');
            }
            const cities = await response.json();
            
            const createCities = await prisma.City.createMany({
                data: cities
            });

    } catch(error){
        console.error("Failed to fetch cities");
    }
}
