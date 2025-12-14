import React, { useState } from "react";
import { MdArrowBack } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import Button from "./../../../../components/Button";
import Snackbar from "./../../../../components/SnackbarComponent";
import { numDifferentiation } from "./../../../../utils/methods";
import { connect } from "react-redux";
import { setPropertyDetails } from "./../../../../reducers/Action";
import CustomButtonGroup from "./../../../../components/CustomButtonGroup";

const preferredTenantsOption = [
    { text: 'Family' },
    { text: 'Bachelors' },
    { text: 'Any' },
];
const nonvegAllowedOption = [
    { text: 'Yes' },
    { text: 'No' },
];

const RentDetailsForm = props => {
    const navigate = useNavigate();
    const [newDate, setNewDate] = React.useState("");
    const [expectedRent, setExpectedRent] = useState("");
    const [expectedDeposit, setExpectedDeposit] = useState("");
    const [isVisible, setIsVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [preferredTenant, setPreferredTenant] = useState("Any");
    const [nonvegAllowed, setNonvegAllowed] = useState("Yes");

    const dismissSnackBar = () => {
        setIsVisible(false);
    };

    const onSubmit = async () => {
        if (expectedRent.trim() === "") {
            setErrorMessage("Expected rent is missing");
            setIsVisible(true);
            return;
        } else if (expectedDeposit.trim() === "") {
            setErrorMessage("Expected deposit is missing");
            setIsVisible(true);
            return;
        } else if (newDate.trim() === "") {
            setErrorMessage("Available date is missing");
            setIsVisible(true);
            return;
        }

        const rent_details = {
            expected_rent: expectedRent,
            expected_deposit: expectedDeposit,
            available_from: newDate.trim(),
            preferred_tenants: preferredTenant,
            non_veg_allowed: nonvegAllowed
        };
        const property = props.propertyDetails;
        property["rent_details"] = rent_details;
        props.setPropertyDetails(property);

        navigate("/listing/Add/AddImages");
    };

    return (
        <div className="flex flex-col h-full bg-gray-100 overflow-y-auto">
            <div className="bg-white px-4 py-3 flex items-center shadow-sm border-b border-gray-200">
                <button
                    onClick={() => navigate(-1)}
                    className="mr-3 p-1 rounded-full hover:bg-gray-100 focus:outline-none"
                    aria-label="Go back"
                >
                    <MdArrowBack className="text-gray-700 text-xl" />
                </button>
                <h1 className="text-lg font-medium text-gray-900">Rent Details</h1>
            </div>
            <div className="p-4">
                <div className="bg-white p-4 rounded shadow">
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            {expectedRent.trim() === ""
                                ? "Expected Rent*"
                                : numDifferentiation(expectedRent) + " Expected Rent"}
                        </label>
                        <input
                            type="number"
                            className="w-full p-2 border border-gray-300 rounded text-gray-900"
                            placeholder="Expected Rent"
                            value={expectedRent}
                            onChange={(e) => setExpectedRent(e.target.value)}
                            onFocus={() => setIsVisible(false)}
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            {expectedDeposit.trim() === ""
                                ? "Expected Deposit*"
                                : numDifferentiation(expectedDeposit) + " Expected Deposit"}
                        </label>
                        <input
                            type="number"
                            className="w-full p-2 border border-gray-300 rounded text-gray-900"
                            placeholder="Expected Deposit"
                            value={expectedDeposit}
                            onChange={(e) => setExpectedDeposit(e.target.value)}
                            onFocus={() => setIsVisible(false)}
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Available From *</label>
                        <input
                            type="date"
                            className="w-full p-2 border border-gray-300 rounded text-gray-900"
                            value={newDate}
                            onChange={(e) => setNewDate(e.target.value)}
                            onFocus={() => setIsVisible(false)}
                        />
                    </div>

                    {props.propertyDetails && props.propertyDetails.propertyType === "Residential" ? (
                        <div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Tenants*</label>
                                <CustomButtonGroup
                                    buttons={preferredTenantsOption}
                                    selectedIndices={[preferredTenantsOption.findIndex(option => option.text === preferredTenant)]}
                                    isMultiSelect={false}
                                    onButtonPress={(index, button) => setPreferredTenant(button.text)}
                                    width={95}
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Nonveg Allowed*</label>
                                <CustomButtonGroup
                                    buttons={nonvegAllowedOption}
                                    selectedIndices={[nonvegAllowedOption.findIndex(option => option.text === nonvegAllowed)]}
                                    isMultiSelect={false}
                                    onButtonPress={(index, button) => setNonvegAllowed(button.text)}
                                    width={95}
                                />
                            </div>
                        </div>
                    ) : null}

                    <div className="mt-4">
                        <Button title="NEXT" onPress={onSubmit} />
                    </div>
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
)(RentDetailsForm);
