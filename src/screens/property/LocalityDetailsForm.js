import React, { useState, useEffect, useRef } from "react";
import { MdArrowBack } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import Button from "./../../components/Button";
import Snackbar from "./../../components/SnackbarComponent";
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';
import { GOOGLE_PLACES_API_KEY } from "./../../utils/Constant";
import { connect } from "react-redux";
import { setPropertyType, setPropertyDetails } from "./../../reducers/Action";

const homePlace = { description: 'Mumbai', geometry: { location: { lat: 48.8152937, lng: 2.4597668 } } };

const LocalityDetailsForm = props => {
    const navigate = useNavigate();
    const [city, setCity] = useState("");
    const [gLocation, setGLocation] = useState(null);
    const [flatNumber, setFlatNumber] = useState("");
    const [buildingName, setBuildingName] = useState("");
    const [landmark, setLandmark] = useState("");
    const [isVisible, setIsVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const [address, setAddress] = useState(null);
    const [focusedField, setFocusedField] = useState(null);

    const dismissSnackBar = () => {
        setIsVisible(false);
    };

    useEffect(() => {
        if (props.propertyDetails && props.propertyDetails.property_address) {
            const data = props.propertyDetails.property_address;
            if (data.city) setCity(data.city);
            if (data.location_area) setGLocation(data.location_area);
            if (data.flat_number) setFlatNumber(data.flat_number);
            if (data.building_name) setBuildingName(data.building_name);
            if (data.landmark_or_street) setLandmark(data.landmark_or_street);
        }
    }, [props.propertyDetails]);

    const onSubmit = async () => {
        const property = props.propertyDetails || {};
        const propertyType = property.property_type || "";

        if (city.trim() === "") {
            setErrorMessage("City is missing");
            setIsVisible(true);
            return;
        } else if (gLocation === null) {
            setErrorMessage("Area is missing");
            setIsVisible(true);
            return;
        } else if (
            propertyType.toLowerCase() === "residential" &&
            flatNumber.trim() === ""
        ) {
            setErrorMessage("Flat Number is missing");
            setIsVisible(true);
            return;
        } else if (buildingName.trim() === "") {
            setErrorMessage("Building name is missing");
            setIsVisible(true);
            return;
        } else if (landmark.trim() === "") {
            setErrorMessage("Street/Landmark is missing");
            setIsVisible(true);
            return;
        }



        const property_address = {
            city: city.trim(),
            location_area: gLocation,
            flat_number: flatNumber.trim(),
            building_name: buildingName.trim(),
            landmark_or_street: landmark.trim(),
            pin: "123",
        };

        property["property_address"] = property_address;
        props.setPropertyDetails(property);

        if (propertyType.toLowerCase() === "residential") {
            navigate("/listing/Add/ResidentialPropertyDetailsForm");
        } else {
            navigate("/listing/Add/CommercialPropertyDetailsForm");
        }
    };

    const onSelectPlace = (data) => {
        console.log("onSelectPlace data: ", data);
        if (data && data.value && data.value.place_id) {
            const gLocation = {
                location: {
                    type: "Point",
                    coordinates: [0, 0] // We might not get coords immediately without extra call
                },
                main_text: data.label, // or data.value.structured_formatting.main_text
                formatted_address: data.label,
                place_id: data.value.place_id
            }
            setGLocation(gLocation);
        } else if (data === null) {
            setGLocation(null);
        }
    }

    return (
        <div className="flex flex-col h-full bg-neutral-800 overflow-y-auto">
            <div className="bg-neutral-900 px-4 py-3 flex items-center shadow-sm border-b border-neutral-700">
                <button
                    onClick={() => navigate(-1)}
                    className="mr-3 p-1 rounded-full hover:bg-neutral-800 focus:outline-none"
                    aria-label="Go back"
                >
                    <MdArrowBack className="text-gray-300 text-xl" />
                </button>
                <h1 className="text-lg font-medium text-gray-100">Locality Details</h1>
            </div>
            <div className="p-5">
                <p className="text-gray-400 text-lg font-medium mb-5">Enter property address details</p>

                <div className="mb-6">
                    <label className={`block text-xs font-medium mb-1 ${focusedField === 'city' ? 'text-teal-500' : 'text-gray-500'}`}>City*</label>
                    <input
                        type="text"
                        className={`w-full bg-transparent text-base text-gray-100 border-b-2 focus:outline-none py-1 transition-colors ${focusedField === 'city' ? 'border-teal-500' : 'border-neutral-700'}`}
                        value={city}
                        onChange={e => setCity(e.target.value)}
                        onFocus={() => { setIsVisible(false); setFocusedField('city'); }}
                        onBlur={() => setFocusedField(null)}
                    />
                </div>

                <div className="mb-6">
                    <label className={`block text-xs font-medium mb-1 ${focusedField === 'location' ? 'text-teal-500' : 'text-gray-500'}`}>Area / Location*</label>
                    <div className="w-full">
                        <GooglePlacesAutocomplete
                            apiKey={GOOGLE_PLACES_API_KEY}
                            selectProps={{
                                placeholder: 'Add multiple locations within city',
                                isClearable: true,
                                onChange: (val) => onSelectPlace(val),
                                onFocus: () => setFocusedField('location'),
                                onBlur: () => setFocusedField(null),
                                styles: {
                                    input: (provided) => ({
                                        ...provided,
                                        height: '38px',
                                        color: 'var(--foreground)',
                                        margin: 0,
                                        padding: 0,
                                    }),
                                    menu: (provided) => ({
                                        ...provided,
                                        zIndex: 1000,
                                        backgroundColor: '#1e1e1e',
                                        boxShadow: '0px 2px 8px rgba(0,0,0,0.5)',
                                    }),
                                    control: (provided, state) => ({
                                        ...provided,
                                        backgroundColor: 'transparent',
                                        border: 'none',
                                        borderBottom: state.isFocused ? '2px solid #14b8a6' : '2px solid rgba(255,255,255,0.2)',
                                        borderRadius: 0,
                                        boxShadow: 'none',
                                        padding: '0',
                                        minHeight: 'auto',
                                        '&:hover': {
                                            borderColor: state.isFocused ? '#14b8a6' : 'rgba(255,255,255,0.2)',
                                        },
                                    }),
                                    valueContainer: (provided) => ({
                                        ...provided,
                                        padding: '4px 0',
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
                                    }),
                                    indicatorSeparator: () => ({ display: 'none' }),
                                    dropdownIndicator: () => ({ display: 'none' }),
                                    option: (provided, state) => ({
                                        ...provided,
                                        color: 'var(--foreground)',
                                        backgroundColor: state.isFocused ? 'rgba(255,255,255,0.1)' : '#1e1e1e',
                                    }),
                                    singleValue: (provided) => ({
                                        ...provided,
                                        color: 'var(--foreground)',
                                        margin: 0,
                                        padding: 0,
                                    }),
                                },
                            }}
                        />
                    </div>
                </div>

                {props.propertyDetails && props.propertyDetails.property_type && props.propertyDetails.property_type.toLowerCase() === "residential" ? (
                    <div className="mb-6">
                        <label className={`block text-xs font-medium mb-1 ${focusedField === 'flatNumber' ? 'text-teal-500' : 'text-gray-500'}`}>Flat No and Wing*</label>
                        <input
                            type="text"
                            className={`w-full bg-transparent text-base text-gray-100 border-b-2 focus:outline-none py-1 transition-colors ${focusedField === 'flatNumber' ? 'border-teal-500' : 'border-neutral-700'}`}
                            value={flatNumber}
                            onChange={e => setFlatNumber(e.target.value)}
                            onFocus={() => { setIsVisible(false); setFocusedField('flatNumber'); }}
                            onBlur={() => setFocusedField(null)}
                        />
                    </div>
                ) : null}

                <div className="mb-6">
                    <label className={`block text-xs font-medium mb-1 ${focusedField === 'buildingName' ? 'text-teal-500' : 'text-gray-500'}`}>Building Name / Society*</label>
                    <input
                        type="text"
                        className={`w-full bg-transparent text-base text-gray-100 border-b-2 focus:outline-none py-1 transition-colors ${focusedField === 'buildingName' ? 'border-teal-500' : 'border-neutral-700'}`}
                        value={buildingName}
                        onChange={e => setBuildingName(e.target.value)}
                        onFocus={() => { setIsVisible(false); setFocusedField('buildingName'); }}
                        onBlur={() => setFocusedField(null)}
                    />
                </div>

                <div className="mb-6">
                    <label className={`block text-xs font-medium mb-1 ${focusedField === 'landmark' ? 'text-teal-500' : 'text-gray-500'}`}>Street / Landmark*</label>
                    <input
                        type="text"
                        className={`w-full bg-transparent text-base text-gray-100 border-b-2 focus:outline-none py-1 transition-colors ${focusedField === 'landmark' ? 'border-teal-500' : 'border-neutral-700'}`}
                        value={landmark}
                        onChange={e => setLandmark(e.target.value)}
                        onFocus={() => { setIsVisible(false); setFocusedField('landmark'); }}
                        onBlur={() => setFocusedField(null)}
                    />
                </div>

                <div className="mt-5">
                    <Button title="NEXT" onPress={() => onSubmit()} />
                </div>

                <Snackbar
                    visible={isVisible}
                    textMessage={errorMessage}
                    actionHandler={dismissSnackBar}
                    actionText="OK"
                />
            </div>
        </div>
    );
};

const mapStateToProps = state => ({
    userDetails: state.AppReducer.userDetails,
    propertyDetails: state.AppReducer.propertyDetails,
});
const mapDispatchToProps = {
    setPropertyType,
    setPropertyDetails
};
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(LocalityDetailsForm);
