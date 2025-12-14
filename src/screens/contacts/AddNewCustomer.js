import React, { useState } from "react";
import { MdArrowBack } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import Button from "./../../components/Button";
import Snackbar from "./../../components/SnackbarComponent";
import { connect } from "react-redux";
import { setPropertyType, setPropertyDetails, setCustomerDetails } from "./../../reducers/Action";

const AddNewCustomer = props => {
    const navigate = useNavigate();
    const [ownerName, setOwnerName] = useState("");
    const [ownerMobile, setOwnerMobile] = useState("");
    const [ownerAddress, setOwnerAddress] = useState("");

    const [errorMessage, setErrorMessage] = useState("");
    const [isVisible, setIsVisible] = useState(false);

    const dismissSnackBar = () => {
        setIsVisible(false);
    };

    const onSubmit = () => {
        if (ownerName.trim() === "") {
            setErrorMessage("Owner name is missing");
            setIsVisible(true);
            return;
        } else if (ownerMobile.trim() === "") {
            setErrorMessage("Owner mobile is missing");
            setIsVisible(true);
            return;
        }
        const customer = {
            customer_details: {
                name: ownerName.trim(),
                mobile1: ownerMobile.trim(),
                mobile2: ownerMobile.trim(),
                address: ownerAddress.trim()
            }
        };
        console.log("customer: ", JSON.stringify(customer));
        props.setCustomerDetails(customer);
        navigate("ContactLocalityDetailsForm");
    };

    return (
        <div style={{ flex: 1, backgroundColor: "#ffffff" }}>
            {/* Header */}
            <div style={styles.headerContainer}>
                <div style={styles.backButtonContainer} onClick={() => navigate(-1)}>
                    <MdArrowBack size={24} color="#000000" />
                </div>
                <div style={styles.headerTitleContainer}>
                    <p style={styles.headerTitle}>Customer Details</p>
                </div>
            </div>

            <div style={styles.container}>
                <div>
                    <p style={{ color: '#000000' }}>
                        Add new customer details who is looking to rent or buy a property
                    </p>
                </div>

                <div style={styles.propSection}>
                    <div style={{ marginBottom: 15 }}>
                        <label style={{ display: 'block', marginBottom: 5, color: '#000000', fontWeight: '500' }}>Name*</label>
                        <input
                            value={ownerName}
                            onChange={e => setOwnerName(e.target.value)}
                            onFocus={() => setIsVisible(false)}
                            style={styles.input}
                        />
                    </div>
                    <div style={{ marginBottom: 15 }}>
                        <label style={{ display: 'block', marginBottom: 5, color: '#000000', fontWeight: '500' }}>Mobile*</label>
                        <input
                            value={ownerMobile}
                            onChange={e => setOwnerMobile(e.target.value)}
                            onFocus={() => setIsVisible(false)}
                            type="number"
                            style={styles.input}
                        />
                    </div>
                    <div style={{ marginBottom: 15 }}>
                        <label style={{ display: 'block', marginBottom: 5, color: '#000000', fontWeight: '500' }}>Address*</label>
                        <input
                            value={ownerAddress}
                            onChange={e => setOwnerAddress(e.target.value)}
                            onFocus={() => setIsVisible(false)}
                            style={styles.input}
                        />
                    </div>
                </div>
                <div style={{ marginTop: 20 }}>
                    <Button title="NEXT" onPress={() => onSubmit()} />
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
    headerContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        padding: '10px 15px',
        borderBottom: '1px solid #e0e0e0', // Light border for separation
        backgroundColor: '#fff',
    },
    backButtonContainer: {
        cursor: 'pointer',
        marginRight: 15,
        display: 'flex',
        alignItems: 'center',
    },
    headerTitleContainer: {
        flex: 1,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1a1a1a', // Darker text color
        margin: 0,
    },
    container: {
        flex: 1,
        marginTop: 20,
        marginLeft: 20,
        marginRight: 20
    },
    propSection: {
        marginTop: 20
    },
    propSubSection: {
        marginBottom: 10,
        marginLeft: 10
    },
    input: {
        width: '100%',
        padding: 10,
        borderRadius: 5,
        border: '1px solid #ccc',
        backgroundColor: "#f9f9f9",
        outline: 'none',
        color: '#000000'
    }
};

const mapStateToProps = state => ({
    userDetails: state.AppReducer.userDetails,
    propertyDetails: state.AppReducer.propertyDetails,
    customerDetails: state.AppReducer.customerDetails
});
const mapDispatchToProps = {
    setPropertyType,
    setPropertyDetails,
    setCustomerDetails,
};
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AddNewCustomer);
