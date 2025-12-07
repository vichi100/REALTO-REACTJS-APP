import * as React from "react";
import { Routes, Route } from 'react-router-dom';
import ListingTopTab from "../tabs/ListingTopTabNavigator";
import Meeting from "./../../screens/meeting/Meeting";
import PropDetailsFromListing from "./../../screens/property/residential/rent/PropDetailsFromListing";
import PropDetailsFromListingForSell from "./../../screens/property/residential/sell/PropDetailsFromListingForSell";
import CommercialRentPropDetails from "./../../screens/property/commercial/rent/CommercialRentPropDetails";
import CommercialSellPropDetails from "./../../screens/property/commercial/sell/CommercialSellPropDetails";
import AddNewPropertyStack from "./AddPropertyStack";
import CustomerMeetingDetails from "././../../screens/contacts/CustomerMeetingDetails";
import CustomerListForMeeting from "./../../screens/meeting/CustomerListForMeeting";
import PropertyListForMeeting from "./../../screens/contacts/PropertyListForMeeting";
import AddNewContactsStack from "./AddCustomerStack";
import MatchedCustomers from "./../../screens/contacts/MatchedCustomers";
import MatchedProperties from "./../../screens/property/MatchedProperties";
import CustomerDetailsResidentialRentFromList from "./../../screens/contacts/residential/rent/CustomerDetailsResidentialRentFromList";
import CustomerDetailsResidentialBuyFromList from "./../../screens/contacts/residential/buy/CustomerDetailsResidentialBuyFromList";
import CustomerDetailsCommercialRentFromList from "./../../screens/contacts/commercial/rent/CustomerDetailsCommercialRentFromList";
import CustomerDetailsCommercialBuyFromList from "./../../screens/contacts/commercial/buy/CustomerDetailsCommercialBuyFromList";
import EmployeeList from "./../../screens/employee/EmployeeList";
import CustomerMeeting from "../../screens/contacts/CustomerMeeting";
import ScreenWrapper from "../../components/ScreenWrapper";

const ListingStack = () => {
    return (
        <Routes>
            <Route path="/*" element={<ScreenWrapper Component={ListingTopTab} />} />
            <Route path="/Listing/*" element={<ScreenWrapper Component={ListingTopTab} />} />
            <Route path="/Meeting" element={<ScreenWrapper Component={Meeting} />} />
            <Route path="/PropDetailsFromListing" element={<ScreenWrapper Component={PropDetailsFromListing} />} />
            <Route path="/MatchedCustomers" element={<ScreenWrapper Component={MatchedCustomers} />} />
            <Route path="/MatchedProperties" element={<ScreenWrapper Component={MatchedProperties} />} />
            <Route path="/PropDetailsFromListingForSell" element={<ScreenWrapper Component={PropDetailsFromListingForSell} />} />
            <Route path="/CommercialRentPropDetails" element={<ScreenWrapper Component={CommercialRentPropDetails} />} />
            <Route path="/CommercialSellPropDetails" element={<ScreenWrapper Component={CommercialSellPropDetails} />} />
            <Route path="/AddNewCustomerStack/*" element={<AddNewContactsStack />} />
            <Route path="/Add/*" element={<AddNewPropertyStack />} />
            <Route path="/CustomerMeetingDetails" element={<ScreenWrapper Component={CustomerMeetingDetails} />} />
            <Route path="/CustomerListForMeeting" element={<ScreenWrapper Component={CustomerListForMeeting} />} />
            <Route path="/CustomerMeeting" element={<ScreenWrapper Component={CustomerMeeting} />} />
            <Route path="/CustomerDetailsResidentialRentFromList" element={<ScreenWrapper Component={CustomerDetailsResidentialRentFromList} />} />
            <Route path="/CustomerDetailsResidentialBuyFromList" element={<ScreenWrapper Component={CustomerDetailsResidentialBuyFromList} />} />
            <Route path="/CustomerDetailsCommercialRentFromList" element={<ScreenWrapper Component={CustomerDetailsCommercialRentFromList} />} />
            <Route path="/CustomerDetailsCommercialBuyFromList" element={<ScreenWrapper Component={CustomerDetailsCommercialBuyFromList} />} />
            <Route path="/PropertyListForMeeting" element={<ScreenWrapper Component={PropertyListForMeeting} />} />
            <Route path="/EmployeeListOfListing" element={<ScreenWrapper Component={EmployeeList} />} />
        </Routes>
    );
};

export default ListingStack;
