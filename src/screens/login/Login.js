import React, { useState } from "react";
import { setUserMobile, setUserDetails } from "./../../reducers/Action";
import { connect } from "react-redux";
// import { EntypoControllerPlay } from "react-icons/entypo"; // Assuming you have react-icons installed, or use a similar icon
import { FaPlay } from "react-icons/fa";

import { useNavigate } from "react-router-dom";

const Login = props => {
    const navigate = useNavigate();
    const [mobileNumber, setMobileNumber] = useState("");

    const setMobileNumberX = (text) => {
        setMobileNumber(text)
    }

    const onSkip = () => {
        navigate("/");
    };

    const onNext = () => {
        props.setUserMobile(mobileNumber);
        navigate("/otp", {
            state: {
                needToEnterOTP: true
            }
        });
    };

    return (
        <div style={{ flex: 1, backgroundColor: "#ffffff", height: '100vh', display: 'flex', flexDirection: 'column' }}>
            <div style={{
                flex: 1,
                backgroundImage: 'url("/assets/images/rbg.jpeg")', // Ensure this path is correct for your public folder
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative'
            }}>
                <div
                    style={styles.background}
                />
                <div
                    style={{
                        flex: 1,
                        marginTop: "20%",
                        marginLeft: 30,
                        marginRight: 30,
                        justifyContent: "center",
                        alignItems: "center",
                        display: 'flex',
                        flexDirection: 'column',
                        zIndex: 1
                    }}
                >

                    <img
                        style={{ width: 200, height: 200 }}
                        src="/assets/images/logo.png" // Ensure this path is correct
                        alt="Logo"
                    />
                    <div>
                        <p style={{
                            paddingLeft: 10,
                            width: "80%",
                            // height: 45,
                            color: "#ffffff",
                            fontWeight: "500",
                            fontSize: 18,
                            textAlign: 'center'
                        }}>Supercharge Your Property Broking</p>
                    </div>


                    <div
                        style={{
                            flex: 1,
                            justifyContent: "center",
                            alignItems: "center",
                            width: "100%",
                            marginBottom: "55%",
                            display: 'flex',
                            flexDirection: 'column'
                        }}
                    >

                        <input
                            style={{
                                borderWidth: 1,
                                borderColor: "lightgrey",
                                paddingLeft: 10,
                                width: "80%",
                                height: 45,
                                color: "#000", // Changed to black for visibility on white input, or keep white if background is dark
                                fontSize: 16,
                                textAlign: 'center',
                                borderRadius: 5,
                                border: '1px solid lightgrey',
                                backgroundColor: 'rgba(255, 255, 255, 0.8)'
                            }}
                            onChange={e => setMobileNumberX(e.target.value)}
                            placeholder="Enter Mobile Number"
                            type="number"
                        />
                        <div
                            onClick={() => onNext()}
                            style={{
                                padding: 5,
                                paddingTop: 15,
                                cursor: 'pointer'
                            }}
                        >
                            <FaPlay
                                color={"#ffffff"}
                                size={50}
                            />
                        </div>
                    </div>
                </div>

                <div
                    style={{
                        position: "absolute",
                        bottom: 10,
                        right: 10,
                        margin: 20,
                        cursor: 'pointer',
                        zIndex: 1
                    }}
                    onClick={() => onSkip()}
                >
                    <span
                        style={{ color: "#fff" }}
                    >
                        Skip
                    </span>
                </div>
            </div>

        </div>
    );
};

const styles = {
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'orange',
    },
    background: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        height: '100%',
        width: '100%',
        background: 'linear-gradient(to bottom, rgba(0,0,0,0.8), transparent)',
        zIndex: 0
    },
    button: {
        padding: 15,
        alignItems: 'center',
        borderRadius: 5,
    },
    text: {
        backgroundColor: 'transparent',
        fontSize: 15,
        color: '#fff',
    },
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
