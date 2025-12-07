import * as React from "react";
import { Routes, Route } from 'react-router-dom';
import Home from "./../../screens/dashboard/Home";

const HomeStackNav = () => {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/Home" element={<Home />} />
        </Routes>
    );
};

export default HomeStackNav;
