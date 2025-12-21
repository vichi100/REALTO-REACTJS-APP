import React, { useState } from "react";
import { MdArrowBack } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import Button from "./../../../components/Button";
import Snackbar from "./../../../components/SnackbarComponent";
import { connect } from "react-redux";
import { setPropertyType, setPropertyDetails, setCustomerDetails } from "./../../../reducers/Action";
import CustomButtonGroup from "./../../../components/CustomButtonGroup";
import * as  AppConstant from "./../../../utils/AppConstant";

const ContactResidentialPropertyDetailsForm = props => {
    const navigate = useNavigate();

    const [isVisible, setIsVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const [houseType, setHouseType] = useState("Apartment");
    const [bhkType, setBHKType] = useState("2BHK");
    const [furnishingStatus, setFurnishingStatus] = useState("Semi");
    const [parkingType, setParkingType] = useState("Car");
    const [liftOption, setLiftOption] = useState("Yes");

    const dismissSnackBar = () => {
        setIsVisible(false);
    };

    const onSubmit = async () => {

        const customer = props.customerDetails
        const propertyFor = customer.customer_locality.property_for;

        const customer_property_details = {
            house_type: houseType,
            bhk_type: bhkType,
            furnishing_status: furnishingStatus,
            parking_type: parkingType,
            lift: liftOption,
        };

        customer["customer_property_details"] = customer_property_details;
        props.setCustomerDetails(customer);
        if (propertyFor.toLowerCase() === "Rent".toLowerCase()) {
            navigate("../ContactRentDetailsForm");
        } else if (propertyFor.toLowerCase() === "Buy".toLowerCase()) {
            navigate("../ContactBuyResidentialDetailsForm");
        }
    };

    return (
        <div style={{ flex: 1, backgroundColor: "#F9FAFB", minHeight: "100vh" }}>
            {/* Header */}
            <div style={styles.headerContainer}>
                <div style={styles.backButtonContainer} onClick={() => navigate(-1)}>
                    <MdArrowBack size={24} color="#000000" />
                </div>
                <div style={styles.headerTitleContainer}>
                    <p style={styles.headerTitle}>Property Details</p>
                </div>
            </div>
            <div style={styles.container}>
                <div style={{ paddingTop: 30, marginLeft: 15, marginRight: 0 }}>
                    <p style={{ marginBottom: 30, color: '#000000' }}>
                        Provide property details of which customer is looking for
                    </p>

                    <div className="mb-6">
                        <p className="text-sm font-medium text-gray-700 mb-3">House Type*</p>
                        <CustomButtonGroup
                            buttons={AppConstant.HOUSE_TYPE_OPTION}
                            selectedIndices={[AppConstant.HOUSE_TYPE_OPTION.findIndex(option => option.text === houseType)]}
                            isMultiSelect={false}
                            onButtonPress={(index, button) => {
                                setHouseType(button.text);
                            }}
                            containerStyle={{ gap: '12px' }}
                            buttonStyle={{ backgroundColor: '#FFFFFF', borderRadius: '6px', border: '1px solid #E5E7EB', padding: '8px 20px', fontSize: '14px', fontWeight: '500', color: '#374151', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)', width: '140px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                        />
                    </div>

                    <div className="mb-6">
                        <p className="text-sm font-medium text-gray-700 mb-3">Size of BHK*</p>
                        <CustomButtonGroup
                            buttons={AppConstant.BHK_OPTION}
                            selectedIndices={[AppConstant.BHK_OPTION.findIndex(option => option.text === bhkType)]}
                            isMultiSelect={false}
                            onButtonPress={(index, button) => {
                                setBHKType(button.text);
                            }}
                            containerStyle={{ gap: '12px' }}
                            buttonStyle={{ backgroundColor: '#FFFFFF', borderRadius: '6px', border: '1px solid #E5E7EB', padding: '8px 20px', fontSize: '14px', fontWeight: '500', color: '#374151', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)', width: '140px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                        />
                    </div>

                    <div className="mb-6">
                        <p className="text-sm font-medium text-gray-700 mb-3">Furnishing*</p>
                        <CustomButtonGroup
                            buttons={AppConstant.FURNISHING_STATUS_OPTION}
                            selectedIndices={[AppConstant.FURNISHING_STATUS_OPTION.findIndex(option => option.text === furnishingStatus)]}
                            isMultiSelect={false}
                            onButtonPress={(index, button) => {
                                setFurnishingStatus(button.text);
                            }}
                            containerStyle={{ gap: '12px' }}
                            buttonStyle={{ backgroundColor: '#FFFFFF', borderRadius: '6px', border: '1px solid #E5E7EB', padding: '8px 20px', fontSize: '14px', fontWeight: '500', color: '#374151', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)', width: '140px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                        />
                    </div>

                    <div className="mb-6">
                        <p className="text-sm font-medium text-gray-700 mb-3">Parkings*</p>
                        <CustomButtonGroup
                            buttons={AppConstant.PARKING_OPTION}
                            selectedIndices={[AppConstant.PARKING_OPTION.findIndex(option => option.text === parkingType)]}
                            isMultiSelect={false}
                            onButtonPress={(index, button) => {
                                setParkingType(button.text);
                            }}
                            containerStyle={{ gap: '12px' }}
                            buttonStyle={{ backgroundColor: '#FFFFFF', borderRadius: '6px', border: '1px solid #E5E7EB', padding: '8px 20px', fontSize: '14px', fontWeight: '500', color: '#374151', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)', width: '140px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                        />
                    </div>

                    <div className="mb-6">
                        <p className="text-sm font-medium text-gray-700 mb-3">Lift Mandatory*</p>
                        <CustomButtonGroup
                            buttons={AppConstant.LIFT_AVAILBLE_OPTION}
                            selectedIndices={[AppConstant.LIFT_AVAILBLE_OPTION.findIndex(option => option.text === liftOption)]}
                            isMultiSelect={false}
                            onButtonPress={(index, button) => {
                                setLiftOption(button.text);
                            }}
                            containerStyle={{ gap: '12px' }}
                            buttonStyle={{ backgroundColor: '#FFFFFF', borderRadius: '6px', border: '1px solid #E5E7EB', padding: '8px 20px', fontSize: '14px', fontWeight: '500', color: '#374151', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)', width: '140px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                        />
                    </div>

                    <div style={{ marginTop: 15 }}>
                        <Button title="NEXT" onPress={() => onSubmit()} />
                    </div>
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
    headerContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        padding: '10px 15px',
        borderBottom: '1px solid #e0e0e0',
        backgroundColor: '#fff',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
    },
    backButtonContainer: {
        cursor: 'pointer',
        marginRight: 15,
        display: 'flex',
        alignItems: 'center',
    },
    headerTitleContainer: {
        flex: 1,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1a1a1a',
        margin: 0,
    },
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
    userDetails: state.AppReducer.userDetails,
    propertyDetails: state.AppReducer.propertyDetails,
    customerDetails: state.AppReducer.customerDetails
});
const mapDispatchToProps = {
    setPropertyType,
    setPropertyDetails,
    setCustomerDetails,
};
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ContactResidentialPropertyDetailsForm);
