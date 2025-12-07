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
  AsyncStorage,
  FlatList
} from "react-native";
import SegmentedControlTab from "react-native-segmented-control-tab";
// ezora
// eza
import { ButtonGroup, CheckBox } from "@rneui/themed";
import { TextInput, HelperText, useTheme } from "react-native-paper";
import Button from "./../../../components/Button";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Snackbar from "./../../../components/SnackbarComponent";
import { connect } from "react-redux";
import { setPropertyType, setPropertyDetails, setCustomerDetails } from "./../../../reducers/Action";
import CustomButtonGroup from "./../../../components/CustomButtonGroup";
import * as  AppConstant from "./../../../utils/AppConstant";


const propertyTypeArray = [
  "Shop",
  "Office",
  "Showroom",
  "Godown",
  "Restaurant / Cafe",
  "Pub / Night Club"
];
const buildingTypeArray = [
  "Businesses park ",
  "Mall",
  "StandAlone",
  "Industrial",
  "Shopping complex"
];
const idealForArrayDict = [
  { name: "Shop", checked: false },
  { name: "Bank", checked: false },
  { name: "ATM", checked: false },
  { name: "Restaurant/Cafe", checked: false },
  { name: "Pub/Night Club", checked: false },
  { name: "Office", checked: false },
  { name: "Showroom", checked: false },
  { name: "Godown", checked: false }
];

const parkingTypeArray = ["Must", "Doesn't matter"];
const propertyAgeArray = ["1-5", "6-10", "11-15", "20+"];
const powerBackupkArray = ["Yes", "No"];

const CustomerCommercialPropertyDetailsForm = props => {
  const { navigation } = props;

  const [propertyTypeIndex, setHouseTypeIndex] = useState(-1);
  const [buildingIndex, setBuildingIndex] = useState(-1);
  const [parkingTypeIndex, setParkingTypeIndex] = useState(-1);
  const [propertyAgeIndex, setPropertyAgeIndex] = useState(-1);
  const [powerBackupIndex, setPowerBackupIndex] = useState(-1);
  const [propertySize, setPropertySize] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [idealForSelectArray, setIdealForSelectArray] = useState([]);
  const [idealForArray, setIdealForArray] = useState(idealForArrayDict);

  const [propertyType, setPropertyType] = useState("Shop");
  const [buildingType, setBuildingType] = useState("Mall");
  const [selectIdealForList, setSelectIdealForList] = useState(["Shop"]);
  const [parkingRequire, setParkingRequire] = useState("Must");


  const dismissSnackBar = () => {
    setIsVisible(false);
  };

  const onSubmit = async () => {
    if (propertySize.trim()==="") {
      setErrorMessage("Property size is missing");
      setIsVisible(true);
      return;
    } 
    const customer = props.customerDetails;
    const propertyFor = customer.customer_locality.property_for;

    const customer_property_details = {
      property_used_for: propertyType,
      building_type: buildingType,
      // ideal_for: idealForSelectArray,
      parking_type: parkingRequire,
      // property_age: propertyAgeArray[propertyAgeIndex],
      // power_backup: powerBackupkArray[powerBackupIndex],
      property_size: propertySize
    };

    customer["customer_property_details"] = customer_property_details;
    // // console.log(property);
    // AsyncStorage.setItem("customer", JSON.stringify(customer));
    props.setCustomerDetails(customer);
    // // console.log(property);
    if (propertyFor.toLowerCase() === "Rent".toLowerCase()) {
      navigation.navigate("CustomerCommercialRentDetailsForm");
    } else if (propertyFor.toLowerCase() === "Buy".toLowerCase()) {
      navigation.navigate("CustomerCommercialBuyDetailsForm");
    }
  };

  

  return (
    <View style={{ flex: 1, backgroundColor: "rgba(245,245,245, 0.2)" }}>
      <KeyboardAwareScrollView onPress={Keyboard.dismiss}>
        <ScrollView style={styles.container}>
          <View style={{ paddingTop: 30, marginLeft: 20, marginRight: 0 }}>
            <Text>Property Type*</Text>
            <View style={styles.propSubSection}>
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
                  console.log(`Button pressed: ${button.text} (Index: ${index})`);
                  setPropertyType(button.text);
                  // Query update is handled by useEffect after state change
                }}
              />
              
            </View>
            <Text>Building Type*</Text>
            <View style={styles.propSubSection}>

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
                  console.log(`Button pressed: ${button.text} (Index: ${index})`);
                  setBuildingType(button.text);
                  // Query update is handled by useEffect after state change
                }}
              />
              
            </View>

            <Text>Looking For Size In SQFT*</Text>

            <TextInput
              mode="outlined"
              style={styles.inputContainerStyle}
              label="Property Size*"
              keyboardType={"numeric"}
              returnKeyType={"done"}
              placeholder="Property Size"
              value={propertySize}
              // keyboardType={"numeric"}
              onChangeText={text => setPropertySize(text)}
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

            <Text style={{ marginTop: 10 }}>Parkings*</Text>
            <View style={styles.doubleColSection}>
            <CustomButtonGroup
                buttons={AppConstant.PARKING_REQUIRED_OPTION}
                accessibilityLabelId="parking_required"
                selectedIndices={[AppConstant.PARKING_REQUIRED_OPTION.findIndex(option => option.text === parkingRequire)]}
                isMultiSelect={false}
                buttonStyle={{ backgroundColor: '#fff' }}
                selectedButtonStyle={{ backgroundColor: 'rgba(0, 163, 108, .2)' }}
                buttonTextStyle={{ color: '#000' }}
                selectedButtonTextStyle={{ color: '#000' }}
                onButtonPress={(index, button) => {
                  console.log(`Button pressed: ${button.text} (Index: ${index})`);
                  setParkingRequire(button.text);
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
)(CustomerCommercialPropertyDetailsForm);
// export default CustomerCommercialPropertyDetailsForm;
