import React, { Component, useEffect, useState } from "react";
// import {
//   StyleSheet,
//   View,
//   Image,
//   Text,
//   ScrollView,
//   TouchableOpacity
// } from "react-native";
// import { Avatar } from "@rneui/themed";
import { numDifferentiation, dateFormat } from "././../../../../utils/methods";
import { connect } from "react-redux";
import Reminder from "../../../common/Reminder";
import { formatIsoDateToCustomString, camalize } from "../../../../utils/methods";


const CustomerDetailsCommercialBuyFromList = props => {
    const { navigation } = props;
    // const { item, displayMatchCount = true, displayMatchPercent = true } = props.route.params;
    let item = props.item || (props.route && props.route.params && props.route.params.item);
    let displayMatchCount = props.displayMatchCount !== undefined ? props.displayMatchCount : (props.route && props.route.params && props.route.params.displayMatchCount !== undefined ? props.route.params.displayMatchCount : true);
    // let displayMatchPercent = props.displayMatchPercent !== undefined ? props.displayMatchPercent : (props.route && props.route.params && props.route.params.displayMatchPercent !== undefined ? props.route.params.displayMatchPercent : true);

    // let item = props.anyItemDetails;
    // if (!item) {
    //   item = itemX
    // }

    const [location, setLocation] = useState([]);

    const getMatched = (matchedCustomerItem) => {
        navigation.navigate('MatchedProperties', { matchedCustomerItem: matchedCustomerItem },);
    }

    useEffect(() => {
        // setItem(props.anyItemDetails);

        if (item) {
            const locX = []
            item.customer_locality.location_area.map(item => {
                console.log(item.main_text);
                locX.push(item.main_text)
            })
            setLocation(locX)
        }

    }, [item])

    // // console.log(item);
    return (
        <div style={styles.container}>
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
                    backgroundColor: "#ffffff"
                }}
            >
                <div style={{
                    width: 60, height: 60, display: 'flex', justifyContent: 'center', alignItems: 'center',
                    backgroundColor: '#ccc', color: "rgba(105,105,105, .9)", border: '1px solid rgba(127,255,212, .9)',
                    fontSize: 24, fontWeight: 'bold'
                }}>
                    {item.customer_details.name && item.customer_details.name.slice(0, 1)}
                </div>

                <div style={{ paddingLeft: 20, paddingTop: 10, flex: 1, minHeight: 95 }}>
                    <p style={styles.title}>{item.customer_details.name}</p>
                    <p style={styles.subTitle}>
                        {item.customer_details.mobile1?.startsWith("+91")
                            ? item.customer_details.mobile1
                            : `+91 ${item.customer_details.mobile1}`}
                    </p>
                    <p style={{ ...styles.subTitle, marginTop: 5 }}>
                        {camalize(item.customer_details.address)}
                    </p>
                </div>
                {displayMatchCount && <button
                    onClick={() => getMatched(item)}
                    style={{ flexDirection: 'row', marginTop: 0, border: 'none', background: 'transparent', cursor: 'pointer', position: 'relative', width: 80, height: 60 }}
                >
                    <div style={{
                        backgroundColor: 'rgba(234, 155, 20, 0.7)', position: 'absolute', right: 0, top: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                        width: 38, height: 20, marginRight: 0
                    }}>
                        <span style={{ fontSize: 15, fontWeight: '500', color: '#000', paddingLeft: 0 }}>{item.match_count ? item.match_count : 0}</span>
                    </div>
                    <div style={{
                        position: 'absolute', right: 0, top: 20, transform: 'rotate(270deg)',
                        backgroundColor: 'rgba(80, 200, 120, 0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        width: 70, height: 35, padding: 0, marginRight: -15, marginTop: 20, marginBottom: 15,
                    }}>
                        <span style={{ fontSize: 14, fontWeight: '300', color: '#000' }}>Match</span>
                    </div>


                </button>}
            </div>

            {/* <Image
        source={require("../../assets/images/p1.jpg")}
        resizeMode={"stretch"}
        resizeMethod={"resize"}
        style={{ width: "100%", height: 200 }}
      /> */}

            <div style={{ ...styles.detailsContainer, backgroundColor: "#ffffff" }}>
                <div style={styles.details}>
                    <div style={styles.subDetails}>
                        <p style={styles.subDetailsValue}>
                            {item.customer_property_details.property_used_for}
                        </p>
                        <p style={styles.subDetailsTitle}>Prop Type</p>
                    </div>
                    <div style={styles.verticalLine}></div>
                    <div style={styles.subDetails}>
                        <p style={styles.subDetailsValue}>
                            {numDifferentiation(item.customer_buy_details.expected_buy_price)}
                        </p>
                        <p style={styles.subDetailsTitle}>Buy</p>
                    </div>
                    <div style={styles.verticalLine}></div>
                    <div style={styles.subDetails}>
                        <p style={styles.subDetailsValue}>
                            {item.customer_property_details.building_type}
                        </p>
                        <p style={styles.subDetailsTitle}>Building Type</p>
                    </div>
                    {/* <div style={styles.verticalLine}></div>
          <div style={styles.subDetails}>
            <p style={styles.subDetailsValue}>
              {item.customer_property_details.furnishing_status}
            </p>
            <p style={styles.subDetailsTitle}>Furnishing</p>
          </div> */}
                    {/* <div style={styles.verticalLine}></div> */}
                    {/* <div style={styles.subDetails}>
            <p style={styles.subDetailsValue}>
              {item.customer_property_details.property_size}sqft
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
                                {item.customer_locality.city}
                            </p>
                            <p style={styles.subDetailsTitle}>City</p>
                        </div>

                        <div style={{ paddingBottom: 20, width: "70%" }}>
                            <p style={styles.subDetailsValue}>
                                {location.join(', ')}
                            </p>
                            <p style={styles.subDetailsTitle}>Locations</p>
                        </div>

                        <div style={styles.subDetails}>
                            <p style={styles.subDetailsValue}>
                                {item.customer_buy_details.negotiable}
                            </p>
                            <p style={styles.subDetailsTitle}>Negotiable</p>
                        </div>

                        {/* <div style={styles.subDetails}>
              <p style={{ ...styles.subDetailsValue, width: 200 }}>
                {item.customer_property_details.ideal_for.join(", ")}
              </p>
              <p style={styles.subDetailsTitle}>Ideal For</p>
            </div> */}
                    </div>
                    <div style={styles.overviewRightColumn}>
                        <div style={styles.subDetails}>
                            <p style={styles.subDetailsValue}>
                                {formatIsoDateToCustomString(item.customer_buy_details.available_from)}
                            </p>
                            <p style={styles.subDetailsTitle}>Possession</p>
                        </div>
                        <div style={styles.subDetails}>
                            <p style={styles.subDetailsValue}>
                                {item.customer_property_details.parking_type}
                            </p>
                            <p style={styles.subDetailsTitle}>Parking</p>
                        </div>
                        {/* <div style={styles.subDetails}>
              <p style={styles.subDetailsValue}>Shop</p>
              <p style={styles.subDetailsTitle}>Last used for</p>
            </div> */}

                        {/* <div style={styles.subDetails}>
              <p style={styles.subDetailsValue}>
                {item.customer_property_details.property_age} years
              </p>
              <p style={styles.subDetailsTitle}>Age Of Building</p>
            </div> */}
                        {/* <div style={styles.subDetails}>
              <p style={styles.subDetailsValue}>
                {item.customer_property_details.power_backup}
              </p>
              <p style={styles.subDetailsTitle}>Power Backup</p>
            </div> */}
                    </div>
                </div>
            </div>
            {/* owner details */}
            <div style={styles.margin1}></div>
            <Reminder navigation={navigation} customerData={item} isSpecificRemider={true} />

        </div>
    );
};

const styles = {
    container: {
        flex: 1,
        overflowY: 'auto',
        height: '100vh'
    },
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
        display: 'flex',
        flexDirection: "column",
        alignItems: "flex-start",
        paddingRight: 16,
        paddingLeft: 16,
        paddingBottom: 16,
        paddingTop: 16,
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
        height: 60
        // borderTopWidth: 1
        // borderTopColor: "#C0C0C0",
        // backgroundColor: "rgba(220,220,220, 0.80)"
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
        borderBottomColor: "#ffffff",
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
        backgroundColor: "#E0E0E0"
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
    }
};

const mapStateToProps = state => ({
    userDetails: state.AppReducer.userDetails,
    anyItemDetails: state.AppReducer.anyItemDetails
});
// const mapDispatchToProps = {
//   setCommercialCustomerList
// };
export default connect(
    mapStateToProps,
    null
)(CustomerDetailsCommercialBuyFromList);
