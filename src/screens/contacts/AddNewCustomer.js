import React, { useState } from "react";
import Button from "./../../components/Button";
import Snackbar from "./../../components/SnackbarComponent";
import { connect } from "react-redux";
import { setPropertyType, setPropertyDetails, setCustomerDetails } from "./../../reducers/Action";

const AddNewCustomer = props => {
    const { navigation } = props;
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
        navigation.navigate("ContactLocalityDetailsForm");
    };

    return (
        <div style={{ flex: 1, backgroundColor: "rgba(254,254,250, 0.1)", height: '100vh', overflowY: 'auto' }}>
            <div style={styles.container}>
                <div>
                    <p>
                        Add new customer details who is looking to rent or buy a property
                    </p>
                </div>

                <div style={{ ...styles.header, marginTop: 30 }}>
                    <p>Customer Details</p>
                </div>
                <div style={styles.propSection}>
                    <div style={{ marginBottom: 15 }}>
                        <label style={{ display: 'block', marginBottom: 5, color: 'rgba(0,191,255, .9)' }}>Name*</label>
                        <input
                            value={ownerName}
                            onChange={e => setOwnerName(e.target.value)}
                            onFocus={() => setIsVisible(false)}
                            style={styles.input}
                        />
                    </div>
                    <div style={{ marginBottom: 15 }}>
                        <label style={{ display: 'block', marginBottom: 5, color: 'rgba(0,191,255, .9)' }}>Mobile*</label>
                        <input
                            value={ownerMobile}
                            onChange={e => setOwnerMobile(e.target.value)}
                            onFocus={() => setIsVisible(false)}
                            type="number"
                            style={styles.input}
                        />
                    </div>
                    <div style={{ marginBottom: 15 }}>
                        <label style={{ display: 'block', marginBottom: 5, color: 'rgba(0,191,255, .9)' }}>Address*</label>
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
    container: {
        flex: 1,
        marginTop: 30,
        marginLeft: 20,
        marginRight: 20
    },
    header: {
        alignContent: "flex-start"
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
        backgroundColor: "rgba(245,245,245, 0.1)",
        outline: 'none'
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
