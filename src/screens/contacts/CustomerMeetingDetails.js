import React, { useState, useEffect } from "react";
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
import { formatIsoDateToCustomString } from "./../../utils/methods";
import {
    setPropertyDetails
} from "../../reducers/Action";

const CustomerMeetingDetails = props => {
    const { navigation } = props;
    const { item, updateDbCall } = props.route?.params || {};

    const [reminderObj, setReminderObj] = useState(item);
    const [customerMeetingDetailsObj, setCustomerMeetingDetailsObj] = useState(
        null
    );
    useEffect(() => {
        if (reminderObj) {
            getCustomerAndMeetingDetails();
        }
    }, [reminderObj]);

    const getCustomerAndMeetingDetails = () => {
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
                    if (response.data !== "fail") {
                        setCustomerMeetingDetailsObj(response.data);
                    }
                },
                error => {
                }
            );
    };

    if (!item) return null;

    return (
        <div style={{ flex: 1, backgroundColor: "rgba(254,254,250, 0.1)", height: '100vh', overflowY: 'auto' }}>
            {customerMeetingDetailsObj ? (
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    {item.category_type === "Residential" ? (
                        item.category_for === "Rent" ? (
                            <div>
                                <ContactResidentialRentCard
                                    navigation={navigation}
                                    item={customerMeetingDetailsObj.customer_details}
                                    disableDrawer={true}
                                    displayCheckBox={false}
                                    displayMatchCount={false}
                                    displayMatchPercent={false}
                                />
                                <div
                                    style={{
                                        backgroundColor: "#ffffff",
                                        marginBottom: 1,
                                        flexDirection: "row",
                                        justifyContent: "space-between",
                                        display: 'flex'
                                    }}
                                >
                                    <span style={{ padding: 10 }}>
                                        {reminderObj.reminder_for}
                                    </span>
                                    <span style={{ padding: 10 }}>
                                        {formatIsoDateToCustomString(reminderObj.meeting_date)}
                                    </span>
                                    <span style={{ padding: 10 }}>
                                        {reminderObj.meeting_time}
                                    </span>
                                </div>
                                <div
                                    style={{
                                        backgroundColor: "rgba(0,255,255, 0.1)"
                                    }}
                                >
                                    <p style={{ padding: 10, textAlign: "center", margin: 0 }}>
                                        Related Properties For Meeting
                                    </p>
                                </div>

                                {customerMeetingDetailsObj.property_details.map((item, index) => (
                                    <div
                                        key={index}
                                        onClick={() => {
                                            props.setPropertyDetails(item);
                                            navigation.navigate("PropDetailsFromListing", {
                                                item: item,
                                                displayMatchCount: false,
                                                displayMatchPercent: true
                                            })

                                        }}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <div>
                                            <CardResidentialRent
                                                navigation={navigation}
                                                item={item}
                                                disableDrawer={true}
                                                displayCheckBox={false}
                                                displayMatchCount={false}
                                                displayMatchPercent={true}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : item.category_for === "Buy" || item.category_for === "Sell" ? (
                            <div>
                                <ContactResidentialSellCard
                                    navigation={navigation}
                                    item={customerMeetingDetailsObj.customer_details}
                                    disableDrawer={true}
                                    displayCheckBox={false}
                                    displayMatchCount={false}
                                />
                                <div
                                    style={{
                                        backgroundColor: "#ffffff",
                                        marginBottom: 1,
                                        flexDirection: "row",
                                        justifyContent: "space-between",
                                        display: 'flex'
                                    }}
                                >
                                    <span style={{ padding: 10 }}>
                                        {reminderObj.reminder_for}
                                    </span>
                                    <span style={{ padding: 10 }}>
                                        {formatIsoDateToCustomString(reminderObj.meeting_date)}
                                    </span>
                                    <span style={{ padding: 10 }}>
                                        {reminderObj.meeting_time}
                                    </span>
                                </div>
                                <div
                                    style={{
                                        backgroundColor: "rgba(0,255,255, 0.1)"
                                    }}
                                >
                                    <p style={{ padding: 10, textAlign: "center", margin: 0 }}>
                                        Related Properties For Meeting
                                    </p>
                                </div>

                                {customerMeetingDetailsObj.property_details.map((item, index) => (
                                    <div
                                        key={index}
                                        onClick={() => {
                                            props.setPropertyDetails(item);
                                            navigation.navigate("PropDetailsFromListingForSell", {
                                                item: item,
                                                displayMatchCount: false,
                                                displayMatchPercent: true
                                            })

                                        }

                                        }
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <div>
                                            <CardResidentialSell
                                                navigation={navigation}
                                                item={item}
                                                disableDrawer={true}
                                                displayCheckBox={false}
                                                displayMatchCount={false}
                                                displayMatchPercent={true}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : null
                    ) : item.category_type === "Commercial" ? (
                        item.category_for === "Rent" ? (
                            <div>
                                <CustomerCommercialRentCard
                                    navigation={navigation}
                                    item={customerMeetingDetailsObj.customer_details}
                                    disableDrawer={true}
                                    displayCheckBox={false}
                                    displayMatchCount={false}
                                />
                                <div
                                    style={{
                                        backgroundColor: "#ffffff",
                                        marginBottom: 1,
                                        flexDirection: "row",
                                        justifyContent: "space-between",
                                        display: 'flex'
                                    }}
                                >
                                    <span style={{ padding: 10 }}>
                                        {reminderObj.reminder_for}
                                    </span>
                                    <span style={{ padding: 10 }}>
                                        {formatIsoDateToCustomString(reminderObj.meeting_date)}
                                    </span>
                                    <span style={{ padding: 10 }}>
                                        {reminderObj.meeting_time}
                                    </span>
                                </div>
                                <div
                                    style={{
                                        backgroundColor: "rgba(0,255,255, 0.1)"
                                    }}
                                >
                                    <p style={{ padding: 10, textAlign: "center", margin: 0 }}>
                                        Related Properties For Meeting
                                    </p>
                                </div>

                                {customerMeetingDetailsObj.property_details.map((item, index) => (
                                    <div
                                        key={index}
                                        onClick={() => {
                                            props.setPropertyDetails(item)
                                            navigation.navigate("CommercialRentPropDetails", {
                                                item: item,
                                                displayMatchCount: false,
                                                displayMatchPercent: true
                                            })
                                        }
                                        }
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <div>
                                            <CardCommercialRent
                                                navigation={navigation}
                                                item={item}
                                                disableDrawer={true}
                                                displayCheckBox={false}
                                                displayMatchCount={false}
                                                displayMatchPercent={true}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>

                        ) : (
                            <div>
                                <CustomerCommercialBuyCard
                                    navigation={navigation}
                                    item={customerMeetingDetailsObj.customer_details}
                                    disableDrawer={true}
                                    displayCheckBox={false}
                                    displayMatchCount={false}
                                />
                                <div
                                    style={{
                                        backgroundColor: "#ffffff",
                                        marginBottom: 1,
                                        flexDirection: "row",
                                        justifyContent: "space-between",
                                        display: 'flex'
                                    }}
                                >
                                    <span style={{ padding: 10 }}>
                                        {reminderObj.reminder_for}
                                    </span>
                                    <span style={{ padding: 10 }}>
                                        {formatIsoDateToCustomString(reminderObj.meeting_date)}
                                    </span>
                                    <span style={{ padding: 10 }}>
                                        {reminderObj.meeting_time}
                                    </span>
                                </div>
                                <div
                                    style={{
                                        backgroundColor: "rgba(0,255,255, 0.1)"
                                    }}
                                >
                                    <p style={{ padding: 10, textAlign: "center", margin: 0 }}>
                                        Related Properties For Meeting
                                    </p>
                                </div>

                                {customerMeetingDetailsObj.property_details.map((item, index) => (
                                    <div
                                        key={index}
                                        onClick={() => {
                                            props.setPropertyDetails(item);
                                            navigation.navigate("CommercialSellPropDetails", {
                                                item: item,
                                                displayMatchCount: false,
                                                displayMatchPercent: true
                                            })
                                        }
                                        }
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <div>
                                            <CardCommercialSell
                                                navigation={navigation}
                                                item={item}
                                                disableDrawer={true}
                                                displayCheckBox={false}
                                                displayMatchCount={false}
                                                displayMatchPercent={true}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )
                    ) : null}
                </div>
            ) : null}
        </div>
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
