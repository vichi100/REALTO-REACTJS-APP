import React, { Component, useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Image,
  Text,
  ScrollView,
  Modal,
  TouchableHighlight
} from "react-native";
import Button from "./../../../../components/Button";
import axios from "axios";
import { SERVER_URL } from "./../../../../utils/Constant";
import { numDifferentiation, dateFormat } from "./../../../../utils/methods";
import { Avatar } from "@rneui/themed";
import { connect } from "react-redux";
import {
  setPropertyType, setPropertyDetails, setCustomerDetails,
  setStartNavigationPoint, setCommercialCustomerList
} from "./../../../../reducers/Action";
import ModalActivityIndicator from 'react-native-modal-activityindicator';



const AddNewCustomerCommercialBuyFinalDetails = props => {
  const { navigation } = props;
  const [customerFinalDetails, setCustomerFinalDetails] = useState(null);
  const [location, setLocation] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    getPropFinalDetails();
  }, []);

  // useEffect(() => {
  //   if (propertyFinalDetails !== null) {
  //     let bhkTemp = propertyFinalDetails.customer_property_details.bhk_type;
  //     if (bhkTemp.indexOf("RK") > -1) {
  //       setBHK(bhkTemp);
  //     } else {
  //       let x = bhkTemp.split("BHK");
  //       setBHK(x[0]);
  //     }
  //     const availableDateStr = propertyFinalDetails.customer_rent_details.available_from;
  //     const availableDate = new Date(availableDateStr);
  //     const t = convert(availableDate);
  //     var today = new Date();
  //     const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
  //     const diffDays = Math.round((today - new Date(t)) / oneDay);
  //     // // console.log(diffDays);
  //     if (diffDays >= 0) {
  //       setPossessionDate("Immediately");
  //     } else {
  //       setPossessionDate(availableDateStr);
  //     }
  //   }
  // }, [propertyFinalDetails]);

  const getPropFinalDetails = () => {
    const customer = props.customerDetails
    console.log(JSON.stringify(customer));
    setCustomerFinalDetails(customer);
    const locX = []
    customer.customer_locality.location_area.map(item => {
      console.log(item.main_text);
      locX.push(item.main_text)
    })
    setLocation(locX)
    // console.log(customer);
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

  const send = async () => {
    if (props.userDetails === null) {
      console.log("You are not logged in, please login");
      setModalVisible(true);
      return;
    }
    setLoading(true);
    customerFinalDetails.agent_id = props.userDetails.works_for;

    // console.log(await AsyncStorage.getItem("property"));
    axios
      .post(
        SERVER_URL + "/addNewCommercialCustomer",
        customerFinalDetails
      )
      .then(
        async response => {
          // // console.log("vichi: " + response.data.customer_id);
          if (response.data !== null) {
            // // console.log("inside");
            // await AsyncStorage.removeItem("customer");
            props.setCustomerDetails(null);
            props.setCommercialCustomerList([...props.commercialCustomerList, response.data])
            if (props.startNavigationPoint === null) {
              navigation.navigate("Contacts", { didDbCall: true });

            } else {
              navigation.navigate("CustomerListForMeeting");
            }
            props.setStartNavigationPoint(null)
            // // console.log("inside");
          } else {
            setErrorMessage(
              "Error: Seems there is some network issue, please try later"
            );
          }
        },
        error => {
          // console.log(error);
        }
      );
  };
  return customerFinalDetails ? (
    <ScrollView style={{ flex: 1, backgroundColor: "#ffffff" }}>
      <View style={[styles.headerContainer]}>
        <View
          style={[
            {
              flexDirection: "row",
              alignItems: "flex-start",
              paddingRight: 16,
              // paddingLeft: 16,
              // paddingBottom: 16,
              // paddingTop: 16,
              width: "100%",
              backgroundColor: "#d1d1d1"
            }
            // { backgroundColor: "rgba(245,245,245, 0.8)" }
          ]}
        >
          <Avatar
            square
            size={80}
            title={
              customerFinalDetails.customer_details.name &&
              customerFinalDetails.customer_details.name.slice(0, 1)
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
          />
          <View style={{ paddingLeft: 20, paddingTop: 10 }}>
            <Text style={[styles.title]}>
              {customerFinalDetails.customer_details.name}
            </Text>
            <Text style={[StyleSheet.subTitle]}>
              {customerFinalDetails.customer_details.mobile1}
            </Text>
            <Text style={[StyleSheet.subTitle]}>
              {customerFinalDetails.customer_details.address}
            </Text>
          </View>
        </View>
      </View>

      <View style={[styles.detailsContainer]}>
        <View style={[styles.details, { paddingLeft: 20, paddingRight: 20 }]}>
          <View style={[styles.subDetails]}>
            <Text style={[styles.subDetailsValue]}>
              {customerFinalDetails.customer_property_details.property_used_for}
            </Text>
            <Text style={[styles.subDetailsTitle]}>Looking For</Text>
          </View>
          <View style={styles.verticalLine}></View>
          <View style={[styles.subDetails]}>
            <Text style={[styles.subDetailsValue]}>
              {numDifferentiation(
                customerFinalDetails.customer_buy_details.expected_buy_price
              )}
            </Text>
            <Text style={[styles.subDetailsTitle]}>
              {customerFinalDetails.customer_locality.property_for}
            </Text>
          </View>
          {/* <View style={styles.verticalLine}></View> */}
          {/* <View style={[styles.subDetails]}>
            <Text style={[styles.subDetailsValue]}>
              {numDifferentiation(
                customerFinalDetails.customer_rent_details.expected_deposit
              )}
            </Text>
            <Text style={[styles.subDetailsTitle]}>Deposit</Text>
          </View> */}
          <View style={styles.verticalLine}></View>
          <View style={[styles.subDetails]}>
            <Text style={[styles.subDetailsValue]}>
              {customerFinalDetails.customer_property_details.property_size}sqft
            </Text>
            <Text style={[styles.subDetailsTitle]}>Builtup Apx</Text>
          </View>
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
                {customerFinalDetails.customer_locality.city}
              </Text>
              <Text style={[styles.subDetailsTitle]}>City</Text>
            </View>
            <View style={{ paddingBottom: 20, width: "80%" }}>
              <Text style={[styles.subDetailsValue]}>
                {location.join(', ')}
              </Text>
              <Text style={[styles.subDetailsTitle]}>Locations</Text>
            </View>
            <View style={[styles.subDetails]}>
              <Text style={[styles.subDetailsValue]}>
                {customerFinalDetails.customer_property_details.building_type}
              </Text>
              <Text style={[styles.subDetailsTitle]}>Building Type</Text>
            </View>

            
          </View>
          <View style={styles.overviewRightColumn}>
            <View style={[styles.subDetails]}>
              <Text style={{
                fontSize: 14,
                fontWeight: "600",
                // paddingRight: 10
              }}>
                {dateFormat(
                  customerFinalDetails.customer_buy_details.available_from
                )}
              </Text>
              <Text style={[styles.subDetailsTitle]}>Possession</Text>
            </View>
            <View style={[styles.subDetails]}>
              <Text style={[styles.subDetailsValue]}>
                {customerFinalDetails.customer_property_details.parking_type}
              </Text>
              <Text style={[styles.subDetailsTitle]}>Parking</Text>
            </View>
            {/* <View style={[styles.subDetails]}>
              <Text style={[styles.subDetailsValue]}>
                {propertyFinalDetails.customer_property_details.floor_number}/
                {propertyFinalDetails.customer_property_details.total_floor}
              </Text>
              <Text style={[styles.subDetailsTitle]}>Floor</Text>
            </View> */}
            {/* <View style={[styles.subDetails]}>
              <Text style={[styles.subDetailsValue]}>
                {propertyFinalDetails.customer_rent_details.non_veg_allowed}
              </Text>
              <Text style={[styles.subDetailsTitle]}>NonVeg</Text>
            </View> */}
            {/* <View style={[styles.subDetails]}>
              <Text style={[styles.subDetailsValue]}>
                {customerFinalDetails.customer_property_details.property_age}
              </Text>
              <Text style={[styles.subDetailsTitle]}>Age Of Building</Text>
            </View> */}
          </View>
        </View>
      </View>
      {/* owner details */}
      <View style={styles.margin1}></View>
      {/* <View style={styles.overviewContainer}>
        <View style={styles.overview}>
          <Text>Owner</Text>
          <View style={styles.horizontalLine}></View>
          <View style={styles.ownerDetails}>
            <Text>{customerFinalDetails.owner_details.name}</Text>
            <Text>{customerFinalDetails.owner_details.address}</Text>
            <Text>+91 {customerFinalDetails.owner_details.mobile1}</Text>
          </View>
        </View>
      </View> */}
      <View style={{ margin: 20 }}>
        <Button title="ADD" onPress={() => send()} />
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          // Alert.alert("Modal has been closed.");
          setModalVisible(false);
        }}
      >
        <View style={styles.centeredView1}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>
              You are not logged in, please login.
            </Text>


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
                  login();
                  setModalVisible(!modalVisible);
                }}
              >
                <Text style={styles.textStyle}>Login</Text>
              </TouchableHighlight>
            </View>
          </View>
        </View>
      </Modal>

      <ModalActivityIndicator visible={loading} size='large' color='#A9A9A9' />


    </ScrollView>
  ) : null;
};

const styles = StyleSheet.create({
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
    // flexDirection: "column",
    // alignItems: "flex-start",
    // paddingRight: 16,
    // paddingLeft: 16,
    // paddingBottom: 16,
    // paddingTop: 16,
    // backgroundColor: "#d1d1d1"
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
    height: 60,
    borderTopWidth: 1,
    borderTopColor: "#C0C0C0",
    backgroundColor: "rgba(220,220,220, 0.80)"
  },

  details: {
    padding: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
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
    fontWeight: "600",
    // paddingRight: 15
    // textAlign: "center"
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
    // paddingTop: 5
  },
  ownerDetails: {
    paddingTop: 10,
    paddingBottom: 10
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
    height: 150,
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
    marginBottom: 16,
    fontWeight: "600",
    textAlign: "center"
  },
});

const mapStateToProps = state => ({
  userDetails: state.AppReducer.userDetails,
  propertyDetails: state.AppReducer.propertyDetails,
  customerDetails: state.AppReducer.customerDetails,
  startNavigationPoint: state.AppReducer.startNavigationPoint,
  commercialCustomerList: state.AppReducer.commercialCustomerList
});
const mapDispatchToProps = {
  setPropertyType,
  setPropertyDetails,
  setCustomerDetails,
  setStartNavigationPoint,
  setCommercialCustomerList
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddNewCustomerCommercialBuyFinalDetails);

// export default AddNewCustomerCommercialBuyFinalDetails;
