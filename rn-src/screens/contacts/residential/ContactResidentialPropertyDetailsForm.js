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
// ezora
// eza
import { ButtonGroup } from "@rneui/themed";
import { TextInput, HelperText, useTheme } from "react-native-paper";
import Button from "./../../../components/Button";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Snackbar from "./../../../components/SnackbarComponent";
import { connect } from "react-redux";
import { setPropertyType, setPropertyDetails, setCustomerDetails } from "./../../../reducers/Action";
import CustomButtonGroup from "./../../../components/CustomButtonGroup";
import * as  AppConstant from "./../../../utils/AppConstant";




const ContactResidentialPropertyDetailsForm = props => {
  const { navigation } = props;
  
  const [isVisible, setIsVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [houseType, setHouseType] = useState("Apartment");
  const [bhkType, setBHKType] = useState("2BHK");
  // const [washroomNumber, setWashroomNumber] = useState("2");
  const [furnishingStatus, setFurnishingStatus] = useState("Semi");
  // const [parkingNumber, setParkingNumber] = useState("1");
  const [parkingType, setParkingType] = useState("Car");
  // const [propertyAge, setPropertyAge] = useState("6-10");
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
      // property_age: propertyAgeArray[propertyAgeIndex],
      lift: liftOption,
    };

    customer["customer_property_details"] = customer_property_details;
    // // console.log(property);
    // AsyncStorage.setItem("customer", JSON.stringify(customer));
    props.setCustomerDetails(customer);
    // console.log(JSON.stringify(customer));
    if (propertyFor.toLowerCase() === "Rent".toLowerCase()) {
      navigation.navigate("ContactRentDetailsForm");
    } else if (propertyFor.toLowerCase() === "Buy".toLowerCase()) {
      navigation.navigate("ContactBuyResidentialDetailsForm");
    }
  };

  

  return (
    <View
      style={{ flex: 1, backgroundColor: "rgba(245,245,245, 0.2)" }}
    >
      <KeyboardAwareScrollView onPress={Keyboard.dismiss}>
        <ScrollView style={styles.container}>
          <View style={{ paddingTop: 30, marginLeft: 15, marginRight: 0 }}>
            <Text style={{ marginBottom: 30 }}>
              Provide property details of which customer is looking for
            </Text>
            <Text>House Type*</Text>
            <View style={styles.propSubSection}>
              <CustomButtonGroup
                buttons={AppConstant.HOUSE_TYPE_OPTION}
                accessibilityLabelId="house_type"
                selectedIndices={[AppConstant.HOUSE_TYPE_OPTION.findIndex(option => option.text === houseType)]}
                isMultiSelect={false}
                buttonStyle={{ backgroundColor: '#fff' }}
                selectedButtonStyle={{ backgroundColor: 'rgba(0, 163, 108, .2)' }}
                buttonTextStyle={{ color: '#000' }}
                selectedButtonTextStyle={{ color: '#000' }}
                onButtonPress={(index, button) => {
                  console.log(`Button pressed: ${button.text} (Index: ${index})`);
                  setHouseType(button.text);
                  // Query update is handled by useEffect after state change
                }}
              />
              
            </View>
            <Text>Size of BHK*</Text>
            <View style={[styles.propSubSection, { marginTop: 10 }]}>
            <CustomButtonGroup
                buttons={AppConstant.BHK_OPTION}
                accessibilityLabelId="bhk_type"
                selectedIndices={[AppConstant.BHK_OPTION.findIndex(option => option.text === bhkType)]}
                isMultiSelect={false}
                buttonStyle={{ backgroundColor: '#fff' }}
                selectedButtonStyle={{ backgroundColor: 'rgba(0, 163, 108, .2)' }}
                buttonTextStyle={{ color: '#000' }}
                selectedButtonTextStyle={{ color: '#000' }}
                onButtonPress={(index, button) => {
                  console.log(`Button pressed: ${button.text} (Index: ${index})`);
                  setBHKType(button.text);
                  // Query update is handled by useEffect after state change
                }}
              />
              
            </View>

            <Text>Furnishing*</Text>
            <View style={styles.propSubSection}>
            <CustomButtonGroup
                buttons={AppConstant.FURNISHING_STATUS_OPTION}
                accessibilityLabelId="furnishing_status"
                selectedIndices={[AppConstant.FURNISHING_STATUS_OPTION.findIndex(option => option.text === furnishingStatus)]}
                isMultiSelect={false}
                buttonStyle={{ backgroundColor: '#fff' }}
                selectedButtonStyle={{ backgroundColor: 'rgba(0, 163, 108, .2)' }}
                buttonTextStyle={{ color: '#000' }}
                selectedButtonTextStyle={{ color: '#000' }}
                onButtonPress={(index, button) => {
                  console.log(`Button pressed: ${button.text} (Index: ${index})`);
                  setFurnishingStatus(button.text);
                  // Query update is handled by useEffect after state change
                }}
              />

              
            </View>

            <Text>Parkings*</Text>
            <View style={styles.doubleColSection}>
            <CustomButtonGroup
                buttons={AppConstant.PARKING_OPTION}
                accessibilityLabelId="parking_type"
                selectedIndices={[AppConstant.PARKING_OPTION.findIndex(option => option.text === parkingType)]}
                isMultiSelect={false}
                buttonStyle={{ backgroundColor: '#fff' }}
                selectedButtonStyle={{ backgroundColor: 'rgba(0, 163, 108, .2)' }}
                buttonTextStyle={{ color: '#000' }}
                selectedButtonTextStyle={{ color: '#000' }}
                onButtonPress={(index, button) => {
                  console.log(`Button pressed: ${button.text} (Index: ${index})`);
                  setParkingType(button.text);
                  // Query update is handled by useEffect after state change
                }}
              />

            </View>

            <Text>Lift Mandatory*</Text>
            <View style={[styles.propSubSection, {}]}>
            <CustomButtonGroup
                buttons={AppConstant.LIFT_AVAILBLE_OPTION}
                accessibilityLabelId="lift_available"
                selectedIndices={[AppConstant.LIFT_AVAILBLE_OPTION.findIndex(option => option.text === liftOption)]}
                isMultiSelect={false}
                buttonStyle={{ backgroundColor: '#fff' }}
                selectedButtonStyle={{ backgroundColor: 'rgba(0, 163, 108, .2)' }}
                buttonTextStyle={{ color: '#000' }}
                selectedButtonTextStyle={{ color: '#000' }}
                onButtonPress={(index, button) => {
                  console.log(`Button pressed: ${button.text} (Index: ${index})`);
                  setLiftOption(button.text);
                  // Query update is handled by useEffect after state change
                }}
                
              />

            </View>

            <View style={{ marginTop: 15 }}>
              <Button title="NEXT" onPress={() => onSubmit()} />
            </View>
          </View>
        </ScrollView>
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
    flex: 1
    // paddingTop: 50,
    // marginLeft: 20,
    // marginRight: 20
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
)(ContactResidentialPropertyDetailsForm);

// export default ContactResidentialPropertyDetailsForm;
