import React from "react";
import { Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import ContactsResidential from "./../../screens/contacts/residential/ContactsResidential";
import CustomersCommercial from "./../../screens/contacts/commercial/CustomersCommercial";
import { MdAccountCircle, MdBusiness } from "react-icons/md";

const ContactsTopTab = () => {
    const location = useLocation();
    const currentPath = location.pathname.split('/').pop();

    return (
        <div className="flex flex-col h-full">
            <div className="flex bg-white border-b border-gray-200">
                <Link
                    to="/profile/ContactsListing/residential"
                    state={location.state}
                    className={`flex-1 py-3 text-center font-medium flex items-center justify-center gap-2 ${currentPath === 'residential' || currentPath === 'Contacts' || currentPath === '' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-500'
                        }`}
                >
                    <MdAccountCircle size={20} />
                    RESIDENTIAL CUSTOMER
                </Link>
                <Link
                    to="/profile/ContactsListing/commercial"
                    state={location.state}
                    className={`flex-1 py-3 text-center font-medium flex items-center justify-center gap-2 ${currentPath === 'commercial' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-500'
                        }`}
                >
                    <MdBusiness size={20} />
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
