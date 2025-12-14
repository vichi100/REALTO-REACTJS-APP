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
        <div
            style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'rgba(0,0,0, .9)',
                height: '100vh',
                display: 'flex'
            }}
        >
            <div style={{ color: '#fff' }}>Loading...</div>
        </div>
    ) : (
        <div style={{ flex: 1, backgroundColor: '#fff', height: '100vh', display: 'flex', flexDirection: 'column' }}>
            <div style={{ overflowY: 'auto', flex: 1 }}>
                <div
                    style={{
                        marginTop: 50,
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                        display: 'flex',
                        flexDirection: 'column'
                    }}
                >
                    <span style={{ color: '#000000', fontSize: 18, fontWeight: '500' }}>OTP Sent To Mobile</span>
                    <span style={{ color: '#696969', fontSize: 16, fontWeight: '500', marginTop: 10 }}>
                        {props.countryCode + ' ' + props.userMobileNumber}
                    </span>
                </div>
                <div
                    style={{
                        flex: 1,
                        justifyContent: 'center',
                        marginLeft: 15,
                        marginRight: 15,
                        marginTop: 40,
                        display: 'flex'
                    }}
                >
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
                                style={{
                                    width: '3rem',
                                    height: '3.5rem',
                                    margin: '0 0.5rem',
                                    fontSize: '1.5rem',
                                    borderRadius: 12,
                                    outline: 'none',
                                    textAlign: 'center'
                                }}
                                className="border border-gray-300 focus:border-green-600 focus:border-2 text-black"
                                inputMode="numeric"
                                pattern="[0-9]*"
                                type="tel"
                            />
                        )}
                    />
                </div>

                <div style={{ margin: 20 }}>
                    <Counter resendOTP={resendOTP} />
                </div>
            </div>
            <div style={{ position: 'absolute', bottom: 15, right: 15 }}>
                <div onClick={() => onSkip()} style={{ cursor: 'pointer' }}>
                    <span style={{ color: '#000000' }}>{'Skip >>'}</span>
                </div>
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
