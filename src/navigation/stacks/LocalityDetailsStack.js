import * as React from "react";
import { Routes, Route } from 'react-router-dom';
import LocalityDetails from "./../../screens/property/LocalityDetailsForm";

function LocalityDetailsNav() {
    return (
        <Routes>
            <Route path="/" element={<LocalityDetails />} />
            <Route path="/LocalityDetails" element={<LocalityDetails />} />
        </Routes>
    );
}

export default LocalityDetailsNav;
