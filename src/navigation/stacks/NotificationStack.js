import * as React from "react";
import { Routes, Route } from 'react-router-dom';
import NotificationTopTab from "../tabs/NotificationTopTabNavigator";
import CustomerMeetingDetails from "./../../screens/contacts/CustomerMeetingDetails";
import PropDetailsFromListing from "./../../screens/property/residential/rent/PropDetailsFromListing";
import PropDetailsFromListingForSell from "./../../screens/property/residential/sell/PropDetailsFromListingForSell";
import CommercialRentPropDetails from "./../../screens/property/commercial/rent/CommercialRentPropDetails";
import CommercialSellPropDetails from "./../../screens/property/commercial/sell/CommercialSellPropDetails";
import MessageDetails from "./../../screens/messages/MessageDetails";
import ScreenWrapper from "../../components/ScreenWrapper";

const NotificationStack = () => {
    return (
        <Routes>
            <Route path="/*" element={<ScreenWrapper Component={NotificationTopTab} />} />
            <Route path="/NotificationTopTab" element={<ScreenWrapper Component={NotificationTopTab} />} />
            <Route path="/CustomerMeetingDetails" element={<ScreenWrapper Component={CustomerMeetingDetails} />} />
            <Route path="/MessageDetails" element={<ScreenWrapper Component={MessageDetails} />} />
            <Route path="/PropDetailsFromListing" element={<ScreenWrapper Component={PropDetailsFromListing} />} />
            <Route path="/PropDetailsFromListingForSell" element={<ScreenWrapper Component={PropDetailsFromListingForSell} />} />
            <Route path="/CommercialRentPropDetails" element={<ScreenWrapper Component={CommercialRentPropDetails} />} />
            <Route path="/CommercialSellPropDetails" element={<ScreenWrapper Component={CommercialSellPropDetails} />} />
        </Routes>
    );
};

export default NotificationStack;
