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

import { MdArrowBack } from "react-icons/md";
import { useNavigate } from "react-router-dom";

const CustomerMeetingDetails = props => {
    const navigate = useNavigate();
    const handleBack = () => {
        if (window.history.length > 1 && window.history.state && window.history.state.idx > 0) {
            navigate(-1);
        } else {
            navigate('/notifications'); // Or wherever it should go back to
        }
    };
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

    if (!item) {
        return (
            <div style={{ flex: 1, backgroundColor: "var(--background)" }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '15px 20px',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                    backgroundColor: 'var(--background)',
                    position: 'sticky',
                    top: 0,
                    zIndex: 10,
                }}>
                    <div onClick={handleBack} style={{
                        cursor: 'pointer',
                        marginRight: '15px',
                        display: 'flex',
                        alignItems: 'center',
                    }}>
                        <MdArrowBack size={24} color="var(--foreground)" />
                    </div>
                    <h1 style={{
                        fontSize: '20px',
                        fontWeight: '600',
                        color: 'var(--foreground)',
                        margin: 0,
                    }}>Meeting Details</h1>
                </div>
                <div style={{ padding: '20px', textAlign: 'center', color: 'rgba(255, 255, 255, 0.6)' }}>
                    No meeting details available.
                </div>
            </div>
        );
    }

    return (
        <div style={{ flex: 1, backgroundColor: "var(--background)" }}>
            <div style={{
                display: 'flex',
                alignItems: 'center',
                padding: '15px 20px',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                backgroundColor: 'var(--background)',
                position: 'sticky',
                top: 0,
                zIndex: 10,
            }}>
                <div onClick={handleBack} style={{
                    cursor: 'pointer',
                    marginRight: '15px',
                    display: 'flex',
                    alignItems: 'center',
                }}>
                    <MdArrowBack size={24} color="var(--foreground)" />
                </div>
                <h1 style={{
                    fontSize: '20px',
                    fontWeight: '600',
                    color: 'var(--foreground)',
                    margin: 0,
                }}>Meeting Details</h1>
            </div>
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
                                <div className="bg-neutral-900 border-b border-neutral-600 flex flex-col sm:flex-row justify-between p-3 text-white font-semibold text-sm sm:text-base gap-2">
                                    <div className="flex-1 break-words">
                                        {reminderObj.reminder_for}
                                    </div>
                                    <div className="flex items-center gap-4 text-gray-200 whitespace-nowrap">
                                        <span>
                                            {formatIsoDateToCustomString(reminderObj.meeting_date)}
                                        </span>
                                        <span>
                                            {reminderObj.meeting_time}
                                        </span>
                                    </div>
                                </div>
                                <div className="bg-neutral-800 border-b border-neutral-700 p-3 text-center text-gray-200 font-bold">
                                    Related Properties For Meeting
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
                                        style={{ cursor: 'pointer', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', marginBottom: '10px', paddingBottom: '10px' }}
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
                                <div className="bg-neutral-900 border-b border-neutral-600 flex flex-col sm:flex-row justify-between p-3 text-white font-semibold text-sm sm:text-base gap-2">
                                    <div className="flex-1 break-words">
                                        {reminderObj.reminder_for}
                                    </div>
                                    <div className="flex items-center gap-4 text-gray-200 whitespace-nowrap">
                                        <span>
                                            {formatIsoDateToCustomString(reminderObj.meeting_date)}
                                        </span>
                                        <span>
                                            {reminderObj.meeting_time}
                                        </span>
                                    </div>
                                </div>
                                <div className="bg-neutral-800 border-b border-neutral-700 p-3 text-center text-gray-200 font-bold">
                                    Related Properties For Meeting
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
                                        style={{ cursor: 'pointer', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', marginBottom: '10px', paddingBottom: '10px' }}
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
                                <div className="bg-neutral-900 border-b border-neutral-600 flex flex-col sm:flex-row justify-between p-3 text-white font-semibold text-sm sm:text-base gap-2">
                                    <div className="flex-1 break-words">
                                        {reminderObj.reminder_for}
                                    </div>
                                    <div className="flex items-center gap-4 text-gray-200 whitespace-nowrap">
                                        <span>
                                            {formatIsoDateToCustomString(reminderObj.meeting_date)}
                                        </span>
                                        <span>
                                            {reminderObj.meeting_time}
                                        </span>
                                    </div>
                                </div>
                                <div className="bg-neutral-800 border-b border-neutral-700 p-3 text-center text-gray-200 font-bold">
                                    Related Properties For Meeting
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
                                        style={{ cursor: 'pointer', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', marginBottom: '10px', paddingBottom: '10px' }}
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
                                <div className="bg-neutral-900 border-b border-neutral-600 flex flex-col sm:flex-row justify-between p-3 text-white font-semibold text-sm sm:text-base gap-2">
                                    <div className="flex-1 break-words">
                                        {reminderObj.reminder_for}
                                    </div>
                                    <div className="flex items-center gap-4 text-gray-200 whitespace-nowrap">
                                        <span>
                                            {formatIsoDateToCustomString(reminderObj.meeting_date)}
                                        </span>
                                        <span>
                                            {reminderObj.meeting_time}
                                        </span>
                                    </div>
                                </div>
                                <div className="bg-neutral-800 border-b border-neutral-700 p-3 text-center text-gray-200 font-bold">
                                    Related Properties For Meeting
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
                                        style={{ cursor: 'pointer', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', marginBottom: '10px', paddingBottom: '10px' }}
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
