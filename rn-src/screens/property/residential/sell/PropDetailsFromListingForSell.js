import React, { Component, useRef, useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Image,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Animated,
  ActivityIndicator,
  Linking,
} from "react-native";
import Slideshow from "./../../../../components/Slideshow";
import { numDifferentiation, dateFormat } from "./././../../../../utils/methods";
import { connect } from "react-redux";

import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import AccordionListItem from './../../../../components/AccordionListItem';
import { MaterialIcons } from "@expo/vector-icons";
import PropertyReminder from "../../PropertyReminder";
import { SERVER_URL } from "./../../../../utils/Constant";
import axios from "axios";
import AppConstant from "./../../../../utils/AppConstant";
import { formatIsoDateToCustomString } from "../../../../utils/methods";
import Feather from "react-native-vector-icons/Feather";
import { makeCall , camalize} from "../../../../utils/methods";


const PropDetailsFromListingForSell = props => {
  // const { navigation } = props;
  // const item = route.params;
  // console.log(item);

  const { navigation } = props;
  let { item,
    displayMatchCount = true,
    displayMatchPercent = true
  } = props.route.params;
  if (!item) {
    item = props.propertyDetails;
  }
  console.log("displayMatchCount:", displayMatchCount);
  console.log("displayMatchPercent:", displayMatchPercent);

  const scrollViewRef = useRef();
  const [reminderListX, setReminderListX] = useState([]);
  const [loading, setLoading] = useState(false);

  const gotoEmployeeList = itemForAddEmplyee => {
    console.log("gotoEmployeeList: ", itemForAddEmplyee);
    // props.setPropertyDetails(itemForAddEmplyee);
    navigation.navigate("EmployeeListOfListing", {
      itemForAddEmplyee: itemForAddEmplyee,
      disableDrawer: true,
      displayCheckBox: true,
    });
  }

  // const makeCall = mobile => {
  //   const url = "tel://" + mobile;
  //   Linking.openURL(url);
  // };

  const scrollToAccordion = () => {
    scrollViewRef.current.scrollTo({ y: 0, animated: true });
  };

  const getMatched = (matchedProprtyItem) => {
    navigation.navigate('MatchedCustomers', { matchedProprtyItem: matchedProprtyItem },);
  }

  const getPropReminders = () => {
    // console.log("item getPropReminders: " + propertyIdX);
    const propertyId = {
      req_user_id: props.userDetails.id,
      agent_id: props.userDetails.works_for,
      property_id: item.property_id
    };
    setLoading(true);

    axios
      .post(
        SERVER_URL + "/getPropReminderList",
        propertyId
      )
      .then(
        response => {
          // console.log("response.data.length: " + response.data.length);
          // navigation.navigate("CardDetails");
          if (response.data && response.data.length > 0) {
            // const x = [...props.propReminderList, ...response.data];
            // // console.log("X: " + x);
            // props.setPropReminderList(response.data);
            setReminderListX(response.data);
            setLoading(false);
          } else {
            setReminderListX([]);
            setLoading(false);
          }
        },
        error => {
          setLoading(false);
          console.log(error);
        }
      );
  };
  useEffect(() => {
    // console.log("useEffect called: " + props.propReminderList.length);
    // if (props.propReminderList.length === 0) {
    // console.log("getPropReminders called");
    getPropReminders();
    // }
  }, []);



  return (
    <ScrollView style={[styles.container]}>
      <View style={{ flexDirection: 'row', flex: 1, }}>
        <View style={{ flex: 1, minHeight: 100 }}>
          <View style={{
            flex: 1,
            flexDirection: "column",
            alignItems: "flex-start",
            paddingRight: 16,
            paddingLeft: 16,
            // paddingBottom: 25,
            paddingTop: 16,
            // backgroundColor: "#d1d1d1",
          }}>
            <Text style={[styles.title]}>
              Sell Off In {item.property_address.flat_number},{" "} {item.property_address.building_name},{" "}
              {item.property_address.landmark_or_street}
            </Text>
            <Text style={[StyleSheet.subTitle]}>
              {item.property_address.formatted_address}
            </Text>
          </View>
          {props.userDetails.works_for === props.userDetails.id && item.agent_id === props.userDetails.id && <TouchableOpacity onPress={() => gotoEmployeeList(item)}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 10, marginTop: 10 }}>
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

        {displayMatchCount && <TouchableOpacity
          onPress={() => getMatched(item)}
          style={{ flexDirection: 'row', marginTop: 8 }}
        >
          <View style={{
            backgroundColor: 'rgba(234, 155, 20, 0.7)', position: 'absolute', right: 0, top: 0, alignItems: 'center', justifyContent: 'center',
            width: 38, height: 20, marginRight: 0
          }}>
            <Text style={{ fontSize: 15, fontWeight: '500', color: '#000', paddingLeft: 0 }}>{item.match_count ? item.match_count : 0}</Text>
          </View>
          <View style={{
            position: 'absolute', right: 0, top: 20, transform: [{ rotate: '270deg' }],
            backgroundColor: 'rgba(80, 200, 120, 0.7)', alignItems: 'center', justifyContent: 'center',
            width: 70, height: 35, padding: 0, marginRight: -15, marginTop: 20, marginBottom: 15,
          }}>
            <Text style={{ fontSize: 14, fontWeight: '300', color: '#000' }}>Match</Text>
          </View>
        </TouchableOpacity>}
      </View>
      {/* <View style={[styles.headerContainer]}>
        <Text style={[styles.title]}>
          Sell {item.property_address.flat_number},{" "} {item.property_address.building_name},{" "}
          {item.property_address.landmark_or_street}
        </Text>
        <Text style={[StyleSheet.subTitle]}>
          {item.property_address.formatted_address}
        </Text>
      </View> */}
      {/* <Image
        source={require("../../../../../assets/images/p1.jpg")}
        resizeMode={"stretch"}
        resizeMethod={"resize"}
        style={{ width: "100%", height: 200 }}
      /> */}
      <Slideshow
        dataSource={item.image_urls}
      />
      <View style={[styles.detailsContainer]}>
        <View style={[styles.details]}>
          <View style={[styles.subDetails]}>
            <Text style={[styles.subDetailsValue, { marginTop: 7 }]}>
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
          {/* <View style={styles.verticalLine}></View> */}
          {/* <View style={[styles.subDetails]}>
            <Text style={[styles.subDetailsValue]}>
              {item.property_details.property_size}sqft
            </Text>
            <Text style={[styles.subDetailsTitle]}>Builtup</Text>
          </View> */}
        </View>
      </View>

      <View style={styles.margin1}></View>
      {/* property details */}
      <View style={styles.overviewContainer}>
        <View style={styles.overview}>
          <Text>Details</Text>
          <View style={styles.horizontalLine}></View>
        </View>
        <View style={styles.overviewColumnWrapper}>
          <View style={styles.overviewLeftColumn}>
            <View style={[styles.subDetails]}>
              <Text style={[styles.subDetailsValue]}>
                {item.property_details.washroom_numbers}
              </Text>
              <Text style={[styles.subDetailsTitle]}>Bathroom</Text>
            </View>
            <View style={[styles.subDetails]}>
              <Text style={[styles.subDetailsValue]}>
                {formatIsoDateToCustomString(item.sell_details.available_from)}
              </Text>
              <Text style={[styles.subDetailsTitle]}>Possession</Text>
            </View>
            <View style={[styles.subDetails]}>
              <Text style={[styles.subDetailsValue]}>
                {numDifferentiation(item.sell_details.maintenance_charge)}
              </Text>
              <Text style={[styles.subDetailsTitle]}>Maintenance charge</Text>
            </View>
            <View style={[styles.subDetails]}>
              <Text style={[styles.subDetailsValue]}>
                {item.property_details.lift}
              </Text>
              <Text style={[styles.subDetailsTitle]}>Lift</Text>
            </View>
          </View>
          <View style={styles.overviewRightColumn}>
            <View style={[styles.subDetails]}>
              <Text style={[styles.subDetailsValue]}>
                {item.property_details.parking_number}{" "}
                {item.property_details.parking_type}
              </Text>
              <Text style={[styles.subDetailsTitle]}>Parking</Text>
            </View>
            <View style={[styles.subDetails]}>
              <Text style={[styles.subDetailsValue]}>
                {item.property_details.floor_number}/
                {item.property_details.total_floor}
              </Text>
              <Text style={[styles.subDetailsTitle]}>Floor</Text>
            </View>
            <View style={[styles.subDetails]}>
              <Text style={[styles.subDetailsValue]}>
                {item.sell_details.negotiable}
              </Text>
              <Text style={[styles.subDetailsTitle]}>Negotiable</Text>
            </View>
            <View style={[styles.subDetails]}>
              <Text style={[styles.subDetailsValue]}>
                {item.property_details.property_age} years
              </Text>
              <Text style={[styles.subDetailsTitle]}>Age Of Building</Text>
            </View>
          </View>
        </View>
      </View>
      {/* owner details */}
      <View style={styles.margin1}></View>
      <AccordionListItem title="Owner" open={false} onPress={scrollToAccordion} testID="owner_accordion">
        <View style={styles.ownerDetails}>
          <View style={{ flexDirection: "row", marginBottom: 0, alignItems: "center", justifyContent: "space-between" }}>
            <View style={{ flexDirection: "column", }}>
              <Text>{item.owner_details.name}</Text>
              <Text>
                {item.owner_details.mobile1?.startsWith("+91")
                  ? item.owner_details.mobile1
                  : `+91 ${item.owner_details.mobile1}`}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => makeCall(item.owner_details.mobile1)}
              style={{ padding: 0, marginRight: 35 }}
              testID="owner_phone"
            >
              <FontAwesome5 name="phone-alt" color={"#00bfa5"} size={25} />
              {/* <Text style={{ fontSize: 8, paddingTop: 5 }}>OWNER</Text> */}
            </TouchableOpacity>
          </View>
          <Text style={{ marginTop: 5 }}>{camalize(item.owner_details.address)}</Text>


        </View>
      </AccordionListItem>

      {loading ? <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(245,245,245, .4)'
        }}
      >
        <ActivityIndicator animating size="large" color={'#000'} />
        {/* <ActivityIndicator animating size="large" /> */}
      </View> : <PropertyReminder navigation={navigation} reminderListX={reminderListX} />}


    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white"
  },
  media: {
    padding: 2,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  },
  card: {
    shadowOpacity: 0.0015 * 5 + 0.18,
    shadowRadius: 0.54 * 5,
    shadowOffset: {
      height: 0.6 * 5
    },
    backgroundColor: "#ffffff"
  },
  cardImage: {
    alignSelf: "stretch",
    marginBottom: 16,
    justifyContent: "center",
    alignItems: "stretch"
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
    fontWeight: "600"
  },
  subTitle: {
    fontSize: 14,
    fontWeight: "400",
    color: "rgba(255 ,255 ,255 , 0.87)"
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
    justifyContent: "space-between"
  },
  subDetails: {
    paddingBottom: 20
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

  horizontalLine: {
    borderBottomColor: "#E0E0E0",
    borderBottomWidth: 1,
    marginLeft: 5,
    marginRight: 5,
    paddingTop: 10
  },
  overviewContainer: {
    flex: 1,
    width: "100%",
    shadowOpacity: 0.0015 * 5 + 0.18,
    shadowRadius: 0.54 * 5,
    shadowOffset: {
      height: 0.6 * 5
    },
    backgroundColor: "white"
  },
  overview: {
    padding: 10
  },
  overviewSubDetailsRow: {
    flexDirection: "row",
    justifyContent: "center",
    padding: 15
  },

  overviewColumnWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10
  },
  overviewLeftColumn: {
    flexDirection: "column",
    justifyContent: "center"
  },
  overviewRightColumn: {
    flexDirection: "column",
    justifyContent: "center"
  },
  margin1: {
    marginTop: 2
  },
  ownerDetails: {
    flex: 1,
    paddingTop: 10,
    paddingBottom: 10,
    marginLeft: 20,
    width: "100%",
  }
});

const mapStateToProps = state => ({
  userDetails: state.AppReducer.userDetails,
  anyItemDetails: state.AppReducer.anyItemDetails,
  propertyDetails: state.AppReducer.propertyDetails
});
export default connect(
  mapStateToProps,
  null
)(PropDetailsFromListingForSell);
