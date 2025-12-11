import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
// import {
//   StyleSheet,
//   View,
//   Text,
//   TouchableOpacity,
//   Platform,
//   KeyboardAvoidingView,
//   SafeAreaView,
//   SafeAreaView,
//   ScrollView,
//   Keyboard,
//   AsyncStorage
// } from "react-native";
// import { DatePickerModal } from "react-native-paper-dates";
// import { ButtonGroup } from "@rneui/themed";
// import { TextInput, HelperText, useTheme } from "react-native-paper";
import Button from "./../../../../components/Button";
// import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Snackbar from "./../../../../components/SnackbarComponent";
import { numDifferentiation } from "./../../../../utils/methods";
import { connect } from "react-redux";
import { setPropertyType, setPropertyDetails, setCustomerDetails } from "./../../../../reducers/Action";
// import DatePicker, { RangeOutput, SingleOutput } from 'react-native-neat-date-picker';
import CustomButtonGroup from "./../../../../components/CustomButtonGroup";
import * as  AppConstant from "./../../../../utils/AppConstant";



const negotiableArray = ["Yes", "No"];

const ContactBuyResidentialDetailsForm = props => {
    const navigate = useNavigate();
    const date = new Date();
    const [newDate, setNewDate] = React.useState("");

    const [expectedBuyPrice, setExpectedBuyPrice] = useState("");
    const [maintenanceCharge, setMaintenanceCharge] = useState("");
    const [isVisible, setIsVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [negotiableIndex, setNegotiableIndex] = useState(-1);
    const [visible, setVisible] = React.useState(false);
    const [negotiable, setNegotiable] = useState("Yes");

    const dismissSnackBar = () => {
        setIsVisible(false);
    };

    const onDismiss = React.useCallback(() => {
        setVisible(false);
        setIsVisible(false);
        // Keyboard.dismiss();
    }, [setVisible]);

    const onChange = React.useCallback((event) => {
        const date = event.target.value;
        setVisible(false);
        setIsVisible(false);
        // const x = date.toString().split("00:00");
        setNewDate(date);
        // Keyboard.dismiss();
        // setNewDate(date.toString());
        // // console.log({ date });
    }, []);

    const selectNegotiableIndex = index => {
        setNegotiableIndex(index);
        setIsVisible(false);
    };

    const onSubmit = () => {
        if (expectedBuyPrice.trim() === "") {
            setErrorMessage("Expected sell price is missing");
            setIsVisible(true);
            return;
        } else if (newDate.trim() === "") {
            setErrorMessage("Available from date is missing");
            setIsVisible(true);
            return;
        }

        const customer_buy_details = {
            expected_buy_price: expectedBuyPrice,
            available_from: newDate.trim(),
            negotiable: negotiable
        };
        // const customer = JSON.parse(await AsyncStorage.getItem("customer"));
        const customer = props.customerDetails;
        customer["customer_buy_details"] = customer_buy_details;
        // // console.log(property);
        // AsyncStorage.setItem("customer", JSON.stringify(customer));
        props.setCustomerDetails(customer)

        navigate("../AddNewCustomerBuyResidentialFinalDetails");
    };


    return (
        <div style={{ flex: 1, backgroundColor: "#ffffff", height: '100vh', overflowY: 'auto' }}>
            <div style={styles.container}>
                <div style={styles.inputContainerStyle}>
                    <label style={{ display: 'block', marginBottom: 5, fontSize: 12, color: '#000000', fontWeight: '500' }}>
                        {expectedBuyPrice.trim() === "" ? "Expected Buy Price*" : numDifferentiation(expectedBuyPrice) + " Expected Buy Price"}
                    </label>
                    <input
                        type="number"
                        placeholder="Expected Buy Price*"
                        value={expectedBuyPrice}
                        onChange={e => setExpectedBuyPrice(e.target.value)}
                        onFocus={() => setIsVisible(false)}
                        style={{
                            width: '100%',
                            padding: 10,
                            borderRadius: 4,
                            border: '1px solid #ccc',
                            backgroundColor: "#f9f9f9",
                            color: '#000000'
                        }}
                    />
                </div>

                <div style={styles.inputContainerStyle}>
                    <label style={{ display: 'block', marginBottom: 5, fontSize: 12, color: '#000000', fontWeight: '500' }}>
                        Required From (DD/MM/YYYY) *
                    </label>
                    <input
                        type={visible || newDate ? "date" : "text"}
                        placeholder="DD/MM/YYYY"
                        value={newDate}
                        onChange={onChange}
                        onFocus={() => setVisible(true)}
                        onBlur={() => setVisible(false)}
                        style={{
                            width: '100%',
                            padding: 10,
                            borderRadius: 4,
                            border: '1px solid #ccc',
                            backgroundColor: "#f9f9f9",
                            color: '#000000'
                        }}
                    />
                </div>

                <p style={{ color: '#000000', fontWeight: 'bold' }}>Negotiable*</p>
                <div style={styles.propSubSection}>
                    <CustomButtonGroup
                        buttons={AppConstant.NEGOTIABLE_OPTION}
                        accessibilityLabelId="negotiable"
                        selectedIndices={[AppConstant.NEGOTIABLE_OPTION.findIndex(option => option.text === negotiable)]}
                        isMultiSelect={false}
                        buttonStyle={{ backgroundColor: '#fff' }}
                        selectedButtonStyle={{ backgroundColor: 'rgba(0, 163, 108, .2)' }}
                        buttonTextStyle={{ color: '#000' }}
                        selectedButtonTextStyle={{ color: '#000' }}
                        onButtonPress={(index, button) => {
                            console.log(`Button pressed: ${button.text} (Index: ${index})`);
                            setNegotiable(button.text);
                            // Query update is handled by useEffect after state change
                        }}
                    />

                </div>

                <Button title="NEXT" onPress={() => onSubmit()} />
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
        flex: 1,
        marginTop: 20,
        marginLeft: 20,
        marginRight: 20
    },
    inputContainerStyle: {
        marginBottom: 20
    },
    propSubSection: {
        marginTop: 10,
        marginBottom: 15
    },
    doubleColSection: {
        flex: 1,
        width: "100%",
        flexDirection: "row",
        marginTop: 5,
        marginBottom: 5
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
)(ContactBuyResidentialDetailsForm);
