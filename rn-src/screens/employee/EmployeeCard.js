import React, { useState, useEffect } from "react";
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
  TextInput,
} from "react-native";
import { connect } from "react-redux";
import DoughnutChart from "./../../components/DoughnutChart";
import { CheckBox } from "@rneui/themed";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Ionicons from "react-native-vector-icons/Ionicons";
import AntDesign from "react-native-vector-icons/AntDesign";
import { ButtonGroup } from "@rneui/themed";
import { Avatar } from "@rneui/themed";
import { numDifferentiation } from "././../../utils/methods";
import { SERVER_URL } from "./../../utils/Constant";
import {
  setUserMobile,
  setUserDetails,
  setPropReminderList,
  setPropListForMeeting,
  setCustomerDetailsForMeeting,
  setStartNavigationPoint,
  setCustomerDetails
} from "./../../reducers/Action";
import axios from "axios";
import { makeCall, camalize } from "../../utils/methods";

// https://reactnativecode.com/create-custom-sliding-drawer-using-animation/
// https://www.skptricks.com/2019/05/react-native-custom-animated-sliding-drawer.html

const Sliding_Drawer_Width = 195;
const width = (Dimensions && typeof Dimensions.get === "function")
  ? Dimensions.get("window").width
  : 400;

const EmployeeCard = props => {
  const {
    navigation,
    item,
    disableDrawer = false,
    displayCheckBox = false,
    displayChat,
    deleteMe,
    navigatedFrom = "none",
    displayMatchCount = true,
    displayMatchPercent = false,
    itemForAddEmplyee = null,// this will pass value from property or customer card
  } = props;
  // console.log("ContactResidentialRentCard :    ", item);
  let animatedValue = new Animated.Value(0);
  let toggleFlag = 0;
  let Animation = new Animated.Value(0);
  let Sliding_Drawer_Toggle = true;
  const [disabled, setDisabled] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [index, setIndex] = useState(-1);
  const [chatModalVisible, setChatModalVisible] = useState(false);
  const [refresh, setRefresh] = useState(false); // Add a state to trigger re-render
  const [loading, setLoading] = useState(false);

  // const [text, onChangeText] = React.useState("I have customer for this property. Please call me.");
  const [message, setMessage] = useState(
    "I have property for this customer. Please call me. "
  );

  const getMatched = (matchedCustomerItem) => {
    navigation.navigate('MatchedProperties', { matchedCustomerItem: matchedCustomerItem },);
  }

  const {
    assigned_residential_rent_properties = [],
    assigned_residential_sell_properties = [],
    assigned_commercial_rent_properties = [],
    assigned_commercial_sell_properties = [],
    assigned_residential_rent_customers = [],
    assigned_residential_buy_customers = [],
    assigned_commercial_rent_customers = [],
    assigned_commercial_buy_customers = [],
  } = item || {}; // Ensure item is not null or undefined

  const totalAssignedProperties =
    (assigned_residential_rent_properties?.length || 0) +
    (assigned_residential_sell_properties?.length || 0) +
    (assigned_commercial_rent_properties?.length || 0) +
    (assigned_commercial_sell_properties?.length || 0);

  const totalAssignedCustomers =
    (assigned_residential_rent_customers?.length || 0) +
    (assigned_residential_buy_customers?.length || 0) +
    (assigned_commercial_rent_customers?.length || 0) +
    (assigned_commercial_buy_customers?.length || 0);

  // check if item type is customer or property
  // check it item is for rent or sell/Buy
  // check if item is commercial or residential
  // check this item id is in employee agssigned list
  // if it is then return true else return false

  const isChecked = (item) => {
    const {
      assigned_residential_rent_properties,
      assigned_residential_sell_properties,
      assigned_commercial_rent_properties,
      assigned_commercial_sell_properties,
      assigned_residential_rent_customers,
      assigned_residential_buy_customers,
      assigned_commercial_rent_customers,
      assigned_commercial_buy_customers
    } = item; // Assuming employeeList contains the assigned lists

    // // Determine if the item is a property or a customer
    let isProperty = false;
    let isCustomer = false;
    if (!itemForAddEmplyee || !itemForAddEmplyee.property_id) {
      // isProperty = false; // Return false if property_id is missing
      isCustomer = true;
    }
    else if (!itemForAddEmplyee || !itemForAddEmplyee.customer_id) {
      isProperty = true; // Return false if property_id is missing
      // isCustomer = false;
    }


    let isForRent = false;
    let isForSell = false;
    let isCommercial = false;
    let isResidential = false;


    // Check if the item ID exists in the appropriate assigned list
    if (isProperty) {
      // Determine if the item is for rent or sell/buy
      if (!itemForAddEmplyee || itemForAddEmplyee.property_for === undefined || itemForAddEmplyee.property_for === null) {
        isForRent = false;
      } else {
        isForRent = itemForAddEmplyee.property_for === "Rent";
      }
      if (!itemForAddEmplyee || itemForAddEmplyee.property_for === undefined || itemForAddEmplyee.property_for === null) {
        isForSell = false;
      } else {
        isForSell = itemForAddEmplyee.property_for === "Sell" || itemForAddEmplyee.property_for === "Buy";
      }

      // Determine if the item is commercial or residential
      if (!itemForAddEmplyee || itemForAddEmplyee.property_type === undefined || itemForAddEmplyee.property_type === null) {
        isCommercial = false;
      } else {
        isCommercial = itemForAddEmplyee.property_type === "Commercial";
      }
      if (!itemForAddEmplyee || itemForAddEmplyee.property_type === undefined || itemForAddEmplyee.property_type === null) {
        isResidential = false;
      } else {
        isResidential = itemForAddEmplyee.property_type === "Residential";
      }

      if (isResidential && isForRent) {
        return Array.isArray(assigned_residential_rent_properties) && assigned_residential_rent_properties.includes(itemForAddEmplyee.property_id);
      } else if (isResidential && isForSell) {
        return Array.isArray(assigned_residential_sell_properties) && assigned_residential_sell_properties.includes(itemForAddEmplyee.property_id);
      } else if (isCommercial && isForRent) {
        return Array.isArray(assigned_commercial_rent_properties) && assigned_commercial_rent_properties.includes(itemForAddEmplyee.property_id);
      } else if (isCommercial && isForSell) {
        return Array.isArray(assigned_commercial_sell_properties) && assigned_commercial_sell_properties.includes(itemForAddEmplyee.property_id);
      }
    } else if (isCustomer) {
      // Determine if the item is for rent or sell/buy
      isForRent = itemForAddEmplyee.customer_locality.property_for === "Rent";
      isForSell = itemForAddEmplyee.customer_locality.property_for === "Sell" || itemForAddEmplyee.customer_locality.property_for === "Buy";

      // Determine if the item is commercial or residential
      isCommercial = itemForAddEmplyee.customer_locality.property_type === "Commercial";
      isResidential = itemForAddEmplyee.customer_locality.property_type === "Residential";
      if (isResidential && isForRent) {
        return Array.isArray(assigned_residential_rent_customers) && assigned_residential_rent_customers.includes(itemForAddEmplyee.customer_id);
      } else if (isResidential && isForSell) {
        return Array.isArray(assigned_residential_buy_customers) && assigned_residential_buy_customers.includes(itemForAddEmplyee.customer_id);
      } else if (isCommercial && isForRent) {
        return Array.isArray(assigned_commercial_rent_customers) && assigned_commercial_rent_customers.includes(itemForAddEmplyee.customer_id);
      } else if (isCommercial && isForSell) {
        return Array.isArray(assigned_commercial_buy_customers) && assigned_commercial_buy_customers.includes(itemForAddEmplyee.customer_id);
      }
    }

    // If none of the conditions match, return false
    return false;
  };

  const openPropertiesList = item => {
    navigation.navigate("PropertyListing", {
      item: item,
      displayMatchCount: true,
      displayMatchPercent: false
    });
  };
  const openCustomerList = item => {
    navigation.navigate("ContactsListing", {
      item: item,
      displayMatchCount: true,
      displayMatchPercent: false
    });
  };

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

  useEffect(() => {
    // console.log("useEffect", props.customerDetailsForMeeting);
  }, [props.customerDetailsForMeeting]);

  const updateIndex = index => {
    setIndex(index);
  };

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
    outputRange: [Sliding_Drawer_Width - 33, -15]
  });

  // const makeCall = item => {
  //   const mobile = item.customer_details.mobile1;
  //   const url = "tel://" + mobile;
  //   Linking.openURL(url);
  // };

  const checkDeleteDecision = (item) => {
    if (index === 0) {
      deleteMe(item);
      setModalVisible(false);
      Animated.timing(Animation, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true
      }).start(() => {
        Sliding_Drawer_Toggle = false;
      });
    }
    if (index === 1) {
      setModalVisible(false);
    }

  }

  const editEmployee = async (empData) => {
    // https://docs.expo.io/versions/latest/react-native/share/
    try {
      navigation.navigate("ManageEmployee", { empData: empData, editEmp: true },);
    } catch (error) {
      alert(error.message);
    }
  };

  const onClickCheckBox = (item) => {
    const wasChecked = isChecked(item); // Check the current state
    console.log("Checkbox was", wasChecked ? "selected" : "unselected");
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
      if (!itemForAddEmplyee || itemForAddEmplyee.property_for === undefined || itemForAddEmplyee.property_for === null) {
        isForRent = false;
      } else {
        isForRent = itemForAddEmplyee.property_for === "Rent";
      }
      if (!itemForAddEmplyee || itemForAddEmplyee.property_for === undefined || itemForAddEmplyee.property_for === null) {
        isForSell = false;
      } else {
        isForSell = itemForAddEmplyee.property_for === "Sell" || itemForAddEmplyee.property_for === "Buy";
      }

      if (!itemForAddEmplyee || itemForAddEmplyee.property_type === undefined || itemForAddEmplyee.property_type === null) {
        isCommercial = false;
      } else {
        isCommercial = itemForAddEmplyee.property_type === "Commercial";
      }
      if (!itemForAddEmplyee || itemForAddEmplyee.property_type === undefined || itemForAddEmplyee.property_type === null) {
        isResidential = false;
      } else {
        isResidential = itemForAddEmplyee.property_type === "Residential";
      }

      if (isResidential && isForRent) {
        toggleSelection(assigned_residential_rent_properties, itemForAddEmplyee.property_id);
      } else if (isResidential && isForSell) {
        toggleSelection(assigned_residential_sell_properties, itemForAddEmplyee.property_id);
      } else if (isCommercial && isForRent) {
        toggleSelection(assigned_commercial_rent_properties, itemForAddEmplyee.property_id);
      } else if (isCommercial && isForSell) {
        toggleSelection(assigned_commercial_sell_properties, itemForAddEmplyee.property_id);
      }
    } else if (isCustomer) {
      isForRent = itemForAddEmplyee.customer_locality.property_for === "Rent";
      isForSell = itemForAddEmplyee.customer_locality.property_for === "Sell" || itemForAddEmplyee.customer_locality.property_for === "Buy";

      isCommercial = itemForAddEmplyee.customer_locality.property_type === "Commercial";
      isResidential = itemForAddEmplyee.customer_locality.property_type === "Residential";

      if (isResidential && isForRent) {
        toggleSelection(assigned_residential_rent_customers, itemForAddEmplyee.customer_id);
      } else if (isResidential && isForSell) {
        toggleSelection(assigned_residential_buy_customers, itemForAddEmplyee.customer_id);
      } else if (isCommercial && isForRent) {
        toggleSelection(assigned_commercial_rent_customers, itemForAddEmplyee.customer_id);
      } else if (isCommercial && isForSell) {
        toggleSelection(assigned_commercial_buy_customers, itemForAddEmplyee.customer_id);
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

  // Helper function to toggle selection
  const toggleSelection = (list, id) => {
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

  const onClickMeeting = item => {
    console.log(item)
    props.setCustomerDetailsForMeeting(null);
    // props.setPropListForMeeting([]);
    props.setStartNavigationPoint("PropertyListForMeeting");
    props.setCustomerDetails(item);
    navigation.navigate("CustomerMeeting", {
      item: item,
      category: "customer"
    });
  };

  return (
    <View style={styles.card}>
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
              // width: "100%",
              backgroundColor: "#ffffff",
              justifyContent: 'center'

            }
            // { backgroundColor: "rgba(245,245,245, 0.8)" }
          ]}
        >





          <View style={{ marginLeft: !displayMatchPercent ? 10 : 0, alignItems: 'center', marginBottom: 5, justifyContent: 'center' }}>
            <Avatar
              square
              size={55}
              title={
                item.name &&
                item.name.slice(0, 1)
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
                borderStyle: "solid",

              }}
            />
            {item.employee_role == "admin" ?
              <Text style={{ fontSize: 15, fontWeight: 500, color: "rgba(255, 34, 0, 1)" }}>{camalize(item.employee_role)} </Text> :
              item.employee_role == "master" ?
                <Text style={{ fontSize: 15, fontWeight: 500, color: "rgba(249, 105, 14, .8)" }}>{camalize(item.employee_role)} </Text> :
                item.employee_role == "add" ?
                  <Text style={{ fontSize: 15, fontWeight: 500, color: "rgba(25, 181, 254, 1))" }}>{camalize(item.employee_role)} </Text> :
                  <Text style={{ fontSize: 15, fontWeight: 500, color: "rgba(22, 160, 133, 1)" }}>{camalize(item.employee_role)} </Text>}
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              // alignItems: "center",
              flex: 1
            }}
          >
            <View style={{ paddingLeft: 20, paddingTop: 20 }}>
              <Text style={[styles.title]}>{item.name} </Text>
              <Text style={[styles.subTitle]}>
                {item.mobile}
              </Text>
              {/* <Text style={[StyleSheet.subTitle]}>
               {item.employee_role == "admin" ?
                  <Text style={{ fontSize: 15, fontWeight: 500, color: "rgba(255, 76, 48, .9)" }}>{camalize(item.employee_role)} </Text> :
                  item.employee_role == "master" ?
                    <Text style={{ fontSize: 15, fontWeight: 500, color: "rgba(249, 105, 14, 1)" }}>{camalize(item.employee_role)} </Text> :
                    item.employee_role == "add" ?
                      <Text style={{ fontSize: 15, fontWeight: 500, color: "rgba(25, 181, 254, 1))" }}>{camalize(item.employee_role)} </Text> :
                      <Text style={{ fontSize: 15, fontWeight: 500, color: "rgba(22, 160, 133, 1)" }}>{camalize(item.employee_role)} </Text>}
              </Text> */}
            </View>
            {/* <View style={{marginRight:50}}>

            {item.employee_role == "admin" ?
            <Text style={{fontSize:15, fontWeight:500, color:"rgba(255, 76, 48, .9)"}}>{camalize(item.employee_role)} </Text> : 
            item.employee_role == "master" ? 
            <Text style={{fontSize:15, fontWeight:500, color:"rgba(249, 105, 14, 1)" }}>{camalize(item.employee_role)} </Text> : 
            item.employee_role == "add" ? 
            <Text style={{fontSize:15, fontWeight:500, color:"rgba(25, 181, 254, 1))" }}>{camalize(item.employee_role)} </Text> :
            <Text style={{fontSize:15, fontWeight:500, color:"rgba(22, 160, 133, 1)" }}>{camalize(item.employee_role)} </Text>}
            </View> */}



          </View>
        </View>

        {displayCheckBox ? (
          <View
            style={{
              position: "absolute", // Use absolute positioning
              top: 10, // Adjust top margin
              right: 10, // Adjust right margin
              zIndex: 1000, // Ensure it appears above other elements
            }}
          >
            <CheckBox
              onPress={() => {
                onClickCheckBox(item);
                setRefresh(!refresh); // Trigger re-render
              }}
              center
              checked={isChecked(item)} // Ensure this is tied to the isChecked function
              containerStyle={{
                backgroundColor: "transparent", // Transparent background
                borderWidth: 0, // Remove border
                padding: 0, // Remove padding
              }}
            />
          </View>
        ) : null}

        {!disableDrawer && (
          <Animated.View
            style={[
              styles.drawer,
              { transform: [{ translateX: Animation_Interpolate }] }
            ]}
          >
            <View style={styles.Main_Sliding_Drawer_Container}>
              {/* Put All Your Components Here Which You Want To Show Inside Sliding Drawer. */}
              <TouchableOpacity
                onPress={ShowSlidingDrawer}
                style={{ paddingTop: 20 }}
              >
                <MaterialCommunityIcons
                  name="chevron-left"
                  color={"#ffffff"}
                  size={30}
                />
              </TouchableOpacity>
              <View style={styles.verticalLine} />
              <TouchableOpacity
                // disabled={Sliding_Drawer_Toggle}
                onPress={() => {
                  setModalVisible(true);
                }}
                style={{ padding: 15, backgroundColor: "#e57373" }}
              >
                <Ionicons name="close-sharp" color={"#ffffff"} size={30} />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => editEmployee(item)}
                style={{ padding: 15, backgroundColor: "#0091ea" }}
              >
                <MaterialCommunityIcons name="account-edit" color={"#ffffff"} size={30} />
              </TouchableOpacity>
              {/* <TouchableOpacity
                onPress={() => onClickMeeting(item)}
                style={{ padding: 15, backgroundColor: "#ffd600" }}
              >
                <Ionicons
                  name="alarm-outline"
                  color={"#ffffff"}
                  size={30}
                />
              </TouchableOpacity> */}
              <TouchableOpacity
                onPress={() => makeCall(item.mobile)}
                style={{ padding: 15, backgroundColor: "#00bfa5" }}
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
          {item.company_name}
        </Text>
      </View>

      <View
        style={[
          styles.detailsContainer
          // { backgroundColor: "rgba(192,192,192, 0.1)" }
        ]}
      >
        <View style={[styles.details, { marginLeft: 10, marginRight: 10, marginBottom: 10 }]}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <View style={[styles.subDetails,]}>
              <Text style={[styles.subDetailsValue, { marginTop: 0 }]}>
                Properties
              </Text>
              <Text style={[styles.subDetailsTitle]} accessibilityLabel={`count_property_${item.mobile?.slice(-6)}_` + totalAssignedProperties}>{totalAssignedProperties}</Text>
            </View>
            <TouchableOpacity
              // disabled={Sliding_Drawer_Toggle}
              onPress={() => {
                openPropertiesList(item);
              }}
              // style={{ padding: 15, backgroundColor: "#e57373" }}
              accessibilityLabel={`add_property_icon_id_${item.mobile?.slice(-6)}`}
              testID={`add_property_icon_id_${item.mobile?.slice(-6)}`}
            >
              <MaterialCommunityIcons
                name="bank-plus"
                color={"rgba(34, 167, 240, .5)"}
                size={25}
                style={{ marginLeft: 30, marginTop: 0 }}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.verticalLine}></View>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <TouchableOpacity
              // disabled={Sliding_Drawer_Toggle}
              onPress={() => {
                openCustomerList(item);
              }}
              // style={{ padding: 15, backgroundColor: "#e57373" }}
              accessibilityLabel={`add_customer_icon_id_${item.mobile?.slice(-6)}`}
              testID={`add_customer_icon_id_${item.mobile?.slice(-6)}`}
            >
              <MaterialCommunityIcons
                name="account-plus-outline"
                color={"rgba(63, 195, 128, .6)"}
                size={27}
                style={{ marginRight: 30, marginTop: 0 }}
              />
            </TouchableOpacity>
            <View style={[styles.subDetails]}>
              <Text style={[styles.subDetailsValue]}>
                Customers
              </Text>
              <Text style={[styles.subDetailsTitle]} accessibilityLabel={`count_customer_${item.mobile?.slice(-6)}_` + totalAssignedCustomers}>{totalAssignedCustomers}</Text>
            </View>
          </View>
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
            <Text style={styles.modalText}>
              Sure want to delete this employee?
            </Text>
            <Text style={styles.modalTextSub}>
              This action can not be undone and remove this employee reference from every where.
            </Text>
            <ButtonGroup
              selectedBackgroundColor="rgba(27, 106, 158, 0.85)"
              onPress={updateIndex}
              selectedIndex={index}
              buttons={["Yes", "No"]}
              // containerStyle={{ height: 30 }}
              textStyle={{ textAlign: "center" }}
              selectedTextStyle={{ color: "#fff" }}
              containerStyle={{ borderRadius: 10, width: 300 }}
              containerBorderRadius={10}
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
                  setModalVisible(!modalVisible);
                }}
              >
                <Text style={styles.textStyle}>Cancel</Text>
              </TouchableHighlight>
              <TouchableHighlight
                style={{ ...styles.applyButton }}
                onPress={() => {
                  checkDeleteDecision(item);
                  setModalVisible(!modalVisible);
                }}
              >
                <Text style={styles.textStyle}>Apply</Text>
              </TouchableHighlight>
            </View>
          </View>
        </View>
      </Modal>
      {/* close property modal  */}
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

const mapStateToProps = state => ({
  userDetails: state.AppReducer.userDetails,
  propReminderList: state.AppReducer.propReminderList,
  propListForMeeting: state.AppReducer.propListForMeeting,
  customerDetailsForMeeting: state.AppReducer.customerDetailsForMeeting,
  employeeList: state.AppReducer.employeeList,
});

const mapDispatchToProps = {
  setUserMobile,
  setUserDetails,
  setPropReminderList,
  setCustomerDetailsForMeeting,
  setPropListForMeeting,
  setStartNavigationPoint,
  setCustomerDetails
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EmployeeCard);

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
    flexDirection: "row",
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
    color: "rgba(0,0,0, .8)"
  },
  subTitleA: {
    fontSize: 14,
    fontWeight: "400",
    color: "rgb(0,0,0)",
    marginTop: 5
  },
  detailsContainer: {
    // borderBottomWidth: 1,
    // borderTopColor: "#ffffff",
    borderBottomColor: "#bdbdbd",
    borderBottomColor: "#bdbdbd",
    // borderTopWidth: 1,
    borderBottomWidth: 1,
    marginBottom: 3
  },

  details: {
    padding: 10,
    flexDirection: "row",
    justifyContent: "space-between"
    // justifyContent:"space-evenly"
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
    width: Sliding_Drawer_Width
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
    textAlign: "center",
    fontSize: 15,
    fontWeight: "600",
  },
  modalTextSub: {
    marginBottom: 15,
    textAlign: "center",
    fontSize: 14,
  },
  drawer: {
    position: "absolute",
    // top: Platform.OS == "ios" ? 20 : 0,
    right: 0,
    bottom: 0,
    width: Sliding_Drawer_Width,
    flexDirection: "row"
  }
});
