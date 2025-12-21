import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MdArrowBack } from "react-icons/md";
import Button from "./../../../components/Button";
import Snackbar from "./../../../components/SnackbarComponent";
import { setPropertyDetails } from "./../../../reducers/Action";
import { connect } from "react-redux";
import CustomButtonGroup from "./../../../components/CustomButtonGroup";
import * as AppConstant from "./../../../utils/AppConstant";

const PropertyDetails = props => {
    const navigate = useNavigate();

    const [propertySize, setPropertySize] = useState("");
    const [isVisible, setIsVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const [propertyType, setPropertyType] = useState("Shop");
    const [buildingType, setBuildingType] = useState("Mall");
    const [selectIdealForList, setSelectIdealForList] = useState(["Shop"]);
    const [parkingType, setParkingType] = useState("Public");
    const [propertyAge, setPropertyAge] = useState("6-10");
    const [powerBackup, setPowerBackup] = useState("Yes");

    const dismissSnackBar = () => {
        setIsVisible(false);
    };

    useEffect(() => {
        if (props.propertyDetails && props.propertyDetails.property_details) {
            const data = props.propertyDetails.property_details;
            if (data.property_used_for) setPropertyType(data.property_used_for);
            if (data.building_type) setBuildingType(data.building_type);
            if (data.ideal_for) setSelectIdealForList(data.ideal_for);
            if (data.parking_type) setParkingType(data.parking_type);
            if (data.property_age) setPropertyAge(data.property_age);
            if (data.power_backup) setPowerBackup(data.power_backup);
            if (data.property_size) setPropertySize(data.property_size);
        }
    }, [props.propertyDetails]);

    const onSubmit = async () => {
        if (propertySize.trim() === "") {
            setErrorMessage("Property size is missing");
            setIsVisible(true);
            return;
        }
        const property = props.propertyDetails;
        const propertyFor = property.property_for;

        const property_details = {
            property_used_for: propertyType,
            building_type: buildingType,
            ideal_for: selectIdealForList,
            parking_type: parkingType,
            property_age: propertyAge,
            power_backup: powerBackup,
            property_size: propertySize
        };

        property["property_details"] = property_details;
        props.setPropertyDetails(property);
        props.setPropertyDetails(property);
        if (propertyFor.toLowerCase() === "Rent".toLowerCase()) {
            navigate("/listing/Add/RentDetailsForm");
        } else if (propertyFor.toLowerCase() === "Sell".toLowerCase()) {
            navigate("/listing/Add/SellDetailsForm");
        }
    };

    const selectIdealFor = (index, button) => {
        let newSelectedIndicesPropertyType;
        newSelectedIndicesPropertyType = [...selectIdealForList];
        if (newSelectedIndicesPropertyType.includes(button.text)) {
            newSelectedIndicesPropertyType.splice(newSelectedIndicesPropertyType.indexOf(button.text), 1);
        } else {
            newSelectedIndicesPropertyType.push(button.text);
        }
        setSelectIdealForList(newSelectedIndicesPropertyType);
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
                <h1 className="text-lg font-medium text-gray-900">Commercial Property Details</h1>
            </div>
            <div className="p-5">
                <label className="block text-sm font-medium text-gray-700 mb-2">Property Type*</label>
                <div className="mb-4">
                    <CustomButtonGroup
                        buttons={AppConstant.COMMERCIAL_PROPERTY_TYPE_OPTION}
                        accessibilityLabelId="commercial_property_type"
                        selectedIndices={[AppConstant.COMMERCIAL_PROPERTY_TYPE_OPTION.findIndex(option => option.text === propertyType)]}
                        isMultiSelect={false}
                        containerStyle={{ gap: '12px' }}
                        buttonStyle={{ backgroundColor: '#FFFFFF', borderRadius: '6px', border: '1px solid #E5E7EB', padding: '8px 20px', fontSize: '14px', fontWeight: '500', color: '#374151', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)', width: '140px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                        onButtonPress={(index, button) => {
                            setPropertyType(button.text);
                        }}
                    />
                </div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Building Type*</label>
                <div className="mb-4">
                    <CustomButtonGroup
                        buttons={AppConstant.COMMERCIAL_PROPERTY_BUILDING_TYPE_OPTION}
                        accessibilityLabelId="commercial_property_building_type"
                        selectedIndices={[AppConstant.COMMERCIAL_PROPERTY_BUILDING_TYPE_OPTION.findIndex(option => option.text === buildingType)]}
                        isMultiSelect={false}
                        containerStyle={{ gap: '12px' }}
                        buttonStyle={{ backgroundColor: '#FFFFFF', borderRadius: '6px', border: '1px solid #E5E7EB', padding: '8px 20px', fontSize: '14px', fontWeight: '500', color: '#374151', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)', width: '140px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                        onButtonPress={(index, button) => {
                            setBuildingType(button.text);
                        }}
                    />
                </div>

                <label className="block text-sm font-medium text-gray-700 mb-2">Ideal For*(Multi Select)</label>
                <div className="mb-4">
                    <CustomButtonGroup
                        buttons={AppConstant.COMMERCIAL_PROPERTY_IDEAL_FOR_OPTION}
                        accessibilityLabelId="commercial_property_ideal_for"
                        isMultiSelect={true}
                        containerStyle={{ gap: '12px' }}
                        buttonStyle={{ backgroundColor: '#FFFFFF', borderRadius: '6px', border: '1px solid #E5E7EB', padding: '8px 20px', fontSize: '14px', fontWeight: '500', color: '#374151', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)', width: '140px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                        selectedIndices={selectIdealForList.map((item) =>
                            AppConstant.COMMERCIAL_PROPERTY_IDEAL_FOR_OPTION.findIndex((option) => option.text === item)
                        )}
                        onButtonPress={(index, button) => {
                            selectIdealFor(index, button);
                        }}
                    />
                </div>

                <label className="block text-sm font-medium text-gray-700 mb-2">Parkings</label>
                <div className="mb-4">
                    <CustomButtonGroup
                        buttons={AppConstant.COMMERCIAL_PARKING_OPTION}
                        accessibilityLabelId="commercial_parking_type"
                        selectedIndices={[AppConstant.COMMERCIAL_PARKING_OPTION.findIndex(option => option.text === parkingType)]}
                        isMultiSelect={false}
                        containerStyle={{ gap: '12px' }}
                        buttonStyle={{ backgroundColor: '#FFFFFF', borderRadius: '6px', border: '1px solid #E5E7EB', padding: '8px 20px', fontSize: '14px', fontWeight: '500', color: '#374151', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)', width: '140px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                        onButtonPress={(index, button) => {
                            setParkingType(button.text);
                        }}
                    />
                </div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Property Age*</label>
                <div className="mb-4">
                    <CustomButtonGroup
                        buttons={AppConstant.PROPERTY_AGE_OPTION}
                        accessibilityLabelId="property_age"
                        selectedIndices={[AppConstant.PROPERTY_AGE_OPTION.findIndex(option => option.text === propertyAge)]}
                        isMultiSelect={false}
                        containerStyle={{ gap: '12px' }}
                        buttonStyle={{ backgroundColor: '#FFFFFF', borderRadius: '6px', border: '1px solid #E5E7EB', padding: '8px 20px', fontSize: '14px', fontWeight: '500', color: '#374151', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)', width: '140px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                        onButtonPress={(index, button) => {
                            setPropertyAge(button.text);
                        }}
                    />
                </div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Power Backup*</label>
                <div className="mb-4">
                    <CustomButtonGroup
                        buttons={AppConstant.POWER_BACKUP_OPTION}
                        accessibilityLabelId="power_backup"
                        selectedIndices={[AppConstant.POWER_BACKUP_OPTION.findIndex(option => option.text === powerBackup)]}
                        isMultiSelect={false}
                        containerStyle={{ gap: '12px' }}
                        buttonStyle={{ backgroundColor: '#FFFFFF', borderRadius: '6px', border: '1px solid #E5E7EB', padding: '8px 20px', fontSize: '14px', fontWeight: '500', color: '#374151', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)', width: '140px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                        onButtonPress={(index, button) => {
                            setPowerBackup(button.text);
                        }}
                    />
                </div>
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Property Size*</label>
                    <input
                        type="number"
                        placeholder="Property Size"
                        value={propertySize}
                        onChange={e => setPropertySize(e.target.value)}
                        onFocus={() => setIsVisible(false)}
                        className="w-full p-2 border border-gray-300 rounded bg-white text-gray-900 focus:outline-none focus:border-teal-500"
                    />
                </div>

                <div className="mt-5">
                    <Button title="NEXT" onPress={() => onSubmit()} />
                </div>
            </div>
            <Snackbar
                visible={isVisible}
                textMessage={errorMessage}
                position={"top"}
                actionHandler={() => dismissSnackBar()}
                actionText="OK"
            />
        </div>
    );
};

const styles = {
    container: {
        flex: 1
    },
    inputContainerStyle: {
        margin: 8
    },
    propSubSection: {
        marginTop: 10,
        marginBottom: 15
    },
    doubleColSection: {
        flex: 1,
        width: "100%",
        flexDirection: "row",
        marginTop: 10,
        marginBottom: 15
    }
};

const mapStateToProps = state => ({
    propertyDetails: state.AppReducer.propertyDetails,
    userDetails: state.AppReducer.userDetails
});
const mapDispatchToProps = {
    setPropertyDetails
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(PropertyDetails);
