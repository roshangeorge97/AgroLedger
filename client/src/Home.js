import React from 'react';
import { useHistory } from 'react-router-dom';

function Home() {
    const history = useHistory();

    const redirectToRoles = () => {
        history.push('/roles');
    };

    const redirectToAddMed = () => {
        history.push('/add');
    };

    const redirectToControlSupply = () => {
        history.push('/supply');
    };

    const redirectToTrack = () => {
        history.push('/track');
    };

    return (
        <div className="bg-green-900 text-white min-h-screen py-10 flex items-center">
            <div className="container mx-auto px-4">
                <h1 className="text-3xl font-bold mb-4">Agro Supply Chain</h1>
                <p className="mb-8">Welcome to Agro Supply Chain! This DApp empowers the owner to seamlessly manage the supply chain process.</p>

                <div className="flex flex-col space-y-4">
                    <div className="bg-green-700 p-6 rounded-lg shadow-md relative">
                        <h2 className="text-xl font-semibold mb-2">Step 1: Register Entities</h2>
                        <p>Owner should register raw material suppliers, manufacturers, distributors, and retailers.</p>
                        <button onClick={redirectToRoles} className="btn btn-success">Register</button>
                    </div>

                    <div className="bg-green-700 p-6 rounded-lg shadow-md relative">
                        <h2 className="text-xl font-semibold mb-2">Step 2: Order Product</h2>
                        <p>Owner should order products from manufacturers.</p>
                        <button onClick={redirectToAddMed} className="btn btn-success">Order Product</button>
                    </div>

                    <div className="bg-green-700 p-6 rounded-lg shadow-md relative">
                        <h2 className="text-xl font-semibold mb-2">Step 3: Control Supply Chain</h2>
                        <p>Owner should control the supply chain.</p>
                        <button onClick={redirectToControlSupply} className="btn btn-success">Control Supply Chain</button>
                    </div>

                    <hr className="w-full my-6" />

                    <div className="bg-green-700 p-6 rounded-lg shadow-md relative">
                        <h2 className="text-xl font-semibold mb-2">Track Products</h2>
                        <p>Track the movement of products through the supply chain.</p>
                        <button onClick={redirectToTrack} className="btn btn-success">Track Product</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;
