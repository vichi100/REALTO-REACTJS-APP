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
import { setPropertyDetails } from "./../../../../reducers/Action";
import DatePicker, { RangeOutput, SingleOutput } from 'react-native-neat-date-picker'
import CustomButtonGroup from "./../../../../components/CustomButtonGroup";
import * as  AppConstant from "./../../../../utils/AppConstant";

const negotiableArray = ["Yes", "No"];

const SellDetails = props => {
  const { navigation } = props;
  const date = new Date();
  const [newDate, setNewDate] = React.useState("");

  const [expectedSellPrice, setExpectedSellPrice] = useState("");
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

  const onSubmit = async () => {
    if (expectedSellPrice.trim() === "") {
      setErrorMessage("Expected sell price is missing");
      setIsVisible(true);
      return;
    } else if (maintenanceCharge.trim() === "") {
      setErrorMessage("Maintenance charge is missing");
      setIsVisible(true);
      return;
    } else if (newDate.trim() === "") {
      setErrorMessage("Available from date is missing");
      setIsVisible(true);
      return;
    } 

    const sell_details = {
      expected_sell_price: expectedSellPrice,
      maintenance_charge: maintenanceCharge,
      available_from: newDate.trim(),
      negotiable: negotiable
    };
    // const property = JSON.parse(await AsyncStorage.getItem("property"));
    const property = props.propertyDetails;
    property["sell_details"] = sell_details;
    // // console.log(property);
    // AsyncStorage.setItem("property", JSON.stringify(property));
    props.setPropertyDetails(property)

    navigation.navigate("AddImages");
  };

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
                  ? "Expected Sell Price*"
                  : numDifferentiation(expectedSellPrice) +
                  " Expected Sell Price"
              }
              placeholder="Expected Sell Price*"
              value={expectedSellPrice}
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
            <TextInput
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
            />
            <TextInput
              mode="outlined"
              style={styles.inputContainerStyle}
              label="Available From *"
              placeholder="Available From *"
              value={newDate}
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
                accessibilityLabelId="negotiable_option"
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
        <DatePicker
        isVisible={visible}
        mode={'single'}
        showSoftInputOnFocus={false}
        initialDate={new Date()}
        minDate={new Date()}
        onCancel={onDismiss}
        onConfirm={onChange}
        dateStringFormat={"dd-mmm-yyyy"}
      />
      </KeyboardAwareScrollView>
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
  propertyType: state.AppReducer.propertyType,
  propertyDetails: state.AppReducer.propertyDetails,
});
const mapDispatchToProps = {
  setPropertyDetails
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SellDetails);

// export default SellDetails;
