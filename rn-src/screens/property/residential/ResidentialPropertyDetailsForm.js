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
import { setPropertyDetails } from "./../../../reducers/Action";
import { connect } from "react-redux";
import CustomButtonGroup from "./../../../components/CustomButtonGroup";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import * as  AppConstant from "./../../../utils/AppConstant";


// const houseTypeArray = ["Apartment", "Villa", "Independent House"];
// const bhkArray = ["1RK", "1BHK", "2BHK", "3BHK", "4+BHK"];
// const washroomArray = ["1", "2", "3", "4", "4+"];
// const furnishingStatusArray = ["Full", "Semi", "Empty"];
// const parkingNumberArray = ["1", "2", "3", "4", "4+"];
// const parkingTypeArray = ["Car", "Bike"];
// const propertyAgeArray = ["1-5", "6-10", "11-15", "20+"];
// const liftArray = ["Yes", "No"];

const houseTypeOption = [
  { text: 'Apartment' },
  { text: 'Villa' },
  { text: 'Independent House' },
];

const bhkOption = [
  { text: '1RK' },
  { text: '1BHK' },
  { text: '2BHK' },
  { text: '3BHK' },
  { text: '4+BHK' },
];

const washroomOption = [
  { text: '1' },
  { text: '2' },
  { text: '3' },
  { text: '4' },
  { text: '4+' },
];

const furnishingStatusOption = [
  { text: 'Full' },
  { text: 'Semi' },
  { text: 'Empty' },
];

const parkingNumberOption = [
  { text: '1' },
  { text: '2' },
  { text: '3' },
  { text: '4' },
  { text: '4+' },
];

const parkingTypeOption = [
  { text: 'Car' },
  { text: 'Bike' },
];

const propertyAgeOption = [
  { text: '1-5' },
  { text: '6-10' },
  { text: '11-15' },
  { text: '20+' },
];

const liftAvailbleOption = [
  { text: 'Yes' },
  { text: 'No' },
];


const ResidentialPropertyDetailsForm = props => {
  const { navigation } = props;

  const [floor, setFloor] = useState("");
  const [totalFloor, setTotalFloor] = useState("");
  // const [liftIndex, setLiftIndex] = useState(-1);
  const [propertySize, setPropertySize] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");


  const [houseType, setHouseType] = useState("Apartment");
  const [bhkType, setBHKType] = useState("2BHK");
  const [washroomNumber, setWashroomNumber] = useState("2");
  const [furnishingStatus, setFurnishingStatus] = useState("Semi");
  const [parkingNumber, setParkingNumber] = useState("1");
  const [parkingType, setParkingType] = useState("Car");
  const [propertyAge, setPropertyAge] = useState("6-10");
  const [liftOption, setLiftOption] = useState("Yes");
  
  






  const dismissSnackBar = () => {
    setIsVisible(false);
  };

  const onSubmit = async () => {
    
    if (floor.trim() === "") {
      setErrorMessage("Floor is missing");
      setIsVisible(true);
      return;
    } else if (totalFloor.trim() === "") {
      setErrorMessage("Total floors is missing");
      setIsVisible(true);
      return;
    } 
    
    if (propertySize.trim() === "") {
      setErrorMessage("Property size is missing");
      setIsVisible(true);
      return;
    }
    // const property = JSON.parse(await AsyncStorage.getItem("property"));
    const property = props.propertyDetails;
    const propertyFor = property.property_for;

    const property_details = {
      house_type: houseType,
      bhk_type: bhkType,
      washroom_numbers: washroomNumber,
      furnishing_status: furnishingStatus,
      parking_type: parkingType,
      parking_number: parkingNumber,
      property_age: propertyAge,
      floor_number: floor,
      total_floor: totalFloor,
      lift: liftOption,
      property_size: propertySize
    };

    property["property_details"] = property_details;
    // // console.log(property);
    // AsyncStorage.setItem("property", JSON.stringify(property));
    props.setPropertyDetails(property);
    // console.log(JSON.stringify(property));
    if (propertyFor.toLowerCase() === "Rent".toLowerCase()) {
      navigation.navigate("RentDetailsForm");
    } else if (propertyFor.toLowerCase() === "Sell".toLowerCase()) {
      navigation.navigate("SellDetailsForm");
    }
  };

  return (
    <View
      style={{ flex: 1, backgroundColor: "rgba(245,245,245, 0.2)" }}
    >
      <KeyboardAwareScrollView style={styles.container} onPress={Keyboard.dismiss} testID="scrollView">
        {/* <ScrollView style={styles.container} testID="scrollView"> */}
          <View style={{ paddingTop: 30, padding: 10 }}>
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
            <View style={styles.propSubSection}>

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

            <Text>How many wash rooms*</Text>
            <View style={styles.propSubSection}>

              <CustomButtonGroup
                buttons={washroomOption}
                accessibilityLabelId="washroom_number"
                selectedIndices={[washroomOption.findIndex(option => option.text === washroomNumber)]}
                isMultiSelect={false}
                buttonStyle={{ backgroundColor: '#fff' }}
                selectedButtonStyle={{ backgroundColor: 'rgba(0, 163, 108, .2)' }}
                buttonTextStyle={{ color: '#000' }}
                selectedButtonTextStyle={{ color: '#000' }}
                onButtonPress={(index, button) => {
                  console.log(`Button pressed: ${button.text} (Index: ${index})`);
                  setWashroomNumber(button.text);
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
            <View style={styles.propSubSection}>
              <CustomButtonGroup
                buttons={parkingNumberOption}
                accessibilityLabelId="parking_number"
                selectedIndices={[parkingNumberOption.findIndex(option => option.text === parkingNumber)]}
                isMultiSelect={false}
                buttonStyle={{ backgroundColor: '#fff' }}
                selectedButtonStyle={{ backgroundColor: 'rgba(0, 163, 108, .2)' }}
                buttonTextStyle={{ color: '#000' }}
                selectedButtonTextStyle={{ color: '#000' }}
                onButtonPress={(index, button) => {
                  console.log(`Button pressed: ${button.text} (Index: ${index})`);
                  setParkingNumber(button.text);
                  // Query update is handled by useEffect after state change
                }}
              />

              

              <View style={{marginLeft: 20, marginTop:15, flexDirection: 'row', alignItems: 'center'}}>
                <View>
                
                <MaterialIcons name="directions-car" color={"#000"} size={26} />

                <MaterialIcons name="directions-bike" color={"#000"} size={26} />
                </View>
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

              
            </View>
            <Text>Property Age*</Text>
            <View style={styles.propSubSection}>
            <CustomButtonGroup
                buttons={propertyAgeOption}
                accessibilityLabelId="property_age"
                selectedIndices={[propertyAgeOption.findIndex(option => option.text === propertyAge)]}
                isMultiSelect={false}
                buttonStyle={{ backgroundColor: '#fff' }}
                selectedButtonStyle={{ backgroundColor: 'rgba(0, 163, 108, .2)' }}
                buttonTextStyle={{ color: '#000' }}
                selectedButtonTextStyle={{ color: '#000' }}
                onButtonPress={(index, button) => {
                  console.log(`Button pressed: ${button.text} (Index: ${index})`);
                  setPropertyAge(button.text);
                  // Query update is handled by useEffect after state change
                }}
              />
              
            </View>

            <View
              style={[
                styles.doubleColSection,
                { marginBottom: 5, marginTop: 5 }
              ]}
            >
              <TextInput
              testID="floorInput"
                mode="outlined"
                style={[
                  styles.inputContainerStyle,
                  { width: "20%", backgroundColor: "rgba(245,245,245, 0.2)" }
                ]}
                label="Floor*"
                placeholder="Floor"
                value={floor}
                keyboardType={"numeric"}
                returnKeyType={"done"}
                onChangeText={text => setFloor(text)}
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
              testID="totalFloorInput"
                mode="outlined"
                style={[
                  styles.inputContainerStyle,
                  { width: "30%", backgroundColor: "rgba(245,245,245, 0.2)" }
                ]}
                keyboardType={"numeric"}
                returnKeyType={"done"}
                label="Total Floor*"
                placeholder="Total Floor"
                value={totalFloor}
                onChangeText={text => setTotalFloor(text)}
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

              <View style={[styles.propSubSection, { marginLeft: 10 }]}>
                <Text style={{marginBottom:10}}>Lift*</Text>
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
                width={50}
                height={40}
              />
                
              </View>
            </View>

            <TextInput
              testID="propertySizeInput"
              mode="outlined"
              style={styles.inputContainerStyle}
              label="Property Size*"
              keyboardType={"numeric"}
              returnKeyType={"done"}
              placeholder="Property Size"
              value={propertySize}
              onChangeText={text => setPropertySize(text)}
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

            <View style={{ marginTop: 15 }}>
              <Button title="NEXT" onPress={() => onSubmit()} />
            </View>
          </View>
        {/* </ScrollView> */}
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
  propertyDetails: state.AppReducer.propertyDetails,
  userDetails: state.AppReducer.userDetails
});
const mapDispatchToProps = {
  setPropertyDetails
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ResidentialPropertyDetailsForm);

// export default ResidentialPropertyDetailsForm;
