import React, { Component, useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Image,
  Text,
  ImageBackground,
  Animated,
  TouchableOpacity,
  Modal,
  TouchableHighlight,
  Dimensions,
  Share,
  Linking,
  TextInput
} from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Feather from "react-native-vector-icons/Feather";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

import { MaterialIcons } from "@expo/vector-icons";
import DoughnutChart from "./../../../../components/DoughnutChart";
import Ionicons from "react-native-vector-icons/Ionicons";
import Button from "./../../../../components/Button";
import { ButtonGroup } from "@rneui/themed";
import axios from "axios";
import Slideshow from "./../../../../components/Slideshow";
import AntDesign from "react-native-vector-icons/AntDesign";
import { numDifferentiation } from "././../../../../utils/methods";
import { connect } from "react-redux";
import { CheckBox } from "@rneui/themed";
import { SERVER_URL } from "./../../../../utils/Constant";
import { EMPLOYEE_ROLE, EMPLOYEE_ROLE_DELETE } from "././../../../../utils/AppConstant";
import {
  setUserMobile,
  setUserDetails,
  setPropReminderList,
  setPropListForMeeting,
  setCustomerDetailsForMeeting,
  setStartNavigationPoint,
  setPropertyDetails
} from "./../../../../reducers/Action";
import { makeCall } from "../../../../utils/methods";
import * as  AppConstant from "../../../../utils/AppConstant";
import CustomButtonGroup from "./../../../../components/CustomButtonGroup";

// https://reactnativecode.com/create-custom-sliding-drawer-using-animation/
// https://www.skptricks.com/2019/05/react-native-custom-animated-sliding-drawer.html

// const Sliding_Drawer_Width = 250;
const width = Dimensions.get("window").width;

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
    displayOnlyMatch = false,
    displayMatchPercent = false,
    displayCheckBoxForEmployee = false,
    employeeObj = null,
  } = props;
  let animatedValue = new Animated.Value(0);
  let toggleFlag = 0;
  const [disabled, setDisabled] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [index, setIndex] = React.useState(null);
  const [chatModalVisible, setChatModalVisible] = useState(false);
  const [refresh, setRefresh] = useState(false); // Add a state to trigger re-render
  // const [text, onChangeText] = React.useState("I have customer for this property. Please call me.");

  const [Sliding_Drawer_Width, setSlidingDrawerWidth] = useState(250);
  const [Sliding_Drawer_Width_WO_Delete, setSlidingDrawerWidthWODelete] = useState(195);

  const [dealWin, setDealWin] = useState("Yes");

  // --- NEW CODE: Determine if the property is closed ---
  const isPropertyClosed = item && item.property_status === 0;
  // ---------------------------------------------------

  const canAddDelete = true; // props.userDetails &&
  // ((props.userDetails.works_for === props.userDetails.id) ||
  //   (props.userDetails.user_type === "employee" && EMPLOYEE_ROLE.includes(props.userDetails.employee_role)));

  const canDelete = props.userDetails &&
    ((props.userDetails.works_for === props.userDetails.id) ||
      (props.userDetails.user_type === "employee" && EMPLOYEE_ROLE_DELETE.includes(props.userDetails.employee_role)))

  // const canAddDelete = props.userDetails &&
  //   ((props.userDetails.works_for === props.userDetails.id) ||
  //     (props.userDetails.user_type === "employee" && EMPLOYEE_ROLE.includes(props.userDetails.employee_role)));

  const slidingDrawerWidth = canAddDelete
    ? Sliding_Drawer_Width
    : Sliding_Drawer_Width_WO_Delete;

  useEffect(() => {
    // Dynamically update the sliding drawer width based on the condition
    if (item && item.agent_id === props.userDetails.works_for) {
      setSlidingDrawerWidth(250); // Increase width
    } else {
      setSlidingDrawerWidth(195); // Default width if dont want to see delete option
    }
  }, [item, props.userDetails.works_for]);

  let Animation = new Animated.Value(0);

  let Sliding_Drawer_Toggle = true;

  const ShowSlidingDrawer = () => {
    // // console.log(Sliding_Drawer_Toggle);
    if (Sliding_Drawer_Toggle === true) {
      Animated.timing(Animation, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true
      }).start(() => {
        Sliding_Drawer_Toggle = false;
      });
    } else {
      Animated.timing(Animation, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true
      }).start(() => {
        Sliding_Drawer_Toggle = true;
      });
    }
  };

  const Animation_Interpolate = Animation.interpolate({
    inputRange: [0, 1],
    // outputRange: [370, 135]
    // outputRange: [-(Sliding_Drawer_Width - width * 1.55), 135]
    // outputRange: ["330%", "100%"]
    // outputRange: ["250%", "100%"]
    outputRange: [slidingDrawerWidth - 33, -15]
  });


  const [message, setMessage] = React.useState(
    "I have customer for this property. Please call me. "
  );

  const onChangeText = text => {
    console.log(text);
    setMessage(text);
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
      const result = await Share.share({
        message:
          "React Native | A framework for building native apps using React"
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      alert(error.message);
    }
  };



  const gotoEmployeeList = itemForAddEmplyee => {
    console.log("gotoEmployeeList: ", itemForAddEmplyee);
    // props.setPropertyDetails(itemForAddEmplyee);
    navigation.navigate("EmployeeListOfListing", {
      itemForAddEmplyee: itemForAddEmplyee,
      disableDrawer: true,
      displayCheckBox: true,
    });
  }

  const onClickMeeting = item => {
    console.log("hi")
    props.setCustomerDetailsForMeeting(null);
    // props.setPropListForMeeting([]);
    props.setPropertyDetails(item);
    props.setStartNavigationPoint("CustomerListForMeeting");
    navigation.navigate("Meeting", {
      item: item,
      category: "property"
    });
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
    // // console.log("onClickCheckBox", JSON.stringify(item));
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
      // // console.log("remove: ", checkBoxList);
      const x = props.propListForMeeting.filter(z => z.id !== item.property_id);
      // setCheckBoxList(x);
      props.setPropListForMeeting(x);
    } else {
      const x = [obj, ...props.propListForMeeting];
      // // console.log("add: X :  ", x);
      // setCheckBoxList(x);
      props.setPropListForMeeting(x);
    }
    // console.log(
    //   "setPropListForMeeting: ",
    //   JSON.stringify(props.propListForMeeting)
    // );
  };

  const onChat = () => {
    setChatModalVisible(true);
  };
  const sendMessage = () => {
    console.log("userDetails: ", props.userDetails);
    console.log("Property Details: ", item);
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
      subject_id: item.property_id, // property_id or buyer_id
      subject_category: "property", // property, customer
      subject_type: item.property_type, // commercial, residential
      subject_for: item.property_for, // buy, sell, rent
      city: item.property_address.city,
      location_area: item.property_address.location_area
    };

    const messageDetails = {
      // agent_id: props.userDetails.works_for
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
        props.setCommercialCustomerList(response.data);
        setData(response.data);
      },
      error => {
        console.log(error);
      }
    );
    setChatModalVisible(false);
  };

  const navigateToDetails = (item, propertyFor) => {
    // props.setAnyItemDetails(item);
    console.log("props.setPropertyDetails(item: )", item);
    props.setPropertyDetails(item);

    if (propertyFor === "Rent") {
      navigation.navigate("PropDetailsFromListing", { item: item });
    } else if (propertyFor === "Sell") {
      navigation.navigate("PropDetailsFromListingForSell", { item: item });
    }

  };

  const getMatched = (matchedProprtyItem) => {
    navigation.navigate('MatchedCustomers', { matchedProprtyItem: matchedProprtyItem },);
  }

  return (
    // <TouchableOpacity onPress={() => navigateToDetails(item, "Sell")}>
    <View style={[styles.card, isPropertyClosed && {
      opacity: 0.6,
      backgroundColor: 'rgba(128, 128, 128, 0.3)' // Adds semi-transparent gray
    }]}>

      <Slideshow
        dataSource={item.image_urls}
      />
      {/* --- NEW CODE: Conditional Overlay for Closed Property --- */}
      {isPropertyClosed && (
        <View style={styles.overlay}>
          {/* <Text style={styles.overlayText}>CLOSED</Text> */}
        </View>
      )}
      {/* -------------------------------------------------------- */}
      <View style={styles.MainContainer}>
        <View
          style={[
            {
              // backgroundColor: "rgba(245,245,245, 0.8)",
              flexDirection: "row",
              // justifyContent: "space-between"
            }
          ]}
        >

          <View style={{
            flex: 1,
            flexDirection: "row",
            backgroundColor: isPropertyClosed ? "rgba(128, 128, 128, 0.3)" : "#ffffff",
            marginTop: -5,
            marginBottom: 5,
          }}>
            {displayMatchCount && <TouchableOpacity onPress={() => getMatched(item)}
              accessibilityLabel={`match_${item.property_id?.slice(-6)}`}
              testID={`match_id_${item.property_id?.slice(-6)}`}
            >
              {<View style={{ backgroundColor: 'rgba(234, 155, 20, 0.7)', position: 'absolute', left: 0, top: 0, alignItems: 'center', justifyContent: 'center', width: 50, height: 20, marginLeft: -20 }}>
                <Text style={{ fontSize: 15, fontWeight: '500', color: '#000', paddingLeft: 20 }}>
                  {item.match_count ? item.match_count : 0}
                </Text>
              </View>}
              <View style={{
                position: 'absolute', left: 0, top: 20, transform: [{ rotate: '270deg' }],
                backgroundColor: 'rgba(80, 200, 120, 0.7)', alignItems: 'center', justifyContent: 'center',
                width: 70, height: 30, padding: 0, marginLeft: -20, marginTop: 20, marginBottom: 15
              }}>
                <Text style={{ fontSize: 14, fontWeight: '300', color: '#000' }}>
                  Match
                </Text>
              </View>
            </TouchableOpacity>}
            {displayMatchPercent === true && (
              <>
                {/* <View style={{ justifyContent: 'center', alignItems: 'center' }}> */}

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
                {/* </View> */}
              </>
            )}

            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', }}>
              <View style={{
                flex: 1, alignItems: "flex-start", justifyContent: 'center', paddingLeft: displayMatchPercent ? 1 : 40, paddingRight: 20,
                paddingBottom: 20, paddingTop: 5, minHeight: 90
              }}>
                <Text style={[styles.title]}
                // accessibilityLabel={`header_${item.property_id?.slice(-6)}`}
                // testID={`header_id_${item.property_id?.slice(-6)}`}
                >
                  Sell Off In {item.property_address.building_name},{" "}
                  {item.property_address.landmark_or_street}
                </Text>
                <Text style={{ paddingRight: 10 }}
                // accessibilityLabel={`address_${item.property_id?.slice(-6)}`}
                // testID={`address_id_${item.property_id?.slice(-6)}`}
                >
                  {item.property_address.formatted_address}
                </Text>
                <Text style={{ paddingRight: 10, color: "#0f1a20", marginTop: 5 }}
                  // accessibilityLabel={`ref_${item.property_id?.slice(-6)}`}
                  testID={`ref_id_${item.property_id?.slice(-6)}`}
                >
                  Reference id: {item.property_id?.slice(-6)}
                </Text>
              </View>
              {props.userDetails.works_for === props.userDetails.id && item.agent_id === props.userDetails.id &&
                <TouchableOpacity onPress={() => gotoEmployeeList(item)}
                  accessibilityLabel={`employee_${item.property_id?.slice(-6)}`}
                  testID={`employee_id_${item.property_id?.slice(-6)}`}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', marginBottom: 10, marginTop: 0, marginLeft: 20 }}>
                    {/* <MaterialIcons name="alarm" size={20} color="black" /> */}
                    <Feather name="user-plus" size={20} color="black" />
                    {/* <FontAwesome5 name="user-minus" size={20} color="rgb(70, 69, 69)" />  */}
                    {/* <FontAwesome5 name="user-plus" size={20} color="rgb(111, 104, 104)" /> */}
                    <Text style={{ fontSize: 14, fontWeight: '300', color: '#000', marginLeft: 20, marginRight: 20 }}>
                      {Array.isArray(item.assigned_to_employee_name) && item.assigned_to_employee_name.length > 0
                        ? item.assigned_to_employee_name.join(", ")
                        : "No Employees Assigned"}
                    </Text>
                    {/* <SimpleLineIcons name="user-unfollow" size={20} color="black" /> */}
                  </View>
                </TouchableOpacity>}

            </View>


            {/* <View style={styles.headerContainer}>
              <Text style={[styles.title]}>
                Sell In {item.property_address.building_name},{" "}
                {item.property_address.landmark_or_street}
              </Text>
              <Text style={[StyleSheet.subTitle]}>
                {item.property_address.formatted_address}
              </Text>
            </View> */}
          </View>

          {displayCheckBox ? (
            <View
              style={{
                // backgroundColor: "rgba(108, 198, 114, 0.2)",
                justifyContent: "center"
              }}
            >
              <CheckBox
                onPress={() => onClickCheckBox(item)}
                accessibilityLabel={`checkbox_${item.property_id?.slice(-6)}`}
                testID={`checkbox_id_${item.property_id?.slice(-6)}`}
                center
                // title="Select"
                checked={
                  props.propListForMeeting.some(s => s.id === item.property_id)
                    ? true
                    : false
                }
                containerStyle={{
                  // backgroundColor: "rgba(108, 198, 114, 0.3)",
                  borderWidth: 0,
                  margin: 0,
                  // padding: 30,
                  borderRadius: 10
                  // width: 60
                }}
              />
            </View>
          ) : null}

          {displayCheckBoxForEmployee ? (
            <View
              style={{
                justifyContent: "center",
              }}
            >
              <CheckBox
                onPress={() => onClickCheckBoxForEmployee(item)}
                accessibilityLabel={`emp_checkbox_${item.property_id?.slice(-6)}`}
                testID={`emp_checkbox_id_${item.property_id?.slice(-6)}`}
                center
                checked={isAssetChecked(item)} // Ensure this is tied to the isAssetChecked function
                containerStyle={{
                  borderWidth: 0,
                  margin: 0,
                  borderRadius: 10,
                }}
              />
            </View>
          ) : null}



          {displayChat ? (
            <TouchableOpacity
              onPress={() => onChat(item)}
              style={{ paddingTop: 15 }}
            >
              <View
                style={{
                  // backgroundColor: "rgba(108, 198, 114, 0.2)",
                  justifyContent: "center",
                  marginRight: 15
                }}
              >
                <AntDesign name="message1" color={"#86b9d4"} size={30} />
              </View>
            </TouchableOpacity>
          ) : null}
        </View>

        {!disableDrawer && (
          <Animated.View
            style={[
              styles.drawer,
              {
                width: slidingDrawerWidth,
                transform: [{ translateX: Animation_Interpolate }],
                // overflow: "hidden", // Prevent content overflow
              },
            ]}
            accessibilityLabel={`animated_${item.property_id?.slice(-6)}`}
            testID={`animated_id_${item.property_id?.slice(-6)}`}
          >
            <View style={[styles.Main_Sliding_Drawer_Container, { width: slidingDrawerWidth, paddingHorizontal: 0 }]}>
              {/* Put All Your Components Here Which You Want To Show Inside Sliding Drawer. */}
              <TouchableOpacity
                onPress={ShowSlidingDrawer}
                style={{ paddingTop: 20 }}
                accessibilityLabel={`chevron_left_icon_${item.property_id?.slice(-6)}`}
                testID={`chevron_left_icon_id_${item.property_id?.slice(-6)}`}
              >
                <MaterialCommunityIcons
                  name="chevron-left"
                  color={"#ffffff"}
                  size={30}
                />
              </TouchableOpacity>
              <View style={styles.verticalLine} />
              {(item.agent_id === props.userDetails.works_for && canAddDelete) &&
                <TouchableOpacity
                  // disabled={Sliding_Drawer_Toggle}
                  onPress={() => {
                    setModalVisible(true);
                  }}
                  style={{ padding: 15, backgroundColor: "#e57373" }}
                  accessibilityLabel={`close_sharp_icon_${item.property_id?.slice(-6)}`}
                  testID={`close_sharp_icon_id_${item.property_id?.slice(-6)}`}
                >
                  <Ionicons name="close-sharp" color={"#ffffff"} size={30} />
                </TouchableOpacity>}

              <TouchableOpacity
                onPress={() => onShare(item)}
                style={{ padding: 15, backgroundColor: "#0091ea" }}
                accessibilityLabel={`share_social_icon_${item.property_id?.slice(-6)}`}
                testID={`share_social_icon_id_${item.property_id?.slice(-6)}`}
              >
                <Ionicons name="share-social" color={"#ffffff"} size={30} />
                {/* <Text style={{ fontSize: 8, paddingTop: 5 }}>Share</Text> */}
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => onClickMeeting(item)}
                style={{ padding: 15, backgroundColor: "#ffd600" }}
                accessibilityLabel={`alarm_outline_icon_${item.property_id?.slice(-6)}`}
                testID={`alarm_outline_icon_id_${item.property_id?.slice(-6)}`}
              >
                <Ionicons
                  name="alarm-outline"
                  color={"#ffffff"}
                  size={30}
                />
                {/* <Text style={{ fontSize: 8, paddingTop: 5 }}>Meeting</Text> */}
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => makeCall(item.owner_details.mobile1)}
                style={{ padding: 15, backgroundColor: "#00bfa5" }}
                accessibilityLabel={`call_icon_${item.property_id?.slice(-6)}`}
                testID={`call_icon_id_${item.property_id?.slice(-6)}`}
              >
                <Ionicons name="call" color={"#ffffff"} size={30} />
                {/* <Text style={{ fontSize: 8, paddingTop: 5 }}>Owner</Text> */}
              </TouchableOpacity>
            </View>
          </Animated.View>
        )}
      </View>

      <View style={[styles.detailsContainer]}>
        <View style={[styles.details]}>
          <View style={[styles.subDetails]}>
            <Text style={[styles.subDetailsValue, { marginTop: 5 }]}>
              {item.property_details.bhk_type}
            </Text>
            {/* <Text style={[styles.subDetailsTitle]}>BHK</Text> */}
          </View>
          <View style={styles.verticalLine}></View>
          <View style={[styles.subDetails]}>
            <Text style={[styles.subDetailsValue]}>
              {numDifferentiation(item.sell_details.expected_sell_price)}
            </Text>
            <Text style={[styles.subDetailsTitle]}>Price</Text>
          </View>
          <View style={styles.verticalLine}></View>
          <View style={[styles.subDetails]}>
            <Text style={[styles.subDetailsValue]}>
              {item.property_details.property_size}
            </Text>
            <Text style={[styles.subDetailsTitle]}>Builtup</Text>
          </View>
          <View style={styles.verticalLine}></View>
          <View style={[styles.subDetails]}>
            <Text style={[styles.subDetailsValue]}>
              {item.property_details.furnishing_status}
            </Text>
            <Text style={[styles.subDetailsTitle]}>Furnishing</Text>
          </View>
          {/* <View style={styles.verticalLine}></View>
          <View style={[styles.subDetails]}>
            <Text style={[styles.subDetailsValue]}>800 sqft</Text>
            <Text style={[styles.subDetailsTitle]}>Builtup</Text>
          </View> */}
        </View>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          setModalVisible(false);
        }}
      >
        <View style={styles.centeredView1}>

          <View style={styles.modalView}>
            {isPropertyClosed ? <Text style={styles.modalText}>
              Do you want to open this property?
            </Text> : <Text style={styles.modalText}>
              Did you win deal for this property?
            </Text>}
            {!isPropertyClosed ? <CustomButtonGroup
              buttons={AppConstant.DEAL_WIN_OPTION}
              accessibilityLabelId={`delete_option_${item.property_id?.slice(-6)}`}
              testID={`delete_option_id_${item.property_id?.slice(-6)}`}
              selectedIndices={[AppConstant.DEAL_WIN_OPTION.findIndex(option => option.text === dealWin)]}
              isMultiSelect={false}
              buttonStyle={{ backgroundColor: '#fff' }}
              buttonBorderColor='#E5E4E2'
              selectedButtonStyle={{ backgroundColor: 'rgba(0, 163, 108, .2)' }}
              buttonTextStyle={{ color: '#000' }}
              selectedButtonTextStyle={{ color: '#000' }}
              width={100}
              onButtonPress={(index, button) => {
                console.log(`Button pressed: ${button.text} (Index: ${index})`);
                setDealWin(button.text);
                // Query update is handled by useEffect after state change
              }}

            /> : null}
            {
              !isPropertyClosed ? (canDelete ? <Text style={{ marginBottom: 50, fontSize: 12, marginTop: 20 }}>You can close or delete property. Close will keep property in list for 10 days, Delete will remove permanently.</Text> :
                <Text style={{ marginBottom: 50, fontSize: 12, marginTop: 20 }}>You can close property. Close will keep property in list for 10 days. </Text>) : null
            }

            <View
              style={{
                position: "absolute",
                flexDirection: "row",
                right: 0,
                bottom: 0,
                marginTop: 20,
                marginBottom: 20,
                padding: 20
                // justifyContent: "flex-end"
              }}
            >
              {canDelete ? <TouchableHighlight
                style={{ ...styles.applyButton }}
                onPress={() => {
                  deleteMe(item);
                  setModalVisible(!modalVisible);
                }}
              >
                <Text style={styles.textStyle}>Delete</Text>
              </TouchableHighlight> : null}

              <TouchableHighlight
                style={{ ...styles.applyButton }}
                onPress={() => {
                  closeMe(item);
                  setModalVisible(!modalVisible);
                }}
              >
                <Text style={styles.textStyle}>{isPropertyClosed ? "Open" : "Close"}</Text>
              </TouchableHighlight>

              <TouchableHighlight
                style={{ ...styles.cancelButton }}
                onPress={() => {
                  setModalVisible(!modalVisible);
                }}
              >
                <Text style={styles.textStyle}>Cancel</Text>
              </TouchableHighlight>


            </View>

          </View>
        </View>
      </Modal>
      {/* modal for chat */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={chatModalVisible}
        onRequestClose={() => {
          setChatModalVisible(false);
        }}
      >
        <View style={styles.centeredView1}>
          <View style={styles.modalView}>
            <Text style={{ color: "616161", fontSize: 16 }}>
              Enter your message
            </Text>
            <TextInput
              style={{
                height: 90,
                width: "95%",
                margin: 12,
                borderWidth: 1,
                borderColor: "rgba(191, 191, 191, 1)",
                padding: 7,
                color: "#616161"
              }}
              multiline
              numberOfLines={10}
              onChangeText={onChangeText}
              value={message}
              placeholder={message}
            // keyboardType="numeric"
            />

            <View
              style={{
                position: "absolute",
                flexDirection: "row",
                right: 0,
                bottom: 0,
                marginTop: 20,
                marginBottom: 20,
                padding: 20
                // justifyContent: "flex-end"
              }}
            >
              <TouchableHighlight
                style={{ ...styles.cancelButton }}
                onPress={() => {
                  setChatModalVisible(!chatModalVisible);
                }}
              >
                <Text style={styles.textStyle}>Cancel</Text>
              </TouchableHighlight>
              <TouchableHighlight
                style={{ ...styles.applyButton }}
                onPress={() => sendMessage()}
              >
                <Text style={styles.textStyle}>Send</Text>
              </TouchableHighlight>
            </View>
          </View>
        </View>
      </Modal>
    </View>
    // </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    justifyContent: "center",
    shadowOpacity: 0.0015 * 5 + 0.18,
    shadowRadius: 0.54 * 5,
    shadowOffset: {
      height: 0.6 * 5
    },
    backgroundColor: "white",
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  cardImage: {
    // alignSelf: "stretch",
    marginBottom: 16,
    flex: 1,
    width: "100%",
    height: "auto",
    topborderleftRadius: 15,
    topborderRightRadius: 15,
    // justifyContent: "center",
    // alignItems: "stretch"
  },
  headerContainer: {
    flex: 1,
    flexDirection: "column",
    alignItems: "flex-start",
    // paddingRight: 16,
    // paddingLeft: 16,
    // paddingBottom: 16,
    // paddingTop: 16,
    // width: "100%",
    backgroundColor: "#ffffff"
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    paddingRight: 15
  },
  subTitle: {
    fontSize: 14,
    fontWeight: "400",
    color: "rgba(255 ,255 ,255 , 0.87)"
  },
  detailsContainer: {
    // borderBottomWidth: 1,
    borderTopColor: "#DCDCDC",
    borderBottomColor: "#DCDCDC",
    borderTopWidth: 1,
    borderBottomWidth: 1,
    marginBottom: 3
  },

  details: {
    padding: 10,
    flexDirection: "row",
    justifyContent: "space-between"
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
    height: "100%",
    width: 1,
    backgroundColor: "#909090"
  },
  MainContainer: {
    // flex: 1,
    // justifyContent: "center",
    // alignItems: "center"
  },

  Root_Sliding_Drawer_Container: {
    position: "absolute",
    flexDirection: "row",
    // left: 0,
    // bottom: 0,
    // top: Platform.OS == "ios" ? 20 : 0,
    // width: Sliding_Drawer_Width
  },

  Main_Sliding_Drawer_Container: {
    // flex: 1,
    flexDirection: "row",
    backgroundColor: "#616161",
    height: 67
    // paddingHorizontal: 10
    // justifyContent: "center",
    // alignItems: "center"
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
    marginBottom: 20
  },
  modalView: {
    margin: 20,
    height: 250,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  applyButton: {
    // backgroundColor: "#F194FF",
    // width: 150,
    // textAlign: "center",
    // borderRadius: 20,
    // paddingLeft: 60,
    // paddingRight: 20,
    // paddingTop: 10,
    // paddingBottom: 10,
    // elevation: 2,
    marginLeft: 10,
    marginRight: 10
  },

  cancelButton: {
    // backgroundColor: "#F194FF",
    // width: 150,
    // textAlign: "center",
    // borderRadius: 20,
    // paddingLeft: 55,
    // paddingRight: 20,
    // paddingTop: 10,
    // paddingBottom: 10,
    // elevation: 2,
    marginLeft: 10,
    marginRight: 30
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  },
  drawer: {
    position: "absolute",
    // top: Platform.OS == "ios" ? 20 : 0,
    right: 0,
    // bottom: 0,
    alignContent: "center",
    // width: Sliding_Drawer_Width,
    flexDirection: "row"
  }
});

const mapStateToProps = state => ({
  userDetails: state.AppReducer.userDetails,
  propReminderList: state.AppReducer.propReminderList,
  propListForMeeting: state.AppReducer.propListForMeeting
});

const mapDispatchToProps = {
  setUserMobile,
  setUserDetails,
  setPropReminderList,
  setPropListForMeeting,
  setCustomerDetailsForMeeting,
  setStartNavigationPoint,
  setPropertyDetails
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Card);

// export default Card;
