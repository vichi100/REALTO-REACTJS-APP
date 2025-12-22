import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { SERVER_URL } from "../../utils/Constant";
import PropDetailsFromListing from "./residential/rent/PropDetailsFromListing";
import PropDetailsFromListingForSell from "./residential/sell/PropDetailsFromListingForSell";

const PublicPropertyDetails = () => {
    const { agentId, propertyId, propertyType } = useParams();
    const [fetchedItem, setFetchedItem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (agentId && propertyId && propertyType) {
            setLoading(true);
            // Use the propertyType directly as expected by the backend (assuming lowercase or as provided)
            axios.get(SERVER_URL + "/prop/" + agentId + "/" + propertyId + "/" + propertyType)
                .then(response => {
                    if (response.data) {
                        const found = response.data;
                        // Fix image URLs if needed
                        if (found && Array.isArray(found.image_urls)) {
                            found.image_urls.forEach(image => {
                                if (image.url && !image.url.startsWith("http")) {
                                    image.url = SERVER_URL + image.url;
                                }
                            });
                        }
                        setFetchedItem(found);
                    } else {
                        setError("Property not found.");
                    }
                    setLoading(false);
                })
                .catch(err => {
                    console.log(err);
                    setError("Failed to load property details.");
                    setLoading(false);
                });
        }
    }, [agentId, propertyId, propertyType]);

    if (loading) {
        return (
            <div className="flex flex-1 justify-center items-center h-screen bg-white">
                Loading Property Details...
            </div>
        );
    }

    if (error || !fetchedItem) {
        return (
            <div className="flex flex-1 justify-center items-center h-screen bg-white">
                {error || "Property not found."}
            </div>
        );
    }

    // Determine which component to render based on property_for
    // Assuming 'Rent' -> rent component, 'Sell'/'Buy' -> sell component
    const propertyFor = fetchedItem.property_for;

    if (propertyFor === "Rent") {
        return <PropDetailsFromListing item={fetchedItem} showHeader={false} />;
    } else if (propertyFor === "Sell" || propertyFor === "Buy") {
        return <PropDetailsFromListingForSell item={fetchedItem} showHeader={false} />;
    } else {
        // Fallback or handle other types
        return <PropDetailsFromListing item={fetchedItem} showHeader={false} />;
    }
};

export default PublicPropertyDetails;
