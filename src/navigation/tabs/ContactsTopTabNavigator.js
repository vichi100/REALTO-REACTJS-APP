import React from "react";
import { Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import ContactsResidential from "./../../screens/contacts/residential/ContactsResidential";
import CustomersCommercial from "./../../screens/contacts/commercial/CustomersCommercial";
import { MdPerson, MdBusiness, MdArrowBack } from "react-icons/md";
import { FaUserTie } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const ContactsTopTab = () => {
    const location = useLocation();
    const navigate = useNavigate();

    let pathname = location.pathname;
    const isProfileContext = pathname.includes("/profile") || pathname.includes("/ContactsListing");

    if (pathname.endsWith("/")) pathname = pathname.slice(0, -1);
    const segments = pathname.split("/");
    const currentPath = segments[segments.length - 1];

    let basePath = pathname;
    if (currentPath === "residential" || currentPath === "commercial") {
        basePath = pathname.substring(0, pathname.lastIndexOf("/"));
    }

    const handleBack = () => {
        if (window.history.length > 1 && window.history.state && window.history.state.idx > 0) {
            navigate(-1);
        } else {
            navigate('/profile');
        }
    };

    return (
        <div className="flex flex-col h-full">
            {isProfileContext && (
                <div className="bg-white border-b border-gray-200 flex items-center p-4 shadow-sm">
                    <div onClick={handleBack} className="cursor-pointer mr-4 flex items-center">
                        <MdArrowBack size={24} color="#333" />
                    </div>
                    <h1 className="text-lg font-semibold text-gray-800">Contacts Listing</h1>
                </div>
            )}
            <div className="flex bg-white border-b border-gray-200">
                <Link
                    to={`${basePath}/residential`}
                    state={location.state}
                    className={`flex-1 py-3 text-center font-medium flex items-center justify-center gap-2 ${currentPath === 'residential' || currentPath === 'Contacts' || currentPath === '' ? 'text-black border-b-2 border-green-600' : 'text-gray-500'
                        }`}
                >
                    <MdPerson size={20} />
                    RESIDENTIAL CUSTOMER
                </Link>
                <Link
                    to={`${basePath}/commercial`}
                    state={location.state}
                    className={`flex-1 py-3 text-center font-medium flex items-center justify-center gap-2 ${currentPath === 'commercial' ? 'text-black border-b-2 border-green-600' : 'text-gray-500'
                        }`}
                >
                    <FaUserTie size={20} />
                    COMMERCIAL CUSTOMER
                </Link>
            </div>

            <div className="flex-1 overflow-y-auto">
                <Routes>
                    <Route path="/" element={<Navigate to="residential" replace state={location.state} />} />
                    <Route path="residential" element={<ContactsResidential />} />
                    <Route path="commercial" element={<CustomersCommercial />} />
                </Routes>
            </div>
        </div>
    );
};

export default ContactsTopTab;
