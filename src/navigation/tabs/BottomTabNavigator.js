import React from "react";
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { MdWeb, MdViewModule, MdContacts, MdNotifications, MdAccountCircle } from "react-icons/md";
import ListingStack from "../stacks/ListingStack";
import ContactsStack from "../stacks/ContactsStack";
import NotificationStack from "../stacks/NotificationStack";
import ProfileStack from "../stacks/ProfileStack";
import GlobalSearchStackNav from "../stacks/GlobalSearchStack";

const BottomTabScreen = () => {
    const location = useLocation();

    const isActive = (path) => {
        return location.pathname.startsWith(path);
    };

    return (
        <div className="flex flex-col h-full">
            <div className="flex-1 overflow-y-auto pb-16">
                <Routes>
                    <Route path="/search/*" element={<GlobalSearchStackNav />} />
                    <Route path="/listing/*" element={<ListingStack />} />
                    <Route path="/contacts/*" element={<ContactsStack />} />
                    <Route path="/notifications/*" element={<NotificationStack />} />
                    <Route path="/profile/*" element={<ProfileStack />} />
                    <Route path="*" element={<GlobalSearchStackNav />} />
                </Routes>
            </div>

            <div className="fixed bottom-0 w-full bg-white border-t border-gray-200 flex justify-around items-center h-16 z-50">
                <Link to="/search" className="flex flex-col items-center justify-center w-full h-full text-gray-500 hover:text-blue-500">
                    <MdWeb size={26} color={isActive('/search') ? '#ff5733' : '#828282'} />
                </Link>

                <Link to="/listing" className="flex flex-col items-center justify-center w-full h-full text-gray-500 hover:text-blue-500">
                    <MdViewModule size={26} color={isActive('/listing') ? 'rgba(63, 195, 128, 1)' : '#828282'} />
                </Link>

                <Link to="/contacts" className="flex flex-col items-center justify-center w-full h-full text-gray-500 hover:text-blue-500">
                    <MdContacts size={26} color={isActive('/contacts') ? '#33aaff' : '#828282'} />
                </Link>

                <Link to="/notifications" className="flex flex-col items-center justify-center w-full h-full text-gray-500 hover:text-blue-500">
                    <MdNotifications size={26} color={isActive('/notifications') ? '#FFAA1D' : '#828282'} />
                </Link>

                <Link to="/profile" className="flex flex-col items-center justify-center w-full h-full text-gray-500 hover:text-blue-500">
                    <MdAccountCircle size={26} color={isActive('/profile') ? 'rgba(148, 124, 176, 1)' : '#828282'} />
                </Link>
            </div>
        </div>
    );
};

export default BottomTabScreen;
