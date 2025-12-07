import * as React from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from "./../../screens/dashboard/Home";

function MainStackNavigator() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/home" element={<Home />} />
            </Routes>
        </Router>
    );
}

export default MainStackNavigator;
