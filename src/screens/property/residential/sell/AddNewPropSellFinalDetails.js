import React, { useEffect, useState } from "react";
import Slideshow from "./../../../../components/Slideshow";
import Button from "./../../../../components/Button";
import axios from "axios";
import { SERVER_URL } from "./../../../../utils/Constant";
import { numDifferentiation } from "./../../../../utils/methods";
import { connect } from "react-redux";
import { setPropertyDetails, setResidentialPropertyList, setStartNavigationPoint } from "./../../../../reducers/Action";

const AddNewPropSellFinalDetails = props => {
    const { navigation } = props;
    const [propertyFinalDetails, setPropertyFinalDetails] = useState(null);
    const [bhk, setBHK] = useState(null);
    const [possessionDate, setPossessionDate] = useState(null);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        getPropFinalDetails();
    }, []);

    useEffect(() => {
        if (propertyFinalDetails !== null) {
            let bhkTemp = propertyFinalDetails.property_details.bhk_type;
            if (bhkTemp.indexOf("RK") > -1) {
                setBHK(bhkTemp);
            } else {
                let x = bhkTemp.split("BHK");
                setBHK(x[0]);
            }
            const availableDateStr = propertyFinalDetails.sell_details.available_from;
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
        const property = props.propertyDetails
        setPropertyFinalDetails(property);
    };

    const convert = str => {
        var date = new Date(str),
            mnth = ("0" + (date.getMonth() + 1)).slice(-2),
            day = ("0" + date.getDate()).slice(-2);
        return [date.getFullYear(), mnth, day].join("-");
    };

    const login = async () => {
        navigation.navigate("Login");
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
        propertyFinalDetails.image_urls.forEach((element, i) => {
            // In a real web app, you'd handle file uploads differently, 
            // likely by sending the file object directly or a base64 string.
            // For now, we'll assume the URL is sufficient or needs to be handled as per backend requirements for web.
            // If these are local file URIs from a file picker, they need to be converted to Blobs.
            // Since this is a conversion, we might need to adjust how images are passed.
            // Assuming element.url is a valid URL or blob URI.
            data.append('prop_image_' + i, element.file || element.url);
        });

        data.append('propertyFinalDetails', JSON.stringify(propertyFinalDetails));
        propertyFinalDetails.agent_id = props.userDetails.works_for;

        axios(SERVER_URL + "/addNewResidentialRentProperty", {
            method: "post",
            headers: {
                Accept: 'application/json',
            },
            data: data
        })
            .then(
                response => {
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

                        props.setPropertyDetails(null)
                        props.setResidentialPropertyList([...props.residentialPropertyList, responseData])
                        if (props.startNavigationPoint === null) {
                            navigation.navigate("Listing", { didDbCall: true });

                        } else {
                            navigation.navigate("PropertyListForMeeting");
                        }
                        props.setStartNavigationPoint(null)
                        setLoading(false)
                    } else {
                        setLoading(false)
                        setErrorMessage(
                            "Error: Seems there is some network issue, please try later"
                        );
                    }
                },
                error => {
                    setLoading(false)
                    console.log(error);
                }
            );
    };

    return propertyFinalDetails ? (
        <div className="flex flex-col h-full bg-white overflow-y-auto">
            <div className="bg-gray-200 p-4">
                <h2 className="text-lg font-semibold">
                    {"Sell Off "}{propertyFinalDetails.property_address.flat_number},
                    {propertyFinalDetails.property_address.building_name},
                </h2>
                <p className="text-sm text-gray-600">
                    {propertyFinalDetails.property_address.landmark_or_street},
                    {propertyFinalDetails.property_address.location_area.formatted_address}
                </p>
            </div>

            <Slideshow
                dataSource={propertyFinalDetails.image_urls}
            />

            <div className="border-t border-gray-300 bg-gray-100 p-4">
                <div className="flex justify-between">
                    <div className="text-center">
                        <p className="text-sm font-semibold text-center">{propertyFinalDetails.property_details.bhk_type}</p>
                    </div>
                    <div className="w-px bg-gray-400 h-full mx-2"></div>
                    <div className="text-center">
                        <p className="text-sm font-semibold">
                            {numDifferentiation(propertyFinalDetails.sell_details.expected_sell_price)}
                        </p>
                        <p className="text-xs text-gray-500">{propertyFinalDetails.property_for}</p>
                    </div>
                    <div className="w-px bg-gray-400 h-full mx-2"></div>
                    <div className="text-center">
                        <p className="text-sm font-semibold">
                            {propertyFinalDetails.property_details.property_size}
                        </p>
                        <p className="text-xs text-gray-500">Builtup</p>
                    </div>
                    <div className="w-px bg-gray-400 h-full mx-2"></div>
                    <div className="text-center">
                        <p className="text-sm font-semibold">
                            {propertyFinalDetails.property_details.furnishing_status}
                        </p>
                        <p className="text-xs text-gray-500">Furnishing</p>
                    </div>
                </div>
            </div>

            <div className="mt-2 bg-white shadow-md">
                <div className="p-4 border-b border-gray-200">
                    <h3 className="text-md font-semibold">Details</h3>
                </div>
                <div className="flex justify-between p-4">
                    <div className="flex flex-col space-y-4 w-1/2">
                        <div>
                            <p className="text-sm font-semibold">{propertyFinalDetails.property_details.washroom_numbers}</p>
                            <p className="text-xs text-gray-500">Bathroom</p>
                        </div>
                        <div>
                            <p className="text-sm font-semibold">{possessionDate}</p>
                            <p className="text-xs text-gray-500">Possession</p>
                        </div>
                        <div>
                            <p className="text-sm font-semibold">
                                {numDifferentiation(propertyFinalDetails.sell_details.maintenance_charge)}
                            </p>
                            <p className="text-xs text-gray-500">Maintenance charge</p>
                        </div>
                        <div>
                            <p className="text-sm font-semibold">{propertyFinalDetails.property_details.lift}</p>
                            <p className="text-xs text-gray-500">Lift</p>
                        </div>
                    </div>
                    <div className="flex flex-col space-y-4 w-1/2">
                        <div>
                            <p className="text-sm font-semibold">
                                {propertyFinalDetails.property_details.parking_number}{" "}
                                {propertyFinalDetails.property_details.parking_type}
                            </p>
                            <p className="text-xs text-gray-500">Parking</p>
                        </div>
                        <div>
                            <p className="text-sm font-semibold">
                                {propertyFinalDetails.property_details.floor_number}/{propertyFinalDetails.property_details.total_floor}
                            </p>
                            <p className="text-xs text-gray-500">Floor</p>
                        </div>
                        <div>
                            <p className="text-sm font-semibold">{propertyFinalDetails.sell_details.negotiable}</p>
                            <p className="text-xs text-gray-500">Negotiable</p>
                        </div>
                        <div>
                            <p className="text-sm font-semibold">{propertyFinalDetails.property_details.property_age}</p>
                            <p className="text-xs text-gray-500">Age Of Building</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-2 bg-white shadow-md">
                <div className="p-4 border-b border-gray-200">
                    <h3 className="text-md font-semibold">Owner</h3>
                </div>
                <div className="p-4">
                    <p>{propertyFinalDetails.owner_details.name}</p>
                    <p>{propertyFinalDetails.owner_details.address}</p>
                    <p>+91 {propertyFinalDetails.owner_details.mobile1}</p>
                </div>
            </div>

            <div className="p-4">
                <Button title="ADD" onPress={send} />
            </div>

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
    ) : null;
};

const mapStateToProps = state => ({
    userDetails: state.AppReducer.userDetails,
    propertyType: state.AppReducer.propertyType,
    propertyDetails: state.AppReducer.propertyDetails,
    residentialPropertyList: state.AppReducer.residentialPropertyList,
    startNavigationPoint: state.AppReducer.startNavigationPoint
});
const mapDispatchToProps = {
    setPropertyDetails,
    setResidentialPropertyList,
    setStartNavigationPoint
};
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AddNewPropSellFinalDetails);
