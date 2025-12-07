import React, { useState, useRef } from "react";
import Button from "./../../components/Button";
import { connect } from "react-redux";
import { setPropertyDetails } from "./../../reducers/Action";
import { useNavigate } from "react-router-dom";

const AddImages = props => {
    const navigate = useNavigate();
    const [imageArray, setImageArray] = useState([]);
    const fileInputRef = useRef(null);

    const handleFileChange = (event) => {
        const files = event.target.files;
        if (files && files.length > 0) {
            const newImages = Array.from(files).map(file => ({
                url: URL.createObjectURL(file),
                file: file // Keep the file object if needed for upload later
            }));
            setImageArray(prev => [...prev, ...newImages]);
        }
    };

    const pickImage = () => {
        fileInputRef.current.click();
    };

    const onSubmit = async () => {
        console.log("Submitting images from AddImages.js", imageArray);
        const property = { ...props.propertyDetails };
        property["image_urls"] = imageArray;

        console.log("Dispatching propertyDetails with images:", property);
        props.setPropertyDetails(property);

        if (property.property_type.toLowerCase() === "Residential".toLowerCase()) {
            if (property.property_for.toLowerCase() === "Rent".toLowerCase()) {
                navigate("/listing/Add/AddNewPropFinalDetails");
            } else if (property.property_for.toLowerCase() === "Sell".toLowerCase()) {
                navigate("/listing/Add/AddNewPropSellFinalDetails");
            }
        } else if (
            property.property_type.toLowerCase() === "Commercial".toLowerCase()
        ) {
            if (property.property_for.toLowerCase() === "Rent".toLowerCase()) {
                navigate("/listing/Add/AddNewPropCommercialRentFinalDetails");
            } else if (property.property_for.toLowerCase() === "Sell".toLowerCase()) {
                navigate("/listing/Add/AddNewPropCommercialSellFinalDetails");
            }
        }
    };

    return (
        <div className="flex flex-col h-full bg-gray-100 p-4 overflow-y-auto">
            <div className="flex-1">
                <div className="mb-4">
                    <input
                        type="file"
                        ref={fileInputRef}
                        style={{ display: 'none' }}
                        onChange={handleFileChange}
                        accept="image/*"
                        multiple
                    />
                    <Button title="ADD PHOTOS" onPress={pickImage} />
                </div>

                <div className="grid grid-cols-2 gap-2 w-full">
                    {imageArray.map((item, index) => (
                        <div key={index} className="relative aspect-[4/3] bg-gray-200 rounded overflow-hidden">
                            <img
                                src={item.url}
                                alt={`Selected ${index}`}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    ))}
                </div>
            </div>

            <div className="mt-4">
                <Button title="NEXT" onPress={() => onSubmit()} />
            </div>
        </div>
    );
};

const mapStateToProps = state => ({
    userDetails: state.AppReducer.userDetails,
    propertyType: state.AppReducer.propertyType,
    propertyDetails: state.AppReducer.propertyDetails,
});
const mapDispatchToProps = {
    setPropertyDetails
};
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AddImages);
