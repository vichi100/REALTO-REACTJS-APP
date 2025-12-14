import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { connect } from "react-redux";
import DoughnutChart from "./../../../../components/DoughnutChart";
// import { CheckBox } from "@rneui/themed";
import {
    MdPhoneInTalk,
    MdChevronLeft,
    MdClose,
    MdMessage,
    MdShare,
    MdAlarm,
    MdCall,
    MdLocationOn,
    MdPersonAdd,
} from "react-icons/md";
import { VscLocation } from "react-icons/vsc";
import { IoMdClose } from "react-icons/io";
import { AiOutlineMessage, AiOutlineShareAlt } from "react-icons/ai";
import { FiUserPlus } from "react-icons/fi";
import { IoCallOutline, IoAlarmOutline, IoShareSocialOutline, IoCloseSharp, IoLocationSharp } from "react-icons/io5";

import { numDifferentiation, makeCall } from "./../../../../utils/methods";
import { SERVER_URL } from "./../../../../utils/Constant";
import { EMPLOYEE_ROLE, EMPLOYEE_ROLE_DELETE } from "././../../../../utils/AppConstant";
import {
    setUserMobile,
    setUserDetails,
    setPropReminderList,
    setPropListForMeeting,
    setCustomerDetailsForMeeting,
    setStartNavigationPoint,
    setCustomerDetails,
    setPropertyDetails
} from "./../../../../reducers/Action";
import axios from "axios";
import * as AppConstant from "../../../../utils/AppConstant";
import CustomButtonGroup from "./../../../../components/CustomButtonGroup";

// Mock Avatar component for web
const Avatar = ({ title, size, avatarStyle, titleStyle }) => (
    <div
        style={{
            width: size,
            height: size,
            borderRadius: size / 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            ...avatarStyle,
        }}
    >
        <span style={{ fontSize: size / 2, ...titleStyle }}>{title}</span>
    </div>
);

// Mock CheckBox component for web
const CheckBox = ({ checked, onPress, containerStyle }) => (
    <div style={{ cursor: "pointer", ...containerStyle }} onClick={onPress}>
        <input type="checkbox" checked={checked} readOnly style={{ cursor: "pointer" }} />
    </div>
);

const ContactResidentialRentCard = props => {
    const navigate = useNavigate();
    const navigation = {
        navigate: (path, params) => {
            navigate(path, { state: params });
        }
    };
    const {
        // navigation,
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
    const [message, setMessage] = React.useState(
        "I have property for this customer. Please call me. "
    );

    const [Sliding_Drawer_Width, setSlidingDrawerWidth] = useState(250);
    const [Sliding_Drawer_Width_WO_Delete, setSlidingDrawerWidthWODelete] = useState(195);

    const iscustomerClosed = item && item.customer_status === 0;

    const canDelete = props.userDetails &&
        ((props.userDetails.works_for === props.userDetails.id) ||
            (props.userDetails.user_type === "employee" && EMPLOYEE_ROLE_DELETE.includes(props.userDetails.employee_role)));

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
        console.log("gotoEmployeeList: ", itemForAddEmplyee);
        navigation.navigate("/contacts/EmployeeListOfListing", {
            itemForAddEmplyee: itemForAddEmplyee,
            disableDrawer: true,
            displayCheckBox: true,
        });
    }

    const getMatched = (matchedCustomerItem) => {
        navigation.navigate('/contacts/MatchedProperties', { matchedCustomerItem: matchedCustomerItem },);
    }

    const onChangeText = e => {
        setMessage(e.target.value);
    };

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
            subject_id: item.customer_id,
            subject_category: "customer",
            subject_type: item.customer_locality.property_type,
            subject_for: item.customer_locality.property_for,
            city: item.customer_locality.city,
            location_area: item.customer_locality.location_area
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
                console.log(response.data);
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
                    title: 'React Native',
                    text: 'A framework for building native apps using React',
                });
            } catch (error) {
                console.log('Error sharing:', error);
            }
        } else {
            alert("Share not supported on this browser");
        }
    };

    const isAssetChecked = (item) => {
        console.log("Employee Object:", JSON.stringify(employeeObj));
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
            assigned_residential_sell_properties,
            assigned_commercial_rent_properties,
            assigned_commercial_sell_properties,
            assigned_residential_rent_customers,
            assigned_residential_buy_customers,
            assigned_commercial_rent_customers,
            assigned_commercial_buy_customers,
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

            if (isResidential && isForRent) toggleSelection(employeeObj, itemForAddEmplyee);
            else if (isResidential && isForSell) toggleSelection(employeeObj, itemForAddEmplyee);
            else if (isCommercial && isForRent) toggleSelection(employeeObj, itemForAddEmplyee);
            else if (isCommercial && isForSell) toggleSelection(employeeObj, itemForAddEmplyee);

        } else if (isCustomer) {
            isForRent = itemForAddEmplyee.customer_locality.property_for === "Rent";
            isForSell = itemForAddEmplyee.customer_locality.property_for === "Sell" || itemForAddEmplyee.customer_locality.property_for === "Buy";
            isCommercial = itemForAddEmplyee.customer_locality.property_type === "Commercial";
            isResidential = itemForAddEmplyee.customer_locality.property_type === "Residential";

            if (isResidential && isForRent) toggleSelection(employeeObj, itemForAddEmplyee);
            else if (isResidential && isForSell) toggleSelection(employeeObj, itemForAddEmplyee);
            else if (isCommercial && isForRent) toggleSelection(employeeObj, itemForAddEmplyee);
            else if (isCommercial && isForSell) toggleSelection(employeeObj, itemForAddEmplyee);
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
                        console.log("Properties updated successfully");
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
        const customerObj = {
            name: item.customer_details.name,
            mobile: item.customer_details.mobile1 || item.customer_details.mobile2 || item.customer_details.mobile || item.customer_details.phone || item.mobile || item.phone || "",
            customer_id: item.customer_id,
            agent_id: item.agent_id
        };

        props.setCustomerDetailsForMeeting(customerObj);
    };

    const onClickMeeting = item => {
        console.log(item)
        props.setCustomerDetailsForMeeting(null);
        props.setStartNavigationPoint("PropertyListForMeeting");
        props.setCustomerDetails(item);
        navigation.navigate("/contacts/CustomerMeeting", {
            item: item,
            category: "customer"
        });
    };

    // Styles
    const styles = {
        card: {
            flex: 1,
            justifyContent: "center",
            backgroundColor: "white",
            borderColor: "#ffffff",
            marginTop: 2,
            position: 'relative',
            overflow: 'hidden'
        },
        title: {
            fontSize: 16,
            fontWeight: "600",
            color: "#000"
        },
        subTitle: {
            fontSize: 14,
            fontWeight: "400",
            color: "#000"
        },
        subTitleA: {
            fontSize: 14,
            fontWeight: "500",
            color: "#000",
            marginTop: 5
        },
        detailsContainer: {
            borderBottomColor: "#bdbdbd",
            borderBottomWidth: 1,
            marginBottom: 3
        },
        details: {
            padding: 10,
            flexDirection: "row",
            justifyContent: "space-between",
            display: 'flex'
        },
        subDetailsTitle: {
            fontSize: 12,
            fontWeight: "400",
            color: "#000"
        },
        subDetailsValue: {
            fontSize: 14,
            fontWeight: "600",
            color: "#000"
        },
        verticalLine: {
            height: "100%",
            width: 1,
            backgroundColor: "#909090"
        },
        Main_Sliding_Drawer_Container: {
            flexDirection: "row",
            backgroundColor: "#616161",
            height: "100%",
            display: 'flex',
            alignItems: 'center'
        },
        centeredView1: {
            flex: 1,
            justifyContent: "center",
            alignContent: "center",
            marginTop: 22,
            marginBottom: 20,
            display: 'flex',
            alignItems: 'center'
        },
        modalView: {
            margin: 20,
            height: 250,
            backgroundColor: "white",
            borderRadius: 20,
            padding: 35,
            alignItems: "center",
            boxShadow: "0px 2px 4px rgba(0,0,0,0.25)",
            elevation: 5,
            display: 'flex',
            flexDirection: 'column',
            position: 'relative'
        },
        applyButton: {
            marginLeft: 10,
            marginRight: 10,
            cursor: 'pointer',
            padding: '10px 20px',
            backgroundColor: '#f0f0f0',
            borderRadius: 5
        },
        cancelButton: {
            marginLeft: 10,
            marginRight: 30,
            cursor: 'pointer',
            padding: '10px 20px',
            backgroundColor: '#f0f0f0',
            borderRadius: 5
        },
        modalText: {
            marginBottom: 15,
            textAlign: "center",
            color: "#000"
        },
        drawer: {
            position: "absolute",
            right: 0,
            top: 0,
            height: '100%',
            flexDirection: "row",
            transition: 'transform 0.5s ease',
            zIndex: 10
        },
        textStyle: {
            fontWeight: 'bold',
            textAlign: 'center',
            color: "#000"
        },
        MainContainer: {
            position: 'relative'
        }
    };

    const drawerTranslateX = !drawerOpen ? (slidingDrawerWidth - 40) : 0;

    return (
        <div style={styles.card}>
            <div style={{
                ...(iscustomerClosed ? {
                    opacity: 0.6,
                    backgroundColor: 'rgba(128, 128, 128, 0.3)'
                } : {})
            }}>
                <div style={styles.MainContainer}>
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: "row",
                            alignItems: "flex-start",
                            // paddingRight: 16,
                            // paddingLeft: 16,
                            // paddingBottom: 16,
                            // paddingTop: 16,
                            width: "100%",
                            backgroundColor: iscustomerClosed ? "rgba(128, 128, 128, 0.2)" : "#ffffff",
                        }}
                    >
                        {displayMatchCount === true && (
                            <div className="w-10 h-24 relative flex-shrink-0 cursor-pointer" onClick={(e) => { e.stopPropagation(); getMatched(item); }}>
                                <div style={{ backgroundColor: 'rgba(234, 155, 20, 0.7)', position: 'absolute', left: 0, top: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', width: 30, height: 20, zIndex: 10 }}>
                                    <span style={{ fontSize: 15, fontWeight: '500', color: '#000' }}>{item.match_count ? item.match_count : 0}</span>
                                </div>
                                <div style={{
                                    position: 'absolute', left: 0, top: 20, transform: 'rotate(270deg)',
                                    backgroundColor: 'rgba(80, 200, 120, 0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    width: 70, height: 30, padding: 0, marginLeft: -20, marginTop: 20, marginBottom: 15
                                }}
                                >
                                    <span style={{ fontSize: 14, fontWeight: '300', color: '#000' }}

                                    >Match</span>
                                </div>
                            </div>
                        )}

                        {displayMatchPercent === true && (
                            <>
                                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                    <DoughnutChart
                                        // data={[60, 40]}
                                        data={[
                                            // First segment (matched percentage)
                                            Math.max(0, Number(
                                                typeof item.matched_percentage === 'number'
                                                    ? item.matched_percentage
                                                    : typeof item.matched_percentage === 'string'
                                                        ? parseFloat(item.matched_percentage) || 0
                                                        : 0
                                            )),

                                            // Second segment (remaining percentage)
                                            100 - Math.max(0, Number(
                                                typeof item.matched_percentage === 'number'
                                                    ? item.matched_percentage
                                                    : typeof item.matched_percentage === 'string'
                                                        ? parseFloat(item.matched_percentage) || 0
                                                        : 0
                                            ))
                                        ]}
                                        radius={35}
                                        holeRadius={25}  // Adjust this to change the hole size
                                        strokeWidth={60}
                                        colors={['rgba(38, 208, 109, 0.8)', 'rgba(211, 61, 24, 0.6)']}
                                        textColor="#333"
                                        textSize={14}
                                        showPercentage={true}
                                    />
                                </div>
                            </>
                        )}

                        <div style={{ marginLeft: !displayMatchPercent ? 40 : 0, }}>
                            {!displayMatchPercent &&
                                <div style={{
                                    width: 60, height: 60, display: 'flex', justifyContent: 'center', alignItems: 'center',
                                    color: "rgba(105,105,105, .9)", border: '1px solid rgba(127,255,212, .9)',
                                    fontSize: 24, fontWeight: 'bold', borderRadius: 30
                                }}>
                                    {item.customer_details.name && item.customer_details.name.slice(0, 1)}
                                </div>
                            }
                        </div>
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: "row",
                                justifyContent: "space-between",
                                flex: 1
                            }}
                        >
                            <div style={{ paddingLeft: 20, paddingTop: 10 }}>
                                <p style={styles.title}
                                >
                                    {item.customer_details.name}
                                </p>
                                <div style={{ display: 'flex', flexDirection: "row", alignItems: "center", marginTop: 5 }}>
                                    {/* <MaterialCommunityIcons name="phone-dial" color={"#0f1a20"} size={20} /> */}
                                    <span>📞</span>
                                    <p style={{ ...styles.subTitle, paddingLeft: 10, color: "#0f1a20" }}
                                    >
                                        {item.customer_details.mobile1?.startsWith("+91")
                                            ? item.customer_details.mobile1
                                            : `+91 ${item.customer_details.mobile1}`}
                                    </p>
                                </div>
                                <p style={{ paddingRight: 10, color: "#0f1a20", marginTop: 5, marginBottom: 5 }}
                                >
                                    Reference id: {item.customer_id?.slice(-6)}
                                </p>

                            </div>


                            {displayCheckBox ? (
                                <div
                                    style={{
                                        // backgroundColor: "rgba(108, 198, 114, 0.2)",
                                        display: 'flex',
                                        justifyContent: "center"
                                    }}
                                >
                                    <input
                                        type="checkbox"
                                        onChange={(e) => { e.stopPropagation(); onClickCheckBox(item); }}
                                        onClick={(e) => e.stopPropagation()}
                                        checked={
                                            props.customerDetailsForMeeting &&
                                                props.customerDetailsForMeeting.customer_id ===
                                                item.customer_id
                                                ? true
                                                : false
                                        }
                                        style={{
                                            margin: 10,
                                            transform: 'scale(1.5)'
                                        }}
                                    />
                                </div>
                            ) : null}

                            {displayCheckBoxForEmployee ? (
                                <div
                                    style={{
                                        display: 'flex',
                                        justifyContent: "center",
                                    }}
                                >
                                    <input
                                        type="checkbox"
                                        onChange={(e) => { e.stopPropagation(); onClickCheckBoxForEmployee(item); }}
                                        onClick={(e) => e.stopPropagation()}
                                        checked={isAssetChecked(item)}
                                        style={{
                                            margin: 10,
                                            transform: 'scale(1.5)'
                                        }}
                                    />
                                </div>
                            ) : null}


                            {displayChat ? (
                                <button
                                    onClick={(e) => { e.stopPropagation(); onChat(item); }}
                                    style={{ paddingTop: 15, border: 'none', background: 'transparent', outline: 'none' }}
                                >
                                    <div
                                        style={{
                                            // backgroundColor: "rgba(108, 198, 114, 0.2)",
                                            display: 'flex',
                                            justifyContent: "center",
                                            marginRight: 15
                                        }}
                                    >
                                        {/* <AntDesign name="message1" color={"#86b9d4"} size={30} /> */}
                                        <span style={{ fontSize: 30, color: "#86b9d4" }}>💬</span>
                                    </div>
                                </button>
                            ) : null}
                        </div>
                    </div>

                    {disableDrawer ? null : (
                        <div
                            style={{
                                ...styles.drawer,
                                width: slidingDrawerWidth,
                                transform: `translateX(${drawerTranslateX}px)`,
                                transition: 'transform 0.5s',
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center',
                                backgroundColor: 'transparent' // Ensure container is transparent
                            }}
                        >
                            {/* Back Arrow Strip */}
                            <div
                                onClick={(e) => { e.stopPropagation(); ShowSlidingDrawer(); }}
                                style={{
                                    width: 40,
                                    backgroundColor: '#4b5563', // bg-gray-600
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer',
                                    height: '100%',
                                    outline: 'none'
                                }}
                            >
                                <MdChevronLeft color={"#ffffff"} size={30} />
                            </div>

                            {/* Action Buttons Container */}
                            <div style={{ display: 'flex', flexDirection: 'row', height: '100%' }}>
                                {(item.agent_id === props.userDetails.works_for && canAddDelete) && (
                                    <div
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setModalVisible(true);
                                        }}
                                        style={{
                                            width: 64,
                                            height: '100%',
                                            backgroundColor: '#f87171', // bg-red-400
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            cursor: 'pointer',
                                            outline: 'none'
                                        }}
                                    >
                                        <MdClose color={"#ffffff"} size={30} />
                                    </div>
                                )}

                                <div
                                    onClick={(e) => { e.stopPropagation(); onClickMeeting(item); }}
                                    style={{
                                        width: 64,
                                        height: '100%',
                                        backgroundColor: '#facc15', // bg-yellow-400
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        cursor: 'pointer',
                                        outline: 'none'
                                    }}
                                >
                                    <MdAlarm color={"#ffffff"} size={30} />
                                </div>

                                <div
                                    onClick={(e) => { e.stopPropagation(); makeCall(item.customer_details.mobile1); }}
                                    style={{
                                        width: 64,
                                        height: '100%',
                                        backgroundColor: '#14b8a6', // bg-teal-500
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        cursor: 'pointer',
                                        outline: 'none'
                                    }}
                                >
                                    <MdCall color={"#ffffff"} size={30} />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                <div
                    style={{
                        display: 'flex',
                        flexDirection: "row",
                        paddingLeft: 30, backgroundColor: "rgba(220,220,220, .2)"
                    }}>
                    {/* <Ionicons
          name="location-sharp"
          color={"#000"}
          size={16}
          style={{ marginLeft: 10, marginTop: 10 }}
        /> */}
                    <span style={{ marginLeft: 10, marginTop: 10, color: "#000" }}>📍</span>
                    <p style={{ ...styles.subTitleA, marginLeft: 10, marginRight: 10, paddingTop: 5, paddingBottom: 5 }}>
                        {item.customer_locality.location_area.map(item => item.main_text).join(', ')}
                    </p>
                </div>

                {props.userDetails.works_for === props.userDetails.id && item.agent_id === props.userDetails.id &&
                    <div onClick={(e) => { e.stopPropagation(); gotoEmployeeList(item); }} style={{ cursor: 'pointer', width: '100%' }}>
                        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 10, marginTop: 10, marginLeft: 20 }}>
                            {/* <Feather name="user-plus" size={20} color="black" /> */}
                            <MdPersonAdd size={18} className="text-black mr-2" />
                            <p style={{ fontSize: 14, fontWeight: '400', color: '#000', marginLeft: 0, marginRight: 0 }}>
                                {Array.isArray(item.assigned_to_employee_name) && item.assigned_to_employee_name.length > 0
                                    ? item.assigned_to_employee_name.join(", ")
                                    : "No Employees Assigned"}
                            </p>
                        </div>
                    </div>}

                <div style={styles.detailsContainer}>
                    <div style={styles.details}>
                        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                            <p style={{ ...styles.subDetailsValue, marginTop: 5 }}>
                                {item.customer_property_details.bhk_type}
                            </p>
                            {/* <p style={styles.subDetailsTitle}>Prop Type</p> */}
                        </div>
                        <div style={styles.verticalLine}></div>
                        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                            <p style={styles.subDetailsValue}>
                                {numDifferentiation(item.customer_rent_details.expected_rent)}
                            </p>
                            <p style={styles.subDetailsTitle}>Rent</p>
                        </div>
                        <div style={styles.verticalLine}></div>
                        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                            <p style={styles.subDetailsValue}>
                                {numDifferentiation(item.customer_rent_details.expected_deposit)}
                            </p>
                            <p style={styles.subDetailsTitle}>Deposit</p>
                        </div>
                        <div style={styles.verticalLine}></div>
                        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                            <span style={styles.subDetailsValue}>
                                {item.customer_property_details.furnishing_status}
                            </span>
                            <span style={styles.subDetailsTitle}>Furnishing</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal */}
            {modalVisible && (
                <div className="fixed inset-0 flex items-center justify-center z-50" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }} onClick={(e) => { e.stopPropagation(); }}>
                    <div className="bg-white p-6 rounded-2xl shadow-lg max-w-sm w-full mx-4" onClick={(e) => { e.stopPropagation(); }}>
                        <p className="text-lg font-medium text-center mb-6 text-black">
                            {iscustomerClosed ? "Do you want to open this customer?" : "Did you win deal for this customer?"}
                        </p>

                        {!iscustomerClosed && (
                            <>
                                <div className="flex justify-center space-x-4 mb-6">
                                    <button
                                        className="px-8 py-2 bg-green-100 text-green-800 rounded-md font-medium hover:bg-green-200"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setDealWin("Yes");
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
                                            setDealWin("No");
                                            closeMe(item);
                                            setModalVisible(false);
                                        }}
                                    >
                                        No
                                    </button>
                                </div>

                                <p className="text-sm text-gray-600 text-center mb-8 leading-relaxed">
                                    You can close or delete customer. Close will keep customer in list for 10 days, Delete will remove permanently.
                                </p>
                            </>
                        )}

                        <div className="flex justify-end items-center space-x-8">
                            {canDelete && (
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
                            )}
                            <button
                                className="text-black font-medium hover:text-gray-700"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    closeMe(item);
                                    setModalVisible(false);
                                }}
                            >
                                {iscustomerClosed ? "Open" : "Close"}
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

            {/* Message Modal */}
            {chatModalVisible && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <div style={styles.modalView}>
                        <span style={{ color: "616161", fontSize: 16 }}>
                            Enter your message
                        </span>
                        <textarea
                            style={{
                                height: 90,
                                width: "95%",
                                margin: 12,
                                borderWidth: 1,
                                borderColor: "rgba(191, 191, 191, 1)",
                                padding: 7,
                                color: "#616161"
                            }}
                            rows={10}
                            onChange={onChangeText}
                            value={message}
                            placeholder={message}
                        />

                        <div
                            style={{
                                position: "absolute",
                                flexDirection: "row",
                                right: 0,
                                bottom: 0,
                                marginTop: 20,
                                marginBottom: 20,
                                padding: 20,
                                display: 'flex'
                            }}
                        >
                            <div
                                style={styles.cancelButton}
                                onClick={() => {
                                    setChatModalVisible(!chatModalVisible);
                                }}
                            >
                                <span style={styles.textStyle}>Cancel</span>
                            </div>
                            <div
                                style={styles.applyButton}
                                onClick={() => sendMessage()}
                            >
                                <span style={styles.textStyle}>Send</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const mapStateToProps = state => ({
    userDetails: state.AppReducer.userDetails,
    propReminderList: state.AppReducer.propReminderList,
    propListForMeeting: state.AppReducer.propListForMeeting,
    customerDetailsForMeeting: state.AppReducer.customerDetailsForMeeting,
});

const mapDispatchToProps = {
    setUserMobile,
    setUserDetails,
    setPropReminderList,
    setCustomerDetailsForMeeting,
    setPropListForMeeting,
    setStartNavigationPoint,
    setCustomerDetails,
    setPropertyDetails
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ContactResidentialRentCard);
