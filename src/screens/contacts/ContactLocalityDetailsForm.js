import React, { useState, useEffect, useRef } from "react";
import Button from "./../../components/Button";
import Snackbar from "./../../components/SnackbarComponent";
import { connect } from "react-redux";
import { setPropertyType, setPropertyDetails, setCustomerDetails } from "./../../reducers/Action";
import CustomButtonGroup from "./../../components/CustomButtonGroup";
import * as  AppConstant from "./../../utils/AppConstant";

const ContactLocalityDetailsForm = props => {
    const { navigation } = props;
    const [city, setCity] = useState("");
    const [locationInput, setLocationInput] = useState("");
    const [isVisible, setIsVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const [SelectedLocationArray, setSelectedLocationArray] = useState([]);
    const [requiredFor, setRequiredFor] = useState("Family");

    const [selectedPropType, setSelectedPropType] = useState("Residential");
    const [selectedPropFor, setSelectedPropFor] = useState("Rent");

    const dismissSnackBar = () => {
        setIsVisible(false);
    };

    useEffect(() => {
    }, []);

    const onSubmit = async () => {
        if (!props.customerDetails) {
            setErrorMessage("Customer details are missing");
            setIsVisible(true);
            return;
        }

        const customer = { ...props.customerDetails };
        const customer_locality = {
            city: city.trim(),
            location_area: SelectedLocationArray,
            property_type: selectedPropType,
            property_for: selectedPropFor,
            pin: "123",
            preferred_tenants: requiredFor,
        };

        customer["customer_locality"] = customer_locality;
        props.setCustomerDetails(customer);

        const propertyType = selectedPropType;
        if (propertyType.toLowerCase() === "residential") {
            navigation.navigate("ContactResidentialPropertyDetailsForm");
        } else {
            navigation.navigate("CustomerCommercialPropertyDetailsForm");
        }
    };

    const addLocation = () => {
        if (locationInput.trim() === "") return;
        const gLocation = {
            location: {
                type: "Point",
                coordinates: [0, 0] // Mock coordinates
            },
            main_text: locationInput
        }

        setSelectedLocationArray([...SelectedLocationArray, gLocation])
        setLocationInput("");
    }

    const removeLocation = (loc) => {
        const arr = SelectedLocationArray.filter(item => item.main_text !== loc.main_text);
        setSelectedLocationArray(arr)
    }

    return (
        <div style={{ flex: 1, backgroundColor: "rgba(245,245,245, 0.2)", height: '100vh', overflowY: 'auto' }}>
            <div style={styles.container}>
                <p>Enter city and locations where customer wants the property</p>
                <div style={{ marginBottom: 15 }}>
                    <label style={{ display: 'block', marginBottom: 5, color: 'rgba(0,191,255, .9)' }}>City*</label>
                    <input
                        value={city}
                        onChange={e => setCity(e.target.value)}
                        onFocus={() => setIsVisible(false)}
                        placeholder="Enter city where customer wants property"
                        style={styles.input}
                    />
                </div>
                <div style={{ marginTop: 20 }} />

                <div style={{ marginBottom: 15 }}>
                    <label style={{ display: 'block', marginBottom: 5, color: 'rgba(0,191,255, .9)' }}>Add multiple locations within city</label>
                    <div style={{ display: 'flex' }}>
                        <input
                            value={locationInput}
                            onChange={e => setLocationInput(e.target.value)}
                            onKeyDown={e => { if (e.key === 'Enter') addLocation() }}
                            placeholder="Type location and press Enter"
                            style={{ ...styles.input, flex: 1 }}
                        />
                        <button onClick={addLocation} style={{ marginLeft: 10, padding: '5px 10px' }}>Add</button>
                    </div>
                </div>

                <div style={{ marginTop: 5, display: 'flex', flexWrap: 'wrap' }}>
                    {SelectedLocationArray.map((item, index) => (
                        <div key={index} onClick={() => removeLocation(item)} style={{ backgroundColor: "#66CDAA", borderRadius: 20, margin: 5, padding: '5px 10px', display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                            <span style={{ marginRight: 10 }}>{item.main_text}</span>
                            <span style={{ color: "red", fontWeight: 'bold' }}>x</span>
                        </div>
                    ))}
                </div>

                <div style={styles.header}>
                    <p>Select Property Type</p>
                </div>
                <div style={styles.propSection}>
                    <CustomButtonGroup
                        buttons={AppConstant.PROPERTY_TYPE_OPTION}
                        selectedIndices={[AppConstant.PROPERTY_TYPE_OPTION.findIndex(option => option.text === selectedPropType)]}
                        isMultiSelect={false}
                        onButtonPress={(index, button) => {
                            setSelectedPropType(button.text);
                        }}
                    />

                </div>
                <div style={{ alignContent: "flex-start", marginTop: 20 }}>
                    <p>Select Property For</p>
                </div>
                <div
                    style={{ marginBottom: 10, marginTop: 15 }}
                >
                    <CustomButtonGroup
                        buttons={AppConstant.CUSTOMER_PROPERTY_FOR_OPTION}
                        selectedIndices={[AppConstant.CUSTOMER_PROPERTY_FOR_OPTION.findIndex(option => option.text === selectedPropFor)]}
                        isMultiSelect={false}
                        onButtonPress={(index, button) => {
                            setSelectedPropFor(button.text);
                        }}
                    />

                </div>

                {selectedPropType.toLowerCase() == "Residential".toLowerCase() && selectedPropFor === "Rent" ?
                    <div>
                        <div style={{ alignContent: "flex-start", marginTop: 20 }}>
                            <p>Required for</p>
                        </div>
                        <div
                            style={{ marginBottom: 10, marginTop: 15 }}
                        >
                            <CustomButtonGroup
                                buttons={AppConstant.CUSTOMER_PREFERRED_TENANTS_OPTION}
                                selectedIndices={[AppConstant.CUSTOMER_PREFERRED_TENANTS_OPTION.findIndex(option => option.text === requiredFor)]}
                                isMultiSelect={false}
                                onButtonPress={(index, button) => {
                                    setRequiredFor(button.text);
                                }}
                            />
                        </div>
                    </div> : <div></div>}

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
        marginTop: 20,
        marginLeft: 20,
        marginRight: 20
    },
    header: {
        alignContent: "flex-start",
        marginTop: 30
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
)(ContactLocalityDetailsForm);
