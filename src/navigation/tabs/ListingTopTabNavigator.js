import React from "react";
import { Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import ListingResidential from "./../../screens/property/residential/ListingResidential";
import ListingCommercial from "./../../screens/property/commercial/ListingCommercial";
import { MdHome, MdBusiness } from "react-icons/md";

const ListingTopTab = () => {
    const location = useLocation();
    console.log("ListingTopTabNavigator: location.state:", location.state);
    const currentPath = location.pathname.split('/').pop();

    return (
        <div className="flex flex-col h-full">
            <div className="flex bg-white border-b border-gray-200">
                <Link
                    to="../residential"
                    state={location.state}
                    className={`flex-1 py-3 text-center font-medium flex items-center justify-center gap-2 ${currentPath === 'residential' || currentPath === 'Listing' || currentPath === '' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-500'
                        }`}
                >
                    <MdHome size={20} />
                    RESIDENTIAL PROPERTY
                </Link>
                <Link
                    to="../commercial"
                    state={location.state}
                    className={`flex-1 py-3 text-center font-medium flex items-center justify-center gap-2 ${currentPath === 'commercial' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-500'
                        }`}
                >
                    <MdBusiness size={20} />
                    COMMERCIAL PROPERTY
                </Link>
            </div>

            <div className="flex-1 overflow-y-auto">
                <Routes>
                    <Route path="/" element={<Navigate to="residential" replace state={location.state} />} />
                    <Route path="residential" element={<ListingResidential />} />
                    <Route path="commercial" element={<ListingCommercial />} />
                </Routes>
            </div>
        </div>
    );
};

export default ListingTopTab;
