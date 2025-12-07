'use client';

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from "./../../screens/login/Login";
import OtpScreen from "./../../screens/login/OtpScreen";
import BottomTabScreen from "../tabs/BottomTabNavigator";
import ProfileForm from "./../../screens/profile/ProfileForm";
import { setUserDetails } from "./../../reducers/Action";
import { connect } from "react-redux";

const MainScreen = (props) => {
    const { userDetails } = props;
    const [refresh, setRefresh] = useState(false);

    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        console.log("userDetails changed:", userDetails);
        if (userDetails) {
            setRefresh(!refresh);
        }
    }, [userDetails]);

    if (!mounted) return null;

    return (
        <div className="flex flex-col h-screen bg-white">
            <Router>
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/otp" element={<OtpScreen />} />
                    <Route path="/profile-form" element={<ProfileForm />} />
                    <Route path="/*" element={userDetails ? <BottomTabScreen /> : <Login />} />
                </Routes>
            </Router>
        </div>
    );
}

const mapStateToProps = state => ({
    userDetails: state.AppReducer.userDetails
});

const mapDispatchToProps = {
    setUserDetails,
};
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(MainScreen);
