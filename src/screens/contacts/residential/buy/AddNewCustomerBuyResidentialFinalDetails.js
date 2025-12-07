import React, { Component, useEffect, useState } from "react";
// import {
//   StyleSheet,
//   View,
//   Image,
//   Text,
//   ScrollView,
//   Modal,
//   TouchableHighlight
// } from "react-native";
// import Slideshow from "./../../../../components/Slideshow";
import Button from "./../../../../components/Button";
import axios from "axios";
import { SERVER_URL } from "./../../../../utils/Constant";
import { numDifferentiation } from "./../../../../utils/methods";
// import { Avatar } from "@rneui/themed";
import { connect } from "react-redux";
import {
    setPropertyType, setPropertyDetails, setCustomerDetails,
    setStartNavigationPoint, setResidentialCustomerList
} from "./../../../../reducers/Action";
// import ModalActivityIndicator from 'react-native-modal-activityindicator';



const AddNewCustomerBuyResidentialFinalDetails = props => {
    const { navigation } = props;
    const [customerFinalDetails, setCustomerFinalDetails] = useState(null);
    const [bhk, setBHK] = useState(null);
    const [possessionDate, setPossessionDate] = useState(null);
    const [location, setLocation] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        getPropFinalDetails();
    }, []);

    useEffect(() => {
        if (customerFinalDetails !== null) {
            // let bhkTemp = propertyFinalDetails.property_details.bhk_type;
            // if (bhkTemp.indexOf("RK") > -1) {
            //   setBHK(bhkTemp);
            // } else {
            //   let x = bhkTemp.split("BHK");
            //   setBHK(x[0]);
            // }
            const availableDateStr =
                customerFinalDetails.customer_buy_details.available_from;
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
    }, [customerFinalDetails]);

    const getPropFinalDetails = async () => {
        const customer = props.customerDetails
        console.log(JSON.stringify(customer));
        setCustomerFinalDetails(customer);
        if (customer && customer.customer_locality && customer.customer_locality.location_area) {
            const locX = []
            customer.customer_locality.location_area.map(item => {
                console.log(item.main_text);
                locX.push(item.main_text)
            })
            setLocation(locX)
        }
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

        // console.log(await AsyncStorage.getItem("customer"));
        axios
            .post(
                SERVER_URL + "/addNewResidentialCustomer",
                customerFinalDetails
            )
            .then(
                async response => {
                    // console.log(response.data);
                    if (response.data.customer_id !== null) {
                        // await AsyncStorage.removeItem("customer");
                        props.setCustomerDetails(null);
                        props.setResidentialCustomerList([...props.residentialCustomerList, response.data]);

                        if (props.startNavigationPoint === null) {
                            navigation.navigate("Contacts", { didDbCall: true });

                        } else {
                            navigation.navigate("CustomerListForMeeting");
                        }
                        props.setStartNavigationPoint(null)

                    } else {
                        setErrorMessage(
                            "Error: Seems there is some network issue, please try later"
                        );
                    }
                    setLoading(false);
                },
                error => {
                    // console.log(error);
                    setLoading(false);
                }
            );
    };
    return customerFinalDetails ? (
        <div style={{ flex: 1, backgroundColor: "#ffffff", height: '100vh', overflowY: 'auto' }}>
            <div style={styles.headerContainer}>
                <div
                    style={{
                        display: 'flex',
                        flexDirection: "row",
                        alignItems: "flex-start",
                        paddingRight: 16,
                        // paddingLeft: 16,
                        // paddingBottom: 16,
                        // paddingTop: 16,
                        width: "100%",
                        backgroundColor: "#d1d1d1"
                    }}
                >
                    <div style={{
                        width: 80, height: 80, display: 'flex', justifyContent: 'center', alignItems: 'center',
                        backgroundColor: '#ccc', color: "rgba(105,105,105, .9)", border: '1px solid rgba(127,255,212, .9)',
                        fontSize: 32, fontWeight: 'bold'
                    }}>
                        {customerFinalDetails.customer_details.name &&
                            customerFinalDetails.customer_details.name.slice(0, 1)}
                    </div>

                    <div style={{ paddingLeft: 20, paddingTop: 10 }}>
                        <p style={styles.title}>
                            {customerFinalDetails.customer_details.name}
                        </p>
                        <p style={styles.subTitle}>
                            {customerFinalDetails.customer_details.mobile1}
                        </p>
                        <p style={styles.subTitle}>
                            {customerFinalDetails.customer_details.address}
                        </p>
                    </div>
                </div>
            </div>

            <div style={styles.detailsContainer}>
                <div style={styles.details}>
                    <div style={styles.subDetails}>
                        <p style={{ ...styles.subDetailsValue, textAlign: "center" }}>
                            {customerFinalDetails.customer_property_details.bhk_type}
                        </p>
                        <p style={styles.subDetailsTitle}>Looking For</p>
                    </div>
                    <div style={styles.verticalLine}></div>
                    <div style={styles.subDetails}>
                        <p style={styles.subDetailsValue}>
                            {numDifferentiation(
                                customerFinalDetails.customer_buy_details.expected_buy_price
                            )}
                        </p>
                        <p style={styles.subDetailsTitle}>
                            {customerFinalDetails.customer_locality.property_for}
                        </p>
                    </div>
                    {/* <div style={styles.verticalLine}></div>
          <div style={styles.subDetails}>
            <p style={styles.subDetailsValue}>
              {propertyFinalDetails.property_details.property_size}
            </p>
            <p style={styles.subDetailsTitle}>Builtup</p>
          </div> */}
                    <div style={styles.verticalLine}></div>
                    <div style={styles.subDetails}>
                        <p style={styles.subDetailsValue}>
                            {customerFinalDetails.customer_property_details.furnishing_status}
                        </p>
                        <p style={styles.subDetailsTitle}>Furnishing</p>
                    </div>
                    {/* <div style={styles.verticalLine}></div>
          <div style={styles.subDetails}>
            <p style={styles.subDetailsValue}>
              {propertyFinalDetails.property_details.property_size}sqft
            </p>
            <p style={styles.subDetailsTitle}>Builtup</p>
          </div> */}
                </div>
            </div>

            <div style={styles.margin1}></div>
            {/* property details */}
            <div style={styles.overviewContainer}>
                <div style={styles.overview}>
                    <p>Details</p>
                    <div style={styles.horizontalLine}></div>
                </div>
                <div style={styles.overviewColumnWrapper}>
                    <div style={styles.overviewLeftColumn}>
                        <div style={styles.subDetails}>
                            <p style={styles.subDetailsValue}>
                                {customerFinalDetails.customer_locality.city}
                            </p>
                            <p style={styles.subDetailsTitle}>City</p>
                        </div>
                        <div style={{ paddingBottom: 20, width: "80%" }}>
                            <p style={styles.subDetailsValue}>
                                {location.join(', ')}
                            </p>
                            <p style={styles.subDetailsTitle}>Locations</p>
                        </div>

                        {/* <div style={styles.subDetails}>
              <p style={styles.subDetailsValue}>
                {numDifferentiation(
                  propertyFinalDetails.customer_buy_details.maintenance_charge
                )}
              </p>
              <p style={styles.subDetailsTitle}>Maintenance charge</p>
            </div> */}
                        <div style={styles.subDetails}>
                            <p style={styles.subDetailsValue}>
                                {customerFinalDetails.customer_property_details.lift}
                            </p>
                            <p style={styles.subDetailsTitle}>Lift</p>
                        </div>
                    </div>
                    <div style={styles.overviewRightColumn}>
                        <div style={styles.subDetails}>
                            <p style={styles.subDetailsValue}>{possessionDate}</p>
                            <p style={styles.subDetailsTitle}>Possession</p>
                        </div>
                        <div style={styles.subDetails}>
                            <p style={styles.subDetailsValue}>
                                {/* {propertyFinalDetails.property_details.parking_number}{" "} */}
                                {customerFinalDetails.customer_property_details.parking_type}
                            </p>
                            <p style={styles.subDetailsTitle}>Parking</p>
                        </div>
                        {/* <div style={styles.subDetails}>
              <p style={styles.subDetailsValue}>
                {propertyFinalDetails.property_details.floor_number}/
                {propertyFinalDetails.property_details.total_floor}
              </p>
              <p style={styles.subDetailsTitle}>Floor</p>
            </div> */}
                        <div style={styles.subDetails}>
                            <p style={styles.subDetailsValue}>
                                {customerFinalDetails.customer_buy_details.negotiable}
                            </p>
                            <p style={styles.subDetailsTitle}>Negotiable</p>
                        </div>
                        {/* <div style={styles.subDetails}>
              <p style={styles.subDetailsValue}>
                {propertyFinalDetails.property_details.property_age}
              </p>
              <p style={styles.subDetailsTitle}>Age Of Building</p>
            </div> */}
                    </div>
                </div>
            </div>
            {/* owner details */}
            <div style={styles.margin1}></div>
            {/* <div style={styles.overviewContainer}>
        <div style={styles.overview}>
          <p>Owner</p>
          <div style={styles.horizontalLine}></div>
          <div style={styles.ownerDetails}>
            <p>{propertyFinalDetails.owner_details.name}</p>
            <p>{propertyFinalDetails.owner_details.address}</p>
            <p>+91 {propertyFinalDetails.owner_details.mobile1}</p>
          </div>
        </div>
      </div> */}
            <div style={{ margin: 20 }}>
                <Button title="ADD" onPress={() => send()} />
            </div>

            {modalVisible && (
                <div style={styles.centeredView1}>
                    <div style={styles.modalView}>
                        <p style={styles.modalText}>
                            You are not logged in, please login.
                        </p>


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
                                    setModalVisible(!modalVisible);
                                }}
                            >
                                <span style={styles.textStyle}>Cancel</span>
                            </button>
                            <button
                                style={{ ...styles.applyButton }}
                                onClick={() => {
                                    login();
                                    setModalVisible(!modalVisible);
                                }}
                            >
                                <span style={styles.textStyle}>Login</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {loading && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 1000
                }}>
                    <div className="loader">Loading...</div>
                </div>
            )}

        </div>
    ) : null;
};

const styles = {
    card: {
        // shadowOpacity: 0.0015 * 5 + 0.18,
        // shadowRadius: 0.54 * 5,
        // shadowOffset: {
        //   height: 0.6 * 5
        // },
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
        fontWeight: "600",
        margin: 0
    },
    subTitle: {
        fontSize: 14,
        fontWeight: "400",
        color: "rgba(0 ,0 ,0 , 0.87)",
        margin: 0
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
        display: 'flex',
        flexDirection: "row",
        justifyContent: "space-between"
    },
    subDetails: {
        paddingBottom: 20
    },
    subDetailsTitle: {
        fontSize: 12,
        fontWeight: "400",
        margin: 0
    },
    subDetailsValue: {
        fontSize: 14,
        fontWeight: "600",
        margin: 0
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
        // shadowOpacity: 0.0015 * 5 + 0.18,
        // shadowRadius: 0.54 * 5,
        // shadowOffset: {
        //   height: 0.6 * 5
        // },
        backgroundColor: "white"
    },
    overview: {
        padding: 10
    },
    overviewSubDetailsRow: {
        display: 'flex',
        flexDirection: "row",
        justifyContent: "center",
        padding: 15
    },

    overviewColumnWrapper: {
        display: 'flex',
        flexDirection: "row",
        justifyContent: "space-between",
        padding: 10
    },
    overviewLeftColumn: {
        display: 'flex',
        flexDirection: "column",
        justifyContent: "center"
    },
    overviewRightColumn: {
        display: 'flex',
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
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: 'rgba(0,0,0,0.5)',
        zIndex: 1000
    },
    modalView: {
        margin: 20,
        height: 150,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        boxShadow: "0px 2px 4px rgba(0,0,0,0.25)",
        position: 'relative',
        width: 300
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
        marginRight: 10,
        border: 'none',
        background: 'none',
        cursor: 'pointer',
        color: '#2196F3',
        fontWeight: 'bold'
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
        marginRight: 30,
        border: 'none',
        background: 'none',
        cursor: 'pointer',
        color: '#f44336',
        fontWeight: 'bold'
    },
    modalText: {
        marginBottom: 16,
        fontWeight: "600",
        textAlign: "center"
    },
};

const mapStateToProps = state => ({
    userDetails: state.AppReducer.userDetails,
    propertyDetails: state.AppReducer.propertyDetails,
    customerDetails: state.AppReducer.customerDetails,
    startNavigationPoint: state.AppReducer.startNavigationPoint,
    residentialCustomerList: state.AppReducer.residentialCustomerList
});
const mapDispatchToProps = {
    setPropertyType,
    setPropertyDetails,
    setCustomerDetails,
    setStartNavigationPoint,
    setResidentialCustomerList
};
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AddNewCustomerBuyResidentialFinalDetails);
