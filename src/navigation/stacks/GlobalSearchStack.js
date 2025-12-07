import React from "react";
import { Routes, Route } from 'react-router-dom';
import GlobalSearch from "./../../screens/search/GlobalSearch";
import GlobalResidentialPropertySearchResult from "./../../screens/search/GlobalResidentialPropertySearchResult";
import GlobalCommercialPropertySearchResult from "./../../screens/search/GlobalCommercialPropertySearchResult";
import GlobalResidentialContactsSearchResult from "./../../screens/search/GlobalResidentialContactsSearchResult";
import GlobalCommercialCustomersSearchResult from "./../../screens/search/GlobalCommercialCustomersSearchResult";
import PropDetailsFromListingForSell from "./../../screens/property/residential/sell/PropDetailsFromListingForSell";
import CustomerMeetingDetails from "./../../screens/contacts/CustomerMeetingDetails";
import MatchedCustomers from "./../../screens/contacts/MatchedCustomers";
import MatchedProperties from "./../../screens/property/MatchedProperties";
import CustomerDetailsResidentialRentFromList from "./../../screens/contacts/residential/rent/CustomerDetailsResidentialRentFromList";
import CustomerDetailsResidentialBuyFromList from "./../../screens/contacts/residential/buy/CustomerDetailsResidentialBuyFromList";
import Meeting from "./../../screens/meeting/Meeting";
import CustomerMeeting from "../../screens/contacts/CustomerMeeting";
import PropertyListForMeeting from "./../../screens/contacts/PropertyListForMeeting";
import PropDetailsFromListing from "./../../screens/property/residential/rent/PropDetailsFromListing";
import CustomerListForMeeting from "./../../screens/meeting/CustomerListForMeeting";
import EmployeeList from "./../../screens/employee/EmployeeList";
import ScreenWrapper from "../../components/ScreenWrapper";

const GlobalSearchStackNav = () => {
    return (
        <Routes>
            <Route path="/" element={<ScreenWrapper Component={GlobalSearch} />} />
            <Route path="/GlobalSearch" element={<ScreenWrapper Component={GlobalSearch} />} />
            <Route path="/GlobalResidentialPropertySearchResult" element={<ScreenWrapper Component={GlobalResidentialPropertySearchResult} />} />
            <Route path="/GlobalCommercialPropertySearchResult" element={<ScreenWrapper Component={GlobalCommercialPropertySearchResult} />} />
            <Route path="/GlobalResidentialContactsSearchResult" element={<ScreenWrapper Component={GlobalResidentialContactsSearchResult} />} />
            <Route path="/GlobalCommercialCustomersSearchResult" element={<ScreenWrapper Component={GlobalCommercialCustomersSearchResult} />} />
            <Route path="/CustomerMeetingDetails" element={<ScreenWrapper Component={CustomerMeetingDetails} />} />
            <Route path="/MatchedCustomers" element={<ScreenWrapper Component={MatchedCustomers} />} />
            <Route path="/MatchedProperties" element={<ScreenWrapper Component={MatchedProperties} />} />
            <Route path="/CustomerDetailsResidentialRentFromList" element={<ScreenWrapper Component={CustomerDetailsResidentialRentFromList} />} />
            <Route path="/CustomerDetailsResidentialBuyFromList" element={<ScreenWrapper Component={CustomerDetailsResidentialBuyFromList} />} />
            <Route path="/PropDetailsFromListing" element={<ScreenWrapper Component={PropDetailsFromListing} />} />
            <Route path="/PropDetailsFromListingForSell" element={<ScreenWrapper Component={PropDetailsFromListingForSell} />} />
            <Route path="/Meeting" element={<ScreenWrapper Component={Meeting} />} />
            <Route path="/CustomerMeeting" element={<ScreenWrapper Component={CustomerMeeting} />} />
            <Route path="/PropertyListForMeeting" element={<ScreenWrapper Component={PropertyListForMeeting} />} />
            <Route path="/CustomerListForMeeting" element={<ScreenWrapper Component={CustomerListForMeeting} />} />
            <Route path="/EmployeeListOfListing" element={<ScreenWrapper Component={EmployeeList} />} />
        </Routes>
    );
};

export default GlobalSearchStackNav;
