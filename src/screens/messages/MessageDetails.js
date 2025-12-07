import React from "react";
import { useLocation } from "react-router-dom";
import PropDetailsFromListing from '../property/residential/rent/PropDetailsFromListing';
import PropDetailsFromListingForSell from '../property/residential/sell/PropDetailsFromListingForSell';
import CommercialRentPropDetails from "../property/commercial/rent/CommercialRentPropDetails";
import CommercialSellPropDetails from "../property/commercial/sell/CommercialSellPropDetails";
import CustomerDetailsResidentialRentFromList from "../contacts/residential/rent/CustomerDetailsResidentialRentFromList";
import CustomerDetailsResidentialBuyFromList from "../contacts/residential/buy/CustomerDetailsResidentialBuyFromList";
import CustomerDetailsCommercialRentFromList from "../contacts/commercial/rent/CustomerDetailsCommercialRentFromList";
import CustomerDetailsCommercialBuyFromList from "../contacts/commercial/buy/CustomerDetailsCommercialBuyFromList";

const MessageDetails = () => {
    const location = useLocation();
    const item = location.state?.item;

    if (!item) return null;

    return (
        <div className="flex flex-col h-full bg-white overflow-y-auto">
            <div className="p-2.5 text-base pt-4">
                <p className="text-base text-gray-700">
                    I have customer for your {item.subject.location_area},
                    {item.subject.city} property. Please call me on +91{" "}
                    {item.sender_details.mobile} - {item.subject.name}
                </p>
                <div className="flex flex-row justify-start">
                    <p className="text-right text-gray-700 text-xs mt-1.5">
                        {new Date(item.create_date_time).toDateString()}
                    </p>
                </div>
            </div>
            {item.subject.subject_category === "property" ? (
                item.subject.subject_type === "Residential" ? (
                    item.subject.subject_for === "Rent" ? (
                        <PropDetailsFromListing />
                    ) : (
                        <PropDetailsFromListingForSell />
                    )
                ) : item.subject.subject_type === "Commercial" ? (
                    item.subject.subject_for === "Rent" ? (
                        <CommercialRentPropDetails />
                    ) : (
                        <CommercialSellPropDetails />
                    )
                ) : null
            ) : item.subject.subject_category === "customer" ? (
                item.subject.subject_type === "Residential" ? (
                    item.subject.subject_for === "Rent" ? (
                        <CustomerDetailsResidentialRentFromList />
                    ) : (
                        <CustomerDetailsResidentialBuyFromList />
                    )
                ) : item.subject.subject_type === "Commercial" ? (
                    item.subject.subject_for === "Rent" ? (
                        <CustomerDetailsCommercialRentFromList />
                    ) : (
                        <CustomerDetailsCommercialBuyFromList />
                    )
                ) : null
            ) : null}
        </div>
    );
};

export default MessageDetails;
