import React, { useState, useEffect } from "react";
import { MdArrowBack, MdDateRange } from "react-icons/md";
import { useNavigate } from "react-router-dom";
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
    const navigate = useNavigate();

    const getTodayString = () => {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const [newDate, setNewDate] = React.useState(getTodayString());
    const [focusedField, setFocusedField] = useState(null);

    const [customerDetailsX, setCustomerDetailsX] = useState(null);
    const [expectedRent, setExpectedRent] = useState("");
    const [expectedDeposit, setExpectedDeposit] = useState("");
    const [isVisible, setIsVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [preferredTenantsIndex, setPreferredTenantsIndex] = useState(0);
    const [nonvegAllowedIndex, setNonvegAllowedIndex] = useState(0);
    const [visible, setVisible] = React.useState(false);

    useEffect(() => {
        // Always reset date to Today on mount
        setNewDate(getTodayString());

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

        navigate("../AddNewCustomerRentResidentialFinalDetails");
    };

    return (
        <div style={{ flex: 1, backgroundColor: "#F9FAFB", minHeight: "100vh" }}>
            {/* Header */}
            <div style={styles.headerContainer}>
                <div style={styles.backButtonContainer} onClick={() => navigate(-1)}>
                    <MdArrowBack size={24} color="#000000" />
                </div>
                <div style={styles.headerTitleContainer}>
                    <p style={styles.headerTitle}>Rent Details</p>
                </div>
            </div>
            <div style={styles.container}>
                <p style={{ marginBottom: 30, color: '#000000' }}>
                    Provide rent details what max customer can afford
                </p>

                <div className="mb-6">
                    <label className={`block text-xs font-medium mb-1 ${focusedField === 'rent' ? 'text-teal-500' : 'text-gray-500'}`}>
                        Max Rent*
                    </label>
                    <input
                        type="number"
                        value={expectedRent}
                        onChange={e => setExpectedRent(e.target.value)}
                        onFocus={() => { setIsVisible(false); setFocusedField('rent'); }}
                        onBlur={() => setFocusedField(null)}
                        className={`w-full bg-transparent text-base text-gray-900 border-b-2 focus:outline-none py-1 transition-colors ${focusedField === 'rent' ? 'border-teal-500' : 'border-gray-200'}`}
                    />
                </div>

                <div className="mb-6">
                    <label className={`block text-xs font-medium mb-1 ${focusedField === 'deposit' ? 'text-teal-500' : 'text-gray-500'}`}>
                        Max Deposit*
                    </label>
                    <input
                        type="number"
                        value={expectedDeposit}
                        onChange={e => setExpectedDeposit(e.target.value)}
                        onFocus={() => { setIsVisible(false); setFocusedField('deposit'); }}
                        onBlur={() => setFocusedField(null)}
                        className={`w-full bg-transparent text-base text-gray-900 border-b-2 focus:outline-none py-1 transition-colors ${focusedField === 'deposit' ? 'border-teal-500' : 'border-gray-200'}`}
                    />
                </div>

                <div className="mb-6">
                    <label className={`block text-xs font-medium mb-1 ${focusedField === 'date' ? 'text-teal-500' : 'text-gray-500'}`}>
                        Required From (DD/MM/YYYY) *
                    </label>
                    <div className={`relative w-full border-b-2 py-1 transition-colors flex items-center ${focusedField === 'date' ? 'border-teal-500' : 'border-gray-200'}`}>
                        <style>
                            {`
                                input[type="date"]::-webkit-calendar-picker-indicator {
                                    display: none;
                                    -webkit-appearance: none;
                                }
                                input[type="date"] {
                                    color-scheme: light;
                                }
                            `}
                        </style>

                        {/* Ghost Placeholder */}
                        {!newDate && (
                            <span className="absolute left-0 text-base text-gray-400 pointer-events-none">
                                DD/MM/YYYY
                            </span>
                        )}

                        <input
                            type="date"
                            min={getTodayString()}
                            value={newDate}
                            onChange={(e) => {
                                const selectedDate = e.target.value;
                                if (selectedDate && selectedDate < getTodayString()) {
                                    return;
                                }
                                setNewDate(selectedDate);
                            }}
                            onClick={(e) => {
                                try {
                                    if (e.target.showPicker) e.target.showPicker();
                                } catch (err) {
                                    console.log(err);
                                }
                            }}
                            onFocus={() => { setIsVisible(false); setFocusedField('date'); }}
                            onBlur={() => setFocusedField(null)}
                            onKeyDown={(e) => e.preventDefault()}
                            className={`w-full bg-transparent text-base text-gray-900 focus:outline-none z-10 relative ${!newDate ? 'text-transparent' : 'text-gray-900'}`}
                        />

                        <div className="absolute right-0 pointer-events-none text-gray-500">
                            <MdDateRange size={20} />
                        </div>
                    </div>
                </div>

                {customerDetailsX &&
                    customerDetailsX.customer_locality.property_type ===
                    "Residential" ? (
                    <div>
                        <div className="mb-6">
                            <p className="text-sm font-medium text-gray-700 mb-3">Type of Tenants*</p>
                            <CustomButtonGroup
                                buttons={preferredTenantsArray}
                                selectedIndices={[preferredTenantsIndex]}
                                isMultiSelect={false}
                                onButtonPress={(index) => selectedPreferredTenantsIndex(index)}
                                containerStyle={{ gap: '12px' }}
                                buttonStyle={{ backgroundColor: '#FFFFFF', borderRadius: '6px', border: '1px solid #E5E7EB', padding: '8px 20px', fontSize: '14px', fontWeight: '500', color: '#374151', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)', width: '140px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                            />
                        </div>
                        <div className="mb-6">
                            <p className="text-sm font-medium text-gray-700 mb-3">Tenants is veg / non veg*</p>
                            <CustomButtonGroup
                                buttons={nonvegAllowedArray}
                                selectedIndices={[nonvegAllowedIndex]}
                                isMultiSelect={false}
                                onButtonPress={(index) => selectNonvegAllowedIndex(index)}
                                containerStyle={{ gap: '12px' }}
                                buttonStyle={{ backgroundColor: '#FFFFFF', borderRadius: '6px', border: '1px solid #E5E7EB', padding: '8px 20px', fontSize: '14px', fontWeight: '500', color: '#374151', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)', width: '140px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
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
    headerContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        padding: '10px 15px',
        borderBottom: '1px solid #e0e0e0',
        backgroundColor: '#fff',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
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
        color: '#1a1a1a',
        margin: 0,
    },
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
