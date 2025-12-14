import React, { useState, useEffect, useRef } from "react";
import { MdArrowBack } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import Button from "./../../components/Button";
import Snackbar from "./../../components/SnackbarComponent";
import { connect } from "react-redux";
import { setPropertyType, setPropertyDetails, setCustomerDetails } from "./../../reducers/Action";
import CustomButtonGroup from "./../../components/CustomButtonGroup";
import * as  AppConstant from "./../../utils/AppConstant";
import GooglePlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-google-places-autocomplete';
import { GOOGLE_PLACES_API_KEY } from "./../../utils/Constant";

const ContactLocalityDetailsForm = props => {
    const navigate = useNavigate();
    const [city, setCity] = useState("");
    const [isVisible, setIsVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const [SelectedLocationArray, setSelectedLocationArray] = useState([]);
    const [requiredFor, setRequiredFor] = useState("Family");

    const [selectedPropType, setSelectedPropType] = useState("Residential");
    const [selectedPropFor, setSelectedPropFor] = useState("Rent");

    const [address, setAddress] = useState(null);

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
            navigate("../ContactResidentialPropertyDetailsForm");
        } else {
            navigate("../CustomerCommercialPropertyDetailsForm");
        }
    };

    const onSelectPlace = (val) => {
        if (val && val.label) {
            geocodeByAddress(val.label)
                .then(results => getLatLng(results[0]))
                .then(({ lat, lng }) => {
                    const gLocation = {
                        location: {
                            type: "Point",
                            coordinates: [lng, lat]
                        },
                        main_text: val.label,
                        formatted_address: val.label
                    };
                    setSelectedLocationArray([...SelectedLocationArray, gLocation]);
                    setAddress(null); // Clear input
                })
                .catch(error => console.error('Error', error));
        }
    };

    const removeLocation = (loc) => {
        const arr = SelectedLocationArray.filter(item => item.main_text !== loc.main_text);
        setSelectedLocationArray(arr)
    }

    return (
        <div style={{ flex: 1, backgroundColor: "#ffffff" }}>
            {/* Header */}
            <div style={styles.headerContainer}>
                <div style={styles.backButtonContainer} onClick={() => navigate(-1)}>
                    <MdArrowBack size={24} color="#000000" />
                </div>
                <div style={styles.headerTitleContainer}>
                    <p style={styles.headerTitle}>Locality Details</p>
                </div>
            </div>
            <div style={styles.container}>
                <p style={{ color: '#000000' }}>Enter city and locations where customer wants the property</p>
                <div style={{ marginBottom: 15 }}>
                    <label style={{ display: 'block', marginBottom: 5, color: '#000000', fontWeight: '500' }}>City*</label>
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
                    <label style={{ display: 'block', marginBottom: 5, color: '#000000', fontWeight: '500' }}>Add multiple locations within city</label>
                    <GooglePlacesAutocomplete
                        apiKey={GOOGLE_PLACES_API_KEY}
                        selectProps={{
                            value: address,
                            placeholder: 'Add multiple locations within city',
                            onChange: (val) => onSelectPlace(val),
                            styles: {
                                input: (provided) => ({
                                    ...provided,
                                    height: '38px',
                                }),
                                container: (provided) => ({
                                    ...provided,
                                    zIndex: 1000,
                                    position: 'relative'
                                }),
                                listView: (provided) => ({
                                    ...provided,
                                    zIndex: 1000,
                                    position: 'absolute',
                                    top: 40,
                                    width: '100%',
                                    backgroundColor: 'white',
                                    boxShadow: '0px 2px 4px rgba(0,0,0,0.25)',
                                }),
                                control: (provided) => ({
                                    ...provided,
                                    borderColor: '#ccc',
                                    backgroundColor: "#f9f9f9",
                                    boxShadow: 'none',
                                    '&:hover': {
                                        borderColor: '#aaa',
                                    },
                                }),
                                option: (provided, state) => ({
                                    ...provided,
                                    color: '#000000',
                                    backgroundColor: state.isFocused ? '#e2e8f0' : '#ffffff',
                                }),
                                singleValue: (provided) => ({
                                    ...provided,
                                    color: '#000000',
                                }),
                            },
                        }}
                    />
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
                    <p style={{ color: '#000000', fontWeight: 'bold', fontSize: 16 }}>Select Property Type</p>
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
                    <p style={{ color: '#000000', fontWeight: 'bold', fontSize: 16 }}>Select Property For</p>
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
                            <p style={{ color: '#000000', fontWeight: 'bold', fontSize: 16 }}>Required for</p>
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
)(ContactLocalityDetailsForm);
