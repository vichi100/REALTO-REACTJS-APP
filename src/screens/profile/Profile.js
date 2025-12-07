import React, { useState, useEffect, useCallback } from "react";
import { connect } from "react-redux";
import Button from "./../../components/Button";
import {
    MdMap,
    MdPhone,
    MdAccountBox,
    MdPersonOff,
    MdEdit,
    MdShare,
    MdEmail,
    MdSettings,
    MdSecurity
} from "react-icons/md";
import { AiOutlineCustomerService } from "react-icons/ai";
import { setUserDetails } from "./../../reducers/Action";
import axios from "axios";
import { SERVER_URL, EMAIL_PDF_SERVER } from "./../../utils/Constant";
import { EMPLOYEE_ROLE_DELETE } from "./../../utils/AppConstant";
import Home from "../dashboard/Home";

const Profile = props => {
    const { navigation } = props;
    const { didDbCall = true } = props.route?.params || {};

    const [modalVisible, setModalVisible] = useState(false);
    const [dbCall, setDbCall] = useState(didDbCall);
    const [userDetails, setUserDetails] = useState(props.userDetails);
    const [userData, setUserData] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setUserDetails(props.userDetails);
    }, [props.userDetails]);

    useEffect(() => {
        if (dbCall) {
            getUserProfileDeatails();
        }
        return () => {
            setDbCall(true);
        };
    }, [dbCall]);

    const getUserProfileDeatails = () => {
        if (!props.userDetails) return;
        const profileDetails = {
            req_user_id: props.userDetails.id,
            mobile: props.userDetails.mobile,
        };

        axios(SERVER_URL + "/getUserProfileDeatails", {
            method: "post",
            headers: {
                "Content-type": "Application/json",
                Accept: "Application/json"
            },
            data: profileDetails
        }).then(
            response => {
                if (response.status === 200) {
                    setUserData(response.data);
                    updateDbCall(true);
                }
            },
            error => {
            }
        );
    };

    const updateDbCall = useCallback((value) => {
        setDbCall(value);
    }, []);

    const openEditProfile = () => {
        navigation.navigate("ProfileForm", {
            updateDbCall: updateDbCall
        });
    };

    const sendMail = () => {
        try {
            const email = props.userDetails.email;
            if (email && email.trim() !== "") {
                const profileDetails = {
                    req_user_id: props.userDetails.id,
                    mobile: props.userDetails.mobile,
                };

                axios(EMAIL_PDF_SERVER + "/emailpdf/generate", {
                    method: "post",
                    headers: {
                        "Content-type": "Application/json",
                        Accept: "Application/json"
                    },
                    data: profileDetails
                }).then(
                    response => {
                        if (response.status === 200) {
                            setUserData(response.data);
                            updateDbCall(true);
                        }
                    },
                    error => {
                    }
                );
            } else if (!email || email.trim() === "") {
                navigation.navigate("ProfileForm", {
                    updateDbCall: updateDbCall
                });
            }
        } catch (error) {
            console.log("Error => ", error);
        }
    }

    const makeCall = (mobile) => {
        window.open(`tel:${mobile}`);
    };

    const onShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'Realto AI',
                    text: 'Realto AI is a real estate app that Supercharge Your Property Broking!',
                    url: window.location.href,
                });
            } catch (error) {
                console.log('Error sharing:', error);
            }
        } else {
            alert("Share not supported on this browser");
        }
    };

    const openEmployeeList = () => {
        navigation.navigate("EmployeeList", {
            itemForAddEmplyee: null,
            disableDrawer: false,
            displayCheckBox: false
        });
    };

    const deleteMe = () => {
        const user = props.userDetails;
        if (user.user_type === "employee") {
            deleteEmployee(user);
        } else if (user.user_type === "agent") {
            deleteAgentAccount(user);
        }
    }

    const deleteEmployee = (empObj) => {
        const user = {
            req_user_id: props.userDetails.id,
            agent_id: props.userDetails.works_for,
            employee_id: empObj.id
        };
        axios(SERVER_URL + "/deleteEmployee", {
            method: "post",
            headers: {
                "Content-type": "Application/json",
                Accept: "Application/json"
            },
            data: user
        }).then(
            response => {
                if (response.data === "success") {
                    setModalVisible(false);
                    setUserDetails(null);
                    props.setUserDetails(null);
                    navigation.navigate("Login");
                }
            }
        ).catch((error) => {
            if (error.response && error.response.status === 409) {
                if (error.response.data.errorCode === "EMPLOYEE_EXISTS") {
                    setErrorMessage(error.response.data.message);
                    setIsVisible(true);
                }
            } else {
                console.error("Error deleting employee:", error);
                setErrorMessage("An unexpected error occurred. Please try again.");
                setIsVisible(true);
            }
        });

    }

    const deleteAgentAccount = () => {
        const agent = {
            req_user_id: props.userDetails.works_for,
            agent_id: props.userDetails.id
        };
        axios(SERVER_URL + "/deleteAgentAccount", {
            method: "post",
            headers: {
                "Content-type": "Application/json",
                Accept: "Application/json"
            },
            data: agent
        }).then(
            response => {
                if (response.data === "success") {
                    setUserDetails(null);
                    props.setUserDetails(null);
                    setModalVisible(!modalVisible);
                    navigation.navigate("Login");

                }
            }
        ).catch((error) => {
            if (error.response && error.response.status === 409) {
                if (error.response.data.errorCode === "Unauthorized") {
                    setErrorMessage(error.response.data.message);
                    setIsVisible(true);
                }
            } else {
                console.error("Error deleting user, agent:", error);
                setErrorMessage("An unexpected error occurred. Please try again.");
                setIsVisible(true);
            }
        });;
    };

    return (
        <div style={styles.container}>
            <div style={styles.userInfoSection}>
                <div style={{ flexDirection: "row", marginTop: 15, display: 'flex' }}>
                    <div style={{
                        width: 80,
                        height: 80,
                        borderRadius: 40,
                        backgroundColor: '#ccc',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '2px solid rgba(127,255,212, .9)'
                    }}>
                        <span style={{ color: "rgba(105,105,105, .9)", fontSize: 30 }}>
                            {props.userDetails && props.userDetails.name
                                ? props.userDetails.name.slice(0, 1)
                                : "G"}
                        </span>
                    </div>
                    <div style={{ marginLeft: 20 }}>
                        <h3
                            style={{
                                marginTop: 15,
                                marginBottom: 5,
                                fontSize: 24,
                                fontWeight: "bold",
                                margin: 0
                            }}
                        >
                            {props.userDetails &&
                                props.userDetails.name
                                ? props.userDetails.name
                                : "Guest"}
                        </h3>
                        <span style={styles.caption}>
                            {props.userDetails &&
                                props.userDetails.company_name
                                ? props.userDetails.company_name
                                : "Company"}
                        </span>
                    </div>
                </div>
            </div>

            <div style={styles.userInfoSection}>
                <div style={styles.row}>
                    <MdMap color="#777777" size={20} />
                    <span style={{ color: "#777777", marginLeft: 20 }}>
                        {props.userDetails &&
                            props.userDetails.city
                            ? props.userDetails.city
                            : "Guest City"}
                    </span>
                </div>
                <div style={styles.row}>
                    <MdPhone color="#777777" size={20} />
                    <span style={{ color: "#777777", marginLeft: 20 }}>

                        {props.userDetails && props.userDetails.mobile
                            ? props.userDetails.mobile
                            : "Add Mobile Number"}
                    </span>
                </div>
            </div>
            {props.userDetails &&
                props.userDetails.user_type === "agent" ? (
                <div
                    style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        marginLeft: 40,
                        marginRight: 40,
                        marginBottom: 10,
                        display: 'flex'
                    }}
                >
                    <div onClick={() => setModalVisible(true)} style={{ cursor: 'pointer' }}>
                        <MdPersonOff color="#777777" size={20} />
                    </div>
                    <div onClick={() => openEditProfile()} style={{ cursor: 'pointer' }}>
                        <MdEdit color="#777777" size={20} />
                    </div>
                </div>
            ) : null}

            {props.userDetails &&
                props.userDetails.user_type === "employee" ? (
                <div
                    style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        marginLeft: 40,
                        marginRight: 40,
                        marginBottom: 10,
                        display: 'flex'
                    }}
                >
                    <div onClick={() => setModalVisible(true)} style={{ cursor: 'pointer' }}>
                        <MdPersonOff color="#777777" size={20} />
                    </div>

                </div>
            ) : null}

            {props.userDetails &&
                ((props.userDetails.works_for === props.userDetails.id) ||
                    (props.userDetails.user_type === "employee" && EMPLOYEE_ROLE_DELETE.includes(props.userDetails.employee_role))) ? (
                <div style={[{ flexDirection: "column", marginTop: 20, display: 'flex' }]}>
                    <div
                        style={{
                            marginTop: 10,
                            marginBottom: 10,
                            marginLeft: 10,
                            marginRight: 10
                        }}
                    >
                        <Button title="MY EMPLOYEE" onPress={() => openEmployeeList()} />
                    </div>
                </div>
            ) : (
                <div
                    style={{
                        borderBottomColor: "rgba(211,211,211, 0.5)",
                        borderBottomWidth: 1,
                        marginTop: 30,
                        marginLeft: 10,
                        marginRight: 10
                    }}
                />
            )}

            <div style={styles.menuWrapper}>
                <div onClick={() => onShare()} style={{ cursor: 'pointer' }}>
                    <div style={styles.menuItem}>
                        <MdShare color="rgb(183, 113, 229)" size={25} />
                        <span style={styles.menuItemText}>Tell Your Friends</span>
                    </div>
                </div>
                <div onClick={() => makeCall("+919833097595")} style={{ cursor: 'pointer' }}>
                    <div style={styles.menuItem}>
                        <AiOutlineCustomerService color="rgb(103, 174, 110)" size={25} />
                        <span style={styles.menuItemText}>Support</span>
                    </div>
                </div>
                {(props.userDetails &&
                    props.userDetails.user_type === "agent") && (props.userDetails &&
                        props.userDetails.id === props.userDetails.works_for) ? <div onClick={() => { sendMail() }} style={{ cursor: 'pointer' }}>
                    <div style={{ flexDirection: "row", alignContent: "center", alignItems: "center", justifyContent: "space-between", marginRight: 15, display: 'flex' }}>
                        <div style={styles.menuItem}>
                            <div style={{ flexDirection: "column", alignItems: "center", display: 'flex' }}>
                                <div style={{ flexDirection: "row", alignItems: "center", display: 'flex' }}>
                                    <MdEmail color="rgb(61, 144, 215)" size={25} />
                                    <span style={styles.menuItemText}>Email your data to you</span>
                                </div>
                                <span style={{}}>{userData && userData.email ? userData.email : "email@gmail.com"}</span>
                            </div>

                        </div>
                        <span style={{ color: "#0f1a20", marginLeft: 0, fontSize: 16 }}>
                            {userData && userData.last_backup_date ? userData.last_backup_date : "29/Feb/2025"}
                        </span>
                    </div>
                </div> : null}

                <div onClick={() => { }} style={{ cursor: 'pointer' }}>
                    <div style={styles.menuItem}>
                        <MdSecurity color="rgba(255, 99, 99, .9)" size={25} />
                        <span style={styles.menuItemText}>Privacy Policy</span>
                    </div>
                </div>
            </div>
            <Home />
            {modalVisible && (
                <div style={styles.centeredView1}>
                    <div style={styles.modalView}>
                        <span style={{ color: "rgba(255,0,0, .9)", marginBottom: 10, fontSize: 17, fontWeight: "500" }}>
                            Do you really want to DELETE your account ?
                        </span>
                        <span style={{ marginTop: 10, fontSize: 15, textAlign: 'center' }}>
                            Please note once its removed, it can not be recovered.
                        </span>

                        <div
                            style={{
                                flexDirection: "row",
                                marginBottom: 20,
                                padding: 20,
                                display: 'flex',
                                justifyContent: 'flex-end',
                                width: '100%'
                            }}
                        >
                            <div
                                style={{ ...styles.cancelButton, cursor: 'pointer' }}
                                onClick={() => {
                                    setModalVisible(!modalVisible);
                                }}
                            >
                                <span style={styles.textStyle}>No</span>
                            </div>
                            <div
                                style={{ ...styles.applyButton, cursor: 'pointer' }}
                                onClick={() => {
                                    deleteMe();
                                }}
                            >
                                <span style={styles.textStyle}>YES, DELETE NOW</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const styles = {
    container: {
        flex: 1,
        backgroundColor: "#ffffff",
        marginTop: 0,
        height: '100vh',
        overflowY: 'auto'
    },
    userInfoSection: {
        paddingHorizontal: 30,
        marginBottom: 25
    },
    caption: {
        fontSize: 14,
        lineHeight: 14,
        fontWeight: "500"
    },
    row: {
        flexDirection: "row",
        marginBottom: 10,
        display: 'flex'
    },
    menuWrapper: {
        marginTop: 10
    },
    menuItem: {
        flexDirection: "row",
        paddingVertical: 15,
        paddingHorizontal: 30,
        display: 'flex',
        alignItems: 'center'
    },
    menuItemText: {
        color: "#777777",
        marginLeft: 20,
        fontWeight: "600",
        fontSize: 16,
        lineHeight: 26
    },
    centeredView1: {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0,0,0,0.5)',
        zIndex: 1000,
        display: 'flex',
        justifyContent: "center",
        alignItems: "center",
    },
    modalView: {
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        boxShadow: "0px 2px 4px rgba(0,0,0,0.25)",
        display: 'flex',
        flexDirection: 'column'
    },
    applyButton: {
        marginLeft: 10,
        marginRight: 10,
        padding: 10,
        backgroundColor: '#f44336',
        borderRadius: 5,
        color: 'white'
    },
    cancelButton: {
        marginLeft: 10,
        marginRight: 30,
        padding: 10,
        backgroundColor: '#2196F3',
        borderRadius: 5,
        color: 'white'
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
    }
};

const mapStateToProps = state => ({
    userDetails: state.AppReducer.userDetails
});

const mapDispatchToProps = {
    setUserDetails,
};
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Profile);
