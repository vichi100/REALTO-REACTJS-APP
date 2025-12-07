import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Image,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  AsyncStorage,
  TouchableOpacity
} from "react-native";
import axios from "axios";
import ContactResidentialRentCard from "./residential/rent/ContactResidentialRentCard";
import ContactResidentialSellCard from "./residential/buy/ContactResidentialSellCard";
import CustomerCommercialRentCard from "./commercial/rent/CustomerCommercialRentCard";
import CustomerCommercialBuyCard from "./commercial/buy/CustomerCommercialBuyCard";
import CardResidentialRent from "../property/residential/rent/ResidentialRentCard";
import CardResidentialSell from "../property/residential/sell/ResidentialSellCard";

import CardCommercialRent from "../property/commercial/rent/CommercialRentCard";
import CardCommercialSell from "../property/commercial/sell/CommercialSellCard";
import { SERVER_URL } from "./../../utils/Constant";
import { connect } from "react-redux";
import AppConstant from "./../../utils/AppConstant";
import {formatIsoDateToCustomString} from "./../../utils/methods";
import { useNavigation } from '@react-navigation/native';
import { BackHandler } from 'react-native';
import {
  setPropertyDetails
} from "../../reducers/Action";


const CustomerMeetingDetails = props => {
  const { navigation } = props;
  const {item, updateDbCall, category} = props.route.params;
  // const category = props.route.params.category;

  const [reminderObj, setReminderObj] = useState(item);
  const [customerMeetingDetailsObj, setCustomerMeetingDetailsObj] = useState(
    null
  );
  useEffect(() => {
    // console.log("item useEffect:     ", item);
    getCustomerAndMeetingDetails();
  }, [reminderObj]);


  // const navigation = useNavigation();

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', (e) => {
      // Prevent default back action (optional)
      // e.preventDefault();

      // Call your function here
      myBackFunction();
    });

    return unsubscribe;
  }, [navigation]);

  const myBackFunction = () => {
    console.log('Back navigation detected!');
    // updateDbCall(false); 
    // Do something (e.g., show confirmation, save data)
  };

  const getCustomerAndMeetingDetails = () => {
    // console.log("reminderObj:     ", reminderObj);
    const queryObj = {
      req_user_id: props.userDetails.works_for,
      client_id: reminderObj.client_id,
      category_ids: reminderObj.category_ids,
      category: reminderObj.category,
      category_type: reminderObj.category_type,
      category_for: reminderObj.category_for
    };
    axios
      .post(
        SERVER_URL + "/getCustomerAndMeetingDetails",
        queryObj
      )
      .then(
        response => {
          // console.log("response.data:    ", response.data);
          // navigation.navigate("CardDetails");

          if (response.data !== "fail") {
            response.data.property_details.map(item => {
              item.image_urls.map(image => {
                image.url = SERVER_URL + image.url
              })
            })

            setCustomerMeetingDetailsObj(response.data);
          }
        },
        error => {
          // console.log(error);
        }
      );
  };

  return (
    <View
      style={{ flex: 1, backgroundColor: "rgba(254,254,250, 0.1)" }}
    >
      {customerMeetingDetailsObj ? (
        <ScrollView>
          {item.category_type === "Residential" ? (
            item.category_for === "Rent" ? (
              <View>
                <ContactResidentialRentCard
                  navigation={navigation}
                  item={customerMeetingDetailsObj.customer_details}
                  disableDrawer={true}
                  displayCheckBox={false}
                  displayMatchCount={false}
                  displayMatchPercent={false}
                />
                <View
                  style={{
                    backgroundColor: "#ffffff",
                    marginBottom: 1,
                    flexDirection: "row",
                    justifyContent: "space-between"
                  }}
                >
                  <Text style={{ padding: 10 }}>
                    {reminderObj.reminder_for}
                  </Text>
                  <Text style={{ padding: 10 }}>
                    {formatIsoDateToCustomString(reminderObj.meeting_date)}
                  </Text>
                  <Text style={{ padding: 10 }}>
                    {reminderObj.meeting_time}
                  </Text>
                </View>
                <View
                  style={{
                    backgroundColor: "rgba(0,255,255, 0.1)"
                    // marginTop: 1
                  }}
                >
                  <Text style={{ padding: 10, textAlign: "center" }}>
                    Related Properties For Meeting
                  </Text>
                </View>

                {customerMeetingDetailsObj.property_details.map(item => (
                  <TouchableOpacity
                    onPress={() => {
                      props.setPropertyDetails(item);
                      navigation.navigate("PropDetailsFromListing", {
                        item:item,
                        displayMatchCount: false,
                        displayMatchPercent: true
                      })
                    
                    }}
                  >
                    <View>
                      <CardResidentialRent
                        navigation={navigation}
                        item={item}
                        disableDrawer={true}
                        displayCheckBox={false}
                        displayMatchCount={false}
                        displayMatchPercent={true}
                      />
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            ) : item.category_for === "Buy" || item.category_for === "Sell"? (
              <View>
                <ContactResidentialSellCard
                  navigation={navigation}
                  item={customerMeetingDetailsObj.customer_details}
                  disableDrawer={true}
                  displayCheckBox={false}
                  displayMatchCount={false}
                />
                <View
                  style={{
                    backgroundColor: "#ffffff",
                    marginBottom: 1,
                    flexDirection: "row",
                    justifyContent: "space-between"
                  }}
                >
                  <Text style={{ padding: 10 }}>
                    {reminderObj.reminder_for}
                  </Text>
                  <Text style={{ padding: 10 }}>
                    {formatIsoDateToCustomString(reminderObj.meeting_date)}
                  </Text>
                  <Text style={{ padding: 10 }}>
                    {reminderObj.meeting_time}
                  </Text>
                </View>
                <View
                  style={{
                    backgroundColor: "rgba(0,255,255, 0.1)"
                    // marginTop: 1
                  }}
                >
                  <Text style={{ padding: 10, textAlign: "center" }}>
                    Related Properties For Meeting
                  </Text>
                </View>

                {customerMeetingDetailsObj.property_details.map(item => (
                  <TouchableOpacity
                    onPress={() =>
                    {
                      props.setPropertyDetails(item);
                      navigation.navigate("PropDetailsFromListingForSell", {
                        item:item,
                        displayMatchCount: false,
                        displayMatchPercent: true
                      })

                    }
                      
                    }
                  >
                    <View>
                      <CardResidentialSell
                        navigation={navigation}
                        item={item}
                        disableDrawer={true}
                        displayCheckBox={false}
                        displayMatchCount={false}
                        displayMatchPercent={true}
                      />
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            ) : null
          ) : item.category_type === "Commercial" ? (
            item.category_for === "Rent" ? (
              <View>
                <CustomerCommercialRentCard
                  navigation={navigation}
                  item={customerMeetingDetailsObj.customer_details}
                  disableDrawer={true}
                  displayCheckBox={false}
                  displayMatchCount={false}
                />
                <View
                  style={{
                    backgroundColor: "#ffffff",
                    marginBottom: 1,
                    flexDirection: "row",
                    justifyContent: "space-between"
                  }}
                >
                  <Text style={{ padding: 10 }}>
                    {reminderObj.reminder_for}
                  </Text>
                  <Text style={{ padding: 10 }}>
                    {formatIsoDateToCustomString(reminderObj.meeting_date)}
                  </Text>
                  <Text style={{ padding: 10 }}>
                    {reminderObj.meeting_time}
                  </Text>
                </View>
                <View
                  style={{
                    backgroundColor: "rgba(0,255,255, 0.1)"
                    // marginTop: 1
                  }}
                >
                  <Text style={{ padding: 10, textAlign: "center" }}>
                    Related Properties For Meeting
                  </Text>
                </View>

                {customerMeetingDetailsObj.property_details.map(item => (
                  <TouchableOpacity
                    onPress={() =>{
                      props.setPropertyDetails(item)
                      navigation.navigate("CommercialRentPropDetails", {
                        item:item,
                        displayMatchCount: false,
                        displayMatchPercent: true
                      })
                    }
                    }
                  >
                    <View>
                      <CardCommercialRent
                        navigation={navigation}
                        item={item}
                        disableDrawer={true}
                        displayCheckBox={false}
                        displayMatchCount={false}
                        displayMatchPercent={true}
                      />
                    </View>
                  </TouchableOpacity>
                ))}
              </View>

            ) : (
              <View>
                <CustomerCommercialBuyCard
                  navigation={navigation}
                  item={customerMeetingDetailsObj.customer_details}
                  disableDrawer={true}
                  displayCheckBox={false}
                  displayMatchCount={false}
                />
                <View
                  style={{
                    backgroundColor: "#ffffff",
                    marginBottom: 1,
                    flexDirection: "row",
                    justifyContent: "space-between"
                  }}
                >
                  <Text style={{ padding: 10 }}>
                    {reminderObj.reminder_for}
                  </Text>
                  <Text style={{ padding: 10 }}>
                    {formatIsoDateToCustomString(reminderObj.meeting_date)}
                  </Text>
                  <Text style={{ padding: 10 }}>
                    {reminderObj.meeting_time}
                  </Text>
                </View>
                <View
                  style={{
                    backgroundColor: "rgba(0,255,255, 0.1)"
                    // marginTop: 1
                  }}
                >
                  <Text style={{ padding: 10, textAlign: "center" }}>
                    Related Properties For Meeting
                  </Text>
                </View>

                {customerMeetingDetailsObj.property_details.map(item => (
                  <TouchableOpacity
                    onPress={() =>{
                      props.setPropertyDetails(item);
                      navigation.navigate("CommercialSellPropDetails", {
                        item:item,
                        displayMatchCount: false,
                        displayMatchPercent: true
                      })
                    }
                    }
                  >
                    <View>
                      <CardCommercialSell
                        navigation={navigation}
                        item={item}
                        disableDrawer={true}
                        displayCheckBox={false}
                        displayMatchCount={false}
                        displayMatchPercent={true}
                      />
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            )
          ) : null}
        </ScrollView>
      ) : null}
    </View>
  );
};

const mapStateToProps = state => ({
  userDetails: state.AppReducer.userDetails,
  propReminderList: state.AppReducer.propReminderList
});
const mapDispatchToProps = {
  setPropertyDetails
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CustomerMeetingDetails);

// export default CustomerMeetingDetails;
