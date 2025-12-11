import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// import {
//   StyleSheet,
//   View,
//   Text,
//   TouchableOpacity,
//   Platform,
//   KeyboardAvoidingView,
//   SafeAreaView,
//   ScrollView,
//   Keyboard,
//   AsyncStorage
// } from "react-native";
// import { DatePickerModal } from "react-native-paper-dates";
// import { ButtonGroup } from "react-native-elements";
// import { TextInput, HelperText, useTheme } from "react-native-paper";
import Button from "./../../../../components/Button";
// import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Snackbar from "./../../../../components/SnackbarComponent";
import { numDifferentiation } from "./../../../../utils/methods";
import { connect } from "react-redux";
import { setPropertyType, setPropertyDetails, setCustomerDetails } from "./../../../../reducers/Action";
// import DatePicker, { RangeOutput, SingleOutput } from 'react-native-neat-date-picker';


const preferredTenantsArray = ["Family", "Bachelors", "Any"];
const nonvegAllowedArray = ["Veg", "Non-Veg"];

const CustomerCommercialRentDetailsForm = props => {
    const navigate = useNavigate();
    const date = new Date();
    const [newDate, setNewDate] = React.useState("");

    const [customerDetailsX, setCustomerDetailsX] = useState(null);
    const [expectedRent, setExpectedRent] = useState("");
    const [expectedDeposit, setExpectedDeposit] = useState("");
    const [isVisible, setIsVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [preferredTenantsIndex, setPreferredTenantsIndex] = useState(-1);
    const [nonvegAllowedIndex, setNonvegAllowedIndex] = useState(-1);
    const [visible, setVisible] = React.useState(false);

    useEffect(() => {
        if (customerDetailsX === null) {
            init();
        }
    }, [customerDetailsX]);

    const init = async () => {
        // const customer = JSON.parse(await AsyncStorage.getItem("customer"));
        const customer = JSON.parse(localStorage.getItem("customer"));
        // console.log("ContactRentDetailsForm customer: " + JSON.stringify(customer));
        setCustomerDetailsX(customer);
    };

    const dismissSnackBar = () => {
        setIsVisible(false);
    };

    const onDismiss = React.useCallback(() => {
        setVisible(false);
        setIsVisible(false);
        // Keyboard.dismiss();
    }, [setVisible]);

    const onChange = React.useCallback((event) => {
        const date = event.target.value;
        setVisible(false);
        setIsVisible(false);
        // const x = date.toString().split("00:00");
        setNewDate(date);
        // Keyboard.dismiss();
        // setNewDate(date.toString());
        // // console.log({ date });
    }, []);

    const selectedPreferredTenantsIndex = index => {
        setPreferredTenantsIndex(index);
        setIsVisible(false);
    };

    const selectNonvegAllowedIndex = index => {
        setNonvegAllowedIndex(index);
        setIsVisible(false);
    };

    const onSubmit = async () => {
        if (expectedRent.trim() === "") {
            setErrorMessage("Expected rent is missing");
            setIsVisible(true);
            return;
        } else if (expectedDeposit.trim() === "") {
            setErrorMessage("Expected deposit is missing");
            setIsVisible(true);
            return;
        } else if (newDate.trim() === "") {
            setErrorMessage("Available date is missing");
            setIsVisible(true);
            return;
        } else if (
            customerDetailsX &&
            customerDetailsX.customer_locality.property_type === "Residential" &&
            preferredTenantsIndex === -1
        ) {
            setErrorMessage("Preferred tenants is missing");
            setIsVisible(true);
            return;
        } else if (
            customerDetailsX &&
            customerDetailsX.customer_locality.property_type === "Residential" &&
            nonvegAllowedIndex === -1
        ) {
            setErrorMessage("Nonveg allowed is missing");
            setIsVisible(true);
            return;
        }

        const customer_rent_details = {
            expected_rent: expectedRent,
            expected_deposit: expectedDeposit,
            available_from: newDate.trim(),
            preferred_tenants: preferredTenantsArray[preferredTenantsIndex],
            non_veg_allowed: nonvegAllowedArray[nonvegAllowedIndex]
        };
        // const customer = JSON.parse(await AsyncStorage.getItem("customer"));
        const customer = props.customerDetails;

        customer["customer_rent_details"] = customer_rent_details;

        // AsyncStorage.setItem("customer", JSON.stringify(customer));
        props.setCustomerDetails(customer)
        // console.log(JSON.stringify(customer));

        navigate("../AddNewCustomerCommercialRentFinalDetails");
    };
    return (
        <div
            style={{ flex: 1, backgroundColor: "#ffffff", height: '100vh', overflowY: 'auto' }}
        >
            <div style={styles.container}>
                <div style={styles.inputContainerStyle}>
                    <label style={{ display: 'block', marginBottom: 5, fontSize: 12, color: '#000000', fontWeight: '500' }}>
                        {expectedRent.trim() === "" ? "Max Rent*" : numDifferentiation(expectedRent) + " Max Rent"}
                    </label>
                    <input
                        type="number"
                        placeholder="Max Rent"
                        value={expectedRent}
                        onChange={e => setExpectedRent(e.target.value)}
                        onFocus={() => setIsVisible(false)}
                        style={{
                            width: '100%',
                            padding: 10,
                            borderRadius: 4,
                            border: '1px solid #ccc',
                            backgroundColor: "#f9f9f9",
                            color: '#000000'
                        }}
                    />
                </div>

                <div style={styles.inputContainerStyle}>
                    <label style={{ display: 'block', marginBottom: 5, fontSize: 12, color: '#000000', fontWeight: '500' }}>
                        {expectedDeposit.trim() === "" ? "Max Deposit*" : numDifferentiation(expectedDeposit) + " Max Deposit"}
                    </label>
                    <input
                        type="number"
                        placeholder="Max Deposit"
                        value={expectedDeposit}
                        onChange={e => setExpectedDeposit(e.target.value)}
                        onFocus={() => setIsVisible(false)}
                        style={{
                            width: '100%',
                            padding: 10,
                            borderRadius: 4,
                            border: '1px solid #ccc',
                            backgroundColor: "#f9f9f9",
                            color: '#000000'
                        }}
                    />
                </div>

                <div style={styles.inputContainerStyle}>
                    <label style={{ display: 'block', marginBottom: 5, fontSize: 12, color: '#000000', fontWeight: '500' }}>
                        Required From (DD/MM/YYYY) *
                    </label>
                    <input
                        type={visible || newDate ? "date" : "text"}
                        placeholder="DD/MM/YYYY"
                        value={newDate}
                        onChange={onChange}
                        onFocus={() => setVisible(true)}
                        onBlur={() => setVisible(false)}
                        style={{
                            width: '100%',
                            padding: 10,
                            borderRadius: 4,
                            border: '1px solid #ccc',
                            backgroundColor: "#f9f9f9",
                            color: '#000000'
                        }}
                    />
                </div>

                {customerDetailsX &&
                    customerDetailsX.customer_locality.property_type ===
                    "Residential" ? (
                    <div>
                        <p style={{ color: '#000000', fontWeight: 'bold' }}>Type of Tenants*</p>
                        <div style={styles.propSubSection}>
                            <div style={{ display: 'flex', borderRadius: 10, overflow: 'hidden', border: '1px solid #ccc' }}>
                                {preferredTenantsArray.map((item, index) => (
                                    <button
                                        key={index}
                                        onClick={() => selectedPreferredTenantsIndex(index)}
                                        style={{
                                            flex: 1,
                                            padding: 10,
                                            border: 'none',
                                            backgroundColor: preferredTenantsIndex === index ? "rgba(27, 106, 158, 0.85)" : 'transparent',
                                            color: preferredTenantsIndex === index ? '#fff' : '#000',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        {item}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <p style={{ color: '#000000', fontWeight: 'bold' }}>Tenants is veg / non veg*</p>
                        <div style={styles.propSubSection}>
                            <div style={{ display: 'flex', borderRadius: 10, overflow: 'hidden', border: '1px solid #ccc' }}>
                                {nonvegAllowedArray.map((item, index) => (
                                    <button
                                        key={index}
                                        onClick={() => selectNonvegAllowedIndex(index)}
                                        style={{
                                            flex: 1,
                                            padding: 10,
                                            border: 'none',
                                            backgroundColor: nonvegAllowedIndex === index ? "rgba(27, 106, 158, 0.85)" : 'transparent',
                                            color: nonvegAllowedIndex === index ? '#fff' : '#000',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        {item}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                ) : null}

                <Button title="NEXT" onPress={() => onSubmit()} />
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
        marginTop: 20,
        marginLeft: 20,
        marginRight: 20
    },
    inputContainerStyle: {
        marginBottom: 20
    },
    propSubSection: {
        marginTop: 10,
        marginBottom: 15
    },
    doubleColSection: {
        flex: 1,
        width: "100%",
        flexDirection: "row",
        marginTop: 5,
        marginBottom: 5
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
)(CustomerCommercialRentDetailsForm);

// export default CustomerCommercialRentDetailsForm;
