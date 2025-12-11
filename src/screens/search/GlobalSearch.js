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

    return (
        <div className="flex flex-col h-full bg-gray-100 overflow-y-auto">
            {/* Sticky Header */}
            <div className="sticky top-0 z-10 bg-white shadow-sm">
                <div className="flex justify-center items-center p-2 relative">
                    <img
                        src="/assets/images/home.png"
                        alt="Home"
                        className="w-10 h-10 absolute left-2"
                    />
                    <span className="text-xl font-medium text-black">GLocal Search</span>
                    <div className="absolute right-2">
                        <MdFavoriteBorder size={30} color="rgb(137, 135, 135)" />
                    </div>
                </div>
                <div className="flex justify-center items-center bg-green-100 bg-opacity-20 p-2">
                    <span className="text-center text-sm text-black">Hi, {query}</span>
                </div>
            </div>

            <div className="p-4 flex flex-col gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">City where you want to search*</label>
                    <input
                        type="text"
                        placeholder="Enter city where customer wants property"
                        value={city}
                        onChange={e => setCity(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border text-black"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Add multiple locations within city</label>
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
                {/* Re-injecting the logic to call onSelectPlace correctly */}
                <div style={{ display: 'none' }}>
                    {/* Hidden logic to trigger selection handling if needed, but better to do it in the component props */}
                </div>
                {/* Correcting the component usage above in the next step if this block is just replacement */}
                <div className="flex flex-row flex-wrap gap-2 mt-2">
                    {selectedLocationArray.map((item, index) => (
                        <div key={index} className="flex items-center bg-teal-400 rounded-full px-3 py-1 text-white">
                            <span className="mr-2 truncate max-w-[100px]">{item.main_text}</span>
                            <button onClick={() => removeLocation(item)} className="text-red-600 font-bold">x</button>
                        </div>
                    ))}
                </div>
            </div>

            <div>
                <p className="p-2 bg-gray-200 font-bold text-black">What you are looking for</p>
                <div className="mt-2">
                    <CustomButtonGroup
                        buttons={lookingForOptions}
                        selectedIndices={[lookingForOptions.findIndex(option => option.text === lookingFor)]}
                        onButtonPress={selectWhatYouLookingFor}
                    />
                </div>
            </div>

            <div>
                <p className="p-2 bg-gray-200 font-bold text-black">What type</p>
                <div className="mt-2">
                    <CustomButtonGroup
                        buttons={whatTypeOptions}
                        selectedIndices={[whatTypeOptions.findIndex(option => option.text === whatType)]}
                        onButtonPress={selectWhatType}
                    />
                </div>
            </div>

            <div>
                <p className="p-2 bg-gray-200 font-bold text-black">What is purpose</p>
                <div className="mt-2">
                    <CustomButtonGroup
                        buttons={porposeForOptions}
                        selectedIndices={[porposeForOptions.findIndex(option => option.text === purpose)]}
                        onButtonPress={(index, button) => setPurpose(button.text)}
                    />
                </div>
            </div>

            {whatType.toLowerCase() === "residential" ? (
                <div>
                    <p className="p-2 bg-gray-200 font-bold text-black">BHK Size</p>
                    <div className="mt-2">
                        <CustomButtonGroup
                            buttons={bhkOption}
                            isMultiSelect={true}
                            selectedIndices={selectedBHK.map(item => bhkOption.findIndex(option => option.text === item))}
                            onButtonPress={selectBHK}
                        />
                    </div>
                </div>
            ) : (
                <>
                    <div>
                        <p className="p-2 bg-gray-200 font-bold text-black">Required For</p>
                        <div className="mt-2">
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
                            />
                        </div>
                    </div>
                    <div className="mt-4">
                        <p className="p-2 bg-gray-200 font-bold text-black">Building type</p>
                        <div className="mt-2">
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
                            />
                        </div>
                    </div>
                </>
            )}

            <div>
                <p className="p-2 bg-gray-200 font-bold text-black">Price Range</p>
                <div className="mt-2 px-2">
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
            </div>

            <div>
                <p className="p-2 bg-gray-200 font-bold text-black">Required with in</p>
                <div className="mt-2">
                    <CustomButtonGroup
                        buttons={reqWithinOptions}
                        selectedIndices={[reqWithinOptions.findIndex(option => option.text === reqWithin)]}
                        onButtonPress={(index, button) => setReqWithin(button.text)}
                    />
                </div>
            </div>

            {whatType.toLowerCase() === "residential" && (
                <div>
                    <p className="p-2 bg-gray-200 font-bold text-black">Preferd Tenants</p>
                    <div className="mt-2">
                        <CustomButtonGroup
                            buttons={tenantOptions}
                            selectedIndices={[tenantOptions.findIndex(option => option.text === tenant)]}
                            onButtonPress={(index, button) => setTenant(button.text)}
                        />
                    </div>
                </div>
            )}

            <div className="mt-5 mb-10">
                <button
                    onClick={onSubmit}
                    className="w-full bg-blue-500 text-white p-3 rounded hover:bg-blue-600 font-bold"
                >
                    Search
                </button>
            </div>


            {/* Loading Overlay */}
            {
                loading && (
                    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
                        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-white"></div>
                    </div>
                )
            }

            {/* Login Modal */}
            {
                modalVisible && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                        <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full">
                            <p className="text-lg mb-4">You are not logged in, please login.</p>
                            <div className="flex justify-end gap-2">
                                <button
                                    onClick={() => setModalVisible(false)}
                                    className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => {
                                        setModalVisible(false);
                                        navigation.navigate("Login");
                                    }}
                                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
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
                    <div className="fixed bottom-5 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-4 py-2 rounded shadow-lg flex items-center gap-2 z-50">
                        <span>{errorMessage}</span>
                        <button onClick={() => setIsVisible(false)} className="text-blue-300 font-bold">OK</button>
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
