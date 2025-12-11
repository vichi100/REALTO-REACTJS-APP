import React, { Component, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// import {
//   StyleSheet,
//   View,
//   Image,
//   Text,
//   ScrollView,
//   Modal,
//   TouchableHighlight
// } from "react-native";
import Button from "./../../../../components/Button";
import axios from "axios";
import { SERVER_URL } from "./../../../../utils/Constant";
import { numDifferentiation, dateFormat } from "./../../../../utils/methods";
// import { Avatar } from "@rneui/themed";
import { connect } from "react-redux";
import {
    setPropertyType, setPropertyDetails, setCustomerDetails,
    setStartNavigationPoint,
    setCommercialCustomerList
} from "./../../../../reducers/Action";
// import ModalActivityIndicator from 'react-native-modal-activityindicator';



const AddNewCustomerCommercialRentFinalDetails = props => {
    const navigate = useNavigate();
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
        navigate("/login");
        setModalVisible(false);
    }

    const send = async () => {
        // console.log(await AsyncStorage.getItem("property"));
        if (props.userDetails === null) {
            console.log("You are not logged in, please login");
            setModalVisible(true);
            return;
        }
        setLoading(true);
        customerFinalDetails.agent_id = props.userDetails.works_for;

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
                            navigate("/contacts", { state: { didDbCall: true } });

                        } else {
                            navigate("/contacts/CustomerListForMeeting");
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
        <div style={{ flex: 1, backgroundColor: "#ffffff", overflowY: 'auto', height: '100vh' }}>
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
                        backgroundColor: "#ffffff"
                    }}
                >
                    {/* Avatar replacement */}
                    <div style={{
                        width: 80, height: 80, display: 'flex', justifyContent: 'center', alignItems: 'center',
                        backgroundColor: '#ffffff', color: "#000000", border: '1px solid #000000',
                        fontSize: 30, fontWeight: 'bold'
                    }}>
                        {customerFinalDetails.customer_details.name && customerFinalDetails.customer_details.name.slice(0, 1)}
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
                        <p style={styles.subDetailsValue}>
                            {customerFinalDetails.customer_property_details.property_used_for}
                        </p>
                        <p style={styles.subDetailsTitle}>Looking For</p>
                    </div>
                    <div style={styles.verticalLine}></div>
                    <div style={styles.subDetails}>
                        <p style={styles.subDetailsValue}>
                            {numDifferentiation(
                                customerFinalDetails.customer_rent_details.expected_rent
                            )}
                        </p>
                        <p style={styles.subDetailsTitle}>
                            Max {customerFinalDetails.customer_locality.property_for}
                        </p>
                    </div>
                    <div style={styles.verticalLine}></div>
                    <div style={styles.subDetails}>
                        <p style={styles.subDetailsValue}>
                            {numDifferentiation(
                                customerFinalDetails.customer_rent_details.expected_deposit
                            )}
                        </p>
                        <p style={styles.subDetailsTitle}>Max Deposit</p>
                    </div>
                    <div style={styles.verticalLine}></div>
                    <div style={styles.subDetails}>
                        <p style={styles.subDetailsValue}>
                            {customerFinalDetails.customer_property_details.property_size}sqft
                        </p>
                        <p style={styles.subDetailsTitle}>Builtup Apx</p>
                    </div>
                </div>
            </div>

            <div style={styles.margin1}></div>
            {/* property details */}
            <div style={styles.overviewContainer}>
                <div style={styles.overview}>
                    <p style={{ fontSize: 16, fontWeight: "600", color: "#000000", margin: 0 }}>Details</p>
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

                        <div style={styles.subDetails}>
                            <p style={styles.subDetailsValue}>
                                {customerFinalDetails.customer_property_details.building_type}
                            </p>
                            <p style={styles.subDetailsTitle}>Building Type</p>
                        </div>
                    </div>
                    <div style={styles.overviewRightColumn}>
                        <div style={styles.subDetails}>
                            <p style={styles.subDetailsValue}>
                                {dateFormat(
                                    customerFinalDetails.customer_rent_details.available_from
                                )}
                            </p>
                            <p style={styles.subDetailsTitle}>Possession</p>
                        </div>
                        <div style={styles.subDetails}>
                            <p style={styles.subDetailsValue}>
                                {customerFinalDetails.customer_property_details.parking_type}
                            </p>
                            <p style={styles.subDetailsTitle}>Parking</p>
                        </div>
                        {/* <div style={styles.subDetails}>
              <p style={styles.subDetailsValue}>
                {propertyFinalDetails.customer_property_details.floor_number}/
                {propertyFinalDetails.customer_property_details.total_floor}
              </p>
              <p style={styles.subDetailsTitle}>Floor</p>
            </div> */}
                        {/* <div style={styles.subDetails}>
              <p style={styles.subDetailsValue}>
                {propertyFinalDetails.customer_rent_details.non_veg_allowed}
              </p>
              <p style={styles.subDetailsTitle}>NonVeg</p>
            </div> */}
                        {/* <div style={styles.subDetails}>
              <p style={styles.subDetailsValue}>
                {customerFinalDetails.customer_property_details.property_age}
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
            <p>{customerFinalDetails.owner_details.name}</p>
            <p>{customerFinalDetails.owner_details.address}</p>
            <p>+91 {customerFinalDetails.owner_details.mobile1}</p>
          </div>
        </div>
      </div> */}
            <div style={{ margin: 20 }}>
                <Button title="ADD" onPress={() => send()} />
            </div>

            {modalVisible && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex',
                    justifyContent: 'center', alignItems: 'center', zIndex: 1000
                }}>
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
                </div>
            )}

            {loading && <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>Loading...</div>}


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
        boxShadow: '0px 3px 2.7px rgba(0, 0, 0, 0.18)',
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
        margin: 0,
        color: "#000000"
    },
    subTitle: {
        fontSize: 14,
        fontWeight: "400",
        color: "#000000", // Changed from white to black for visibility on white/grey bg
        margin: 0
    },
    detailsContainer: {
        // borderBottomWidth: 1,
        height: 60,
        borderTopWidth: 1,
        borderTopColor: "#000000",
        backgroundColor: "#ffffff"
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
        margin: 0,
        color: "#000000"
    },
    subDetailsValue: {
        fontSize: 14,
        fontWeight: "600",
        margin: 0,
        color: "#000000"
    },
    verticalLine: {
        height: "70%",
        width: 1,
        backgroundColor: "#000000"
    },

    horizontalLine: {
        borderBottomColor: "#000000",
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
        boxShadow: '0px 3px 2.7px rgba(0, 0, 0, 0.18)',
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
        flex: 1,
        display: 'flex',
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
        // shadowColor: "#000",
        // shadowOffset: {
        //   width: 0,
        //   height: 2
        // },
        // shadowOpacity: 0.25,
        // shadowRadius: 3.84,
        boxShadow: '0px 2px 3.84px rgba(0,0,0,0.25)',
        elevation: 5,
        position: 'relative'
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
        cursor: 'pointer'
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
        cursor: 'pointer'
    },
    modalText: {
        marginBottom: 16,
        fontWeight: "600",
        textAlign: "center"
    },
    textStyle: {
        fontWeight: 'bold'
    }
};

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
)(AddNewCustomerCommercialRentFinalDetails);

// export default AddNewCustomerCommercialRentFinalDetails;
