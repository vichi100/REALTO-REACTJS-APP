import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "./../../../../components/Button";
import Snackbar from "./../../../../components/SnackbarComponent";
import { numDifferentiation } from "./../../../../utils/methods";
import { connect } from "react-redux";
import { setPropertyDetails } from "./../../../../reducers/Action";
import CustomButtonGroup from "./../../../../components/CustomButtonGroup";
import * as  AppConstant from "./../../../../utils/AppConstant";

const negotiableArray = ["Yes", "No"];

const SellDetails = props => {
    const navigate = useNavigate();
    const [newDate, setNewDate] = useState("");
    const [expectedSellPrice, setExpectedSellPrice] = useState("");
    const [maintenanceCharge, setMaintenanceCharge] = useState("");
    const [isVisible, setIsVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [negotiable, setNegotiable] = useState("Yes");

    const dismissSnackBar = () => {
        setIsVisible(false);
    };

    const onSubmit = async () => {
        if (expectedSellPrice.trim() === "") {
            setErrorMessage("Expected sell price is missing");
            setIsVisible(true);
            return;
        } else if (maintenanceCharge.trim() === "") {
            setErrorMessage("Maintenance charge is missing");
            setIsVisible(true);
            return;
        } else if (newDate.trim() === "") {
            setErrorMessage("Available from date is missing");
            setIsVisible(true);
            return;
        }

        const sell_details = {
            expected_sell_price: expectedSellPrice,
            maintenance_charge: maintenanceCharge,
            available_from: newDate.trim(),
            negotiable: negotiable
        };
        const property = props.propertyDetails;
        property["sell_details"] = sell_details;
        props.setPropertyDetails(property)

        navigate("/listing/Add/AddImages");
    };

    return (
        <div className="flex flex-col h-full bg-gray-100 overflow-y-auto">
            <div className="p-5">
                <div className="mb-5">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                        {expectedSellPrice.trim() === ""
                            ? "Expected Sell Price*"
                            : numDifferentiation(expectedSellPrice) + " Expected Sell Price"}
                    </label>
                    <input
                        type="number"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-900 leading-tight focus:outline-none focus:shadow-outline"
                        placeholder="Expected Sell Price*"
                        value={expectedSellPrice}
                        onChange={e => setExpectedSellPrice(e.target.value)}
                        onFocus={() => setIsVisible(false)}
                    />
                </div>

                <div className="mb-5">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                        {maintenanceCharge.trim() === ""
                            ? "Maintenance Charge/Month*"
                            : numDifferentiation(maintenanceCharge) + " Maintenance Charge/Month"}
                    </label>
                    <input
                        type="number"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-900 leading-tight focus:outline-none focus:shadow-outline"
                        placeholder="Maintenance Charge"
                        value={maintenanceCharge}
                        onChange={e => setMaintenanceCharge(e.target.value)}
                        onFocus={() => setIsVisible(false)}
                    />
                </div>

                <div className="mb-5">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                        Available From *
                    </label>
                    <input
                        type="date"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-900 leading-tight focus:outline-none focus:shadow-outline"
                        placeholder="Available From *"
                        value={newDate}
                        onChange={e => setNewDate(e.target.value)}
                        onFocus={() => setIsVisible(false)}
                    />
                </div>

                <div className="mb-5">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                        Negotiable*
                    </label>
                    <div className="mt-2 mb-4">
                        <CustomButtonGroup
                            buttons={AppConstant.NEGOTIABLE_OPTION}
                            selectedIndices={[AppConstant.NEGOTIABLE_OPTION.findIndex(option => option.text === negotiable)]}
                            isMultiSelect={false}
                            onButtonPress={(index, button) => {
                                setNegotiable(button.text);
                            }}
                        />
                    </div>
                </div>

                <div className="mt-5">
                    <Button title="NEXT" onPress={() => onSubmit()} />
                </div>
            </div>
            <Snackbar
                visible={isVisible}
                textMessage={errorMessage}
                actionHandler={dismissSnackBar}
                actionText="OK"
            />
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
)(SellDetails);
