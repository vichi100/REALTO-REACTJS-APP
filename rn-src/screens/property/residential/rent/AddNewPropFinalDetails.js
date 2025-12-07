import React, { Component, useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Image,
  Text,
  ScrollView,
  Modal,
  TouchableHighlight
  // ActivityIndicator
} from "react-native";
import Slideshow from "./../../../../components/Slideshow";
import Button from "./../../../../components/Button";
import axios from "axios";
import { SERVER_URL } from "./../../../../utils/Constant";
import { numDifferentiation } from "./../../../../utils/methods";
import Snackbar from "./../../../../components/SnackbarComponent";
import { setPropertyDetails, setResidentialPropertyList, setStartNavigationPoint } from "./../../../../reducers/Action";
import { connect } from "react-redux";
import ModalActivityIndicator from 'react-native-modal-activityindicator';


const AddNewPropFinalDetails = props => {
  const { navigation } = props;
  const [isVisible, setIsVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [propertyFinalDetails, setPropertyFinalDetails] = useState(null);
  const [bhk, setBHK] = useState(null);
  const [possessionDate, setPossessionDate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    if (propertyFinalDetails === null) {
      getPropFinalDetails();
    }
  }, [propertyFinalDetails]);

  useEffect(() => {
    if (propertyFinalDetails !== null) {
      let bhkTemp = propertyFinalDetails.property_details.bhk_type;
      if (bhkTemp.indexOf("RK") > -1) {
        setBHK(bhkTemp);
      } else {
        let x = bhkTemp.split("BHK");
        setBHK(x[0]);
      }
      const availableDateStr = propertyFinalDetails.rent_details.available_from;
      const availableDate = new Date(availableDateStr);
      const t = convert(availableDate);
      var today = new Date();
      const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
      const diffDays = Math.round((today - new Date(t)) / oneDay);
      // // console.log(diffDays);
      if (diffDays >= 0) {
        setPossessionDate("Immediately");
      } else {
        setPossessionDate(availableDateStr);
      }
    }
  }, [propertyFinalDetails]);

  const getPropFinalDetails = async () => {
    // const property = JSON.parse(await AsyncStorage.getItem("property"));
    const property = props.propertyDetails;
    setPropertyFinalDetails(property);
    // console.log(property);
  };

  const updateIndex = index => {
    setIndex(index);
  };

  const convert = str => {
    var date = new Date(str),
      mnth = ("0" + (date.getMonth() + 1)).slice(-2),
      day = ("0" + date.getDate()).slice(-2);
    return [date.getFullYear(), mnth, day].join("-");
  };

  const dismissSnackBar = () => {
    setIsVisible(false);
  };

  const login = async () => { 
    navigation.navigate("Login");
    setModalVisible(false);
  }

  const send = () => {
    if (props.userDetails === null) {
      console.log("You are not logged in, please login");
      // setErrorMessage("You are not logged in, please login");
      // setIsVisible(true);
      setModalVisible(true);
      return;
    }
    setLoading(true);
    propertyFinalDetails.agent_id = props.userDetails.works_for;
    console.log("propertyFinalDetails: ", propertyFinalDetails);
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
    console.log("Data: ", data);
    axios(SERVER_URL + "/addNewResidentialRentProperty", {
      method: "post",
      headers: {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
      },
      data: data
    })
      .then(
        response => {
          console.log(response.data);
          if (response.data !== null) {
            // console.log(response.data);
            response.data.image_urls.map(item => {
              item.url = SERVER_URL + item.url
            })
            props.setPropertyDetails(null);
            props.setResidentialPropertyList([...props.residentialPropertyList, response.data])
            // navigation.navigate("Listing");
            console.log("props.startNavigationPoint: ", props.startNavigationPoint)
            if (props.startNavigationPoint === null) {
              navigation.navigate("Listing", { didDbCall: true });

            } else {
              navigation.navigate("PropertyListForMeeting");
            }
            props.setStartNavigationPoint(null);
            setLoading(false);
          } else {
            setLoading(false);
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

  return (propertyFinalDetails ? (
    <ScrollView style={{ flex: 1, backgroundColor: "#ffffff" }}>
      <View style={[styles.headerContainer]}>
        <Text style={[styles.title]}>
          {"Rent In "}{propertyFinalDetails.property_address.flat_number},
          {propertyFinalDetails.property_address.building_name},

          {/* 2 BHK For Rent In Anant Villa, Koregaon Park */}
        </Text>
        <Text style={[StyleSheet.subTitle]}>
          {propertyFinalDetails.property_address.landmark_or_street},
          {propertyFinalDetails.property_address.location_area.formatted_address}
          {/* Meera Nagar, Near Marvel Exotica */}
        </Text>
      </View>
      <Slideshow
        // dataSource={[
        //   { url: propertyFinalDetails.image_urls[0] },
        //   { url: "http://placeimg.com/640/480/any" },
        //   { url: "http://placeimg.com/640/480/any" }
        // ]}
        dataSource={propertyFinalDetails.image_urls}
      />
      {/* <Image
        source={require("../../../../../assets/images/p1.jpg")}
        resizeMode={"stretch"}
        resizeMethod={"resize"}
        style={[StyleSheet.cardImage]}
      /> */}
      <View style={[styles.detailsContainer]}>
        <View style={[styles.details]}>
          <View style={[styles.subDetails]}>
            <Text style={[styles.subDetailsValue]}>{bhk}</Text>
            <Text style={[styles.subDetailsTitle]}>BHK</Text>
          </View>
          <View style={styles.verticalLine}></View>
          <View style={[styles.subDetails]}>
            <Text style={[styles.subDetailsValue]}>
              {numDifferentiation(
                propertyFinalDetails.rent_details.expected_rent
              )}
            </Text>
            <Text style={[styles.subDetailsTitle]}>
              {propertyFinalDetails.property_for}
            </Text>
          </View>
          <View style={styles.verticalLine}></View>
          <View style={[styles.subDetails]}>
            <Text style={[styles.subDetailsValue]}>
              {numDifferentiation(
                propertyFinalDetails.rent_details.expected_deposit
              )}
            </Text>
            <Text style={[styles.subDetailsTitle]}>Deposit</Text>
          </View>
          <View style={styles.verticalLine}></View>
          <View style={[styles.subDetails]}>
            <Text style={[styles.subDetailsValue]}>
              {propertyFinalDetails.property_details.furnishing_status}
            </Text>
            <Text style={[styles.subDetailsTitle]}>Furnishing</Text>
          </View>
          <View style={styles.verticalLine}></View>
          <View style={[styles.subDetails]}>
            <Text style={[styles.subDetailsValue]}>
              {propertyFinalDetails.property_details.property_size}sqft
            </Text>
            <Text style={[styles.subDetailsTitle]}>Builtup</Text>
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
                {propertyFinalDetails.property_details.washroom_numbers}
              </Text>
              <Text style={[styles.subDetailsTitle]}>Bathroom</Text>
            </View>
            <View style={[styles.subDetails]}>
              <Text style={[styles.subDetailsValue]}>{possessionDate}</Text>
              <Text style={[styles.subDetailsTitle]}>Possession</Text>
            </View>
            <View style={[styles.subDetails]}>
              <Text style={[styles.subDetailsValue]}>
                {propertyFinalDetails.rent_details.preferred_tenants}
              </Text>
              <Text style={[styles.subDetailsTitle]}>Preferred Tenant</Text>
            </View>
            <View style={[styles.subDetails]}>
              <Text style={[styles.subDetailsValue]}>
                {propertyFinalDetails.property_details.lift}
              </Text>
              <Text style={[styles.subDetailsTitle]}>Lift</Text>
            </View>
          </View>
          <View style={styles.overviewRightColumn}>
            <View style={[styles.subDetails]}>
              <Text style={[styles.subDetailsValue]}>
                {propertyFinalDetails.property_details.parking_number}{" "}
                {propertyFinalDetails.property_details.parking_type}
              </Text>
              <Text style={[styles.subDetailsTitle]}>Parking</Text>
            </View>
            <View style={[styles.subDetails]}>
              <Text style={[styles.subDetailsValue]}>
                {propertyFinalDetails.property_details.floor_number}/
                {propertyFinalDetails.property_details.total_floor}
              </Text>
              <Text style={[styles.subDetailsTitle]}>Floor</Text>
            </View>
            <View style={[styles.subDetails]}>
              <Text style={[styles.subDetailsValue]}>
                {propertyFinalDetails.rent_details.non_veg_allowed}
              </Text>
              <Text style={[styles.subDetailsTitle]}>NonVeg</Text>
            </View>
            <View style={[styles.subDetails]}>
              <Text style={[styles.subDetailsValue]}>
                {propertyFinalDetails.property_details.property_age}
              </Text>
              <Text style={[styles.subDetailsTitle]}>Age Of Building</Text>
            </View>
          </View>
        </View>
      </View>
      {/* owner details */}
      <View style={styles.margin1}></View>
      <View style={styles.overviewContainer}>
        <View style={styles.overview}>
          <Text>Owner</Text>
          <View style={styles.horizontalLine}></View>
          <View style={styles.ownerDetails}>
            <Text>{propertyFinalDetails.owner_details.name}</Text>
            <Text>{propertyFinalDetails.owner_details.address}</Text>
            <Text>+91 {propertyFinalDetails.owner_details.mobile1}</Text>
          </View>
        </View>
      </View>

      <View style={{ margin: 20 }}>
        <Button title="ADD" onPress={() => send()} />
      </View>
      <Snackbar
        visible={isVisible}
        textMessage={errorMessage}
        position={"top"}
        actionHandler={() => dismissSnackBar()}
        actionText="OK"
      />
      <ModalActivityIndicator visible={loading} size='large' color='#A9A9A9' />

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

      {/* close property modal  */}

    </ScrollView>
  ) : null);
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
    flexDirection: "column",
    alignItems: "flex-start",
    paddingRight: 16,
    paddingLeft: 16,
    paddingBottom: 16,
    paddingTop: 16,
    backgroundColor: "#d1d1d1"
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
    shadowOpacity: 0.0015 * 5 + 0.18,
    shadowRadius: 0.54 * 5,
    shadowOffset: {
      height: 0.6 * 5
    },
    backgroundColor: "#ffffff"
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
  propertyDetails: state.AppReducer.propertyDetails,
  userDetails: state.AppReducer.userDetails,
  residentialPropertyList: state.AppReducer.residentialPropertyList,
  startNavigationPoint: state.AppReducer.startNavigationPoint
});
const mapDispatchToProps = {
  setPropertyDetails,
  setResidentialPropertyList,
  setStartNavigationPoint
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddNewPropFinalDetails);



// export default AddNewPropFinalDetails;
