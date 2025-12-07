import React, { useState, useEffect } from "react";
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
import { ButtonGroup } from "react-native-elements";
import { TextInput, HelperText, useTheme } from "react-native-paper";
import Button from "./../../../../components/Button";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Snackbar from "./../../../../components/SnackbarComponent";
import { numDifferentiation } from "./../../../../utils/methods";
import { connect } from "react-redux";
import { setPropertyDetails } from "./../../../../reducers/Action";
import DatePicker, { RangeOutput, SingleOutput } from 'react-native-neat-date-picker'
import { MaterialIcons } from "@expo/vector-icons";
import CustomButtonGroup from "./../../../../components/CustomButtonGroup";


const preferredTenantsArray = ["Family", "Bachelors", "Any"];
const nonvegAllowedArray = ["Yes", "No"];
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
  const { navigation } = props;
  const date = new Date();
  const [newDate, setNewDate] = React.useState("");

  // const [propertyDetailsX, setPropertyDetailsX] = useState({});
  const [expectedRent, setExpectedRent] = useState("");
  const [expectedDeposit, setExpectedDeposit] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  // const [preferredTenantsIndex, setPreferredTenantsIndex] = useState(-1);
  // const [nonvegAllowedIndex, setNonvegAllowedIndex] = useState(-1);
  const [visible, setVisible] = React.useState(false);

  const [preferredTenant, setPreferredTenant] = useState("Any");
  const [nonvegAllowed, setNonvegAllowed] = useState("Yes");
  
  



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
    // const x = date.toString().split("00:00");
    setNewDate(
      date
        .toString()
        .slice(0, 16)
        .trim()
    );
    Keyboard.dismiss();
    // setNewDate(date.toString());
    // // console.log({ date });
  }, []);

  // const selectedPreferredTenantsIndex = index => {
  //   setPreferredTenantsIndex(index);
  //   setIsVisible(false);
  // };

  // const selectNonvegAllowedIndex = index => {
  //   setNonvegAllowedIndex(index);
  //   setIsVisible(false);
  // };

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
    
    // else if (
    //   props.propertyType &&
    //   props.propertyType === "Residential" &&
    //   preferredTenantsIndex === -1
    // ) {
    //   setErrorMessage("Preferred tenants is missing");
    //   setIsVisible(true);
    //   return;
    // } else if (
    //   props.propertyType &&
    //   props.propertyType === "Residential" &&
    //   nonvegAllowedIndex === -1
    // ) {
    //   setErrorMessage("Nonveg allowed is missing");
    //   setIsVisible(true);
    //   return;
    // }

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
    // console.log(JSON.stringify(property));

    navigation.navigate("AddImages");
  };
  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "rgba(245,245,245, 0.2)" }}
    >
      <KeyboardAwareScrollView onPress={Keyboard.dismiss}>
        <ScrollView>
          <View style={styles.container}>
            <TextInput
              testID="expectedRent"
              mode="outlined"
              keyboardType={"numeric"}
              returnKeyType={"done"}
              style={styles.inputContainerStyle}
              label={
                expectedRent.trim() === ""
                  ? "Expected Rent*"
                  : numDifferentiation(expectedRent) + " Expected Rent"
              }
              // label="Expected Rent*"
              placeholder="Expected Rent"
              value={expectedRent}
              // keyboardType={"numeric"}
              onChangeText={text => setExpectedRent(text)}
              onFocus={() => setIsVisible(false)}
              theme={{
                colors: {
                  // placeholder: "white",
                  // text: "white",
                  primary: "rgba(0,191,255, .9)",
                  underlineColor: "transparent",
                  backgroundColor: "rgba(245,245,245, 0.2)"
                }
              }}
            />
            <TextInput
              testID="expectedDeposit"
              mode="outlined"
              style={styles.inputContainerStyle}
              keyboardType={"numeric"}
              returnKeyType={"done"}
              label={
                expectedDeposit.trim() === ""
                  ? "Expected Deposit*"
                  : numDifferentiation(expectedDeposit) + " Expected Deposit"
              }
              // label="Expected Deposit*"
              placeholder="Expected Deposit"
              value={expectedDeposit}
              // keyboardType={"numeric"}
              onChangeText={text => setExpectedDeposit(text)}
              onFocus={() => setIsVisible(false)}
              theme={{
                colors: {
                  // placeholder: "white",
                  // text: "white",
                  primary: "rgba(0,191,255, .9)",
                  underlineColor: "transparent",
                  backgroundColor: "rgba(245,245,245, 0.2)",
                  borderColor: "#ffffff",
                  borderStyle: "solid",
                  borderWidth: 0.5
                }
              }}
            />
            {/* <View style={styles.searchSection}> */}
            {/* <MaterialIcons style={styles.searchIcon} name="calendar-month-outline" color="#FF6347" size={20} /> */}
            {/* <Icon style={styles.searchIcon} name="ios-search" size={20} color="#000"/> */}
            <TextInput
              testID="availableFrom"
              mode="outlined"
              // editable={false}
              style={styles.inputContainerStyle}
              label="Available From *"
              placeholder="Available From *"
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
                  backgroundColor: "rgba(245,245,245, 0.2)"
                }
              }}
            />
            {/* </View> */}
            {props.propertyDetails && props.propertyDetails.propertyType === "Residential" ? (
              <View>
                <Text>Preferred Tenants*</Text>
                <View style={styles.propSubSection}>
                  <CustomButtonGroup
                    buttons={preferredTenantsOption}
                    accessibilityLabelId="preferred_tenants"
                    selectedIndices={[preferredTenantsOption.findIndex(option => option.text === preferredTenant)]}
                    isMultiSelect={false}
                    buttonStyle={{ backgroundColor: '#fff' }}
                    selectedButtonStyle={{ backgroundColor: 'rgba(0, 163, 108, .2)' }}
                    buttonTextStyle={{ color: '#000' }}
                    selectedButtonTextStyle={{ color: '#000' }}
                    onButtonPress={(index, button) => {
                      console.log(`Button pressed: ${button.text} (Index: ${index})`);
                      setPreferredTenant(button.text);
                      // Query update is handled by useEffect after state change
                    }}
                    width={95}
                  />
                  {/* <ButtonGroup
                    selectedBackgroundColor="rgba(27, 106, 158, 0.85)"
                    onPress={selectedPreferredTenantsIndex}
                    selectedIndex={preferredTenantsIndex}
                    buttons={preferredTenantsArray}
                    // containerStyle={{ height: 30 }}
                    textStyle={{ textAlign: "center" }}
                    selectedTextStyle={{ color: "#fff" }}
                    containerStyle={{ borderRadius: 10, width: 300 }}
                    containerBorderRadius={10}
                  /> */}
                </View>
                <Text>Nonveg Allowed*</Text>
                <View style={styles.propSubSection}>
                <CustomButtonGroup
                    buttons={nonvegAllowedOption}
                    accessibilityLabelId="non_veg_allowed"
                    selectedIndices={[nonvegAllowedOption.findIndex(option => option.text === nonvegAllowed)]}
                    isMultiSelect={false}
                    buttonStyle={{ backgroundColor: '#fff' }}
                    selectedButtonStyle={{ backgroundColor: 'rgba(0, 163, 108, .2)' }}
                    buttonTextStyle={{ color: '#000' }}
                    selectedButtonTextStyle={{ color: '#000' }}
                    onButtonPress={(index, button) => {
                      console.log(`Button pressed: ${button.text} (Index: ${index})`);
                      setNonvegAllowed(button.text);
                      // Query update is handled by useEffect after state change
                    }}
                    width={95}
                  />
                  {/* <ButtonGroup
                    selectedBackgroundColor="rgba(27, 106, 158, 0.85)"
                    onPress={selectNonvegAllowedIndex}
                    selectedIndex={nonvegAllowedIndex}
                    buttons={nonvegAllowedArray}
                    // containerStyle={{ height: 30 }}
                    textStyle={{ textAlign: "center" }}
                    selectedTextStyle={{ color: "#fff" }}
                    containerStyle={{ borderRadius: 10, width: 300 }}
                    containerBorderRadius={10}
                  /> */}
                </View>
              </View>
            ) : null}

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
      {/* https://github.com/roto93/react-native-neat-date-picker/tree/main */}
      <DatePicker
        isVisible={visible}
        mode={'single'}
        showSoftInputOnFocus={false}
        initialDate={new Date()}
        minDate={new Date()}
        onCancel={onDismiss}
        onConfirm={onChange}
        dateStringFormat={"dd-mmm-yyyy"}
        confirmButtonTestID="datePickerOk"
  cancelButtonTestID="datePickerCancel"
      />
      <Snackbar
        visible={isVisible}
        textMessage={errorMessage}
        position={"top"}
        actionHandler={() => dismissSnackBar()}
        actionText="OK"
      />
    </SafeAreaView>
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
    marginTop: 15,
    marginBottom: 15
  },
  doubleColSection: {
    flex: 1,
    width: "100%",
    flexDirection: "row",
    marginTop: 5,
    marginBottom: 5
  },
  searchSection: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  searchIcon: {
    padding: 10,
  },
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
)(RentDetailsForm);
