import React, { useState } from "react";
import { MdArrowBack } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import Button from "./../../../components/Button";
import Snackbar from "./../../../components/SnackbarComponent";
import { setPropertyDetails } from "./../../../reducers/Action";
import { connect } from "react-redux";
import CustomButtonGroup from "./../../../components/CustomButtonGroup";
import { MdDirectionsCar, MdDirectionsBike } from "react-icons/md";
import * as AppConstant from "./../../../utils/AppConstant";

const houseTypeOption = [
    { text: 'Apartment' },
    { text: 'Villa' },
    { text: 'Independent House' },
];

const bhkOption = [
    { text: '1RK' },
    { text: '1BHK' },
    { text: '2BHK' },
    { text: '3BHK' },
    { text: '4+BHK' },
];

const washroomOption = [
    { text: '1' },
    { text: '2' },
    { text: '3' },
    { text: '4' },
    { text: '4+' },
];

const furnishingStatusOption = [
    { text: 'Full' },
    { text: 'Semi' },
    { text: 'Empty' },
];

const parkingNumberOption = [
    { text: '1' },
    { text: '2' },
    { text: '3' },
    { text: '4' },
    { text: '4+' },
];

const parkingTypeOption = [
    { text: 'Car' },
    { text: 'Bike' },
];

const propertyAgeOption = [
    { text: '1-5' },
    { text: '6-10' },
    { text: '11-15' },
    { text: '20+' },
];

const liftAvailbleOption = [
    { text: 'Yes' },
    { text: 'No' },
];


const ResidentialPropertyDetailsForm = props => {
    const navigate = useNavigate();

    const [floor, setFloor] = useState("");
    const [totalFloor, setTotalFloor] = useState("");
    const [propertySize, setPropertySize] = useState("");
    const [isVisible, setIsVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");


    const [houseType, setHouseType] = useState("Apartment");
    const [bhkType, setBHKType] = useState("2BHK");
    const [washroomNumber, setWashroomNumber] = useState("2");
    const [furnishingStatus, setFurnishingStatus] = useState("Semi");
    const [parkingNumber, setParkingNumber] = useState("1");
    const [parkingType, setParkingType] = useState("Car");
    const [propertyAge, setPropertyAge] = useState("6-10");
    const [liftOption, setLiftOption] = useState("Yes");

    const dismissSnackBar = () => {
        setIsVisible(false);
    };

    React.useEffect(() => {
        if (props.propertyDetails && props.propertyDetails.property_details) {
            const data = props.propertyDetails.property_details;
            if (data.house_type) setHouseType(data.house_type);
            if (data.bhk_type) setBHKType(data.bhk_type);
            if (data.washroom_numbers) setWashroomNumber(data.washroom_numbers);
            if (data.furnishing_status) setFurnishingStatus(data.furnishing_status);
            if (data.parking_number) setParkingNumber(data.parking_number);
            if (data.parking_type) setParkingType(data.parking_type);
            if (data.property_age) setPropertyAge(data.property_age);
            if (data.floor_number) setFloor(data.floor_number);
            if (data.total_floor) setTotalFloor(data.total_floor);
            if (data.lift) setLiftOption(data.lift);
            if (data.property_size) setPropertySize(data.property_size);
        }
    }, [props.propertyDetails]);

    const onSubmit = async () => {

        if (floor.trim() === "") {
            setErrorMessage("Floor is missing");
            setIsVisible(true);
            return;
        } else if (totalFloor.trim() === "") {
            setErrorMessage("Total floors is missing");
            setIsVisible(true);
            return;
        }

        if (propertySize.trim() === "") {
            setErrorMessage("Property size is missing");
            setIsVisible(true);
            return;
        }
        const property = props.propertyDetails;
        const propertyFor = property.property_for;

        const property_details = {
            house_type: houseType,
            bhk_type: bhkType,
            washroom_numbers: washroomNumber,
            furnishing_status: furnishingStatus,
            parking_type: parkingType,
            parking_number: parkingNumber,
            property_age: propertyAge,
            floor_number: floor,
            total_floor: totalFloor,
            lift: liftOption,
            property_size: propertySize
        };

        property["property_details"] = property_details;
        props.setPropertyDetails(property);
        if (property.property_for === "Rent") {
            navigate("/listing/Add/RentDetailsForm");
        } else {
            navigate("/listing/Add/SellDetailsForm");
        }
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
                <h1 className="text-lg font-medium text-gray-900">Property Details</h1>
            </div>
            <div className="p-4">
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">House Type*</label>
                    <CustomButtonGroup
                        buttons={AppConstant.HOUSE_TYPE_OPTION}
                        selectedIndices={[AppConstant.HOUSE_TYPE_OPTION.findIndex(option => option.text === houseType)]}
                        isMultiSelect={false}
                        onButtonPress={(index, button) => setHouseType(button.text)}
                        containerStyle={{ gap: '12px' }}
                        buttonStyle={{ backgroundColor: '#FFFFFF', borderRadius: '6px', border: '1px solid #E5E7EB', padding: '8px 20px', fontSize: '14px', fontWeight: '500', color: '#374151', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)', width: '140px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Size of BHK*</label>
                    <CustomButtonGroup
                        buttons={AppConstant.BHK_OPTION}
                        selectedIndices={[AppConstant.BHK_OPTION.findIndex(option => option.text === bhkType)]}
                        isMultiSelect={false}
                        onButtonPress={(index, button) => setBHKType(button.text)}
                        containerStyle={{ gap: '12px' }}
                        buttonStyle={{ backgroundColor: '#FFFFFF', borderRadius: '6px', border: '1px solid #E5E7EB', padding: '8px 20px', fontSize: '14px', fontWeight: '500', color: '#374151', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)', width: '140px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">How many wash rooms*</label>
                    <CustomButtonGroup
                        buttons={washroomOption}
                        selectedIndices={[washroomOption.findIndex(option => option.text === washroomNumber)]}
                        isMultiSelect={false}
                        onButtonPress={(index, button) => setWashroomNumber(button.text)}
                        containerStyle={{ gap: '12px' }}
                        buttonStyle={{ backgroundColor: '#FFFFFF', borderRadius: '6px', border: '1px solid #E5E7EB', padding: '8px 20px', fontSize: '14px', fontWeight: '500', color: '#374151', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)', width: '140px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Furnishing*</label>
                    <CustomButtonGroup
                        buttons={AppConstant.FURNISHING_STATUS_OPTION}
                        selectedIndices={[AppConstant.FURNISHING_STATUS_OPTION.findIndex(option => option.text === furnishingStatus)]}
                        isMultiSelect={false}
                        onButtonPress={(index, button) => setFurnishingStatus(button.text)}
                        containerStyle={{ gap: '12px' }}
                        buttonStyle={{ backgroundColor: '#FFFFFF', borderRadius: '6px', border: '1px solid #E5E7EB', padding: '8px 20px', fontSize: '14px', fontWeight: '500', color: '#374151', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)', width: '140px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Parkings*</label>
                    <CustomButtonGroup
                        buttons={parkingNumberOption}
                        selectedIndices={[parkingNumberOption.findIndex(option => option.text === parkingNumber)]}
                        isMultiSelect={false}
                        onButtonPress={(index, button) => setParkingNumber(button.text)}
                        containerStyle={{ gap: '12px' }}
                        buttonStyle={{ backgroundColor: '#FFFFFF', borderRadius: '6px', border: '1px solid #E5E7EB', padding: '8px 20px', fontSize: '14px', fontWeight: '500', color: '#374151', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)', width: '140px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                    />

                    <div className="flex items-center mt-4 ml-4">
                        <div className="flex flex-col mr-4">
                            <MdDirectionsCar size={26} />
                            <MdDirectionsBike size={26} />
                        </div>
                        <CustomButtonGroup
                            buttons={AppConstant.PARKING_OPTION}
                            selectedIndices={[AppConstant.PARKING_OPTION.findIndex(option => option.text === parkingType)]}
                            isMultiSelect={false}
                            onButtonPress={(index, button) => setParkingType(button.text)}
                            containerStyle={{ gap: '12px' }}
                            buttonStyle={{ backgroundColor: '#FFFFFF', borderRadius: '6px', border: '1px solid #E5E7EB', padding: '8px 20px', fontSize: '14px', fontWeight: '500', color: '#374151', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)', width: '140px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                        />
                    </div>
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Property Age*</label>
                    <CustomButtonGroup
                        buttons={propertyAgeOption}
                        selectedIndices={[propertyAgeOption.findIndex(option => option.text === propertyAge)]}
                        isMultiSelect={false}
                        onButtonPress={(index, button) => setPropertyAge(button.text)}
                        containerStyle={{ gap: '12px' }}
                        buttonStyle={{ backgroundColor: '#FFFFFF', borderRadius: '6px', border: '1px solid #E5E7EB', padding: '8px 20px', fontSize: '14px', fontWeight: '500', color: '#374151', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)', width: '140px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                    />
                </div>

                <div className="flex flex-row mb-4 gap-4">
                    <div className="w-1/4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Floor*</label>
                        <input
                            type="number"
                            className="w-full p-2 border border-gray-300 rounded bg-white text-gray-900"
                            value={floor}
                            onChange={(e) => setFloor(e.target.value)}
                            onFocus={() => setIsVisible(false)}
                        />
                    </div>
                    <div className="w-1/3">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Total Floor*</label>
                        <input
                            type="number"
                            className="w-full p-2 border border-gray-300 rounded bg-white text-gray-900"
                            value={totalFloor}
                            onChange={(e) => setTotalFloor(e.target.value)}
                            onFocus={() => setIsVisible(false)}
                        />
                    </div>
                    <div className="ml-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Lift*</label>
                        <CustomButtonGroup
                            buttons={AppConstant.LIFT_AVAILBLE_OPTION}
                            selectedIndices={[AppConstant.LIFT_AVAILBLE_OPTION.findIndex(option => option.text === liftOption)]}
                            isMultiSelect={false}
                            onButtonPress={(index, button) => setLiftOption(button.text)}
                            containerStyle={{ gap: '12px' }}
                            buttonStyle={{ backgroundColor: '#FFFFFF', borderRadius: '6px', border: '1px solid #E5E7EB', padding: '8px 20px', fontSize: '14px', fontWeight: '500', color: '#374151', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)', width: '140px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                        />
                    </div>
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Property Size*</label>
                    <input
                        type="number"
                        className="w-full p-2 border border-gray-300 rounded bg-white text-gray-900"
                        placeholder="Property Size"
                        value={propertySize}
                        onChange={(e) => setPropertySize(e.target.value)}
                        onFocus={() => setIsVisible(false)}
                    />
                </div>

                <div className="mt-4">
                    <Button title="NEXT" onPress={onSubmit} />
                </div>
            </div>

            <Snackbar
                visible={isVisible}
                textMessage={errorMessage}
                actionHandler={dismissSnackBar}
                actionText="OK"
            />
        </div >
    );
};

const mapStateToProps = state => ({
    propertyDetails: state.AppReducer.propertyDetails,
    userDetails: state.AppReducer.userDetails
});

const mapDispatchToProps = {
    setPropertyDetails
};

export default connect(mapStateToProps, mapDispatchToProps)(ResidentialPropertyDetailsForm);
