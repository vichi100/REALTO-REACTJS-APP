import React, { useState, useEffect, useCallback, useRef } from "react";
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
    const isFetching = useRef(false);

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

        if (isFetching.current) return;
        isFetching.current = true;

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
                    isFetching.current = false;
                }
            },
            error => {
                isFetching.current = false;
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
            {/* Profile Header */}
            <div style={styles.header}>
                <div style={styles.profileSection}>
                    <div style={styles.avatarContainer}>
                        <div style={styles.avatar}>
                            <span style={styles.avatarText}>
                                {props.userDetails && props.userDetails.name
                                    ? props.userDetails.name.slice(0, 1)
                                    : "G"}
                            </span>
                        </div>
                        <div style={styles.profileInfo}>
                            <h3 style={styles.userName}>
                                {props.userDetails && props.userDetails.name
                                    ? props.userDetails.name
                                    : "Guest"}
                            </h3>
                            <span style={styles.companyName}>
                                {props.userDetails && props.userDetails.company_name
                                    ? props.userDetails.company_name
                                    : "Company"}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Contact Information */}
                <div style={styles.contactSection}>
                    <div style={styles.contactRow}>
                        <MdMap color="#000000" size={20} />
                        <span style={styles.contactText}>
                            {props.userDetails && props.userDetails.city
                                ? props.userDetails.city
                                : "Guest City"}
                        </span>
                    </div>
                    <div style={styles.contactRow}>
                        <MdPhone color="#000000" size={20} />
                        <span style={styles.contactText}>
                            {props.userDetails && props.userDetails.mobile
                                ? props.userDetails.mobile
                                : "Add Mobile Number"}
                        </span>
                    </div>
                </div>

                {/* Action Buttons for Agent/Employee */}
                {(props.userDetails && props.userDetails.user_type === "agent") && (
                    <div style={styles.actionButtons}>
                        <div onClick={() => setModalVisible(true)} style={styles.actionButton}>
                            <MdPersonOff color="#000000" size={20} />
                        </div>
                        <div onClick={() => openEditProfile()} style={styles.actionButton}>
                            <MdEdit color="#000000" size={20} />
                        </div>
                    </div>
                )}

                {(props.userDetails && props.userDetails.user_type === "employee") && (
                    <div style={styles.actionButtons}>
                        <div onClick={() => setModalVisible(true)} style={styles.actionButton}>
                            <MdPersonOff color="#000000" size={20} />
                        </div>
                    </div>
                )}
            </div>

            {/* Employee Management Section */}
            {props.userDetails &&
                ((props.userDetails.works_for === props.userDetails.id) ||
                    (props.userDetails.user_type === "employee" && EMPLOYEE_ROLE_DELETE.includes(props.userDetails.employee_role))) ? (
                <div style={styles.employeeSection}>
                    <div style={styles.buttonContainer}>
                        <Button title="MY EMPLOYEE" onPress={() => openEmployeeList()} />
                    </div>
                </div>
            ) : (
                <div style={styles.divider} />
            )}

            {/* Menu Items */}
            <div style={styles.menuContainer}>
                <div onClick={() => onShare()} style={styles.menuItem}>
                    <MdShare color="rgb(183, 113, 229)" size={25} />
                    <span style={styles.menuItemText}>Tell Your Friends</span>
                </div>

                <div onClick={() => makeCall("+919833097595")} style={styles.menuItem}>
                    <AiOutlineCustomerService color="rgb(103, 174, 110)" size={25} />
                    <span style={styles.menuItemText}>Support</span>
                </div>

                {(props.userDetails && props.userDetails.user_type === "agent") &&
                    (props.userDetails && props.userDetails.id === props.userDetails.works_for) && (
                        <div onClick={() => { sendMail() }} style={styles.emailDataItem}>
                            <div style={styles.emailDataContent}>
                                <div style={styles.menuItem}>
                                    <MdEmail color="rgb(61, 144, 215)" size={25} />
                                    <span style={styles.menuItemText}>Email your data to you</span>
                                </div>
                                <span style={styles.emailText}>
                                    {userData && userData.email ? userData.email : "email@gmail.com"}
                                </span>
                            </div>
                            <span style={styles.lastBackupDate}>
                                {userData && userData.last_backup_date ? userData.last_backup_date : "29/Feb/2025"}
                            </span>
                        </div>
                    )}

                <div onClick={() => { }} style={styles.menuItem}>
                    <MdSecurity color="rgba(255, 99, 99, .9)" size={25} />
                    <span style={styles.menuItemText}>Privacy Policy</span>
                </div>
            </div>

            <Home disableScroll={true} />

            {/* Delete Account Modal */}
            {modalVisible && (
                <div style={styles.modalOverlay}>
                    <div style={styles.modalContent}>
                        <span style={styles.modalWarning}>
                            Do you really want to DELETE your account ?
                        </span>
                        <span style={styles.modalDescription}>
                            Please note once its removed, it can not be recovered.
                        </span>

                        <div style={styles.modalActions}>
                            <div
                                style={styles.cancelButton}
                                onClick={() => {
                                    setModalVisible(!modalVisible);
                                }}
                            >
                                <span style={styles.buttonText}>No</span>
                            </div>
                            <div
                                style={styles.deleteButton}
                                onClick={() => {
                                    deleteMe();
                                }}
                            >
                                <span style={styles.buttonText}>YES, DELETE NOW</span>
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
        minHeight: '100vh',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    },
    header: {
        padding: '20px 20px 15px',
        borderBottom: '1px solid #f0f0f0',
    },
    profileSection: {
        marginBottom: 20,
    },
    avatarContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: '50%',
        backgroundColor: '#f0f0f0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: '2px solid rgba(127, 255, 212, 0.9)',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    },
    avatarText: {
        color: "#333",
        fontSize: 32,
        fontWeight: "600",
    },
    profileInfo: {
        marginLeft: 20,
    },
    userName: {
        margin: '0 0 5px 0',
        fontSize: 24,
        fontWeight: "700",
        color: "#000000",
        lineHeight: 1.2,
    },
    companyName: {
        fontSize: 14,
        color: "#666",
        fontWeight: "500",
    },
    contactSection: {
        padding: '15px 0',
    },
    contactRow: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    contactText: {
        color: "#000000",
        marginLeft: 15,
        fontSize: 16,
    },
    actionButtons: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: '0 30px 10px',
        marginTop: 10,
    },
    actionButton: {
        cursor: 'pointer',
        padding: '8px',
        borderRadius: '8px',
        transition: 'background-color 0.2s',
    },
    actionButtonHover: {
        backgroundColor: '#f5f5f5',
    },
    employeeSection: {
        marginTop: 20,
        padding: '0 20px',
    },
    buttonContainer: {
        margin: '10px 0',
    },
    divider: {
        borderBottom: "1px solid rgba(211, 211, 211, 0.5)",
        margin: '10px 20px 0',
    },
    menuContainer: {
        marginTop: 10,
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#fff',
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
        margin: '20px',
    },
    menuItem: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        padding: '16px 20px',
        cursor: 'pointer',
        borderBottom: '1px solid #f0f0f0',
        transition: 'background-color 0.2s',
    },
    menuItemHover: {
        backgroundColor: '#f9f9f9',
    },
    menuItemText: {
        color: "#333",
        marginLeft: 20,
        fontWeight: "600",
        fontSize: 16,
        lineHeight: 1.5,
        flex: 1,
    },
    emailDataItem: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px 20px',
        cursor: 'pointer',
        borderBottom: '1px solid #f0f0f0',
        transition: 'background-color 0.2s',
    },
    emailDataContent: {
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
    },
    emailText: {
        color: "#666",
        fontSize: 14,
        marginTop: 4,
        marginLeft: 45,
    },
    lastBackupDate: {
        color: "#0f1a20",
        fontSize: 14,
        fontWeight: "500",
    },
    modalOverlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
        padding: '20px',
    },
    modalContent: {
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        maxWidth: 450,
        width: '100%',
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
    },
    modalWarning: {
        color: "#e53935",
        marginBottom: 12,
        fontSize: 18,
        fontWeight: "600",
        lineHeight: 1.4,
    },
    modalDescription: {
        color: "#666",
        fontSize: 15,
        lineHeight: 1.5,
        marginBottom: 25,
    },
    modalActions: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-end',
        width: '100%',
        gap: '15px',
    },
    cancelButton: {
        padding: '12px 24px',
        backgroundColor: '#2196F3',
        borderRadius: 8,
        color: 'white',
        cursor: 'pointer',
        fontWeight: "600",
        transition: 'background-color 0.2s',
    },
    deleteButton: {
        padding: '12px 24px',
        backgroundColor: '#f44336',
        borderRadius: 8,
        color: 'white',
        cursor: 'pointer',
        fontWeight: "600",
        transition: 'background-color 0.2s',
    },
    buttonText: {
        color: "white",
        fontWeight: "600",
        fontSize: 14,
    },
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