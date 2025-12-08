import * as React from "react";
import { Routes, Route } from 'react-router-dom';
import ContactsTopTab from "../tabs/ContactsTopTabNavigator";
import Meeting from "./../../screens/meeting/Meeting";
import CustomerMeeting from "./../../screens/contacts/CustomerMeeting";
import PropDetailsFromListing from "./../../screens/property/residential/rent/PropDetailsFromListing";
import PropDetailsFromListingForSell from "./../../screens/property/residential/sell/PropDetailsFromListingForSell";
import CommercialRentPropDetails from "./../../screens/property/commercial/rent/CommercialRentPropDetails";
import CommercialSellPropDetails from "./../../screens/property/commercial/sell/CommercialSellPropDetails";
import CustomerDetailsResidentialRentFromList from "./../../screens/contacts/residential/rent/CustomerDetailsResidentialRentFromList";
import CustomerDetailsResidentialBuyFromList from "./../../screens/contacts/residential/buy/CustomerDetailsResidentialBuyFromList";
import CustomerDetailsCommercialRentFromList from "./../../screens/contacts/commercial/rent/CustomerDetailsCommercialRentFromList";
import CustomerDetailsCommercialBuyFromList from "./../../screens/contacts/commercial/buy/CustomerDetailsCommercialBuyFromList";
import PropertyListForMeeting from "./../../screens/contacts/PropertyListForMeeting";
import CustomerMeetingDetails from "./../../screens/contacts/CustomerMeetingDetails";
import AddNewContactsStack from "./AddCustomerStack";
import AddNewPropertyStack from "./AddPropertyStack";
import MatchedProperties from "./../../screens/property/MatchedProperties";
import MatchedCustomers from "./../../screens/contacts/MatchedCustomers";
import CustomerListForMeeting from "./../../screens/meeting/CustomerListForMeeting";
import EmployeeList from "./../../screens/employee/EmployeeList";
import ScreenWrapper from "../../components/ScreenWrapper";

const ContactsStack = () => {
    return (
        <Routes>
            <Route path="/*" element={<ScreenWrapper Component={ContactsTopTab} />} />
            <Route path="/Contacts/*" element={<ScreenWrapper Component={ContactsTopTab} />} />
            <Route path="/Meeting" element={<ScreenWrapper Component={Meeting} />} />
            <Route path="CustomerMeeting" element={<ScreenWrapper Component={CustomerMeeting} />} />
            <Route path="PropertyListForMeeting" element={<ScreenWrapper Component={PropertyListForMeeting} />} />
            <Route path="/PropDetailsFromListing" element={<ScreenWrapper Component={PropDetailsFromListing} />} />
            <Route path="/PropDetailsFromListingForSell" element={<ScreenWrapper Component={PropDetailsFromListingForSell} />} />
            <Route path="/CommercialRentPropDetails" element={<ScreenWrapper Component={CommercialRentPropDetails} />} />
            <Route path="/CommercialSellPropDetails" element={<ScreenWrapper Component={CommercialSellPropDetails} />} />
            <Route path="/CustomerDetailsResidentialRentFromList" element={<ScreenWrapper Component={CustomerDetailsResidentialRentFromList} />} />
            <Route path="/CustomerDetailsResidentialBuyFromList" element={<ScreenWrapper Component={CustomerDetailsResidentialBuyFromList} />} />
            <Route path="/CustomerDetailsCommercialRentFromList" element={<ScreenWrapper Component={CustomerDetailsCommercialRentFromList} />} />
            <Route path="/CustomerDetailsCommercialBuyFromList" element={<ScreenWrapper Component={CustomerDetailsCommercialBuyFromList} />} />
            <Route path="/MatchedProperties" element={<ScreenWrapper Component={MatchedProperties} />} />
            <Route path="/MatchedCustomers" element={<ScreenWrapper Component={MatchedCustomers} />} />
            <Route path="/CustomerMeetingDetails" element={<ScreenWrapper Component={CustomerMeetingDetails} />} />
            <Route path="/AddNewCustomerStack/*" element={<AddNewContactsStack />} />
            <Route path="/Add/*" element={<AddNewPropertyStack />} />
            <Route path="/CustomerListForMeeting" element={<ScreenWrapper Component={CustomerListForMeeting} />} />
            <Route path="/EmployeeListOfListing" element={<ScreenWrapper Component={EmployeeList} />} />
        </Routes>
    );
};

export default ContactsStack;
