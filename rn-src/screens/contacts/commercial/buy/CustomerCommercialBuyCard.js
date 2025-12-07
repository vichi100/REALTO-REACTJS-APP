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
import DoughnutChart from "./../../../../components/DoughnutChart";
import Ionicons from "react-native-vector-icons/Ionicons";
import { ButtonGroup } from "@rneui/themed";
import { Avatar } from "@rneui/themed";
import AntDesign from "react-native-vector-icons/AntDesign";
import { CheckBox } from "@rneui/themed";
import { numDifferentiation } from "././../../../../utils/methods";
import { SERVER_URL } from "./../../../../utils/Constant";
import { EMPLOYEE_ROLE, EMPLOYEE_ROLE_DELETE } from "././../../../../utils/AppConstant";
import { connect } from "react-redux";
import {
  setUserMobile,
  setUserDetails,
  setPropReminderList,
  setPropListForMeeting,
  setCustomerDetailsForMeeting,
  setStartNavigationPoint,
  setCustomerDetails
} from "./../../../../reducers/Action";
import axios from "axios";
import Feather from "react-native-vector-icons/Feather";
import { makeCall } from "../../../../utils/methods";
import * as  AppConstant from "../../../../utils/AppConstant";
import CustomButtonGroup from "./../../../../components/CustomButtonGroup";

// https://reactnativecode.com/create-custom-sliding-drawer-using-animation/
// https://www.skptricks.com/2019/05/react-native-custom-animated-sliding-drawer.html

// const Sliding_Drawer_Width = 250;
// const Sliding_Drawer_Width = 195;

const width = Dimensions.get("window").width;

const CustomerCommercialBuyCard = props => {
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
  let animatedValue = new Animated.Value(0);
  let toggleFlag = 0;
  const [disabled, setDisabled] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [index, setIndex] = React.useState(null);
  const [chatModalVisible, setChatModalVisible] = useState(false);
  const [refresh, setRefresh] = useState(false); // Add a state to trigger re-render
  // const [text, onChangeText] = React.useState("I have customer for this property. Please call me.");

  const [Sliding_Drawer_Width, setSlidingDrawerWidth] = useState(194);
  const [Sliding_Drawer_Width_WO_Delete, setSlidingDrawerWidthWODelete] = useState(140);

  const [dealWin, setDealWin] = useState("Yes");

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
    // Dynamically update the sliding drawer width based on the condition
    if (item && item.agent_id === props.userDetails.works_for) {
      setSlidingDrawerWidth(195); // Increase width
    } else {
      setSlidingDrawerWidth(140); // Default width if dont want to see delete option 140
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

  const onChangeText = text => {
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
    props.setCustomerDetails(item)
    navigation.navigate("CustomerMeeting", {
      item: item,
      category: "customer"
    })
  };

  return (
    <View style={[styles.card, iscustomerClosed && {
      opacity: 0.6,
      backgroundColor: 'rgba(128, 128, 128, 0.3)' // Adds semi-transparent gray
    }]}>
      <View style={styles.MainContainer}>
        <View
          style={[
            {
              flexDirection: "row",
              alignItems: "flex-start",
              // paddingRight: 16,
              // paddingLeft: 16,
              // paddingBottom: 16,
              // paddingTop: 16,
              width: "100%",
              backgroundColor: iscustomerClosed ? "rgba(128, 128, 128, 0.2)" : "#ffffff",
            }
            // { backgroundColor: "rgba(245,245,245, 0.8)" }
          ]}
        >

          {displayMatchCount === true && (
            <>
              <TouchableOpacity onPress={() => getMatched(item)}
                accessibilityLabel={`match_${item.customer_id?.slice(-6)}`}
                testID={`match_id_${item.customer_id?.slice(-6)}`}
                style={{ width: 1, height: 1 }}
              >
                <View style={{ backgroundColor: 'rgba(234, 155, 20, 0.7)', position: 'absolute', left: 0, top: 0, alignItems: 'center', justifyContent: 'center', width: 50, height: 20, marginLeft: -20 }}>
                  <Text style={{ fontSize: 15, fontWeight: '500', color: '#000', paddingLeft: 20 }}>{item.match_count ? item.match_count : 0}</Text>
                </View>
                <View style={{
                  position: 'absolute', left: 0, top: 20, transform: [{ rotate: '270deg' }],
                  backgroundColor: 'rgba(80, 200, 120, 0.7)', alignItems: 'center', justifyContent: 'center',
                  width: 70, height: 30, padding: 0, marginLeft: -20, marginTop: 20, marginBottom: 15
                }}
                  testID={`match_idx_${item.customer_id?.slice(-6)}`}
                >
                  <Text style={{ fontSize: 14, fontWeight: '300', color: '#000' }}>Match</Text>
                </View>
              </TouchableOpacity>
            </>
          )}

          {displayMatchPercent === true && (
            <>
              <View style={{ justifyContent: 'center', alignItems: 'center' }}>
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
              </View>
            </>
          )}

          <View style={{ marginLeft: !displayMatchPercent ? 40 : 0, }}>
            {!displayMatchPercent && <Avatar
              square
              size={60}
              title={
                item.customer_details.name &&
                item.customer_details.name.slice(0, 1)
              }
              activeOpacity={0.7}
              titleStyle={{ color: "rgba(105,105,105, .9)" }}
              // source={{
              //   uri: props.item.photo
              // }}
              avatarStyle={{
                borderWidth: 1,
                borderColor: "rgba(127,255,212, .9)",
                // borderTopLeftRadius: 1,
                borderStyle: "solid"
              }}
            />}
          </View>


          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              flex: 1
            }}
          >
            <View style={{ paddingLeft: 20, paddingTop: 10 }}>
              <Text style={[styles.title]}
              // accessibilityLabel={`name_${item.customer_id?.slice(-6)}`}
              // testID={`name_id_${item.customer_id?.slice(-6)}`}
              >
                {item.customer_details.name}
              </Text>
              <View style={{ flexDirection: "row", alignItems: "center", marginTop: 5 }}>
                <MaterialCommunityIcons name="phone-dial" color={"#0f1a20"} size={20} />
                <Text style={[styles.subTitle, { paddingLeft: 10, color: "#0f1a20" }]}
                // accessibilityLabel={`mobile_${item.customer_id?.slice(-6)}`}
                // testID={`mobile_id_${item.customer_id?.slice(-6)}`}
                >
                  {item.customer_details.mobile1?.startsWith("+91")
                    ? item.customer_details.mobile1
                    : `+91 ${item.customer_details.mobile1}`}
                </Text>
              </View>
              <Text style={{ paddingRight: 10, color: "#0f1a20", marginTop: 5, marginBottom: 5 }}
                // accessibilityLabel={`ref_${item.customer_id?.slice(-6)}`}
                testID={`ref_id_${item.customer_id?.slice(-6)}`}
              >
                Reference id: {item.customer_id?.slice(-6)}
              </Text>

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
                  accessibilityLabel={`checkbox_${item.customer_id?.slice(-6)}`}
                  testID={`checkbox_id_${item.customer_id?.slice(-6)}`}
                  center
                  // title="Select"
                  checked={
                    props.customerDetailsForMeeting &&
                      props.customerDetailsForMeeting.customer_id ===
                      item.customer_id
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
                  accessibilityLabel={`emp_checkbox_${item.customer_id?.slice(-6)}`}
                  testID={`emp_checkbox_id_${item.customer_id?.slice(-6)}`}
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
        </View>

        {disableDrawer ? null : (
          <Animated.View
            style={[
              styles.drawer,
              { width: slidingDrawerWidth, transform: [{ translateX: Animation_Interpolate }] },
            ]}
            accessibilityLabel={`animated_${item.customer_id?.slice(-6)}`}
            testID={`animated_id_${item.customer_id?.slice(-6)}`}
          >
            <View style={[styles.Main_Sliding_Drawer_Container, { width: slidingDrawerWidth, paddingHorizontal: 0 }]}>
              {/* Put All Your Components Here Which You Want To Show Inside Sliding Drawer. */}
              <TouchableOpacity
                onPress={ShowSlidingDrawer}
                style={{ paddingTop: 20 }}
                accessibilityLabel={`chevron_left_icon_${item.customer_id?.slice(-6)}`}
                testID={`chevron_left_icon_id_${item.customer_id?.slice(-6)}`}
              >
                <MaterialCommunityIcons
                  name="chevron-left"
                  color={"#ffffff"}
                  size={30}
                />
              </TouchableOpacity>
              <View style={styles.verticalLine} />
              {(item.agent_id === props.userDetails.works_for && canAddDelete) && <TouchableOpacity
                // disabled={Sliding_Drawer_Toggle}
                onPress={() => {
                  setModalVisible(true);
                }}
                style={{ padding: 15, backgroundColor: "#e57373" }}
                accessibilityLabel={`close_sharp_icon_${item.customer_id?.slice(-6)}`}
                testID={`close_sharp_icon_id_${item.customer_id?.slice(-6)}`}
              >
                <Ionicons name="close-sharp" color={"#ffffff"} size={30} />
              </TouchableOpacity>
              }

              {/* <TouchableOpacity
                        onPress={() => onShare()}
                        style={{ padding: 15, backgroundColor: "#0091ea" }}
                      >
                        <Ionicons name="share-social" color={"#ffffff"} size={30} />
                      </TouchableOpacity> */}
              <TouchableOpacity
                onPress={() => onClickMeeting(item)}
                style={{ padding: 15, backgroundColor: "#ffd600" }}
                accessibilityLabel={`alarm_outline_icon_${item.customer_id?.slice(-6)}`}
                testID={`alarm_outline_icon_id_${item.customer_id?.slice(-6)}`}
              >
                <Ionicons
                  name="alarm-outline"
                  color={"#ffffff"}
                  size={30}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => makeCall(item.customer_details.mobile1)}
                style={{ padding: 15, backgroundColor: "#00bfa5" }}
                accessibilityLabel={`call_icon_${item.customer_id?.slice(-6)}`}
                testID={`call_icon_id_${item.customer_id?.slice(-6)}`}
              >
                <Ionicons name="call" color={"#ffffff"} size={30} />
                {/* <Text style={{ fontSize: 8, paddingTop: 5 }}>OWNER</Text> */}
              </TouchableOpacity>
            </View>
          </Animated.View>
        )}
      </View>

      <View
        style={{
          flexDirection: "row",
          paddingLeft: 30, backgroundColor: "rgba(220,220,220, .2)"
        }}>
        <Ionicons
          name="location-sharp"
          color={"#000"}
          size={16}
          style={{ marginLeft: 10, marginTop: 10 }}
        />
        <Text style={[styles.subTitleA, { marginLeft: 10, marginRight: 10, paddingTop: 5, paddingBottom: 5 }]}>
          {item.customer_locality.location_area.map(item => item.main_text).join(', ')}
        </Text>
      </View>

      {props.userDetails.works_for === props.userDetails.id && item.agent_id === props.userDetails.id &&
        <TouchableOpacity onPress={() => gotoEmployeeList(item)} testID={`goto_employee_list_${item.customer_id?.slice(-6)}`}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 10, marginTop: 10, marginLeft: 20 }}>
            <Feather name="user-plus" size={20} color="black" />
            <Text style={{ fontSize: 14, fontWeight: '300', color: '#000', marginLeft: 20, marginRight: 20 }}>
              {Array.isArray(item.assigned_to_employee_name) && item.assigned_to_employee_name.length > 0
                ? item.assigned_to_employee_name.join(", ")
                : "No Employees Assigned"}
            </Text>
          </View>
        </TouchableOpacity>}

      <View style={[styles.detailsContainer]}>
        <View style={[styles.details]}>
          <View style={[styles.subDetails]}>
            <Text style={[styles.subDetailsValue, { marginTop: 5 }]}>
              {item.customer_property_details.property_used_for}
            </Text>
            <Text style={[styles.subDetailsTitle]}>Prop Type</Text>
          </View>
          <View style={styles.verticalLine}></View>
          <View style={[styles.subDetails]}>
            <Text style={[styles.subDetailsValue]}>
              {numDifferentiation(item.customer_buy_details.expected_buy_price)}
            </Text>
            <Text style={[styles.subDetailsTitle]}>Buy</Text>
          </View>
          <View style={styles.verticalLine}></View>
          <View style={[styles.subDetails]}>
            <Text style={[styles.subDetailsValue]}>
              {item.customer_property_details.building_type}
            </Text>
            <Text style={[styles.subDetailsTitle]}>Building Type</Text>
          </View>
          {/* <View style={styles.verticalLine}></View>
          <View style={[styles.subDetails]}>
            <Text style={[styles.subDetailsValue]}>
              {item.customer_property_details.furnishing_status}
            </Text>
            <Text style={[styles.subDetailsTitle]}>Furnishing</Text>
          </View> */}
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
            {iscustomerClosed ? <Text style={styles.modalText}>
              Do you want to open this customer?
            </Text> : <Text style={styles.modalText}>
              Did you win deal for this customer?
            </Text>}
            {!iscustomerClosed ? <CustomButtonGroup
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
              !iscustomerClosed ? (canDelete ? <Text style={{ marginBottom: 50, fontSize: 12, marginTop: 20 }}>You can close or delete customer. Close will keep customer in list for 10 days, Delete will remove permanently.</Text> :
                <Text style={{ marginBottom: 50, fontSize: 12, marginTop: 20 }}>You can close customer. Close will keep customer in list for 10 days. </Text>) : null
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
                <Text style={styles.textStyle}>{iscustomerClosed ? "Open" : "Close"}</Text>
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
      {/* message modal  */}
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
  );
};

const styles = StyleSheet.create({
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
    marginTop: 2
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
    flexDirection: "column",
    alignItems: "flex-start",
    paddingRight: 16,
    paddingLeft: 16,
    paddingBottom: 16,
    paddingTop: 16,
    width: "100%",
    backgroundColor: "#ffffff"
  },
  title: {
    fontSize: 16,
    fontWeight: "600"
  },
  subTitle: {
    fontSize: 14,
    fontWeight: "400",
    color: "rgba(255 ,255 ,255 , 0.87)"
  },
  detailsContainer: {
    // borderBottomWidth: 1,
    // borderTopColor: "#ffffff",
    borderBottomColor: "#bdbdbd",
    // borderTopWidth: 1,
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
    height: 63
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
    height: 300,
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
    bottom: 0,
    // width: Sliding_Drawer_Width,
    flexDirection: "row"
  }
});

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
  setCustomerDetails
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CustomerCommercialBuyCard);
