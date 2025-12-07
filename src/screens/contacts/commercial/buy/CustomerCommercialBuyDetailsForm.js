import React, { useState } from "react";
// import {
//   StyleSheet,
//   View,
//   Text,
//   TouchableOpacity,
//   Platform,
//   KeyboardAvoidingView,
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

const CustomerCommercialBuyDetailsForm = props => {
    const { navigation } = props;
    const date = new Date();
    const [newDate, setNewDate] = React.useState("");

    const [expectedSellPrice, setExpectedSellPrice] = useState("");
    // const [maintenanceCharge, setMaintenanceCharge] = useState("");
    const [isVisible, setIsVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [negotiable, setNegotiable] = useState("Yes");
    const [visible, setVisible] = React.useState(false);

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
        if (expectedSellPrice.trim() === "") {
            setErrorMessage("Expected sell price is missing");
            setIsVisible(true);
            return;
        } else if (newDate.trim() === "") {
            setErrorMessage("Available from date is missing");
            setIsVisible(true);
            return;
        }
        const customer_buy_details = {
            expected_buy_price: expectedSellPrice,
            available_from: newDate.trim(),
            negotiable: negotiable,
        };
        // const customer = JSON.parse(await AsyncStorage.getItem("customer"));
        const customer = props.customerDetails;
        customer["customer_buy_details"] = customer_buy_details;
        // // console.log(property);
        // AsyncStorage.setItem("customer", JSON.stringify(customer));
        props.setCustomerDetails(customer);

        navigation.navigate("AddNewCustomerCommercialBuyFinalDetails");
    };

    // const numDifferentiation = value => {
    //   var val = Math.abs(value);
    //   if (val >= 10000000) {
    //     val = parseFloat((val / 10000000).toFixed(2)) + " Cr";
    //   } else if (val >= 100000) {
    //     val = parseFloat((val / 100000).toFixed(2)) + " Lac";
    //   } else if (val >= 1000) {
    //     val = parseFloat((val / 1000).toFixed(2)) + " K";
    //   }
    //   return val;
    // };

    return (
        <div style={{ flex: 1, backgroundColor: "rgba(245,245,245, 0.2)", height: '100vh', overflowY: 'auto' }}>
            <div style={styles.container}>
                <div style={styles.inputContainerStyle}>
                    <label style={{ display: 'block', marginBottom: 5, fontSize: 12, color: 'rgba(0,191,255, .9)' }}>
                        {expectedSellPrice.trim() === "" ? "Expected Buy Price*" : numDifferentiation(expectedSellPrice) + " Expected Buy Price"}
                    </label>
                    <input
                        type="number"
                        placeholder="Expected Buy Price*"
                        value={expectedSellPrice}
                        onChange={e => setExpectedSellPrice(e.target.value)}
                        onFocus={() => setIsVisible(false)}
                        style={{
                            width: '100%',
                            padding: 10,
                            borderRadius: 4,
                            border: '1px solid #ccc',
                            backgroundColor: "#ffffff"
                        }}
                    />
                </div>

                <div style={styles.inputContainerStyle}>
                    <label style={{ display: 'block', marginBottom: 5, fontSize: 12, color: 'rgba(0,191,255, .9)' }}>
                        Required From *
                    </label>
                    <input
                        type="date"
                        placeholder="Required From *"
                        value={newDate}
                        onChange={onChange}
                        onFocus={() => setVisible(true)}
                        style={{
                            width: '100%',
                            padding: 10,
                            borderRadius: 4,
                            border: '1px solid #ccc',
                            backgroundColor: "#ffffff"
                        }}
                    />
                </div>

                <p>Negotiable*</p>
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

                    {/* <ButtonGroup
            selectedBackgroundColor="rgba(27, 106, 158, 0.85)"
            onPress={selectNegotiableIndex}
            selectedIndex={negotiableIndex}
            buttons={negotiableArray}
            // containerStyle={{ height: 30 }}
            textStyle={{ textAlign: "center" }}
            selectedTextStyle={{ color: "#fff" }}
            containerStyle={{ borderRadius: 10, width: 300 }}
            containerBorderRadius={10}
          /> */}
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
)(CustomerCommercialBuyDetailsForm);

// export default CustomerCommercialBuyDetailsForm;
