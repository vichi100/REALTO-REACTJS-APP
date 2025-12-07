import React, { Component, useEffect, useState } from "react";
// import {
//   StyleSheet,
//   View,
//   Image,
//   Text,
//   ImageBackground,
//   Animated,
//   TouchableOpacity,
//   Modal,
//   TouchableHighlight,
//   Dimensions,
//   Share,
//   Linking,
//   TextInput
// } from "react-native";
import {
    MdChevronLeft,
    MdClose,
    MdAlarm,
    MdCall
} from "react-icons/md";
import { connect } from "react-redux";
import DoughnutChart from "./../../../../components/DoughnutChart";
// import { CheckBox } from "@rneui/themed";
// import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
// import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";
// import Ionicons from "react-native-vector-icons/Ionicons";
// import { ButtonGroup } from "@rneui/themed";
// import { Avatar } from "@rneui/themed";
import axios from "axios";
// import AntDesign from "react-native-vector-icons/AntDesign";
import { numDifferentiation } from "././../../../../utils/methods";
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
} from "./../../../../reducers/Action";
// import Feather from "react-native-vector-icons/Feather";
import { makeCall } from "../../../../utils/methods";
import * as  AppConstant from "../../../../utils/AppConstant";
import CustomButtonGroup from "./../../../../components/CustomButtonGroup";

// https://reactnativecode.com/create-custom-sliding-drawer-using-animation/
// https://www.skptricks.com/2019/05/react-native-custom-animated-sliding-drawer.html

// const Sliding_Drawer_Width = 250;
// const Sliding_Drawer_Width = 195;

// const width = window.innerWidth; // Dimensions.get("window").width;

const CustomerCommercialRentCard = props => {
    const {
        navigation,
        item,
        disableDrawer,
        displayCheckBox,
        displayChat,
        deleteMe,
        closeMe,
        navigatedFrom = "none",
        displayMatchCount = true,
        displayMatchPercent = false,
        displayCheckBoxForEmployee = false,
        employeeObj = null,
    } = props;
    // let animatedValue = new Animated.Value(0);
    let toggleFlag = 0;
    const [disabled, setDisabled] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [index, setIndex] = React.useState(null);
    const [chatModalVisible, setChatModalVisible] = useState(false);
    const [refresh, setRefresh] = useState(false); // Add a state to trigger re-render
    // const [text, onChangeText] = React.useState("I have customer for this property. Please call me.");

    const [dealWin, setDealWin] = useState("Yes");

    const [Sliding_Drawer_Width, setSlidingDrawerWidth] = useState(232); // 40 + 64 + 64 + 64
    const [Sliding_Drawer_Width_WO_Delete, setSlidingDrawerWidthWODelete] = useState(168); // 40 + 64 + 64

    // --- NEW CODE: Determine if the property is closed ---
    const iscustomerClosed = item && item.customer_status === 0;
    // ---------------------------------------------------

    const canDelete = props.userDetails &&
        ((props.userDetails.works_for === props.userDetails.id) ||
            (props.userDetails.user_type === "employee" && EMPLOYEE_ROLE_DELETE.includes(props.userDetails.employee_role)))


    const canAddDelete = true;

    // const canAddDelete = props.userDetails &&
    //   ((props.userDetails.works_for === props.userDetails.id) ||
    //     (props.userDetails.user_type === "employee" && EMPLOYEE_ROLE.includes(props.userDetails.employee_role)));

    const slidingDrawerWidth = canAddDelete
        ? Sliding_Drawer_Width
        : Sliding_Drawer_Width_WO_Delete;

    useEffect(() => {
        if (item && item.agent_id === props.userDetails.works_for) {
            setSlidingDrawerWidth(232);
        } else {
            setSlidingDrawerWidth(168);
        }
    }, [item, props.userDetails.works_for]);

    // let Animation = new Animated.Value(0);

    let Sliding_Drawer_Toggle = true;
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);


    const ShowSlidingDrawer = () => {
        setIsDrawerOpen(!isDrawerOpen);
        // // console.log(Sliding_Drawer_Toggle);
        // if (Sliding_Drawer_Toggle === true) {
        //   Animated.timing(Animation, {
        //     toValue: 1,
        //     duration: 500,
        //     useNativeDriver: true
        //   }).start(() => {
        //     Sliding_Drawer_Toggle = false;
        //   });
        // } else {
        //   Animated.timing(Animation, {
        //     toValue: 0,
        //     duration: 500,
        //     useNativeDriver: true
        //   }).start(() => {
        //     Sliding_Drawer_Toggle = true;
        //   });
        // }
    };

    // const Animation_Interpolate = Animation.interpolate({
    //   inputRange: [0, 1],
    //   // outputRange: [370, 135]
    //   // outputRange: [-(Sliding_Drawer_Width - width * 1.55), 135]
    //   // outputRange: ["330%", "100%"]
    //   // outputRange: ["250%", "100%"]
    //   outputRange: [slidingDrawerWidth - 33, -15]
    // });


    const gotoEmployeeList = itemForAddEmplyee => {
        // console.log("gotoEmployeeList: ", itemForAddEmplyee);
        // props.setPropertyDetails(itemForAddEmplyee);
        navigation.navigate("EmployeeListOfListing", {
            itemForAddEmplyee: itemForAddEmplyee,
            disableDrawer: true,
            displayCheckBox: true,
        });
    }


    const [message, setMessage] = React.useState(
        "I have property for this customer. Please call me. "
    );

    const getMatched = (matchedCustomerItem) => {
        navigation.navigate('MatchedProperties', { matchedCustomerItem: matchedCustomerItem },);
    }

    const onChangeText = e => {
        const text = e.target.value;
        console.log(text);
        setMessage(text);
    };

    const onChat = () => {
        setChatModalVisible(true);
    };

    const sendMessage = () => {
        console.log("userDetails: ", props.userDetails);
        console.log("customer details: ", item);
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
            subject_id: item.customer_id, // property_id or buyer_id
            subject_category: "customer", // property, customer
            subject_type: item.customer_locality.property_type, // commercial, residential
            subject_for: item.customer_locality.property_for, // buy, sell, rent
            city: item.customer_locality.city,
            location_area: item.customer_locality.location_area
        };

        const messageDetails = {
            // agent_id: props.userDetails.works_for
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
                // props.setCommercialCustomerList(response.data);
                // setData(response.data);
            },
            error => {
                console.log(error);
            }
        );
        setChatModalVisible(false);
    };

    const updateIndex = index => {
        setIndex(index);
    };

    // const makeCall = mobile => {
    //   const url = "tel://" + mobile;
    //   Linking.openURL(url);
    // };

    const onShare = async () => {
        // https://docs.expo.io/versions/latest/react-native/share/
        try {
            if (navigator.share) {
                await navigator.share({
                    title: 'React Native',
                    text: 'A framework for building native apps using React',
                });
            } else {
                alert("Share not supported on this browser");
            }
            // const result = await Share.share({
            //   message:
            //     "React Native | A framework for building native apps using React"
            // });
            // if (result.action === Share.sharedAction) {
            //   if (result.activityType) {
            //     // shared with activity type of result.activityType
            //   } else {
            //     // shared
            //   }
            // } else if (result.action === Share.dismissedAction) {
            //   // dismissed
            // }
        } catch (error) {
            alert(error.message);
        }
    };



    const isAssetChecked = (item) => {
        // console.log("Checking if asset is assigned:", JSON.stringify(item));
        console.log("Employee Object:", JSON.stringify(employeeObj));

        // Check if the assigned_to_employee array exists and contains the employee ID
        if (item.assigned_to_employee && Array.isArray(item.assigned_to_employee)) {
            return item.assigned_to_employee.includes(employeeObj.id);
        }

        // If assigned_to_employee does not exist or is not an array, return false
        return false;
    };

    const onClickCheckBoxForEmployee = (itemForAddEmplyee) => {
        const wasChecked = isAssetChecked(itemForAddEmplyee); // Check the current state
        console.log("Checkbox was", wasChecked ? "selected" : "unselected");
        console.log("onClickCheckBox", JSON.stringify(itemForAddEmplyee));// property
        console.log("onClickCheckBox", JSON.stringify(employeeObj));

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
            // isProperty = false;
            isCustomer = true;
        } else if (!itemForAddEmplyee || !itemForAddEmplyee.customer_id) {
            isProperty = true;
            // isCustomer = false;
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

            if (isResidential && isForRent) {
                toggleSelection(employeeObj, itemForAddEmplyee);
            } else if (isResidential && isForSell) {
                toggleSelection(employeeObj, itemForAddEmplyee);
            } else if (isCommercial && isForRent) {
                toggleSelection(employeeObj, itemForAddEmplyee);
            } else if (isCommercial && isForSell) {
                toggleSelection(employeeObj, itemForAddEmplyee);
            }
        } else if (isCustomer) {
            isForRent = itemForAddEmplyee.customer_locality.property_for === "Rent";
            isForSell = itemForAddEmplyee.customer_locality.property_for === "Sell" || itemForAddEmplyee.customer_locality.property_for === "Buy";

            isCommercial = itemForAddEmplyee.customer_locality.property_type === "Commercial";
            isResidential = itemForAddEmplyee.customer_locality.property_type === "Residential";

            if (isResidential && isForRent) {
                toggleSelection(employeeObj, itemForAddEmplyee);
            } else if (isResidential && isForSell) {
                toggleSelection(employeeObj, itemForAddEmplyee);
            } else if (isCommercial && isForRent) {
                toggleSelection(employeeObj, itemForAddEmplyee);
            } else if (isCommercial && isForSell) {
                toggleSelection(employeeObj, itemForAddEmplyee);
            }
        }
        //whatToUpdateData: will be used to add employee to property or customer assigned list
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

        setRefresh(!refresh); // Trigger re-render
    };

    const toggleSelection = (employeeObj, itemForAddEmplyee) => {
        // console.log("Checking if asset is assigned:", JSON.stringify(item));
        // console.log("Employee Object:", JSON.stringify(employeeObj));

        const list = itemForAddEmplyee.assigned_to_employee;
        const id = employeeObj.id;
        const index = list.indexOf(id);
        if (index > -1) {
            // If the item is already selected, remove it
            list.splice(index, 1);
        } else {
            // If the item is not selected, add it
            list.push(id);
        }
    };

    const updatePropertiesForEmployee = async (item, whatToUpdateData, operation) => {
        // setLoading(true);
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
                    // console.log(error);
                    // setLoading(false);
                    console.log(error);
                }
            );
        } catch (error) {
            console.error('Failed to fetch user:', error);
        } finally {
            setLoading(false);
        }
    };


    const onClickCheckBox = item => {
        // console.log("onClickCheckBox", item.customer_id);
        const customerObj = {
            name: item.customer_details.name,
            mobile: item.customer_details.mobile1,
            customer_id: item.customer_id,
            agent_id: item.agent_id
        };

        props.setCustomerDetailsForMeeting(customerObj);
    };

    const onClickMeeting = item => {
        props.setCustomerDetailsForMeeting(null);
        // props.setPropListForMeeting([]);
        props.setStartNavigationPoint("PropertyListForMeeting");
        props.setCustomerDetails(item);
        navigation.navigate("CustomerMeeting", {
            item: item,
            category: "customer"
        })
    };

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
                            <>
                                <button onClick={(e) => { e.stopPropagation(); getMatched(item); }}
                                    aria-label={`match_${item.customer_id?.slice(-6)}`}
                                    style={{ height: 1, width: 1, border: 'none', background: 'transparent' }}
                                >
                                    <div style={{ backgroundColor: 'rgba(234, 155, 20, 0.7)', position: 'absolute', left: 0, top: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', width: 50, height: 20, marginLeft: -20 }}>
                                        <span style={{ fontSize: 15, fontWeight: '500', color: '#000', paddingLeft: 20 }}>{item.match_count ? item.match_count : 0}</span>
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
                                </button>
                            </>
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
                                transform: isDrawerOpen ? `translateX(0px)` : `translateX(${slidingDrawerWidth - 40}px)`,
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
                            <span style={{ fontSize: 20, color: "black" }}>👤+</span>
                            <p style={{ fontSize: 14, fontWeight: '400', color: '#000', marginLeft: 20, marginRight: 20 }}>
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
                                {item.customer_property_details.property_used_for}
                            </p>
                            <p style={styles.subDetailsTitle}>Prop Type</p>
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
                    </div>
                </div>
            </div>

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
            {/* message modal  */}
            {chatModalVisible && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex',
                    justifyContent: 'center', alignItems: 'center', zIndex: 1000
                }}>
                    <div style={styles.centeredView1}>
                        <div style={styles.modalView}>
                            <p style={{ color: "616161", fontSize: 16 }}>
                                Enter your message
                            </p>
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
                            // keyboardType="numeric"
                            />

                            <div
                                style={{
                                    position: "absolute",
                                    display: 'flex',
                                    flexDirection: "row",
                                    right: 0,
                                    bottom: 0,
                                    marginTop: 20,
                                    marginBottom: 20,
                                    padding: 20
                                    // justifyContent: "flex-end"
                                }}
                            >
                                <button
                                    style={{ ...styles.cancelButton }}
                                    onClick={() => {
                                        setChatModalVisible(!chatModalVisible);
                                    }}
                                >
                                    <span style={styles.textStyle}>Cancel</span>
                                </button>
                                <button
                                    style={{ ...styles.applyButton }}
                                    onClick={() => sendMessage()}
                                >
                                    <span style={styles.textStyle}>Send</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const styles = {
    card: {
        flex: 1,
        justifyContent: "center",
        // shadowOpacity: 0.0015 * 5 + 0.18,
        // shadowRadius: 0.54 * 5,
        // shadowOffset: {
        //   height: 0.6 * 5
        // },
        backgroundColor: "white",
        borderColor: "#ffffff",
        // borderWidth: 1,
        marginTop: 2,
        position: 'relative',
        overflow: 'hidden'
    },
    cardImage: {
        // alignSelf: "stretch",
        marginBottom: 16,
        flex: 1,
        width: "100%",
        height: "auto"
        // justifyContent: "center",
        // alignItems: "stretch"
    },
    headerContainer: {
        display: 'flex',
        flexDirection: "row",
        alignItems: "flex-start",
        paddingRight: 16,
        paddingLeft: 16,
        paddingBottom: 16,
        paddingTop: 16,
        width: "100%",
        backgroundColor: "#ffffff",
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
    MainContainer: {
        position: 'relative'
        // flex: 1,
        // justifyContent: "center",
        // alignItems: "center"
    },

    Root_Sliding_Drawer_Container: {
        position: "absolute",
        display: 'flex',
        flexDirection: "row",
        // left: 0,
        // bottom: 0,
        // top: Platform.OS == "ios" ? 20 : 0,
        // width: Sliding_Drawer_Width
    },

    Main_Sliding_Drawer_Container: {
        // flex: 1,
        display: 'flex',
        flexDirection: "row",
        backgroundColor: "#616161",
        height: "100%",
        display: 'flex',
        alignItems: 'center'
    },

    TextStyle: {
        fontSize: 25,
        padding: 10,
        textAlign: "center",
        color: "#FF5722"
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
        // shadowColor: "#000",
        // shadowOffset: {
        //   width: 0,
        //   height: 2
        // },
        // shadowOpacity: 0.25,
        // shadowRadius: 3.84,
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
        fontWeight: 'bold'
    }
};

const mapStateToProps = state => ({
    userDetails: state.AppReducer.userDetails,
    propReminderList: state.AppReducer.propReminderList,
    propListForMeeting: state.AppReducer.propListForMeeting,
    customerDetailsForMeeting: state.AppReducer.customerDetailsForMeeting
});

const mapDispatchToProps = {
    setUserMobile,
    setUserDetails,
    setPropReminderList,
    setCustomerDetailsForMeeting,
    setStartNavigationPoint,
    setCustomerDetails,
};
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(CustomerCommercialRentCard);
