import React, { useState, useEffect, useRef, useCallback } from "react";
import { connect } from "react-redux";
import {
    setGlobalSearchResult
} from "./../../reducers/Action";
import { MdSearch, MdClose, MdHome, MdFavoriteBorder } from "react-icons/md";
import axios from "axios";
import { SERVER_URL, GOOGLE_PLACES_API_KEY } from "./../../utils/Constant";
import CustomButtonGroup from "./../../components/CustomButtonGroup";
import Slider from "./../../components/Slider";

import SliderCr from "./../../components/SliderCr";
import Button from "./../../components/Button";
import GooglePlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-google-places-autocomplete';

const homePlace = { description: 'Mumbai', geometry: { location: { lat: 48.8152937, lng: 2.4597668 } } };

const propertyTypeArray = ["Residential", "Commercial"];
const assetTypeArray = ["Property", "Customer"];
const whatTypeOptions = [
    { text: 'Residential' },
    { text: 'Commercial' },
];

const lookingForOptions = [
    { text: 'Property' },
    { text: 'Customer' },
];

const porposeForOptions = [
    { text: 'Rent' },
    { text: 'Buy' },
];

const bhkOption = [
    { text: '1RK' },
    { text: '1BHK' },
    { text: '2BHK' },
    { text: '3BHK' },
    { text: '4+BHK' },
];
const reqWithinOptions = [
    { text: '7 Days' },
    { text: '15 Days' },
    { text: '30 Days' },
    { text: '60 Days' },
    { text: '60+ Days' },
];

const tenantOptions = [
    { text: 'Any' },
    { text: 'Family' },
    { text: 'Bachelors' },
];

const buildingTypeOption = [
    { text: 'Mall' },
    { text: 'Businesses Park' },
    { text: 'StandAlone' },
    { text: 'Industrial' },
    { text: 'Shopping Complex' },
    { text: 'Commersial Complex' },
];

const requiredForOption = [
    { text: 'Shop' },
    { text: 'Office' },
    { text: 'Showroom' },
    { text: ' Restaurant/Cafe' },
    { text: 'Pub/Night Club' },
    { text: 'Clinic' },
    { text: 'Godown' },
];

const GlobalSearch = props => {
    const { navigation } = props;

    const [city, setCity] = useState("");
    const [area, setArea] = useState(""); // Not used in RN code but kept
    const [address, setAddress] = useState(""); // Changed from null to string for input
    const [gLocation, setGLocation] = useState(null);
    const [isVisible, setIsVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [propertyForIndex, setPropertyForIndex] = useState(-1);
    const [selectedPropType, setSelectedPropType] = useState(null);
    const [data, setData] = useState([]);

    const [selectedLocationArray, setSelectedLocationArray] = useState([]);
    const [lookingFor, setLookingFor] = useState("Property");
    const [whatType, setWhatType] = useState("Residential");
    const [purpose, setPurpose] = useState("Rent");
    const [selectedBHK, setSelectedBHK] = useState(["1RK"]);
    const [selectedRequiredFor, setSelectedRequiredFor] = useState(["Shop"]);
    const [selectedBuildingType, setSelectedBuildingType] = useState(["Mall"]);
    const [priceRange, setPriceRange] = useState([10000, 400000]);
    const [priceRangeCr, setPriceRangeCr] = useState([1000000, 50000000]);
    const [reqWithin, setReqWithin] = useState("7 Days");
    const [tenant, setTenant] = useState("Any");
    const [query, setQuery] = useState("I am looking for a Property for a Residential property to Rent");

    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);

    const updateQuery = useCallback(() => {
        let newQuery = `I am looking for a ${lookingFor.toLowerCase()} `;

        if (purpose && lookingFor.toLowerCase() === "customer") {
            newQuery += `to ${purpose.toLowerCase()} a ${whatType.toLowerCase()} property for`;
        } else if (purpose && lookingFor.toLowerCase() === "property") {
            newQuery += `to ${purpose.toLowerCase()}`;
        }

        if (whatType.toLowerCase() === "residential") {
            if (selectedBHK.length > 0) {
                newQuery += ` ${selectedBHK.join(', ')}`;
            }
        } else if (whatType.toLowerCase() === "commercial") {
            if (selectedRequiredFor.length > 0) {
                newQuery += `  ${selectedRequiredFor.join(', ')}`;
            }
            if (selectedBuildingType.length > 0) {
                newQuery += ` in building type ${selectedBuildingType.join(', ')}`;
            }
        }

        if (reqWithin) {
            newQuery += ` within ${reqWithin}`;
        }

        setQuery(newQuery);
    }, [lookingFor, whatType, purpose, selectedBHK, selectedRequiredFor, selectedBuildingType, reqWithin, tenant]);

    useEffect(() => {
        updateQuery();
    }, [lookingFor, whatType, purpose, selectedBHK, selectedRequiredFor, selectedBuildingType, reqWithin, tenant, updateQuery]);

    const selectWhatYouLookingFor = (index, button) => {
        setLookingFor(button.text);
    }

    const selectWhatType = (index, button) => {
        setWhatType(button.text);
    }

    const handlePriceRangeChange = useCallback((values) => {
        setPriceRange(values);
    }, []);

    const handlePriceRangeChangeCr = useCallback((values) => {
        setPriceRangeCr(values);
    }, []);

    const selectBHK = (index, button) => {
        let newSelectedIndicesBHK = [...selectedBHK];
        if (newSelectedIndicesBHK.includes(button.text)) {
            newSelectedIndicesBHK.splice(newSelectedIndicesBHK.indexOf(button.text), 1);
        } else {
            newSelectedIndicesBHK.push(button.text);
        }
        setSelectedBHK(newSelectedIndicesBHK);
    }

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
                    setSelectedLocationArray([...selectedLocationArray, gLocation]);
                    setGLocation(gLocation);
                    setAddress(null); // Clear input
                })
                .catch(error => console.error('Error', error));
        }
    };

    const removeLocation = loc => {
        const arr = (selectedLocationArray || []).filter(item => item.main_text !== loc.main_text);
        setSelectedLocationArray(arr);
    };

    const onSubmit = () => {
        if (city.trim() === "") {
            setErrorMessage("City is missing");
            setIsVisible(true);
            return;
        }

        if (selectedLocationArray.length === 0) {
            setErrorMessage("Please add a location of your city");
            setIsVisible(true);
            return;
        }

        if (props.userDetails === null) {
            console.log("You are not logged in, please login");
            setModalVisible(true);
            return;
        }

        const match = reqWithin.match(/\d+/);
        const daysFromReqWithin = match ? parseInt(match[0], 10) : null;
        const today = new Date();
        today.setDate(today.getDate() + daysFromReqWithin);

        setLoading(true);

        const queryObject = {
            req_user_id: props.userDetails?.works_for,
            city: city.trim(),
            selectedLocationArray: selectedLocationArray,
            lookingFor: lookingFor,
            whatType: whatType,
            purpose: purpose,
            selectedBHK: selectedBHK,
            selectedRequiredFor: selectedRequiredFor,
            selectedBuildingType: selectedBuildingType,
            priceRange: priceRange,
            priceRangeCr: priceRangeCr,
            reqWithin: today,
            tenant: tenant
        };
        axios(SERVER_URL + "/getGlobalSearchResult", {
            method: "post",
            headers: {
                "Content-type": "Application/json",
                Accept: "Application/json"
            },
            data: queryObject
        }).then(
            response => {
                setLoading(false);
                response.data.forEach(item => {
                    if (Array.isArray(item.image_urls)) {
                        item.image_urls.forEach(image => {
                            image.url = SERVER_URL + image.url;
                        });
                    }
                });
                setData(response.data);
                props.setGlobalSearchResult(response.data);

                const searchGlobalResult = () => {
                    onSubmit();
                };

                if (lookingFor.toLowerCase() === "Property".toLowerCase()) {
                    if (whatType.toLowerCase() === "Residential".toLowerCase()) {
                        navigation.navigate("GlobalResidentialPropertySearchResult", {
                        });
                    } else if (whatType.toLowerCase() === "Commercial".toLowerCase()) {
                        navigation.navigate("GlobalCommercialPropertySearchResult", {
                        });
                    }
                } else if (lookingFor.toLowerCase() == "Customer".toLowerCase()) {
                    if (whatType.toLowerCase() === "Residential".toLowerCase()) {
                        navigation.navigate("GlobalResidentialContactsSearchResult", {
                        });
                    } else if (whatType.toLowerCase() === "Commercial".toLowerCase()) {
                        navigation.navigate("GlobalCommercialCustomersSearchResult", {
                        });
                    }
                }
            },
            error => {
                setLoading(false);
                console.log(error);
            }
        );
    };

    const imgButtonStyle = {
        borderRadius: '6px',
        borderWidth: '0px',
        padding: '10px 20px',
        marginRight: '10px',
        marginBottom: '10px',
        boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
    };

    const imgSelectedButtonStyle = {
        backgroundColor: 'rgba(0, 163, 108, .2)',
    };

    const SectionHeader = ({ title }) => (
        <div className="w-full bg-gray-100 px-4 py-2 mt-2">
            <span className="text-gray-700 font-medium text-sm">{title}</span>
        </div>
    );

    return (

        <div className="flex flex-col min-h-full bg-white font-sans text-gray-900 relative">
            {/* Header */}
            <div className="bg-white sticky top-0 z-40 shadow-sm border-b border-gray-100">
                <div className="flex justify-between items-center px-4 py-3">
                    <div className="flex items-center gap-3">
                        <img src="/assets/images/home.png" alt="Logo" className="w-8 h-8" />
                        <span className="text-xl font-bold text-gray-900">GLocal Search</span>
                    </div>
                    <MdFavoriteBorder size={26} className="text-gray-400" />
                </div>

                {/* Summary Banner */}
                <div className="bg-teal-100 px-4 py-3 border-t border-teal-200">
                    <p className="text-teal-900 text-sm font-medium leading-relaxed">
                        Hi, {query}
                    </p>
                </div>
            </div>

            <div className="flex flex-col pb-32">

                {/* Location Section - Custom Layout since it's inputs */}
                <div className="px-4 py-4 space-y-4">
                    <div>
                        <input
                            type="text"
                            placeholder="City where you want to search*"
                            value={city}
                            onChange={e => setCity(e.target.value)}
                            className="w-full border-b border-gray-300 py-3 text-gray-900 placeholder-gray-500 focus:border-teal-500 focus:outline-none transition-colors"
                        />
                    </div>

                    <div className="relative z-50">
                        <GooglePlacesAutocomplete
                            apiKey={GOOGLE_PLACES_API_KEY}
                            selectProps={{
                                value: address,
                                placeholder: 'Add multiple locations within city',
                                onChange: (val) => onSelectPlace(val),
                                styles: {
                                    container: (provided) => ({ ...provided, width: '100%' }),
                                    control: (provided, state) => ({
                                        ...provided,
                                        backgroundColor: 'transparent',
                                        border: 'none',
                                        borderBottom: '1px solid #e5e7eb',
                                        borderRadius: '0',
                                        padding: '8px 0',
                                        boxShadow: 'none',
                                        '&:hover': { borderBottom: '1px solid #d1d5db' }
                                    }),
                                    input: (provided) => ({ ...provided, color: '#111827', padding: 0 }),
                                    placeholder: (provided) => ({ ...provided, color: '#6b7280', padding: 0 }),
                                    menu: (provided) => ({
                                        ...provided,
                                        marginTop: '8px',
                                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                        zIndex: 9999,
                                    }),
                                },
                            }}
                        />
                    </div>

                    {selectedLocationArray.length > 0 && (
                        <div className="flex flex-wrap gap-2 pt-2">
                            {selectedLocationArray.map((item, index) => (
                                <div key={index} className="flex items-center bg-teal-50 border border-teal-100 rounded-md px-2 py-1">
                                    <span className="text-xs font-medium text-teal-700 mr-1 max-w-[150px] truncate">
                                        {item.main_text}
                                    </span>
                                    <button
                                        onClick={() => removeLocation(item)}
                                        className="text-teal-400 hover:text-teal-600"
                                    >
                                        <MdClose size={14} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Looking For */}
                <SectionHeader title="What you are looking for" />
                <div className="bg-gray-50/50 p-4">
                    <CustomButtonGroup
                        buttons={lookingForOptions}
                        selectedIndices={[lookingForOptions.findIndex(option => option.text === lookingFor)]}
                        onButtonPress={selectWhatYouLookingFor}
                        buttonStyle={imgButtonStyle}
                        selectedButtonStyle={imgSelectedButtonStyle}
                    />
                </div>

                {/* Property Type */}
                <SectionHeader title="What type" />
                <div className="bg-gray-50/50 p-4">
                    <CustomButtonGroup
                        buttons={whatTypeOptions}
                        selectedIndices={[whatTypeOptions.findIndex(option => option.text === whatType)]}
                        onButtonPress={selectWhatType}
                        buttonStyle={imgButtonStyle}
                        selectedButtonStyle={imgSelectedButtonStyle}
                    />
                </div>

                {/* Purpose */}
                <SectionHeader title="What is purpose" />
                <div className="bg-gray-50/50 p-4">
                    <CustomButtonGroup
                        buttons={porposeForOptions}
                        selectedIndices={[porposeForOptions.findIndex(option => option.text === purpose)]}
                        onButtonPress={(index, button) => setPurpose(button.text)}
                        buttonStyle={imgButtonStyle}
                        selectedButtonStyle={imgSelectedButtonStyle}
                    />
                </div>

                {/* Dynamic Sections */}
                {whatType.toLowerCase() === "residential" ? (
                    <>
                        <SectionHeader title="BHK Size" />
                        <div className="bg-gray-50/50 p-4">
                            <CustomButtonGroup
                                buttons={bhkOption}
                                isMultiSelect={true}
                                selectedIndices={selectedBHK.map(item => bhkOption.findIndex(option => option.text === item))}
                                onButtonPress={selectBHK}
                                buttonStyle={imgButtonStyle}
                                selectedButtonStyle={imgSelectedButtonStyle}
                            />
                        </div>
                    </>
                ) : (
                    <>
                        <SectionHeader title="Required For" />
                        <div className="bg-gray-50/50 p-4">
                            <CustomButtonGroup
                                buttons={requiredForOption}
                                isMultiSelect={true}
                                selectedIndices={selectedRequiredFor.map(item => requiredForOption.findIndex(option => option.text === item))}
                                onButtonPress={(index, button) => {
                                    let newSelected = [...selectedRequiredFor];
                                    if (newSelected.includes(button.text)) {
                                        newSelected.splice(newSelected.indexOf(button.text), 1);
                                    } else {
                                        newSelected.push(button.text);
                                    }
                                    setSelectedRequiredFor(newSelected);
                                }}
                                buttonStyle={imgButtonStyle}
                                selectedButtonStyle={imgSelectedButtonStyle}
                            />
                        </div>

                        <SectionHeader title="Building Type" />
                        <div className="bg-gray-50/50 p-4">
                            <CustomButtonGroup
                                buttons={buildingTypeOption}
                                isMultiSelect={true}
                                selectedIndices={selectedBuildingType.map(item => buildingTypeOption.findIndex(option => option.text === item))}
                                onButtonPress={(index, button) => {
                                    let newSelected = [...selectedBuildingType];
                                    if (newSelected.includes(button.text)) {
                                        newSelected.splice(newSelected.indexOf(button.text), 1);
                                    } else {
                                        newSelected.push(button.text);
                                    }
                                    setSelectedBuildingType(newSelected);
                                }}
                                buttonStyle={imgButtonStyle}
                                selectedButtonStyle={imgSelectedButtonStyle}
                            />
                        </div>
                    </>
                )}

                {/* Price Range */}
                <SectionHeader title="Price Range" />
                <div className="bg-gray-50/50 p-6">
                    {purpose === "Rent" ? (
                        <Slider
                            min={10000}
                            max={400000}
                            initialValues={priceRange}
                            onSlide={handlePriceRangeChange}
                        />
                    ) : (
                        <SliderCr
                            min={1000000}
                            max={50000000}
                            initialValues={priceRangeCr}
                            onSlide={handlePriceRangeChangeCr}
                        />
                    )}
                </div>

                {/* Timeline */}
                <SectionHeader title="Required within" />
                <div className="bg-gray-50/50 p-4">
                    <CustomButtonGroup
                        buttons={reqWithinOptions}
                        selectedIndices={[reqWithinOptions.findIndex(option => option.text === reqWithin)]}
                        onButtonPress={(index, button) => setReqWithin(button.text)}
                        buttonStyle={imgButtonStyle}
                        selectedButtonStyle={imgSelectedButtonStyle}
                    />
                </div>

                {/* Tenant (Residential only) */}
                {whatType.toLowerCase() === "residential" && (
                    <>
                        <SectionHeader title="Preferred Tenant" />
                        <div className="bg-gray-50/50 p-4">
                            <CustomButtonGroup
                                buttons={tenantOptions}
                                selectedIndices={[tenantOptions.findIndex(option => option.text === tenant)]}
                                onButtonPress={(index, button) => setTenant(button.text)}
                                buttonStyle={imgButtonStyle}
                                selectedButtonStyle={imgSelectedButtonStyle}
                            />
                        </div>
                    </>
                )}


            </div>

            {/* Floating Footer Action */}
            <div
                className="fixed bottom-[62px] left-0 right-0 px-4 py-2 z-40 bg-white shadow-lg"
            >
                <Button
                    title="Search"
                    onPress={onSubmit}
                    accessibilityLabel="search-button"
                    className="!mt-0 !mb-0"
                />
            </div>

            {/* Loading Overlay */}
            {
                loading && (
                    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50">
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent"></div>
                    </div>
                )
            }

            {/* Login Modal */}
            {
                modalVisible && (
                    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
                        <div className="bg-white p-6 rounded-lg shadow-xl max-w-xs w-full">
                            <h3 className="text-lg font-bold text-gray-900 mb-2">Login Required</h3>
                            <p className="text-gray-600 mb-6 text-sm">Please login to continue.</p>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setModalVisible(false)}
                                    className="flex-1 py-2 text-gray-600 font-medium hover:bg-gray-50 rounded"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => {
                                        setModalVisible(false);
                                        navigation.navigate("Login");
                                    }}
                                    className="flex-1 py-2 bg-teal-600 text-white font-medium rounded hover:bg-teal-700"
                                >
                                    Login
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }

            {/* Snackbar */}
            {
                isVisible && (
                    <div className="fixed bottom-24 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-4 z-50">
                        <span className="font-medium text-sm">{errorMessage}</span>
                        <button onClick={() => setIsVisible(false)} className="text-teal-400 font-bold hover:text-teal-300 text-sm">OK</button>
                    </div>
                )
            }
        </div >
    );
};

const mapStateToProps = state => ({
    userDetails: state.AppReducer.userDetails,
    globalSearchResult: state.AppReducer.globalSearchResult,
});
const mapDispatchToProps = {
    setGlobalSearchResult
};
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(GlobalSearch);
