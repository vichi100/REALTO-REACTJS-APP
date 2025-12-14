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

import { MdArrowBack } from "react-icons/md";
import { useNavigate } from "react-router-dom";

const MessageDetails = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const item = location.state?.item;

    const handleBack = () => {
        if (window.history.length > 1 && window.history.state && window.history.state.idx > 0) {
            navigate(-1);
        } else {
            navigate('/messages');
        }
    };

    if (!item) return null;

    return (
        <div className="flex flex-col h-full bg-white overflow-y-auto">
            <div style={{
                display: 'flex',
                alignItems: 'center',
                padding: '15px 20px',
                borderBottom: '1px solid #d0d0d0',
                backgroundColor: '#fff',
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
                    <MdArrowBack size={24} color="#333" />
                </div>
                <h1 style={{
                    fontSize: '20px',
                    fontWeight: '600',
                    color: '#333',
                    margin: 0,
                }}>Message Details</h1>
            </div>
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
                        <PropDetailsFromListing item={item.subject} showHeader={false} />
                    ) : (
                        <PropDetailsFromListingForSell item={item.subject} showHeader={false} />
                    )
                ) : item.subject.subject_type === "Commercial" ? (
                    item.subject.subject_for === "Rent" ? (
                        <CommercialRentPropDetails item={item.subject} showHeader={false} />
                    ) : (
                        <CommercialSellPropDetails item={item.subject} showHeader={false} />
                    )
                ) : null
            ) : item.subject.subject_category === "customer" ? (
                item.subject.subject_type === "Residential" ? (
                    item.subject.subject_for === "Rent" ? (
                        <CustomerDetailsResidentialRentFromList item={item.subject} showHeader={false} />
                    ) : (
                        <CustomerDetailsResidentialBuyFromList item={item.subject} showHeader={false} />
                    )
                ) : item.subject.subject_type === "Commercial" ? (
                    item.subject.subject_for === "Rent" ? (
                        <CustomerDetailsCommercialRentFromList item={item.subject} showHeader={false} />
                    ) : (
                        <CustomerDetailsCommercialBuyFromList item={item.subject} showHeader={false} />
                    )
                ) : null
            ) : null}
        </div>
    );
};

export default MessageDetails;
