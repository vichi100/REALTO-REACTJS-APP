import React, { useEffect, useState } from "react";
import { MdArrowBack } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import Slideshow from "./../../../../components/Slideshow";
import Button from "./../../../../components/Button";
import axios from "axios";
import { SERVER_URL } from "./../../../../utils/Constant";
import { numDifferentiation } from "./../../../../utils/methods";
import Snackbar from "./../../../../components/SnackbarComponent";
import { setPropertyDetails, setResidentialPropertyList, setStartNavigationPoint } from "./../../../../reducers/Action";
import { connect } from "react-redux";

const AddNewPropFinalDetails = props => {
    // const { navigation } = props; // Using useNavigate instead for consistency
    const navigation = useNavigate(); // Mapping to logical name used in component, or just use 'navigate'
    const navigate = useNavigate();
    const [isVisible, setIsVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [propertyFinalDetails, setPropertyFinalDetails] = useState(null);
    const [bhk, setBHK] = useState(null);
    const [possessionDate, setPossessionDate] = useState(null);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        if (propertyFinalDetails === null) {
            getPropFinalDetails();
        }
    }, [propertyFinalDetails]);

    useEffect(() => {
        if (propertyFinalDetails !== null) {
            let bhkTemp = propertyFinalDetails.property_details.bhk_type;
            if (bhkTemp.indexOf("RK") > -1) {
                setBHK(bhkTemp);
            } else {
                let x = bhkTemp.split("BHK");
                setBHK(x[0]);
            }
            const availableDateStr = propertyFinalDetails.rent_details.available_from;
            const availableDate = new Date(availableDateStr);
            const t = convert(availableDate);
            var today = new Date();
            const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
            const diffDays = Math.round((today - new Date(t)) / oneDay);
            if (diffDays >= 0) {
                setPossessionDate("Immediately");
            } else {
                setPossessionDate(availableDateStr);
            }
        }
    }, [propertyFinalDetails]);

    const getPropFinalDetails = async () => {
        const property = props.propertyDetails;
        setPropertyFinalDetails(property);
    };

    const convert = str => {
        var date = new Date(str),
            mnth = ("0" + (date.getMonth() + 1)).slice(-2),
            day = ("0" + date.getDate()).slice(-2);
        return [date.getFullYear(), mnth, day].join("-");
    };

    const dismissSnackBar = () => {
        setIsVisible(false);
    };

    const login = async () => {
        navigate("Login");
        setModalVisible(false);
    }

    const send = () => {
        if (props.userDetails === null) {
            console.log("You are not logged in, please login");
            setModalVisible(true);
            return;
        }
        setLoading(true);
        propertyFinalDetails.agent_id = props.userDetails.works_for;
        const data = new FormData();
        console.log("Preparing to upload images. Total images:", propertyFinalDetails.image_urls.length);
        propertyFinalDetails.image_urls.forEach((element, i) => {
            console.log(`Image ${i}:`, element);
            if (element.file) {
                console.log(`Appending file for image ${i}:`, element.file.name, element.file.size, element.file.type);
                data.append('prop_image_' + i, element.file);
            } else {
                console.warn(`No file object found for image ${i}, appending URL instead (this might fail):`, element.url);
                data.append('prop_image_' + i, element.url);
            }
        });

        data.append('propertyFinalDetails', JSON.stringify(propertyFinalDetails));

        axios(SERVER_URL + "/addNewResidentialRentProperty", {
            method: "post",
            headers: {
                Accept: 'application/json',
            },
            data: data
        })
            .then(
                response => {
                    console.log("Server Response:", response);
                    if (response.data !== null) {
                        let responseData = response.data;
                        if (typeof responseData === 'string') {
                            try {
                                responseData = JSON.parse(responseData);
                            } catch (e) {
                                console.error("Error parsing response data:", e);
                            }
                        }

                        if (responseData.image_urls && Array.isArray(responseData.image_urls)) {
                            responseData.image_urls.map(item => {
                                item.url = SERVER_URL + item.url
                            });
                        }

                        props.setPropertyDetails(null);
                        props.setResidentialPropertyList([...props.residentialPropertyList, responseData])
                        if (props.startNavigationPoint === null) {
                            navigate("Listing", { didDbCall: true });

                        } else {
                            navigate("PropertyListForMeeting");
                        }
                        props.setStartNavigationPoint(null);
                        setLoading(false);
                    } else {
                        setLoading(false);
                        setErrorMessage(
                            "Error: Seems there is some network issue, please try later"
                        );
                        setIsVisible(true);
                    }
                },
                error => {
                    setLoading(false)
                    console.log(error);
                    setErrorMessage("Error: " + error.message);
                    setIsVisible(true);
                }
            ).catch(error => {
                setLoading(false);
                console.error("Error in success handler:", error);
                setErrorMessage("Error processing response: " + error.message);
                setIsVisible(true);
            });
    };

    return (propertyFinalDetails ? (
        <div className="flex flex-col h-full bg-white overflow-y-auto">
            <div className="bg-white px-4 py-3 flex items-center shadow-sm border-b border-gray-200">
                <button
                    onClick={() => navigate(-1)}
                    className="mr-3 p-1 rounded-full hover:bg-gray-100 focus:outline-none"
                    aria-label="Go back"
                >
                    <MdArrowBack className="text-gray-700 text-xl" />
                </button>
                <h1 className="text-lg font-medium text-gray-900">Preview Property</h1>
            </div>
            <div className="bg-gray-200 p-4">
                <h2 className="text-xl font-bold text-black">
                    {"Rent In "}{propertyFinalDetails.property_address.flat_number},
                    {propertyFinalDetails.property_address.building_name},
                </h2>
                <p className="text-base text-gray-900 font-medium">
                    {propertyFinalDetails.property_address.landmark_or_street},
                    {propertyFinalDetails.property_address.location_area.formatted_address}
                </p>
            </div>

            <Slideshow
                dataSource={propertyFinalDetails.image_urls || []}
                height={300}
            />

            <div className="border-t border-gray-300 bg-gray-100 p-4">
                <div className="flex justify-between">
                    <div className="text-center">
                        <p className="text-xl font-bold text-black">{bhk}</p>
                        <p className="text-sm text-gray-900 font-medium">BHK</p>
                    </div>
                    <div className="w-px bg-gray-400 h-full mx-2"></div>
                    <div className="text-center">
                        <p className="text-xl font-bold text-black">
                            {numDifferentiation(propertyFinalDetails.rent_details.expected_rent)}
                        </p>
                        <p className="text-sm text-gray-900 font-medium">{propertyFinalDetails.property_for}</p>
                    </div>
                    <div className="w-px bg-gray-400 h-full mx-2"></div>
                    <div className="text-center">
                        <p className="text-xl font-bold text-black">
                            {numDifferentiation(propertyFinalDetails.rent_details.expected_deposit)}
                        </p>
                        <p className="text-sm text-gray-900 font-medium">Deposit</p>
                    </div>
                    <div className="w-px bg-gray-400 h-full mx-2"></div>
                    <div className="text-center">
                        <p className="text-xl font-bold text-black">
                            {propertyFinalDetails.property_details.furnishing_status}
                        </p>
                        <p className="text-sm text-gray-900 font-medium">Furnishing</p>
                    </div>
                    <div className="w-px bg-gray-400 h-full mx-2"></div>
                    <div className="text-center">
                        <p className="text-xl font-bold text-black">
                            {propertyFinalDetails.property_details.property_size}sqft
                        </p>
                        <p className="text-sm text-gray-900 font-medium">Builtup</p>
                    </div>
                </div>
            </div>

            <div className="mt-2 bg-white shadow-md">
                <div className="p-4 border-b border-gray-200">
                    <h3 className="text-lg font-bold text-black">Details</h3>
                </div>
                <div className="flex justify-between p-4">
                    <div className="flex flex-col space-y-6 w-1/2">
                        <div>
                            <p className="text-lg font-bold text-black">{propertyFinalDetails.property_details.washroom_numbers}</p>
                            <p className="text-sm text-gray-900 font-medium">Bathroom</p>
                        </div>
                        <div>
                            <p className="text-lg font-bold text-black">{possessionDate}</p>
                            <p className="text-sm text-gray-900 font-medium">Possession</p>
                        </div>
                        <div>
                            <p className="text-lg font-bold text-black">{propertyFinalDetails.rent_details.preferred_tenants}</p>
                            <p className="text-sm text-gray-900 font-medium">Preferred Tenant</p>
                        </div>
                        <div>
                            <p className="text-lg font-bold text-black">{propertyFinalDetails.property_details.lift}</p>
                            <p className="text-sm text-gray-900 font-medium">Lift</p>
                        </div>
                    </div>
                    <div className="flex flex-col space-y-6 w-1/2">
                        <div>
                            <p className="text-lg font-bold text-black">
                                {propertyFinalDetails.property_details.parking_number} {propertyFinalDetails.property_details.parking_type}
                            </p>
                            <p className="text-sm text-gray-900 font-medium">Parking</p>
                        </div>
                        <div>
                            <p className="text-lg font-bold text-black">
                                {propertyFinalDetails.property_details.floor_number}/{propertyFinalDetails.property_details.total_floor}
                            </p>
                            <p className="text-sm text-gray-900 font-medium">Floor</p>
                        </div>
                        <div>
                            <p className="text-lg font-bold text-black">{propertyFinalDetails.rent_details.non_veg_allowed}</p>
                            <p className="text-sm text-gray-900 font-medium">NonVeg</p>
                        </div>
                        <div>
                            <p className="text-lg font-bold text-black">{propertyFinalDetails.property_details.property_age}</p>
                            <p className="text-sm text-gray-900 font-medium">Age Of Building</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-2 bg-white shadow-md">
                <div className="p-4 border-b border-gray-200">
                    <h3 className="text-lg font-bold text-black">Owner</h3>
                </div>
                <div className="p-4">
                    <p className="text-lg font-medium text-black">{propertyFinalDetails.owner_details.name}</p>
                    <p className="text-base text-gray-800">{propertyFinalDetails.owner_details.address}</p>
                    <p className="text-base text-gray-800">+91 {propertyFinalDetails.owner_details.mobile1}</p>
                </div>
            </div>

            <div className="p-4">
                <Button title="ADD" onPress={send} />
            </div>

            <Snackbar
                visible={isVisible}
                textMessage={errorMessage}
                actionHandler={dismissSnackBar}
                actionText="OK"
            />

            {loading && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-white"></div>
                </div>
            )}

            {modalVisible && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
                        <p className="text-center mb-4 font-semibold">You are not logged in, please login.</p>
                        <div className="flex justify-end space-x-4">
                            <button
                                className="px-4 py-2 text-gray-600 hover:text-gray-800"
                                onClick={() => setModalVisible(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                onClick={login}
                            >
                                Login
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    ) : null);
};

const mapStateToProps = state => ({
    propertyDetails: state.AppReducer.propertyDetails,
    userDetails: state.AppReducer.userDetails,
    residentialPropertyList: state.AppReducer.residentialPropertyList,
    startNavigationPoint: state.AppReducer.startNavigationPoint
});

const mapDispatchToProps = {
    setPropertyDetails,
    setResidentialPropertyList,
    setStartNavigationPoint
};

export default connect(mapStateToProps, mapDispatchToProps)(AddNewPropFinalDetails);
