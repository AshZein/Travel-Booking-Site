import React from 'react';

const Page = () => {
    return (
        <div className="page-container">
            <header className="header flex justify-between items-center bg-blue-800 text-white p-4">
                <h1 className="text-2xl">FlyNext</h1>
            </header>
            <main>
                <div className="loginBox">
                    {/* login form box goes here */}
                </div>
            </main>
            <footer className="footer bg-white text-white p-4 text-center">
                <p className="text-black">&copy; 2025 FlyNext</p>
            </footer>
        </div>
    );
}

export default Page;