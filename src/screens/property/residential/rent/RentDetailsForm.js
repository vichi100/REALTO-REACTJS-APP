import React, { useState } from "react";
import { MdArrowBack, MdDateRange } from "react-icons/md";
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

    const getTodayString = () => {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const [newDate, setNewDate] = React.useState(getTodayString());
    const [expectedRent, setExpectedRent] = useState("");
    const [expectedDeposit, setExpectedDeposit] = useState("");
    const [isVisible, setIsVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [preferredTenant, setPreferredTenant] = useState("Any");
    const [nonvegAllowed, setNonvegAllowed] = useState("Yes");
    const [focusedField, setFocusedField] = useState(null);

    const dismissSnackBar = () => {
        setIsVisible(false);
    };

    React.useEffect(() => {
        if (props.propertyDetails && props.propertyDetails.rent_details) {
            const data = props.propertyDetails.rent_details;
            if (data.expected_rent) setExpectedRent(data.expected_rent);
            if (data.expected_deposit) setExpectedDeposit(data.expected_deposit);
            if (data.preferred_tenants) setPreferredTenant(data.preferred_tenants);
            if (data.non_veg_allowed) setNonvegAllowed(data.non_veg_allowed);
            if (data.available_from) {
                setNewDate(data.available_from);
            } else {
                setNewDate(getTodayString());
            }
        } else {
            // Always default to Today on first load if no stored data
            setNewDate(getTodayString());
        }
    }, [props.propertyDetails]);

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
        <div className="flex flex-col h-full bg-gray-50 overflow-y-auto">
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
                    <div className="mb-6">
                        <label className={`block text-xs font-medium mb-1 ${focusedField === 'rent' ? 'text-teal-500' : 'text-gray-500'}`}>
                            Expected Rent*
                        </label>
                        <input
                            type="number"
                            className={`w-full bg-transparent text-base text-gray-900 border-b-2 focus:outline-none py-1 transition-colors ${focusedField === 'rent' ? 'border-teal-500' : 'border-gray-200'}`}
                            value={expectedRent}
                            onChange={(e) => setExpectedRent(e.target.value)}
                            onFocus={() => { setIsVisible(false); setFocusedField('rent'); }}
                            onBlur={() => setFocusedField(null)}
                        />
                    </div>

                    <div className="mb-6">
                        <label className={`block text-xs font-medium mb-1 ${focusedField === 'deposit' ? 'text-teal-500' : 'text-gray-500'}`}>
                            Expected Deposit*
                        </label>
                        <input
                            type="number"
                            className={`w-full bg-transparent text-base text-gray-900 border-b-2 focus:outline-none py-1 transition-colors ${focusedField === 'deposit' ? 'border-teal-500' : 'border-gray-200'}`}
                            value={expectedDeposit}
                            onChange={(e) => setExpectedDeposit(e.target.value)}
                            onFocus={() => { setIsVisible(false); setFocusedField('deposit'); }}
                            onBlur={() => setFocusedField(null)}
                        />
                    </div>

                    <div className="mb-6">
                        <label className={`block text-xs font-medium mb-1 ${focusedField === 'date' ? 'text-teal-500' : 'text-gray-500'}`}>Available From *</label>
                        <div className={`relative w-full border-b-2 py-1 transition-colors flex items-center ${focusedField === 'date' ? 'border-teal-500' : 'border-gray-200'}`}>
                            <style>
                                {`
                                    input[type="date"]::-webkit-calendar-picker-indicator {
                                        display: none;
                                        -webkit-appearance: none;
                                    }
                                    input[type="date"] {
                                        color-scheme: light;
                                    }
                                `}
                            </style>

                            {/* Ghost Placeholder */}
                            {!newDate && (
                                <span className="absolute left-0 text-base text-gray-400 pointer-events-none">
                                    DD/MM/YYYY
                                </span>
                            )}

                            <input
                                type="date"
                                min={getTodayString()}
                                value={newDate}
                                onChange={(e) => {
                                    const selectedDate = e.target.value;
                                    if (selectedDate && selectedDate < getTodayString()) {
                                        return;
                                    }
                                    setNewDate(selectedDate);
                                }}
                                onClick={(e) => {
                                    try {
                                        if (e.target.showPicker) e.target.showPicker();
                                    } catch (err) {
                                        console.log(err);
                                    }
                                }}
                                onFocus={() => { setIsVisible(false); setFocusedField('date'); }}
                                onBlur={() => setFocusedField(null)}
                                onKeyDown={(e) => e.preventDefault()}
                                className={`w-full bg-transparent text-base text-gray-900 focus:outline-none z-10 relative ${!newDate ? 'text-transparent' : 'text-gray-900'}`}
                            />

                            <div className="absolute right-0 pointer-events-none text-gray-500">
                                <MdDateRange size={20} />
                            </div>
                        </div>
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
