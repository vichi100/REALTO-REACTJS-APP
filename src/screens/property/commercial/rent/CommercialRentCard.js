import React, { useState, useEffect } from "react";
import DoughnutChart from "./../../../../components/DoughnutChart";
import {
    MdChevronLeft,
    MdClose,
    MdShare,
    MdAlarm,
    MdCall,
    MdPersonAdd,
    MdMessage,
    MdCheckBox,
    MdCheckBoxOutlineBlank
} from "react-icons/md";
import axios from "axios";
import Slideshow from "./../../../../components/Slideshow";
import { numDifferentiation } from "././../../../../utils/methods";
import { connect } from "react-redux";
import {
    setPropertyDetails,
    setCustomerDetailsForMeeting,
    setStartNavigationPoint,
    setPropListForMeeting
} from "./../../../../reducers/Action";
import { SERVER_URL } from "./../../../../utils/Constant";
import { EMPLOYEE_ROLE_DELETE } from "././../../../../utils/AppConstant";
import { makeCall } from "../../../../utils/methods";

const Card = props => {
    const {
        navigation,
        item,
        disableDrawer = false,
        displayCheckBox = false,
        displayChat,
        deleteMe,
        closeMe,
        displayMatchCount = true,
        displayMatchPercent = false,
        displayCheckBoxForEmployee = false,
        employeeObj = null,
    } = props;

    const [modalVisible, setModalVisible] = useState(false);
    const [chatModalVisible, setChatModalVisible] = useState(false);
    const [refresh, setRefresh] = useState(false);
    const [drawerOpen, setDrawerOpen] = useState(false);

    const [Sliding_Drawer_Width, setSlidingDrawerWidth] = useState(250);
    const [Sliding_Drawer_Width_WO_Delete, setSlidingDrawerWidthWODelete] = useState(195);

    const isPropertyClosed = item && item.property_status === 0;

    const canDelete = props.userDetails &&
        ((props.userDetails.works_for === props.userDetails.id) ||
            (props.userDetails.user_type === "employee" && EMPLOYEE_ROLE_DELETE.includes(props.userDetails.employee_role)))

    const canAddDelete = true;
    const slidingDrawerWidth = canAddDelete
        ? Sliding_Drawer_Width
        : Sliding_Drawer_Width_WO_Delete;

    useEffect(() => {
        if (item && item.agent_id === props.userDetails.works_for) {
            setSlidingDrawerWidth(250);
        } else {
            setSlidingDrawerWidth(195);
        }
    }, [item, props.userDetails.works_for]);

    const ShowSlidingDrawer = () => {
        setDrawerOpen(!drawerOpen);
    };

    const gotoEmployeeList = itemForAddEmplyee => {
        props.setPropertyDetails(itemForAddEmplyee);
        navigation.navigate("EmployeeListOfListing", {
            itemForAddEmplyee: itemForAddEmplyee,
            disableDrawer: true,
            displayCheckBox: true,
        });
    }

    const [message, setMessage] = React.useState(
        "I have customer for this property. Please call me. "
    );

    const onChat = () => {
        setChatModalVisible(true);
    };

    const sendMessage = () => {
        const sender_details = {
            id: props.userDetails.id,
            name: props.userDetails.name,
            mobile: props.userDetails.mobile,
            city: props.userDetails.city,
            company_name: props.userDetails.company_name
        };
        const receiver_details = {
            id: item.agent_id
        };
        const subject = {
            subject_id: item.property_id,
            subject_category: "property",
            subject_type: item.property_type,
            subject_for: item.property_for,
            city: item.property_address.city,
            location_area: item.property_address.location_area
        };

        const messageDetails = {
            req_user_id: props.userDetails.works_for,
            sender_details: sender_details,
            receiver_details: receiver_details,
            subject: subject,
            message: message
        };

        axios(SERVER_URL + "/sendMessage", {
            method: "post",
            headers: {
                "Content-type": "Application/json",
                Accept: "Application/json"
            },
            data: messageDetails
        }).then(
            response => {
                props.setCommercialCustomerList(response.data);
            },
            error => {
                console.log(error);
            }
        );
        setChatModalVisible(false);
    };

    const onShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'Realto AI',
                    text: 'Check out this property!',
                    url: window.location.href,
                });
            } catch (error) {
                console.log('Error sharing:', error);
            }
        } else {
            alert("Share not supported");
        }
    };

    const isAssetChecked = (item) => {
        if (item.assigned_to_employee && Array.isArray(item.assigned_to_employee)) {
            return item.assigned_to_employee.includes(employeeObj.id);
        }
        return false;
    };

    const onClickCheckBoxForEmployee = (itemForAddEmplyee) => {
        const wasChecked = isAssetChecked(itemForAddEmplyee);
        const item = employeeObj;
        let operation = "add";
        if (wasChecked) {
            operation = "remove";
        }

        const {
            assigned_residential_rent_properties,
        } = item;

        let isProperty = false;
        let isCustomer = false;
        if (!itemForAddEmplyee || !itemForAddEmplyee.property_id) {
            isCustomer = true;
        } else if (!itemForAddEmplyee || !itemForAddEmplyee.customer_id) {
            isProperty = true;
        }

        let isForRent = false;
        let isForSell = false;
        let isCommercial = false;
        let isResidential = false;

        if (isProperty) {
            isForRent = itemForAddEmplyee.property_for === "Rent";
            isForSell = itemForAddEmplyee.property_for === "Sell" || itemForAddEmplyee.property_for === "Buy";

            isCommercial = itemForAddEmplyee.property_type === "Commercial";
            isResidential = itemForAddEmplyee.property_type === "Residential";

            if (isCommercial && isForRent) {
                toggleSelection(employeeObj, itemForAddEmplyee);
            }
        }

        const whatToUpdateData = {
            isProperty: isProperty,
            isCustomer: isCustomer,
            isForRent: isForRent,
            isForSell: isForSell,
            isCommercial: isCommercial,
            isResidential: isResidential,
            customer_id: itemForAddEmplyee.customer_id || null,
            property_id: itemForAddEmplyee.property_id || null,
        }
        const isUpdated = updatePropertiesForEmployee(item, whatToUpdateData, operation);
        if (!isUpdated) {
            toggleSelection(assigned_residential_rent_properties, itemForAddEmplyee.property_id);
            itemForAddEmplyee.assigned_to_employee.push(item.id);
            itemForAddEmplyee.assigned_to_employee_name.push(item.name);
        }

        setRefresh(!refresh);
    };

    const toggleSelection = (employeeObj, itemForAddEmplyee) => {
        const list = itemForAddEmplyee.assigned_to_employee;
        const id = employeeObj.id;
        const index = list.indexOf(id);
        if (index > -1) {
            list.splice(index, 1);
        } else {
            list.push(id);
        }
    };

    const updatePropertiesForEmployee = async (item, whatToUpdateData, operation) => {
        const userObj = {
            req_user_id: props.userDetails.works_for,
            employee_id: item.id,
            employee_name: item.name,
            operation: operation,
            what_to_update_data: whatToUpdateData,
            user_data: item,
        }
        try {
            axios(SERVER_URL + "/updatePropertiesForEmployee", {
                method: "post",
                headers: {
                    "Content-type": "Application/json",
                    Accept: "Application/json"
                },
                data: userObj
            }).then(
                response => {
                    if (response.data === "success") {
                        return true;
                    } else {
                        return false;
                    }
                },
                error => {
                    console.log(error);
                }
            );
        } catch (error) {
            console.error('Failed to fetch user:', error);
        }
    };

    const onClickCheckBox = item => {
        const name =
            item.property_for +
            " in " +
            item.property_address.building_name +
            ", " +
            item.property_address.landmark_or_street;

        const obj = {
            id: item.property_id,
            name: name
        };

        if (props.propListForMeeting.some(y => y.id === item.property_id)) {
            const x = props.propListForMeeting.filter(z => z.id !== item.property_id);
            props.setPropListForMeeting(x);
        } else {
            const x = [obj, ...props.propListForMeeting];
            props.setPropListForMeeting(x);
        }
    };

    const onClickMeeting = item => {
        props.setCustomerDetailsForMeeting(null);
        props.setPropertyDetails(item);
        navigation.navigate("Meeting", {
            item: item,
            category: "property"
        });
        props.setStartNavigationPoint("CustomerListForMeeting");
    };

    const getMatched = (matchedProprtyItem) => {
        navigation.navigate('MatchedCustomers', { matchedProprtyItem: matchedProprtyItem },);
    }

    return (
        <div className={`bg-white shadow-md mb-2 rounded-lg overflow-hidden ${isPropertyClosed ? 'opacity-60 bg-gray-200' : ''}`}>
            <Slideshow
                dataSource={item.image_urls}
            />

            <div className="flex flex-row relative">
                {/* Match Badge Container */}
                {displayMatchCount && (
                    <div className="w-10 relative flex-shrink-0" onClick={(e) => { e.stopPropagation(); getMatched(item); }} style={{ cursor: 'pointer' }}>
                        {/* Orange Count Box */}
                        <div className="bg-orange-400 w-8 h-8 flex items-center justify-center absolute top-0 left-0 z-10">
                            <span className="text-sm font-bold text-black">{item.match_count || 0}</span>
                        </div>
                        {/* Green Match Strip */}
                        <div className="bg-green-400 w-8 h-24 flex items-center justify-center absolute top-4 left-0 pt-6">
                            <span className="text-xs font-medium text-black transform -rotate-90 whitespace-nowrap">Match</span>
                        </div>
                    </div>
                )}

                {displayMatchPercent && (
                    <div className="flex items-center justify-center pl-2">
                        <DoughnutChart
                            data={[
                                Math.max(0, Number(
                                    typeof item.matched_percentage === 'number'
                                        ? item.matched_percentage
                                        : typeof item.matched_percentage === 'string'
                                            ? parseFloat(item.matched_percentage) || 0
                                            : 0
                                )),
                                100 - Math.max(0, Number(
                                    typeof item.matched_percentage === 'number'
                                        ? item.matched_percentage
                                        : typeof item.matched_percentage === 'string'
                                            ? parseFloat(item.matched_percentage) || 0
                                            : 0
                                ))
                            ]}
                            radius={35}
                            holeRadius={25}
                            strokeWidth={60}
                            colors={['rgba(38, 208, 109, 0.8)', 'rgba(211, 61, 24, 0.6)']}
                            textColor="#333"
                            textSize={14}
                            showPercentage={true}
                        />
                    </div>
                )}

                {/* Details Section */}
                <div className="flex-1 py-2 pl-2 pr-12">
                    <h3 className="text-base font-bold text-black leading-tight">
                        {`Rent In ${item.property_address.building_name?.trim() || ""} ${item.property_address.landmark_or_street?.trim() || ""}`}
                    </h3>
                    <p className="text-sm text-gray-900 mt-1">
                        {item.property_address.formatted_address}
                    </p>
                    <p className="text-sm text-black mt-1">
                        Reference id: {item.property_id?.slice(-6)}
                    </p>

                    {/* Employee Info */}
                    <div className="flex flex-row items-center mt-2">
                        <MdPersonAdd size={18} className="text-black mr-2" />
                        <span className="text-sm text-gray-900">
                            {Array.isArray(item.assigned_to_employee_name) && item.assigned_to_employee_name.length > 0
                                ? item.assigned_to_employee_name.join(", ")
                                : "No Employees Assigned"}
                        </span>
                    </div>
                </div>

                {displayCheckBox && (
                    <div
                        className="w-10 flex items-center justify-center absolute right-0 top-0 bottom-0 cursor-pointer z-30 bg-white"
                        onClick={(e) => {
                            e.stopPropagation();
                            onClickCheckBox(item);
                        }}
                    >
                        <input
                            type="checkbox"
                            onChange={(e) => {
                                e.stopPropagation();
                                onClickCheckBox(item);
                            }}
                            onClick={(e) => e.stopPropagation()}
                            checked={props.propListForMeeting.some(y => y.id === item.property_id)}
                            style={{
                                margin: 10,
                                transform: 'scale(1.5)',
                                cursor: 'pointer'
                            }}
                        />
                    </div>
                )}

                {displayCheckBoxForEmployee && (
                    <div
                        className="w-10 flex items-center justify-center absolute right-0 top-0 bottom-0 cursor-pointer z-30 bg-white"
                        onClick={(e) => {
                            e.stopPropagation();
                            onClickCheckBoxForEmployee(item);
                        }}
                    >
                        <input
                            type="checkbox"
                            onChange={(e) => {
                                e.stopPropagation();
                                onClickCheckBoxForEmployee(item);
                            }}
                            onClick={(e) => e.stopPropagation()}
                            checked={isAssetChecked(item)}
                            style={{
                                margin: 10,
                                transform: 'scale(1.5)',
                                cursor: 'pointer'
                            }}
                        />
                    </div>
                )}

                {!displayCheckBox && !displayCheckBoxForEmployee && !disableDrawer && (
                    <div
                        className="w-10 bg-gray-600 flex items-center justify-center absolute right-0 top-0 bottom-0 cursor-pointer z-20"
                        onClick={(e) => {
                            e.stopPropagation();
                            ShowSlidingDrawer();
                        }}
                    >
                        <MdChevronLeft color="white" size={24} />
                    </div>
                )}

                {!disableDrawer && (
                    <div className={`absolute top-0 right-0 h-full bg-white transition-transform duration-300 z-50 flex flex-row ${drawerOpen ? 'translate-x-0' : 'translate-x-full'}`} style={{ width: 'auto' }}>
                        {/* Back Arrow Strip */}
                        <div
                            onClick={(e) => { e.stopPropagation(); ShowSlidingDrawer(); }}
                            className="w-10 bg-gray-600 flex items-center justify-center cursor-pointer h-full"
                        >
                            <MdChevronLeft color={"#ffffff"} size={30} />
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-row h-full">
                            {(item.agent_id === props.userDetails.works_for && canAddDelete) && (
                                <div onClick={(e) => { e.stopPropagation(); setModalVisible(true); }} className="w-16 h-full bg-red-400 flex items-center justify-center cursor-pointer">
                                    <MdClose color={"#ffffff"} size={30} />
                                </div>
                            )}

                            <div onClick={(e) => { e.stopPropagation(); onShare(item); }} className="w-16 h-full bg-blue-500 flex items-center justify-center cursor-pointer">
                                <MdShare color={"#ffffff"} size={26} />
                            </div>

                            <div onClick={(e) => { e.stopPropagation(); onClickMeeting(item); }} className="w-16 h-full bg-yellow-400 flex items-center justify-center cursor-pointer">
                                <MdAlarm color={"#ffffff"} size={30} />
                            </div>

                            <div onClick={(e) => { e.stopPropagation(); makeCall(item.owner_details.mobile1); }} className="w-16 h-full bg-teal-500 flex items-center justify-center cursor-pointer">
                                <MdCall color={"#ffffff"} size={30} />
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Bottom Stats Row */}
            <div className="border-t border-gray-200 py-3 px-2">
                <div className="flex flex-row justify-between items-center text-center">
                    {/* Prop Type */}
                    <div className="flex-1 border-r border-gray-300">
                        <span className="text-sm font-bold block text-black">{item.property_details.property_used_for}</span>
                        <span className="text-xs text-gray-500 block">Prop Type</span>
                    </div>
                    {/* Rent */}
                    <div className="flex-1 border-r border-gray-300">
                        <span className="text-sm font-bold block text-black">{numDifferentiation(item.rent_details.expected_rent)}</span>
                        <span className="text-xs text-gray-500 block">Rent</span>
                    </div>
                    {/* Deposit */}
                    <div className="flex-1 border-r border-gray-300">
                        <span className="text-sm font-bold block text-black">{numDifferentiation(item.rent_details.expected_deposit)}</span>
                        <span className="text-xs text-gray-500 block">Deposit</span>
                    </div>
                    {/* Builtup */}
                    <div className="flex-1">
                        <span className="text-sm font-bold block text-black">{item.property_details.property_size}</span>
                        <span className="text-xs text-gray-500 block">Builtup</span>
                    </div>
                </div>
            </div>

            {modalVisible && (
                <div className="fixed inset-0 flex items-center justify-center z-50" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }} onClick={(e) => { e.stopPropagation(); }}>
                    <div className="bg-white p-6 rounded-2xl shadow-lg max-w-sm w-full mx-4" onClick={(e) => { e.stopPropagation(); }}>
                        <p className="text-lg font-medium text-center mb-6 text-black">
                            {isPropertyClosed ? "Do you want to open this property?" : "Did you win deal for this property?"}
                        </p>

                        {!isPropertyClosed && (
                            <>
                                <div className="flex justify-center space-x-4 mb-6">
                                    <button
                                        className="px-8 py-2 bg-green-100 text-green-800 rounded-md font-medium hover:bg-green-200"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            closeMe(item);
                                            setModalVisible(false);
                                        }}
                                    >
                                        Yes
                                    </button>
                                    <button
                                        className="px-8 py-2 border border-gray-300 text-black rounded-md font-medium hover:bg-gray-50"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            closeMe(item);
                                            setModalVisible(false);
                                        }}
                                    >
                                        No
                                    </button>
                                </div>

                                <p className="text-sm text-gray-600 text-center mb-8 leading-relaxed">
                                    You can close or delete property. Close will keep property in list for 10 days, Delete will remove permanently.
                                </p>
                            </>
                        )}

                        <div className="flex justify-end items-center space-x-8">
                            <button
                                className="text-black font-medium hover:text-gray-700"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    deleteMe(item);
                                    setModalVisible(false);
                                }}
                            >
                                Delete
                            </button>
                            <button
                                className="text-black font-medium hover:text-gray-700"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    closeMe(item);
                                    setModalVisible(false);
                                }}
                            >
                                {isPropertyClosed ? "Open" : "Close"}
                            </button>
                            <button
                                className="text-black font-medium hover:text-gray-700"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setModalVisible(false);
                                }}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const styles = {
    card: {
        boxShadow: "0px 2px 4px rgba(0,0,0,0.2)",
        backgroundColor: "#ffffff",
        marginBottom: 10
    },
    headerContainer: {
        flex: 1,
        flexDirection: "column",
        alignItems: "flex-start",
        paddingRight: 16,
        paddingLeft: 16,
        paddingBottom: 25,
        paddingTop: 16,
        backgroundColor: "#d1d1d1",
    },
    title: {
        fontSize: 16,
        fontWeight: "600",
        margin: 0
    },
    detailsContainer: {
        height: 60,
        borderTopWidth: 1,
        borderTopColor: "#C0C0C0",
        backgroundColor: "rgba(220,220,220, 0.80)"
    },
    details: {
        padding: 10,
        flexDirection: "row",
        justifyContent: "space-between",
        display: 'flex'
    },
    subDetails: {
        paddingBottom: 20,
        display: 'flex',
        flexDirection: 'column'
    },
    subDetailsTitle: {
        fontSize: 12,
        fontWeight: "400"
    },
    subDetailsValue: {
        fontSize: 14,
        fontWeight: "600"
    },
    verticalLine: {
        height: "70%",
        width: 1,
        backgroundColor: "#909090"
    },
    MainContainer: {
        position: 'relative'
    },
    drawer: {
        position: 'absolute',
        right: 0,
        top: 0,
        bottom: 0,
        backgroundColor: '#616161',
        zIndex: 10
    },
    centeredView1: {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex',
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000
    },
    modalView: {
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        boxShadow: "0px 2px 4px rgba(0,0,0,0.25)",
        display: 'flex',
        flexDirection: 'column'
    },
    applyButton: {
        marginLeft: 10,
        marginRight: 10,
        padding: 10,
        backgroundColor: '#f44336',
        borderRadius: 5,
        color: 'white'
    },
    cancelButton: {
        marginLeft: 10,
        marginRight: 30,
        padding: 10,
        backgroundColor: '#2196F3',
        borderRadius: 5,
        color: 'white'
    },
    modalText: {
        marginBottom: 16,
        fontWeight: "600",
        textAlign: "center"
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
    }
};

const mapStateToProps = state => ({
    userDetails: state.AppReducer.userDetails,
    propListForMeeting: state.AppReducer.propListForMeeting,
});
const mapDispatchToProps = {
    setPropertyDetails,
    setCustomerDetailsForMeeting,
    setStartNavigationPoint,
    setPropListForMeeting
};
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Card);
