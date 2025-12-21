import React, { useState } from "react";
import { setUserMobile, setUserDetails } from "./../../reducers/Action";
import { connect } from "react-redux";
// import { EntypoControllerPlay } from "react-icons/entypo"; // Assuming you have react-icons installed, or use a similar icon
import { FaPlay } from "react-icons/fa";
import Snackbar from "./../../components/SnackbarComponent";

import { useNavigate } from "react-router-dom";

const Login = props => {
    const navigate = useNavigate();
    const [mobileNumber, setMobileNumber] = useState("");
    const [isVisible, setIsVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const setMobileNumberX = (text) => {
        setMobileNumber(text)
    }

    const onSkip = () => {
        navigate("/");
    };

    const onNext = () => {
        if (mobileNumber.length !== 10) {
            setErrorMessage("Please enter a valid 10-digit mobile number");
            setIsVisible(true);
            return;
        }
        props.setUserMobile(mobileNumber);
        navigate("/otp", {
            state: {
                needToEnterOTP: true
            }
        });
    };



    const dismissSnackBar = () => {
        setIsVisible(false);
    };

    return (
        <div className="h-screen w-screen overflow-hidden flex flex-col items-center justify-center relative bg-black">
            {/* Background Image */}
            <div
                className="absolute inset-0 z-0 bg-cover bg-center"
                style={{
                    backgroundImage: 'url("/assets/images/rbg.jpeg")',
                }}
            >
                {/* Gradient Overlay - Darker for better text contrast */}
                <div className="absolute inset-0 bg-black/60"></div>
            </div>

            {/* Content Container */}
            <div className="relative z-10 w-full max-w-md p-6 flex flex-col items-center justify-center gap-12">

                {/* Logo & Tagline */}
                <div className="flex flex-col items-center gap-6">
                    <img
                        src="/assets/images/logo.png"
                        alt="Logo"
                        className="w-32 h-32 object-contain"
                    />
                    <p className="text-white text-xl font-medium text-center tracking-wide">
                        Supercharge Your Property Broking
                    </p>
                </div>

                {/* Input Section */}
                <div className="w-full flex flex-col items-center gap-8 mt-8">
                    <div className="relative w-full px-8 flex flex-col items-center gap-8">
                        {/* Transparent Input Box */}
                        <div
                            onClick={() => {
                                const input = document.getElementById('mobile-input');
                                if (input) input.focus();
                            }}
                            className="w-full border border-white/80 py-3 px-4 flex flex-col items-center justify-center relative backdrop-blur-[2px] cursor-text"
                        >
                            {/* Wrapper that shrinks to fit content exactly */}
                            <div className="relative inline-block">
                                {/* Width Driver (Invisible) - sets the width of the relative container */}
                                <span className="text-lg font-light tracking-wide opacity-0 pointer-events-none whitespace-pre">
                                    {mobileNumber.length > 0 ? (
                                        <>
                                            {mobileNumber}
                                            <span className="tracking-[8px]">{'.'.repeat(Math.max(0, 10 - mobileNumber.length))}</span>
                                        </>
                                    ) : (
                                        "Enter Mobile Number"
                                    )}
                                </span>

                                {/* Ghost Overlay (Digits + Dots) - Visible Layer */}
                                {mobileNumber.length > 0 && (
                                    <div className="absolute inset-0 flex items-center pointer-events-none z-0">
                                        <span className="text-lg font-light tracking-wide">
                                            <span className="text-white">{mobileNumber}</span>
                                            <span className="text-white/50 tracking-[8px]">{'.'.repeat(Math.max(0, 10 - mobileNumber.length))}</span>
                                        </span>
                                    </div>
                                )}

                                {/* Actual Input - Interaction Layer */}
                                <input
                                    id="mobile-input"
                                    className={`absolute inset-0 w-full h-full bg-transparent text-lg placeholder-gray-300 focus:outline-none font-light tracking-wide z-10 ${mobileNumber.length > 0 ? 'text-transparent caret-white text-left' : 'text-white text-center'}`}
                                    onChange={e => {
                                        const val = e.target.value;
                                        if (/^\d*$/.test(val) && val.length <= 10) {
                                            setMobileNumberX(val);
                                        }
                                    }}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            onNext();
                                        }
                                    }}
                                    placeholder="Enter Mobile Number"
                                    type="tel"
                                    value={mobileNumber}
                                />
                            </div>
                        </div>

                        {/* Play Button - Minimal White */}
                        <div
                            onClick={() => onNext()}
                            className="cursor-pointer hover:scale-110 transition-transform active:scale-95"
                        >
                            <FaPlay
                                color="white"
                                size={32}
                                className="drop-shadow-lg"
                            />
                        </div>
                    </div>
                </div>

                <Snackbar
                    visible={isVisible}
                    textMessage={errorMessage}
                    position={"top"}
                    actionHandler={() => dismissSnackBar()}
                    actionText="OK"
                />
            </div>

            {/* Skip Button */}
            <div
                className="absolute bottom-10 right-8 z-20 cursor-pointer"
                onClick={() => onSkip()}
            >
                <span className="text-white font-normal text-base hover:underline tracking-wide">
                    Skip
                </span>
            </div>
        </div>
    );
};



const mapStateToProps = state => ({
    userMobileNumber: state.AppReducer.userMobileNumber,
    userDetails: state.AppReducer.userDetails
});
const mapDispatchToProps = {
    setUserMobile,
    setUserDetails
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Login);
