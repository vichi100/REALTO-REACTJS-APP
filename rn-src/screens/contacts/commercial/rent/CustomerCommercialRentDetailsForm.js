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
import { setPropertyType, setPropertyDetails, setCustomerDetails } from "./../../../../reducers/Action";
import DatePicker, { RangeOutput, SingleOutput } from 'react-native-neat-date-picker';


const preferredTenantsArray = ["Family", "Bachelors", "Any"];
const nonvegAllowedArray = ["Veg", "Non-Veg"];

const CustomerCommercialRentDetailsForm = props => {
  const { navigation } = props;
  const date = new Date();
  const [newDate, setNewDate] = React.useState("");

  const [customerDetailsX, setCustomerDetailsX] = useState(null);
  const [expectedRent, setExpectedRent] = useState("");
  const [expectedDeposit, setExpectedDeposit] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [preferredTenantsIndex, setPreferredTenantsIndex] = useState(-1);
  const [nonvegAllowedIndex, setNonvegAllowedIndex] = useState(-1);
  const [visible, setVisible] = React.useState(false);

  useEffect(() => {
    if (customerDetailsX === null) {
      init();
    }
  }, [customerDetailsX]);

  const init = async () => {
    const customer = JSON.parse(await AsyncStorage.getItem("customer"));
    // console.log("ContactRentDetailsForm customer: " + JSON.stringify(customer));
    setCustomerDetailsX(customer);
  };

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

  const selectedPreferredTenantsIndex = index => {
    setPreferredTenantsIndex(index);
    setIsVisible(false);
  };

  const selectNonvegAllowedIndex = index => {
    setNonvegAllowedIndex(index);
    setIsVisible(false);
  };

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
    } else if (
      customerDetailsX &&
      customerDetailsX.customer_locality.property_type === "Residential" &&
      preferredTenantsIndex === -1
    ) {
      setErrorMessage("Preferred tenants is missing");
      setIsVisible(true);
      return;
    } else if (
      customerDetailsX &&
      customerDetailsX.customer_locality.property_type === "Residential" &&
      nonvegAllowedIndex === -1
    ) {
      setErrorMessage("Nonveg allowed is missing");
      setIsVisible(true);
      return;
    }

    const customer_rent_details = {
      expected_rent: expectedRent,
      expected_deposit: expectedDeposit,
      available_from: newDate.trim(),
      preferred_tenants: preferredTenantsArray[preferredTenantsIndex],
      non_veg_allowed: nonvegAllowedArray[nonvegAllowedIndex]
    };
    // const customer = JSON.parse(await AsyncStorage.getItem("customer"));
    const customer = props.customerDetails;

    customer["customer_rent_details"] = customer_rent_details;

    // AsyncStorage.setItem("customer", JSON.stringify(customer));
    props.setCustomerDetails(customer)
    // console.log(JSON.stringify(customer));

    navigation.navigate("AddNewCustomerCommercialRentFinalDetails");
  };
  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "rgba(245,245,245, 0.2)" }}
    >
      <KeyboardAwareScrollView onPress={Keyboard.dismiss}>
        <ScrollView>
          <View style={styles.container}>
            <TextInput
              mode="outlined"
              keyboardType={"numeric"}
              returnKeyType={"done"}
              style={styles.inputContainerStyle}
              label={
                expectedRent.trim() === ""
                  ? "Max Rent*"
                  : numDifferentiation(expectedRent) + " Max Rent"
              }
              // label="Expected Rent*"
              placeholder="Max Rent"
              value={expectedRent}
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
              mode="outlined"
              style={styles.inputContainerStyle}
              keyboardType={"numeric"}
              returnKeyType={"done"}
              label={
                expectedDeposit.trim() === ""
                  ? "Max Deposit*"
                  : numDifferentiation(expectedDeposit) + " Max Deposit"
              }
              // label="Expected Deposit*"
              placeholder="Max Deposit"
              value={expectedDeposit}
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
                  backgroundColor: "rgba(245,245,245, 0.2)"
                }
              }}
            />
            {customerDetailsX &&
              customerDetailsX.customer_locality.property_type ===
              "Residential" ? (
              <View>
                <Text>Type of Tenants*</Text>
                <View style={styles.propSubSection}>
                  <ButtonGroup
                    selectedBackgroundColor="rgba(27, 106, 158, 0.85)"
                    onPress={selectedPreferredTenantsIndex}
                    selectedIndex={preferredTenantsIndex}
                    buttons={preferredTenantsArray}
                    // containerStyle={{ height: 30 }}
                    textStyle={{ textAlign: "center" }}
                    selectedTextStyle={{ color: "#fff" }}
                    containerStyle={{ borderRadius: 10, width: 300 }}
                    containerBorderRadius={10}
                  />
                </View>
                <Text>Tenants is veg / non veg*</Text>
                <View style={styles.propSubSection}>
                  <ButtonGroup
                    selectedBackgroundColor="rgba(27, 106, 158, 0.85)"
                    onPress={selectNonvegAllowedIndex}
                    selectedIndex={nonvegAllowedIndex}
                    buttons={nonvegAllowedArray}
                    // containerStyle={{ height: 30 }}
                    textStyle={{ textAlign: "center" }}
                    selectedTextStyle={{ color: "#fff" }}
                    containerStyle={{ borderRadius: 10, width: 300 }}
                    containerBorderRadius={10}
                  />
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
)(CustomerCommercialRentDetailsForm);

// export default CustomerCommercialRentDetailsForm;
