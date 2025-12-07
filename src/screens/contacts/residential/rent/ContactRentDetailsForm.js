import React, { useState, useEffect } from "react";
import Button from "./../../../../components/Button";
import Snackbar from "./../../../../components/SnackbarComponent";
import { numDifferentiation } from "./../../../../utils/methods";
import { connect } from "react-redux";
import { setPropertyType, setPropertyDetails, setCustomerDetails } from "./../../../../reducers/Action";
import CustomButtonGroup from "./../../../../components/CustomButtonGroup";
import * as AppConstant from "./../../../../utils/AppConstant";

const preferredTenantsArray = [
    { text: "Family" },
    { text: "Bachelors" },
    { text: "Any" }
];
const nonvegAllowedArray = [
    { text: "Veg" },
    { text: "Non-Veg" }
];

const ContactRentDetailsForm = props => {
    const { navigation } = props;
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
        const customer = props.customerDetails;
        setCustomerDetailsX(customer);
    };

    const dismissSnackBar = () => {
        setIsVisible(false);
    };

    const onChange = (e) => {
        const date = e.target.value;
        setNewDate(date);
    };

    const selectedPreferredTenantsIndex = (index) => {
        setPreferredTenantsIndex(index);
    };

    const selectNonvegAllowedIndex = (index) => {
        setNonvegAllowedIndex(index);
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
            preferred_tenants: preferredTenantsArray[preferredTenantsIndex].text,
            non_veg_allowed: nonvegAllowedArray[nonvegAllowedIndex].text
        };

        const customer = props.customerDetails;
        customer["customer_rent_details"] = customer_rent_details;

        props.setCustomerDetails(customer)

        navigation.navigate("AddNewCustomerRentResidentialFinalDetails");
    };

    return (
        <div style={{ flex: 1, backgroundColor: "rgba(245,245,245, 0.2)", height: '100vh', overflowY: 'auto' }}>
            <div style={styles.container}>
                <p style={{ marginBottom: 30 }}>
                    Provide rent details what max customer can afford
                </p>

                <div style={styles.inputContainerStyle}>
                    <label style={{ display: 'block', marginBottom: 5, fontSize: 12, color: 'rgba(0,191,255, .9)' }}>
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
                            backgroundColor: "#ffffff"
                        }}
                    />
                </div>

                <div style={styles.inputContainerStyle}>
                    <label style={{ display: 'block', marginBottom: 5, fontSize: 12, color: 'rgba(0,191,255, .9)' }}>
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
                            backgroundColor: "#ffffff"
                        }}
                    />
                </div>

                <div style={styles.inputContainerStyle}>
                    <label style={{ display: 'block', marginBottom: 5, fontSize: 12, color: 'rgba(0,191,255, .9)' }}>
                        Required From *
                    </label>
                    <input
                        type="date"
                        placeholder="Required From *"
                        value={newDate}
                        onChange={onChange}
                        onFocus={() => setVisible(true)}
                        style={{
                            width: '100%',
                            padding: 10,
                            borderRadius: 4,
                            border: '1px solid #ccc',
                            backgroundColor: "#ffffff"
                        }}
                    />
                </div>

                {customerDetailsX &&
                    customerDetailsX.customer_locality.property_type ===
                    "Residential" ? (
                    <div>
                        <p>Type of Tenants*</p>
                        <div style={styles.propSubSection}>
                            <CustomButtonGroup
                                buttons={preferredTenantsArray}
                                selectedIndices={[preferredTenantsIndex]}
                                isMultiSelect={false}
                                onButtonPress={(index) => selectedPreferredTenantsIndex(index)}
                            />
                        </div>
                        <p>Tenants is veg / non veg*</p>
                        <div style={styles.propSubSection}>
                            <CustomButtonGroup
                                buttons={nonvegAllowedArray}
                                selectedIndices={[nonvegAllowedIndex]}
                                isMultiSelect={false}
                                onButtonPress={(index) => selectNonvegAllowedIndex(index)}
                            />
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
)(ContactRentDetailsForm);
