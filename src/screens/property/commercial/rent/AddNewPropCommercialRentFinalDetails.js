import React, { useState, useEffect } from "react";
import { MdArrowBack } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import Slideshow from "./../../../../components/Slideshow";
import Button from "./../../../../components/Button";
import axios from "axios";
import { SERVER_URL } from "./../../../../utils/Constant";
import { numDifferentiation, dateFormat } from "./../../../../utils/methods";
import { connect } from "react-redux";
import { setPropertyDetails, setCommercialPropertyList, setStartNavigationPoint } from "./../../../../reducers/Action";
import Snackbar from "./../../../../components/SnackbarComponent";

const AddNewPropCommercialRentFinalDetails = props => {
    const navigate = useNavigate();
    const [propertyFinalDetails, setPropertyFinalDetails] = useState(null);
    const [loading, setLoading] = useState(false);

    const [errorMessage, setErrorMessage] = useState("");
    const [isVisible, setIsVisible] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        getPropFinalDetails();
    }, []);

    const getPropFinalDetails = async () => {
        const property = props.propertyDetails
        setPropertyFinalDetails(property);
    };

    const dismissSnackBar = () => {
        setIsVisible(false);
    };

    const login = async () => {
        navigate("/Login");
        setModalVisible(false);
    }

    const send = () => {
        if (props.userDetails === null) {
            setModalVisible(true);
            return;
        }
        setLoading(true);
        propertyFinalDetails.agent_id = props.userDetails.works_for;
        const data = new FormData();
        propertyFinalDetails.image_urls.forEach((element, i) => {
            const newFile = {
                uri: element.url,
                name: `vichi`,
                type: `image/jpeg`,
            }
            data.append('prop_image_' + i, newFile)
        });

        data.append('propertyFinalDetails', JSON.stringify(propertyFinalDetails));

        axios(SERVER_URL + "/addNewCommercialProperty", {
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

                        props.setPropertyDetails(null);
                        props.setCommercialPropertyList([...props.commercialPropertyList, responseData])
                        if (props.startNavigationPoint === null) {
                            navigate("/listing/commercial", { state: { didDbCall: true } });

                        } else {
                            navigate("/PropertyListForMeeting");
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
            {/* Top Navigation Bar */}
            <div className="bg-white px-4 py-3 flex items-center justify-between border-b border-gray-200 sticky top-0 z-10">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center text-gray-500 hover:text-gray-700 focus:outline-none"
                    aria-label="Go back"
                >
                    <MdArrowBack className="text-xl mr-1" />
                    <span className="text-base font-medium">Add Images</span>
                </button>
                <h1 className="text-lg font-bold text-gray-500 absolute left-1/2 transform -translate-x-1/2">
                    Final Details
                </h1>
                <div className="w-20"></div> {/* Spacer to balance the layout if needed, or empty */}
            </div>

            {/* Property Title & Address Header */}
            <div className="bg-gray-300 px-4 py-4 flex flex-col items-start">
                <h2 className="text-base font-bold text-gray-900 mb-1">
                    {propertyFinalDetails.property_details.property_used_for} {"For Rent In "}
                    {propertyFinalDetails.property_address.building_name},
                </h2>
                <p className="text-sm text-gray-800">
                    {propertyFinalDetails.property_address.landmark_or_street},
                    {propertyFinalDetails.property_address.location_area.formatted_address}
                </p>
            </div>

            <Slideshow
                dataSource={propertyFinalDetails.image_urls}
            />

            <div className="border-t border-gray-300 bg-gray-100 p-4">
                <div className="flex justify-between items-center text-center">
                    <div className="flex flex-col">
                        <span className="text-xl font-bold text-gray-900">
                            {propertyFinalDetails.property_details.property_used_for}
                        </span>
                        <span className="text-sm text-gray-500 font-medium">Prop Type</span>
                    </div>
                    <div className="w-px bg-gray-400 h-10 mx-4"></div>
                    <div className="flex flex-col">
                        <span className="text-xl font-bold text-gray-900">
                            {numDifferentiation(
                                propertyFinalDetails.rent_details.expected_rent
                            )}
                        </span>
                        <span className="text-sm text-gray-500 font-medium">
                            {propertyFinalDetails.property_for}
                        </span>
                    </div>
                    <div className="w-px bg-gray-400 h-10 mx-4"></div>
                    <div className="flex flex-col">
                        <span className="text-xl font-bold text-gray-900">
                            {numDifferentiation(
                                propertyFinalDetails.rent_details.expected_deposit
                            )}
                        </span>
                        <span className="text-sm text-gray-500 font-medium">Deposit</span>
                    </div>
                    <div className="w-px bg-gray-400 h-10 mx-4"></div>
                    <div className="flex flex-col">
                        <span className="text-xl font-bold text-gray-900">
                            {propertyFinalDetails.property_details.property_size}sqft
                        </span>
                        <span className="text-sm text-gray-500 font-medium">Builtup</span>
                    </div>
                </div>
            </div>

            <div className="mt-2 bg-white px-4 pt-4">
                <div className="pb-2 border-b border-gray-100">
                    <h3 className="text-sm font-medium text-gray-900">Details</h3>
                </div>
                <div className="flex justify-between py-4">
                    <div className="flex flex-col space-y-4 w-1/2">
                        <div>
                            <p className="text-base font-bold text-gray-900">
                                {propertyFinalDetails.property_details.building_type}
                            </p>
                            <p className="text-xs text-gray-600">Building Type</p>
                        </div>
                        <div>
                            <p className="text-base font-bold text-gray-900">
                                {dateFormat(propertyFinalDetails.rent_details.available_from)}
                            </p>
                            <p className="text-xs text-gray-600">Possession</p>
                        </div>
                        <div>
                            <p className="text-base font-bold text-gray-900">
                                {propertyFinalDetails.property_details.ideal_for.join(", ")}
                            </p>
                            <p className="text-xs text-gray-600">Ideal For</p>
                        </div>
                        <div>
                            <p className="text-base font-bold text-gray-900">
                                {propertyFinalDetails.property_details.power_backup}
                            </p>
                            <p className="text-xs text-gray-600">Power Backup</p>
                        </div>
                    </div>
                    <div className="flex flex-col space-y-4 w-1/2 items-end text-right">
                        <div>
                            <p className="text-base font-bold text-gray-900">
                                {propertyFinalDetails.property_details.parking_type}
                            </p>
                            <p className="text-xs text-gray-600">Parking</p>
                        </div>
                        <div>
                            <p className="text-base font-bold text-gray-900">
                                {propertyFinalDetails.property_details.property_age}
                            </p>
                            <p className="text-xs text-gray-600">Age Of Building</p>
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

            <div className="p-4 mt-8 pb-8">
                <Button title="ADD" onPress={() => send()} />
            </div>

            <Snackbar
                visible={isVisible}
                textMessage={errorMessage}
                position={"top"}
                actionHandler={() => dismissSnackBar()}
                actionText="OK"
            />
            {loading && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="text-white">Loading...</div>
                </div>
            )}

            {modalVisible && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white rounded-lg p-6 shadow-xl w-80 flex flex-col items-center">
                        <span className="text-center font-bold mb-4">
                            You are not logged in, please login.
                        </span>
                        <div className="flex justify-end w-full gap-4 mt-4">
                            <button
                                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                                onClick={() => {
                                    setModalVisible(!modalVisible);
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                onClick={() => {
                                    login();
                                }}
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
    commercialPropertyList: state.AppReducer.commercialPropertyList,
    startNavigationPoint: state.AppReducer.startNavigationPoint
});
const mapDispatchToProps = {
    setPropertyDetails,
    setCommercialPropertyList,
    setStartNavigationPoint
};
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AddNewPropCommercialRentFinalDetails);
