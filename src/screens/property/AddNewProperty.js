import React, { useState } from "react";
import { MdArrowBack } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { connect } from "react-redux";
import Button from "./../../components/Button";
import Snackbar from "./../../components/SnackbarComponent";
import { setPropertyType, setPropertyDetails } from "./../../reducers/Action";
import CustomButtonGroup from "./../../components/CustomButtonGroup";

const selectedPropTypeOption = [
    { text: 'Residential' },
    { text: 'Commercial' },
];

const propertyForOption = [
    { text: 'Rent' },
    { text: 'Sell' },
];

const AddNewProperty = props => {
    const navigate = useNavigate();
    const [ownerName, setOwnerName] = useState("");
    const [ownerMobile, setOwnerMobile] = useState("");
    const [ownerAddress, setOwnerAddress] = useState("");
    const [focusedField, setFocusedField] = useState(null);

    const [errorMessage, setErrorMessage] = useState("");
    const [isVisible, setIsVisible] = useState(false);

    const [selectedPropType, setSelectedPropType] = useState("Residential");
    const [propertyFor, setPropertyFor] = useState("Rent");

    const dismissSnackBar = () => {
        setIsVisible(false);
    };

    React.useEffect(() => {
        if (props.propertyDetails) {
            const { owner_details, property_type, property_for } = props.propertyDetails;
            if (owner_details) {
                setOwnerName(owner_details.name || "");
                setOwnerMobile(owner_details.mobile1 || "");
                setOwnerAddress(owner_details.address || "");
            }
            if (property_type) setSelectedPropType(property_type);
            if (property_for) setPropertyFor(property_for);
        }
    }, [props.propertyDetails]);

    const onSubmit = () => {
        if (ownerName.trim() === "") {
            setErrorMessage("Owner name is missing");
            setIsVisible(true);
            return;
        } else if (ownerMobile.trim() === "") {
            setErrorMessage("Owner mobile is missing");
            setIsVisible(true);
            return;
        }
        console.log("props.userDetails: " + JSON.stringify(props.userDetails));
        const property = {
            property_type: selectedPropType,
            property_for: propertyFor,
            property_status: "open",
            owner_details: {
                name: ownerName.trim(),
                mobile1: ownerMobile.trim(),
                mobile2: ownerMobile.trim(),
                address: ownerAddress.trim()
            }
        };
        props.setPropertyDetails(property);
        navigate("/listing/Add/LocalityDetailsForm");
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
                <h1 className="text-lg font-medium text-gray-900">Add New Property</h1>
            </div>
            <div className="p-5">
                <div className="mb-5">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Select Property Type</label>
                    <div className="mt-2">
                        <CustomButtonGroup
                            buttons={selectedPropTypeOption}
                            selectedIndices={[selectedPropTypeOption.findIndex(option => option.text === selectedPropType)]}
                            isMultiSelect={false}
                            onButtonPress={(index, button) => {
                                setSelectedPropType(button.text);
                            }}
                            containerStyle={{ gap: '12px' }}
                            buttonStyle={{ backgroundColor: '#FFFFFF', borderRadius: '6px', border: '1px solid #E5E7EB', padding: '8px 20px', fontSize: '14px', fontWeight: '500', color: '#374151', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)', width: '140px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                        />
                    </div>
                </div>

                <div className="mb-5">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Select Property For</label>
                    <div className="mt-2">
                        <CustomButtonGroup
                            buttons={propertyForOption}
                            selectedIndices={[propertyForOption.findIndex(option => option.text === propertyFor)]}
                            isMultiSelect={false}
                            onButtonPress={(index, button) => {
                                setPropertyFor(button.text);
                            }}
                            containerStyle={{ gap: '12px' }}
                            buttonStyle={{ backgroundColor: '#FFFFFF', borderRadius: '6px', border: '1px solid #E5E7EB', padding: '8px 20px', fontSize: '14px', fontWeight: '500', color: '#374151', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)', width: '140px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                        />
                    </div>
                </div>

                <div className="mt-8 mb-4">
                    <h3 className="text-lg font-semibold text-gray-700">Owner Details</h3>
                </div>



                <div className="mb-6">
                    <label className={`block text-xs font-medium mb-1 ${focusedField === 'name' ? 'text-teal-500' : 'text-gray-500'}`}>
                        Name*
                    </label>
                    <input
                        type="text"
                        className={`w-full bg-transparent text-base text-gray-900 border-b-2 focus:outline-none py-1 transition-colors ${focusedField === 'name' ? 'border-teal-500' : 'border-gray-200'}`}
                        value={ownerName}
                        onChange={e => setOwnerName(e.target.value)}
                        onFocus={() => { setIsVisible(false); setFocusedField('name'); }}
                        onBlur={() => setFocusedField(null)}
                    />
                </div>

                <div className="mb-6">
                    <label className={`block text-xs font-medium mb-1 ${focusedField === 'mobile' ? 'text-teal-500' : 'text-gray-500'}`}>
                        Mobile*
                    </label>
                    <input
                        type="tel"
                        className={`w-full bg-transparent text-base text-gray-900 border-b-2 focus:outline-none py-1 transition-colors ${focusedField === 'mobile' ? 'border-teal-500' : 'border-gray-200'}`}
                        value={ownerMobile}
                        onChange={e => {
                            const val = e.target.value;
                            if (/^\d*$/.test(val) && val.length <= 10) {
                                setOwnerMobile(val);
                            }
                        }}
                        onFocus={() => { setIsVisible(false); setFocusedField('mobile'); }}
                        onBlur={() => setFocusedField(null)}
                    />
                </div>

                <div className="mb-6">
                    <label className={`block text-xs font-medium mb-1 ${focusedField === 'address' ? 'text-teal-500' : 'text-gray-500'}`}>
                        Address*
                    </label>
                    <input
                        type="text"
                        className={`w-full bg-transparent text-base text-gray-900 border-b-2 focus:outline-none py-1 transition-colors ${focusedField === 'address' ? 'border-teal-500' : 'border-gray-200'}`}
                        value={ownerAddress}
                        onChange={e => setOwnerAddress(e.target.value)}
                        onFocus={() => { setIsVisible(false); setFocusedField('address'); }}
                        onBlur={() => setFocusedField(null)}
                    />
                </div>

                <div className="mt-5">
                    <Button title="NEXT" onPress={() => onSubmit()} />
                </div>

                <Snackbar
                    visible={isVisible}
                    textMessage={errorMessage}
                    actionHandler={dismissSnackBar}
                    actionText="OK"
                />
            </div>
        </div>
    );
};

const mapStateToProps = state => ({
    userDetails: state.AppReducer.userDetails,
    propertyDetails: state.AppReducer.propertyDetails,
});
const mapDispatchToProps = {
    setPropertyType,
    setPropertyDetails
};
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AddNewProperty);
