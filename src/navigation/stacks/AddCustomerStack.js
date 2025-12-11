import * as React from "react";
import { Routes, Route } from 'react-router-dom';
import AddNewCustomer from "./../../screens/contacts/AddNewCustomer";
import ContactLocalityDetailsForm from "./../../screens/contacts/ContactLocalityDetailsForm";
import ContactResidentialPropertyDetailsForm from "./../../screens/contacts/residential/ContactResidentialPropertyDetailsForm";
import ContactRentDetailsForm from "./../../screens/contacts/residential/rent/ContactRentDetailsForm";
import AddNewCustomerRentResidentialFinalDetails from "./../../screens/contacts/residential/rent/AddNewCustomerRentResidentialFinalDetails";
import ContactBuyResidentialDetailsForm from "./../../screens/contacts/residential/buy/ContactBuyResidentialDetailsForm";
import AddNewCustomerBuyResidentialFinalDetails from "./../../screens/contacts/residential/buy/AddNewCustomerBuyResidentialFinalDetails";
import CustomerCommercialPropertyDetailsForm from "./../../screens/contacts/commercial/CustomerCommercialPropertyDetailsForm";
import AddNewCustomerCommercialRentFinalDetails from "./../../screens/contacts/commercial/rent/AddNewCustomerCommercialRentFinalDetails";
import CustomerCommercialRentDetailsForm from "./../../screens/contacts/commercial/rent/CustomerCommercialRentDetailsForm";
import CustomerCommercialBuyDetailsForm from "./../../screens/contacts/commercial/buy/CustomerCommercialBuyDetailsForm";
import AddNewCustomerCommercialBuyFinalDetails from "./../../screens/contacts/commercial/buy/AddNewCustomerCommercialBuyFinalDetails";
import ScreenWrapper from "../../components/ScreenWrapper";

const AddNewContactsStack = () => {
    return (
        <Routes>
            <Route path="/" element={<ScreenWrapper Component={AddNewCustomer} />} />
            <Route path="AddCustomer" element={<ScreenWrapper Component={AddNewCustomer} />} />
            <Route path="ContactLocalityDetailsForm" element={<ScreenWrapper Component={ContactLocalityDetailsForm} />} />
            <Route path="ContactResidentialPropertyDetailsForm" element={<ScreenWrapper Component={ContactResidentialPropertyDetailsForm} />} />
            <Route path="ContactRentDetailsForm" element={<ScreenWrapper Component={ContactRentDetailsForm} />} />
            <Route path="AddNewCustomerRentResidentialFinalDetails" element={<ScreenWrapper Component={AddNewCustomerRentResidentialFinalDetails} />} />
            <Route path="ContactBuyResidentialDetailsForm" element={<ScreenWrapper Component={ContactBuyResidentialDetailsForm} />} />
            <Route path="AddNewCustomerBuyResidentialFinalDetails" element={<ScreenWrapper Component={AddNewCustomerBuyResidentialFinalDetails} />} />
            <Route path="CustomerCommercialPropertyDetailsForm" element={<ScreenWrapper Component={CustomerCommercialPropertyDetailsForm} />} />
            <Route path="AddNewCustomerCommercialRentFinalDetails" element={<ScreenWrapper Component={AddNewCustomerCommercialRentFinalDetails} />} />
            <Route path="CustomerCommercialRentDetailsForm" element={<ScreenWrapper Component={CustomerCommercialRentDetailsForm} />} />
            <Route path="CustomerCommercialBuyDetailsForm" element={<ScreenWrapper Component={CustomerCommercialBuyDetailsForm} />} />
            <Route path="AddNewCustomerCommercialBuyFinalDetails" element={<ScreenWrapper Component={AddNewCustomerCommercialBuyFinalDetails} />} />
        </Routes>
    );
};

export default AddNewContactsStack;
