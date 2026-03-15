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
    const [focusedField, setFocusedField] = useState(null);
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
        <div style={{ flex: 1, backgroundColor: "var(--background)", minHeight: "100vh" }}>
            {/* Header */}
            <div style={styles.headerContainer}>
                <div style={styles.backButtonContainer} onClick={() => navigate(-1)}>
                    <MdArrowBack size={24} color="var(--foreground)" />
                </div>
                <div style={styles.headerTitleContainer}>
                    <p style={styles.headerTitle}>Locality Details</p>
                </div>
            </div>
            <div style={styles.container}>
                <p style={{ color: 'var(--foreground)' }}>Enter city and locations where customer wants the property</p>
                <div className="mb-6">
                    <label className={`block text-xs font-medium mb-1 ${focusedField === 'city' ? 'text-teal-500' : 'text-gray-500'}`}>City*</label>
                    <input
                        value={city}
                        onChange={e => setCity(e.target.value)}
                        onFocus={() => { setIsVisible(false); setFocusedField('city'); }}
                        onBlur={() => setFocusedField(null)}
                        className={`w-full bg-transparent text-base text-gray-100 border-b-2 focus:outline-none py-1 transition-colors ${focusedField === 'city' ? 'border-teal-500' : 'border-neutral-700'}`}
                    />
                </div>
                <div style={{ marginTop: 20 }} />

                <div style={{ marginBottom: 15 }}>
                    <label style={{ display: 'block', marginBottom: 5, color: 'var(--foreground)', fontWeight: '500' }}>Add multiple locations within city</label>
                    <GooglePlacesAutocomplete
                        apiKey={GOOGLE_PLACES_API_KEY}
                        selectProps={{
                            value: address,
                            onChange: (val) => onSelectPlace(val),
                            onFocus: () => setFocusedField('location'),
                            onBlur: () => setFocusedField(null),
                            isClearable: true,
                            styles: {
                                input: (provided) => ({
                                    ...provided,
                                    height: '38px',
                                    color: 'var(--foreground)',
                                    paddingLeft: 0,
                                    backgroundColor: 'transparent',
                                }),
                                container: (provided) => ({
                                    ...provided,
                                    zIndex: 1000,
                                    position: 'relative'
                                }),
                                menu: (provided) => ({
                                    ...provided,
                                    zIndex: 1000,
                                    backgroundColor: '#1e1e1e',
                                    boxShadow: '0px 2px 8px rgba(0,0,0,0.5)',
                                }),
                                listView: (provided) => ({
                                    ...provided,
                                    zIndex: 1000,
                                    position: 'absolute',
                                    top: 40,
                                    width: '100%',
                                    backgroundColor: '#1e1e1e',
                                    boxShadow: '0px 2px 4px rgba(0,0,0,0.5)',
                                }),
                                control: (provided, state) => ({
                                    ...provided,
                                    backgroundColor: 'transparent',
                                    border: 'none',
                                    borderBottom: focusedField === 'location' ? '2px solid #14b8a6' : '2px solid rgba(255,255,255,0.2)',
                                    borderRadius: 0,
                                    boxShadow: 'none',
                                    paddingLeft: 0,
                                    '&:hover': {
                                        borderBottom: focusedField === 'location' ? '2px solid #14b8a6' : '2px solid rgba(255,255,255,0.2)',
                                    },
                                    transition: 'border-color 0.2s',
                                }),
                                valueContainer: (provided) => ({
                                    ...provided,
                                    paddingLeft: 0,
                                }),
                                clearIndicator: (provided) => ({
                                    ...provided,
                                    color: 'rgba(255,255,255,0.4)',
                                    padding: '0 8px',
                                    '&:hover': {
                                        color: 'var(--foreground)',
                                    },
                                }),
                                placeholder: (provided) => ({
                                    ...provided,
                                    color: 'rgba(255,255,255,0.4)',
                                    marginLeft: 0,
                                }),
                                option: (provided, state) => ({
                                    ...provided,
                                    color: 'var(--foreground)',
                                    backgroundColor: state.isFocused ? 'rgba(255,255,255,0.1)' : '#1e1e1e',
                                }),
                                singleValue: (provided) => ({
                                    ...provided,
                                    color: 'var(--foreground)',
                                    marginLeft: 0,
                                }),
                            },
                        }}
                    />
                </div>

                <div style={{ marginTop: 5, display: 'flex', flexWrap: 'wrap' }}>
                    {SelectedLocationArray.map((item, index) => (
                        <div key={index} onClick={() => removeLocation(item)} style={{ backgroundColor: "rgba(20, 184, 166, 0.2)", border: '1px solid rgba(20, 184, 166, 0.4)', borderRadius: 20, margin: 5, padding: '5px 12px', display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                            <span style={{ marginRight: 10, color: 'var(--foreground)', fontSize: 13 }}>{item.main_text}</span>
                            <span style={{ color: "#ef4444", fontWeight: 'bold', fontSize: 16 }}>×</span>
                        </div>
                    ))}
                </div>

                <div className="mt-6">
                    <p className="text-sm font-medium text-gray-300 mb-3">Select Property Type</p>
                    <CustomButtonGroup
                        buttons={AppConstant.PROPERTY_TYPE_OPTION}
                        selectedIndices={[AppConstant.PROPERTY_TYPE_OPTION.findIndex(option => option.text === selectedPropType)]}
                        isMultiSelect={false}
                        onButtonPress={(index, button) => {
                            setSelectedPropType(button.text);
                        }}
                        containerStyle={{ gap: '12px' }}
                        buttonStyle={{ backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.15)', padding: '8px 20px', fontSize: '14px', fontWeight: '500', color: 'var(--foreground)', boxShadow: 'none', width: '140px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                    />
                </div>

                <div className="mt-6">
                    <p className="text-sm font-medium text-gray-300 mb-3">Select Property For</p>
                    <CustomButtonGroup
                        buttons={AppConstant.CUSTOMER_PROPERTY_FOR_OPTION}
                        selectedIndices={[AppConstant.CUSTOMER_PROPERTY_FOR_OPTION.findIndex(option => option.text === selectedPropFor)]}
                        isMultiSelect={false}
                        onButtonPress={(index, button) => {
                            setSelectedPropFor(button.text);
                        }}
                        containerStyle={{ gap: '12px' }}
                        buttonStyle={{ backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.15)', padding: '8px 20px', fontSize: '14px', fontWeight: '500', color: 'var(--foreground)', boxShadow: 'none', width: '140px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                    />
                </div>

                {selectedPropType.toLowerCase() == "Residential".toLowerCase() && selectedPropFor === "Rent" ?
                    <div className="mt-6">
                        <p className="text-sm font-medium text-gray-300 mb-3">Required for</p>
                        <CustomButtonGroup
                            buttons={AppConstant.CUSTOMER_PREFERRED_TENANTS_OPTION}
                            selectedIndices={[AppConstant.CUSTOMER_PREFERRED_TENANTS_OPTION.findIndex(option => option.text === requiredFor)]}
                            isMultiSelect={false}
                            onButtonPress={(index, button) => {
                                setRequiredFor(button.text);
                            }}
                            containerStyle={{ gap: '12px' }}
                            buttonStyle={{ backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.15)', padding: '8px 20px', fontSize: '14px', fontWeight: '500', color: 'var(--foreground)', boxShadow: 'none', width: '140px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                        />
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
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        backgroundColor: 'var(--background)',
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
        color: 'var(--foreground)',
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
        border: '1px solid rgba(255, 255, 255, 0.15)',
        backgroundColor: "rgba(255, 255, 255, 0.05)",
        outline: 'none',
        color: 'var(--foreground)'
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
