import React from 'react';

const Page = () => {
    return (
        <div className="page-container">
            <header className="header flex justify-between items-center bg-blue-800 text-white p-4">
                <h1 className="text-2xl">FlyNext</h1>
                <div className="auth-buttons flex gap-4">
                    <button className="register-button bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                        Register
                    </button>
                    <button className="login-button bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                        Login
                    </button>
                </div>
            </header>
            <main>
                {/* Add your main content here */}
            </main>
            <footer className="footer bg-white text-white p-4 text-center">
                <p className="text-black">&copy; 2025 FlyNext</p>
            </footer>
        </div>
    );
}

export default Page;