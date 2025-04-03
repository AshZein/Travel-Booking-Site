"use client";
import React, { useEffect, useState } from 'react';
import {useRouter} from "next/navigation";
import Footer from '@/components/Footer';
import HomeHeader from '@/components/HomeHeader';

const Page = () =>{
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