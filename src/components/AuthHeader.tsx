import React from 'react';
import { useRouter } from "next/navigation";

const AuthHeader: React.FC = () => {
    const HomeRouter = useRouter();

    // const handleLoginClick = () => {
    //     HomeRouter.push('/login');
    // };

    // const handleRegisterClick = () => {
    //     HomeRouter.push('/register');
    // };

    const handleLogoClick = () => {
        HomeRouter.push('/');
    };
    
    return(
        <header className="header flex justify-between items-center text-white p-4">
            <div className="items-center flex gap-2">
                <img src="logo_no_back.png" alt="FlyNext Logo" className="h-8" onClick={handleLogoClick}/>
                <h1 className="text-2xl" onClick={handleLogoClick}>FlyNext</h1>
            </div>

            {/* <div className="auth-buttons flex gap-4">
                <button 
                    className="auth-button text-white font-bold py-2 px-4 rounded"
                    onClick={handleLoginClick}
                >
                    Login
                </button>
                <button className="auth-button text-white font-bold py-2 px-4 rounded"
                    onClick={handleRegisterClick}
                >
                    Register
                </button>
            </div> */}
        </header>
    );
}

export default AuthHeader;