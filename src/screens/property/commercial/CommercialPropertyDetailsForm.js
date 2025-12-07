import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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
        <div style={{ flex: 1, backgroundColor: "rgba(245,245,245, 0.2)", height: '100vh', overflowY: 'auto' }}>
            <div style={styles.container}>
                <div style={{ paddingTop: 30, marginLeft: 10, marginRight: 0 }}>
                    <span>Property Type*</span>
                    <div style={styles.propSubSection}>
                        <CustomButtonGroup
                            buttons={AppConstant.COMMERCIAL_PROPERTY_TYPE_OPTION}
                            accessibilityLabelId="commercial_property_type"
                            selectedIndices={[AppConstant.COMMERCIAL_PROPERTY_TYPE_OPTION.findIndex(option => option.text === propertyType)]}
                            isMultiSelect={false}
                            buttonStyle={{ backgroundColor: '#fff' }}
                            selectedButtonStyle={{ backgroundColor: 'rgba(0, 163, 108, .2)' }}
                            buttonTextStyle={{ color: '#000' }}
                            selectedButtonTextStyle={{ color: '#000' }}
                            onButtonPress={(index, button) => {
                                setPropertyType(button.text);
                            }}
                        />
                    </div>
                    <span>Building Type*</span>
                    <div style={styles.propSubSection}>
                        <CustomButtonGroup
                            buttons={AppConstant.COMMERCIAL_PROPERTY_BUILDING_TYPE_OPTION}
                            accessibilityLabelId="commercial_property_building_type"
                            selectedIndices={[AppConstant.COMMERCIAL_PROPERTY_BUILDING_TYPE_OPTION.findIndex(option => option.text === buildingType)]}
                            isMultiSelect={false}
                            buttonStyle={{ backgroundColor: '#fff' }}
                            selectedButtonStyle={{ backgroundColor: 'rgba(0, 163, 108, .2)' }}
                            buttonTextStyle={{ color: '#000' }}
                            selectedButtonTextStyle={{ color: '#000' }}
                            onButtonPress={(index, button) => {
                                setBuildingType(button.text);
                            }}
                        />
                    </div>

                    <span>Ideal For*(Multi Select)</span>
                    <div style={styles.propSubSection}>
                        <CustomButtonGroup
                            buttons={AppConstant.COMMERCIAL_PROPERTY_IDEAL_FOR_OPTION}
                            accessibilityLabelId="commercial_property_ideal_for"
                            isMultiSelect={true}
                            buttonStyle={{ backgroundColor: '#fff', borderColor: 'rgba(173, 181, 189, .5)', borderWidth: 1 }}
                            selectedButtonStyle={{ backgroundColor: 'rgba(0, 163, 108, .2)' }}
                            buttonTextStyle={{ color: '#000' }}
                            selectedButtonTextStyle={{ color: '#000' }}
                            selectedIndices={selectIdealForList.map((item) =>
                                AppConstant.COMMERCIAL_PROPERTY_IDEAL_FOR_OPTION.findIndex((option) => option.text === item)
                            )}
                            onButtonPress={(index, button) => {
                                selectIdealFor(index, button);
                            }}
                        />
                    </div>

                    <span>Parkings</span>
                    <div style={styles.doubleColSection}>
                        <CustomButtonGroup
                            buttons={AppConstant.COMMERCIAL_PARKING_OPTION}
                            accessibilityLabelId="commercial_parking_type"
                            selectedIndices={[AppConstant.COMMERCIAL_PARKING_OPTION.findIndex(option => option.text === parkingType)]}
                            isMultiSelect={false}
                            buttonStyle={{ backgroundColor: '#fff' }}
                            selectedButtonStyle={{ backgroundColor: 'rgba(0, 163, 108, .2)' }}
                            buttonTextStyle={{ color: '#000' }}
                            selectedButtonTextStyle={{ color: '#000' }}
                            onButtonPress={(index, button) => {
                                setParkingType(button.text);
                            }}
                        />
                    </div>
                    <span>Property Age*</span>
                    <div style={styles.propSubSection}>
                        <CustomButtonGroup
                            buttons={AppConstant.PROPERTY_AGE_OPTION}
                            accessibilityLabelId="property_age"
                            selectedIndices={[AppConstant.PROPERTY_AGE_OPTION.findIndex(option => option.text === propertyAge)]}
                            isMultiSelect={false}
                            buttonStyle={{ backgroundColor: '#fff' }}
                            selectedButtonStyle={{ backgroundColor: 'rgba(0, 163, 108, .2)' }}
                            buttonTextStyle={{ color: '#000' }}
                            selectedButtonTextStyle={{ color: '#000' }}
                            onButtonPress={(index, button) => {
                                setPropertyAge(button.text);
                            }}
                        />
                    </div>
                    <span>Power Backup*</span>
                    <div style={styles.propSubSection}>
                        <CustomButtonGroup
                            buttons={AppConstant.POWER_BACKUP_OPTION}
                            accessibilityLabelId="power_backup"
                            selectedIndices={[AppConstant.POWER_BACKUP_OPTION.findIndex(option => option.text === powerBackup)]}
                            isMultiSelect={false}
                            buttonStyle={{ backgroundColor: '#fff' }}
                            selectedButtonStyle={{ backgroundColor: 'rgba(0, 163, 108, .2)' }}
                            buttonTextStyle={{ color: '#000' }}
                            selectedButtonTextStyle={{ color: '#000' }}
                            onButtonPress={(index, button) => {
                                setPowerBackup(button.text);
                            }}
                        />
                    </div>
                    <div style={styles.inputContainerStyle}>
                        <label style={{ display: 'block', marginBottom: 5 }}>Property Size*</label>
                        <input
                            type="number"
                            placeholder="Property Size"
                            value={propertySize}
                            onChange={e => setPropertySize(e.target.value)}
                            onFocus={() => setIsVisible(false)}
                            style={{
                                width: '100%',
                                padding: 10,
                                borderRadius: 5,
                                border: '1px solid #ccc',
                                fontSize: 16,
                                color: '#000'
                            }}
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
