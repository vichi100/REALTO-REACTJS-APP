import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Platform,
  KeyboardAvoidingView,
  SafeAreaView,
  ScrollView,
  Keyboard,
  AsyncStorage
} from "react-native";
import { DatePickerModal } from "react-native-paper-dates";
import { ButtonGroup } from "@rneui/themed";
import { TextInput, HelperText, useTheme } from "react-native-paper";
import Button from "./../../../../components/Button";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Snackbar from "./../../../../components/SnackbarComponent";
import { numDifferentiation } from "./../../../../utils/methods";
import { connect } from "react-redux";
import { setPropertyType, setPropertyDetails, setCustomerDetails } from "./../../../../reducers/Action";
import DatePicker, { RangeOutput, SingleOutput } from 'react-native-neat-date-picker';
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
    Keyboard.dismiss();
  }, [setVisible]);

  const onChange = React.useCallback(({ date }) => {
    setVisible(false);
    setIsVisible(false);
    const x = date.toString().split("00:00");
    setNewDate(x[0].toString().trim());
    Keyboard.dismiss();
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
    <View style={{ flex: 1, backgroundColor: "rgba(245,245,245, 0.2)" }}>
      <KeyboardAwareScrollView onPress={Keyboard.dismiss}>
        <ScrollView>
          <View style={styles.container}>
            <TextInput
              mode="outlined"
              keyboardType={"numeric"}
              returnKeyType={"done"}
              style={styles.inputContainerStyle}
              label={
                expectedSellPrice.trim() === ""
                  ? "Expected Buy Price*"
                  : numDifferentiation(expectedSellPrice) +
                  " Expected Buy Price"
              }
              placeholder="Expected Buy Price*"
              value={expectedSellPrice}
              // keyboardType={"numeric"}
              onChangeText={text => setExpectedSellPrice(text)}
              onFocus={() => setIsVisible(false)}
              theme={{
                colors: {
                  // placeholder: "white",
                  // text: "white",
                  primary: "rgba(0,191,255, .9)",
                  underlineColor: "transparent",
                  background: "#ffffff"
                }
              }}
            />
            {/* <TextInput
              mode="outlined"
              style={styles.inputContainerStyle}
              keyboardType={"numeric"}
              returnKeyType={"done"}
              label={
                maintenanceCharge.trim() === ""
                  ? "Maintenance Charge/Month*"
                  : numDifferentiation(maintenanceCharge) +
                    " Maintenance Charge/Month"
              }
              placeholder="Maintenance Charge"
              value={maintenanceCharge}
              keyboardType={"numeric"}
              onChangeText={text => setMaintenanceCharge(text)}
              onFocus={() => setIsVisible(false)}
              theme={{
                colors: {
                  // placeholder: "white",
                  // text: "white",
                  primary: "rgba(0,191,255, .9)",
                  underlineColor: "transparent",
                  background: "#ffffff"
                }
              }}
            /> */}
            <TextInput
              mode="outlined"
              style={styles.inputContainerStyle}
              label="Required From *"
              placeholder="Required From *"
              value={newDate}
              showSoftInputOnFocus={false}
              // onChangeText={newDate => setNewDate(newDate)}
              onFocus={() => setVisible(true)}
              theme={{
                colors: {
                  // placeholder: "white",
                  // text: "white",

                  primary: "rgba(0,191,255, .9)",
                  underlineColor: "transparent",
                  background: "#ffffff"
                }
              }}
            />

            <Text>Negotiable*</Text>
            <View style={styles.propSubSection}>
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
            </View>

            <Button title="NEXT" onPress={() => onSubmit()} />
          </View>
        </ScrollView>
        {/* <DatePickerModal
          mode="single"
          visible={visible}
          onDismiss={onDismiss}
          date={date}
          onConfirm={onChange}
          saveLabel="Ok" // optional
          label="Select date" // optional
          animationType="slide" // optional, default is 'slide' on ios/android and 'none' on web
          locale={"en"} // optional, default is automically detected by your system
        /> */}
      </KeyboardAwareScrollView>
      <DatePicker
        isVisible={visible}
        mode={'single'}
        initialDate={new Date()}
        minDate={new Date()}
        onCancel={onDismiss}
        onConfirm={onChange}
        dateStringFormat={"dd-mmm-yyyy"}
      />
      <Snackbar
        visible={isVisible}
        textMessage={errorMessage}
        position={"top"}
        actionHandler={() => dismissSnackBar()}
        actionText="OK"
      />
    </View>
  );
};

const styles = StyleSheet.create({
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
});

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
