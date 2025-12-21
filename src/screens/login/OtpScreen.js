import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import Counter from './Counter'; // Assuming Counter is in the same directory or adjust path
import axios from 'axios';
import { setUserDetails } from './../../reducers/Action';
import { SERVER_URL } from './../../utils/Constant';
import OtpInput from 'react-otp-input'; // Using a standard React OTP input library

import { useNavigate, useLocation } from 'react-router-dom';

const OtpScreen = (props) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { userDetails } = props;
    const { needToEnterOTP: initialNeedToEnterOTP = false } = location.state || {};
    const [needToEnterOTP, setNeedToEnterOTP] = useState(initialNeedToEnterOTP);

    const [otp, setOTP] = useState(null);
    const [loading, setLoading] = useState(false);
    const [otpValue, setOtpValue] = useState('');

    useEffect(() => {
        console.log("userDetails changed:", userDetails);
        if (!needToEnterOTP && userDetails) {
            navigate("/search");
        }
    }, [userDetails, needToEnterOTP]);

    const hasFetchedOtp = useRef(false);

    useEffect(() => {
        if (hasFetchedOtp.current) return;
        hasFetchedOtp.current = true;
        setLoading(true);
        const otpX = "999999";
        const mobileX = props.userMobileNumber;
        generateOTP(otpX, mobileX);
    }, []);

    const resendOTP = () => {
        const mobileX = props.countryCode + props.userMobileNumber;
        generateOTP(otp, mobileX);
    };

    const generateOTP = (otpX, mobileX) => {
        setOTP(otpX);
        console.log('otp: ', otpX);
        const obj = {
            mobile: mobileX,
            otp: otpX
        };
        axios
            .post(
                SERVER_URL + '/generateOTP',
                obj
            )
            .then(
                (response) => {
                    console.log(response.data);
                    setLoading(false);
                },
                (error) => {
                    console.log(error);
                }
            );
    };

    const handleSubmit = (code) => {
        console.log(code);
        if (code === otp.toString()) {
            onSubmit();
        }
    };
    const onSubmit = () => {
        const mobileX = props.countryCode + props.userMobileNumber;
        console.log('onSubmit: ', mobileX);
        const userObj = {
            mobile: mobileX,
            country: props.country,
            country_code: props.countryCode
        };
        axios
            .post(
                SERVER_URL + '/getUserDetails',
                userObj
            )
            .then(
                (response) => {
                    console.log('response: ' + JSON.stringify(response));
                    console.log('response.data: ' + JSON.stringify(response.data));
                    save(response.data);
                },
                (error) => {
                    console.log(error);
                }
            );
    };

    const save = (userData) => {
        console.log('userData: ' + JSON.stringify(userData));
        setNeedToEnterOTP(false);
        props.setUserDetails(userData);
    };

    const onSkip = () => {
        navigate('/');
    };

    return loading ? (
        <div className="h-screen w-screen flex items-center justify-center bg-black/90">
            <div className="text-white text-lg font-medium animate-pulse">Loading...</div>
        </div>
    ) : (
        <div className="h-screen w-screen flex flex-col items-center justify-center bg-white">

            <div className="w-full max-w-sm px-6 flex flex-col items-center gap-10">
                {/* Header Section */}
                <div className="text-center">
                    <h2 className="text-3xl font-light text-gray-900 mb-2">Verification</h2>
                    <p className="text-gray-500 text-sm mb-1">
                        Enter the code sent to
                    </p>
                    <p className="text-black font-medium text-lg">
                        {props.countryCode + ' ' + props.userMobileNumber}
                    </p>
                </div>

                {/* OTP Input Section */}
                <div className="w-full flex justify-center">
                    <OtpInput
                        shouldAutoFocus={true}
                        value={otpValue}
                        onChange={(val) => {
                            setOtpValue(val);
                            if (val.length === 6) {
                                handleSubmit(val);
                            }
                        }}
                        numInputs={6}
                        renderInput={(props) => (
                            <input
                                {...props}
                                style={{ width: '3rem' }} // Override width for spacing
                                className="h-14 mx-1 text-2xl text-center font-normal text-gray-900 bg-transparent border-b-2 border-gray-300 focus:border-black focus:outline-none transition-colors"
                                inputMode="numeric"
                                pattern="[0-9]*"
                                type="tel"
                            />
                        )}
                    />
                </div>

                {/* Resend/Counter Section */}
                <div className="w-full text-center">
                    <p className="text-sm text-gray-400 mb-4">
                        Didn't receive the code?
                    </p>
                    <Counter resendOTP={resendOTP} />
                </div>

                {/* Skip Button */}
                <button
                    onClick={() => onSkip()}
                    className="text-gray-400 hover:text-black text-sm font-medium transition-colors"
                >
                    Skip for now
                </button>
            </div>
        </div>
    );
};

const mapStateToProps = (state) => ({
    userDetails: state.AppReducer.userDetails,
    country: state.AppReducer.country,
    countryCode: state.AppReducer.countryCode,
    userMobileNumber: state.AppReducer.userMobileNumber
});
const mapDispatchToProps = {
    setUserDetails
};

export default connect(mapStateToProps, mapDispatchToProps)(OtpScreen);
