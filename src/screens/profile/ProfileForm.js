import React, { useState } from "react";
import Button from "./../../components/Button";
import Snackbar from "./../../components/SnackbarComponent";
import { setUserDetails } from "./../../reducers/Action";
import { connect } from "react-redux";
import { SERVER_URL } from "./../../utils/Constant";
import axios from "axios";

import { useNavigate, useLocation } from 'react-router-dom';

import { MdArrowBack } from "react-icons/md";

const ProfileForm = props => {
    const navigate = useNavigate();
    const location = useLocation();
    const { } = location.state || {};

    const handleBack = () => {
        if (window.history.length > 1 && window.history.state && window.history.state.idx > 0) {
            navigate(-1);
        } else {
            navigate('/profile');
        }
    };

    const [name, setName] = useState(props.userDetails.name || "");
    const [city, setCity] = useState(props.userDetails.city || "");
    const [company, setCompany] = useState(props.userDetails.company_name || "");
    const [email, setEmail] = useState(props.userDetails.email || "");

    const [errorMessage, setErrorMessage] = useState("");
    const [isVisible, setIsVisible] = useState(false);

    const dismissSnackBar = () => {
        setIsVisible(false);
    };

    const onSubmit = () => {
        if (name.trim() === "") {
            setErrorMessage("Name is missing");
            setIsVisible(true);
            return;
        } else if (city.trim() === "") {
            setErrorMessage("City is missing");
            setIsVisible(true);
            return;
        }
        const profileDetails = {
            req_user_id: props.userDetails.works_for,
            user_id: props.userDetails.id,
            name: name.trim(),
            company: company.trim(),
            city: city.trim(),
            email: email.trim()
        };

        updateUserProfile(profileDetails);
    };


    const updateUserProfile = profileDetails => {
        axios(SERVER_URL + "/updateUserProfile", {
            method: "post",
            headers: {
                "Content-type": "Application/json",
                Accept: "Application/json"
            },
            data: profileDetails
        }).then(
            response => {
                if (response.data === "success") {
                    props.userDetails["name"] = profileDetails.name;
                    props.userDetails["city"] = profileDetails.city;
                    props.userDetails["company_name"] =
                        profileDetails.company;
                    props.userDetails["email"] = profileDetails.email;
                    props.setUserDetails({ ...props.userDetails });


                    navigate("/profile");
                }
            },
            error => {
            }
        );
    };

    return (
        <div style={{ flex: 1, backgroundColor: "#ffffff", height: '100vh', overflowY: 'auto' }}>
            <div style={styles.header}>
                <div onClick={handleBack} style={styles.backButton}>
                    <MdArrowBack size={24} color="#333" />
                </div>
                <h1 style={styles.title}>Edit Profile</h1>
            </div>
            <div style={styles.container}>
                <div style={styles.propSection}>
                    <div style={{ marginTop: 8 }}>
                        <label style={{ display: 'block', marginBottom: 5, color: '#000' }}>Name*</label>
                        <input
                            value={name}
                            onChange={e => setName(e.target.value)}
                            onFocus={() => setIsVisible(false)}
                            style={styles.input}
                        />
                    </div>
                    <div style={{ marginTop: 8 }}>
                        <label style={{ display: 'block', marginBottom: 5, color: '#000' }}>City*</label>
                        <input
                            value={city}
                            onChange={e => setCity(e.target.value)}
                            onFocus={() => setIsVisible(false)}
                            style={styles.input}
                        />
                    </div>
                    <div style={{ marginTop: 8 }}>
                        <label style={{ display: 'block', marginBottom: 5, color: '#000' }}>Company</label>
                        <input
                            value={company}
                            onChange={e => setCompany(e.target.value)}
                            onFocus={() => setIsVisible(false)}
                            style={styles.input}
                        />
                    </div>
                    <div style={{ marginTop: 8 }}>
                        <label style={{ display: 'block', marginBottom: 5, color: '#000' }}>Email</label>
                        <input
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            onFocus={() => setIsVisible(false)}
                            style={styles.input}
                        />
                    </div>
                </div>
                <div style={{ marginTop: 20 }}>
                    <Button title="DONE" onPress={() => onSubmit()} />
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
    );
};

const styles = {
    container: {
        flex: 1,
        marginTop: 30,
        marginLeft: 20,
        marginRight: 20,
        display: 'flex',
        flexDirection: 'column'
    },
    header: {
        display: 'flex',
        alignItems: 'center',
        padding: '15px 20px',
        borderBottom: '1px solid #f0f0f0',
        backgroundColor: '#fff',
        position: 'sticky',
        top: 0,
        zIndex: 10,
    },
    backButton: {
        cursor: 'pointer',
        marginRight: '15px',
        display: 'flex',
        alignItems: 'center',
    },
    title: {
        fontSize: '20px',
        fontWeight: '600',
        color: '#333',
        margin: 0,
    },
    propSection: {
        marginTop: 20
    },
    input: {
        width: '100%',
        padding: 10,
        borderRadius: 5,
        border: '1px solid #ccc',
        fontSize: 16,
        color: '#000'
    }
};

const mapStateToProps = state => ({
    userDetails: state.AppReducer.userDetails
});
const mapDispatchToProps = {
    setUserDetails
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ProfileForm);
