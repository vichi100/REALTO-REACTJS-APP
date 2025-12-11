import React from "react";
import { Routes, Route } from 'react-router-dom';
import Profile from "./../../screens/profile/Profile";
import ManageEmployee from "./../../screens/employee/ManageEmployee";
import EmployeeList from "./../../screens/employee/EmployeeList";
import ListingTopTab from "../tabs/ListingTopTabNavigator";
import ContactsTopTab from "../tabs/ContactsTopTabNavigator";
import PropDetailsFromListingForSell from "./../../screens/property/residential/sell/PropDetailsFromListingForSell";
import PropDetailsFromListing from "./../../screens/property/residential/rent/PropDetailsFromListing";
import CommercialRentPropDetails from "./../../screens/property/commercial/rent/CommercialRentPropDetails";
import CommercialSellPropDetails from "./../../screens/property/commercial/sell/CommercialSellPropDetails";
import CustomerDetailsResidentialRentFromList from "./../../screens/contacts/residential/rent/CustomerDetailsResidentialRentFromList";
import CustomerDetailsResidentialBuyFromList from "./../../screens/contacts/residential/buy/CustomerDetailsResidentialBuyFromList";
import CustomerDetailsCommercialRentFromList from "./../../screens/contacts/commercial/rent/CustomerDetailsCommercialRentFromList";
import CustomerDetailsCommercialBuyFromList from "./../../screens/contacts/commercial/buy/CustomerDetailsCommercialBuyFromList";
import Login from "./../../screens/login/Login";
import ScreenWrapper from "../../components/ScreenWrapper";

const ProfileStack = () => {
    return (
        <Routes>
            <Route path="/" element={<ScreenWrapper Component={Profile} />} />
            <Route path="/Profile" element={<ScreenWrapper Component={Profile} />} />
            <Route path="/ManageEmployee" element={<ScreenWrapper Component={ManageEmployee} />} />
            <Route path="/EmployeeList" element={<ScreenWrapper Component={EmployeeList} />} />
            <Route path="/PropertyListing/*" element={<ScreenWrapper Component={ListingTopTab} />} />
            <Route path="/PropDetailsFromListing" element={<ScreenWrapper Component={PropDetailsFromListing} />} />
            <Route path="/PropDetailsFromListingForSell" element={<ScreenWrapper Component={PropDetailsFromListingForSell} />} />
            <Route path="/CommercialRentPropDetails" element={<ScreenWrapper Component={CommercialRentPropDetails} />} />
            <Route path="/CommercialSellPropDetails" element={<ScreenWrapper Component={CommercialSellPropDetails} />} />
            <Route path="/ContactsListing/*" element={<ScreenWrapper Component={ContactsTopTab} />} />
            <Route path="/CustomerDetailsResidentialRentFromList" element={<ScreenWrapper Component={CustomerDetailsResidentialRentFromList} />} />
            <Route path="/CustomerDetailsResidentialBuyFromList" element={<ScreenWrapper Component={CustomerDetailsResidentialBuyFromList} />} />
            <Route path="/CustomerDetailsCommercialRentFromList" element={<ScreenWrapper Component={CustomerDetailsCommercialRentFromList} />} />
            <Route path="/CustomerDetailsCommercialBuyFromList" element={<ScreenWrapper Component={CustomerDetailsCommercialBuyFromList} />} />
            <Route path="/Login" element={<ScreenWrapper Component={Login} />} />
        </Routes>
    );
};

export default ProfileStack;
