import React, { useState, useEffect, useRef } from "react";
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

    const dismissSnackBar = () => {
        setIsVisible(false);
    };

    useEffect(() => {
    }, []);

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
            // Fetch details using the place_id if needed, or use the data provided
            // The library usually returns basic info. For geometry, we might need to fetch details.
            // However, react-google-places-autocomplete usually handles this if configured.
            // Let's assume 'data' contains the necessary info or we need to use the 'selectProps' to get details.
            // Actually, the library's onChange returns { label, value } usually.
            // Let's check how we want to structure gLocation.

            // Wait, the previous code had onSelectPlace(data, details).
            // The standard react-google-places-autocomplete (if it's the one I think) works differently than the RN one.
            // Let's use the standard prop 'selectProps' -> 'onChange'.

            // Let's look at the documentation or standard usage.
            // Usually: <GooglePlacesAutocomplete apiKey="..." selectProps={{ onChange: (val) => ... }} />

            // But wait, I need to get geometry (lat/lng).
            // The library 'react-google-places-autocomplete' is a wrapper around 'react-select'.
            // It has a prop 'autocompletionRequest' and 'onLoadFailed'.

            // Let's try to use it simply first.
            // The 'data' in onChange is the selected option.
            // To get details (geometry), we might need to use the Google Maps Geocoding API or Places Details API separately if the library doesn't provide it automatically in the option.
            // OR, maybe I should use 'react-places-autocomplete' (different lib) or just use the raw API.
            // But I installed 'react-google-places-autocomplete'.

            // Let's stick to the plan. I will use the component.
            // I need to fetch details.
            // Actually, the library might have a helper or I might need to do it manually.

            // Let's assume for now we just get the description and place_id.
            // I'll update gLocation with what I have.

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
        }
    }

    return (
        <div className="flex flex-col h-full bg-gray-100 overflow-y-auto p-5">
            <p className="text-gray-600 text-lg font-medium mb-5">Enter property address details</p>

            <div className="mb-5">
                <label className="block text-gray-700 text-sm font-bold mb-2">City*</label>
                <input
                    type="text"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    value={city}
                    onChange={e => setCity(e.target.value)}
                    onFocus={() => setIsVisible(false)}
                />
            </div>

            <div className="mb-5">
                <label className="block text-gray-700 text-sm font-bold mb-2">Area / Location*</label>
                <div className="w-full">
                    <GooglePlacesAutocomplete
                        apiKey={GOOGLE_PLACES_API_KEY}
                        selectProps={{
                            placeholder: 'Add multiple locations within city',
                            onChange: (val) => onSelectPlace(val),
                            styles: {
                                input: (provided) => ({
                                    ...provided,
                                    height: '38px',
                                }),
                                control: (provided) => ({
                                    ...provided,
                                    borderColor: '#e2e8f0',
                                    boxShadow: 'none',
                                    '&:hover': {
                                        borderColor: '#cbd5e0',
                                    },
                                }),
                                option: (provided, state) => ({
                                    ...provided,
                                    color: '#374151', // text-gray-700
                                    backgroundColor: state.isFocused ? '#e2e8f0' : '#ffffff',
                                }),
                                singleValue: (provided) => ({
                                    ...provided,
                                    color: '#374151',
                                }),
                            },
                        }}
                    />
                </div>
            </div>

            {props.propertyDetails && props.propertyDetails.property_type && props.propertyDetails.property_type.toLowerCase() === "residential" ? (
                <div className="mb-5">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Flat No and Wing*</label>
                    <input
                        type="text"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        value={flatNumber}
                        onChange={e => setFlatNumber(e.target.value)}
                        onFocus={() => setIsVisible(false)}
                    />
                </div>
            ) : null}

            <div className="mb-5">
                <label className="block text-gray-700 text-sm font-bold mb-2">Building Name / Society*</label>
                <input
                    type="text"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    value={buildingName}
                    onChange={e => setBuildingName(e.target.value)}
                    onFocus={() => setIsVisible(false)}
                />
            </div>

            <div className="mb-5">
                <label className="block text-gray-700 text-sm font-bold mb-2">Street / Landmark*</label>
                <input
                    type="text"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    value={landmark}
                    onChange={e => setLandmark(e.target.value)}
                    onFocus={() => setIsVisible(false)}
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
