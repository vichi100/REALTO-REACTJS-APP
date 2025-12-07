import React from "react";
import { Routes, Route } from 'react-router-dom';
import AddNewProperty from "./../../screens/property/AddNewProperty";
import LocalityDetailsForm from "./../../screens/property/LocalityDetailsForm";
import ResidentialPropertyDetailsForm from "./../../screens/property/residential/ResidentialPropertyDetailsForm";
import CommercialPropertyDetailsForm from "./../../screens/property/commercial/CommercialPropertyDetailsForm";
import RentDetailsForm from "./../../screens/property/residential/rent/RentDetailsForm";
import SellDetailsForm from "./../../screens/property/residential/sell/SellDetailsForm";
import AddImages from "./../../screens/property/AddImages";
import AddNewPropFinalDetails from "./../../screens/property/residential/rent/AddNewPropFinalDetails";
import AddNewPropSellFinalDetails from "./../../screens/property/residential/sell/AddNewPropSellFinalDetails";
import AddNewPropCommercialRentFinalDetails from "./../../screens/property/commercial/rent/AddNewPropCommercialRentFinalDetails";
import AddNewPropCommercialSellFinalDetails from "./../../screens/property/commercial/sell/AddNewPropCommercialSellFinalDetails";
import ScreenWrapper from "../../components/ScreenWrapper";

const AddNewPropertyStack = () => {
    return (
        <Routes>
            <Route path="/" element={<ScreenWrapper Component={AddNewProperty} />} />
            <Route path="/AddNewProperty" element={<ScreenWrapper Component={AddNewProperty} />} />
            <Route path="/LocalityDetailsForm" element={<ScreenWrapper Component={LocalityDetailsForm} />} />
            <Route path="/ResidentialPropertyDetailsForm" element={<ScreenWrapper Component={ResidentialPropertyDetailsForm} />} />
            <Route path="/CommercialPropertyDetailsForm" element={<ScreenWrapper Component={CommercialPropertyDetailsForm} />} />
            <Route path="/RentDetailsForm" element={<ScreenWrapper Component={RentDetailsForm} />} />
            <Route path="/SellDetailsForm" element={<ScreenWrapper Component={SellDetailsForm} />} />
            <Route path="/AddImages" element={<ScreenWrapper Component={AddImages} />} />
            <Route path="/AddNewPropFinalDetails" element={<ScreenWrapper Component={AddNewPropFinalDetails} />} />
            <Route path="/AddNewPropSellFinalDetails" element={<ScreenWrapper Component={AddNewPropSellFinalDetails} />} />
            <Route path="/AddNewPropCommercialRentFinalDetails" element={<ScreenWrapper Component={AddNewPropCommercialRentFinalDetails} />} />
            <Route path="/AddNewPropCommercialSellFinalDetails" element={<ScreenWrapper Component={AddNewPropCommercialSellFinalDetails} />} />
        </Routes>
    );
};

export default AddNewPropertyStack;
