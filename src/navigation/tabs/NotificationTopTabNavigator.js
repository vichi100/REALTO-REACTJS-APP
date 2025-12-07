import React from "react";
import { Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import Reminder from "./../../screens/common/Reminder";

const NotificationTopTab = () => {
    const location = useLocation();
    const currentPath = location.pathname.split('/').pop();

    return (
        <div className="flex flex-col h-full">
            <div className="flex bg-white border-b border-gray-200">
                <Link
                    to="/notifications/reminders"
                    className={`flex-1 py-3 text-center font-medium flex items-center justify-center gap-2 ${currentPath === 'reminders' || currentPath === 'NotificationTopTab' || currentPath === '' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-500'
                        }`}
                >
                    Reminders
                </Link>
                {/* <Link
          to="message"
          className={`flex-1 py-3 text-center font-medium flex items-center justify-center gap-2 ${
            currentPath === 'message' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-500'
          }`}
        >
          Message
        </Link> */}
            </div>

            <div className="flex-1 overflow-y-auto">
                <Routes>
                    <Route path="/" element={<Navigate to="/notifications/reminders" replace />} />
                    <Route path="reminders" element={<Reminder />} />
                    {/* <Route path="message" element={<Message />} /> */}
                </Routes>
            </div>
        </div>
    );
};

export default NotificationTopTab;
