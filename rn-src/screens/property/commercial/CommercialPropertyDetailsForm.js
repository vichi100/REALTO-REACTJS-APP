import React, { useEffect, useState } from "react";
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
import { TextInput, HelperText, useTheme } from "react-native-paper";
import Button from "./../../../components/Button";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Snackbar from "./../../../components/SnackbarComponent";
import { setPropertyDetails } from "./../../../reducers/Action";
import { connect } from "react-redux";
import { useFocusEffect } from '@react-navigation/native';

import CustomButtonGroup from "./../../../components/CustomButtonGroup";
import * as  AppConstant from "./../../../utils/AppConstant";


const propertyTypeArray = [
  "Shop",
  "Office",
  "Showroom",
  "Godown",
  "Restaurant/Cafe",
  "Pub/Night Club",
  "Clinic",
];
const buildingTypeArray = [
  "Businesses Park ",
  "Mall",
  "StandAlone",
  "Industrial",
  "Shopping Complex",
  "Commersial Complex"
];
const idealForArrayDict = [
  { name: "Shop", checked: false },
  { name: "Bank", checked: false },
  { name: "ATM", checked: false },
  { name: "Restaurant/Cafe", checked: false },
  { name: "Pub/Night Club", checked: false },
  { name: "Office", checked: false },
  { name: "Showroom", checked: false },
  { name: "Godown", checked: false },
  { name: "Clinic", checked: false }
];

const parkingTypeArray = ["Public", "Private", "Both"];
const propertyAgeArray = ["1-5", "6-10", "11-15", "20+"];
const powerBackupkArray = ["Yes", "No"];


const COMMERCIAL_PROPERTY_TYPE_OPTION = [
  { text: 'Shop' },
  { text: 'Office' },
  { text: 'Showroom' },
  { text: ' Restaurant/Cafe' },
  { text: 'Pub/Night Club' },
  { text: 'Clinic' },
  { text: 'Godown' },
];

const PropertyDetails = props => {
  const { navigation } = props;

  
  const [propertySize, setPropertySize] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [idealForSelectArray, setIdealForSelectArray] = useState([]);
  const [idealForArray, setIdealForArray] = useState(idealForArrayDict);

  const [propertyType, setPropertyType] = useState("Shop");
  const [buildingType, setBuildingType] = useState("Mall");
  const [selectIdealForList, setSelectIdealForList] = useState(["Shop"]);
  const [parkingType, setParkingType] = useState("Public");
  const [propertyAge, setPropertyAge] = useState("6-10");
  const [powerBackup, setPowerBackup] = useState("Yes");
  
  
  

  // useFocusEffect(
  //   React.useCallback(() => {
  //     // Do something when the screen is focused
  //     setIdealForSelectArray([]);

  //     return () => {
  //       // Do something when the screen is unfocused
  //       // Useful for cleanup functions
  //       console.log("cleaned up");
  //       setIdealForSelectArray([]);
  //       setIdealForArray([
  //         { name: "Shop", checked: false },
  //         { name: "Bank", checked: false },
  //         { name: "ATM", checked: false },
  //         { name: "Restaurant/Cafe", checked: false },
  //         { name: "Pub/Night Club", checked: false },
  //         { name: "Office", checked: false },
  //         { name: "Showroom", checked: false },
  //         { name: "Godown", checked: false },
  //         { name: "Clinic", checked: false }
  //       ])
  //     };
  //   }, [])
  // );

  // useEffect(() => {
  //   return () => {
  //     console.log("cleaned up");
  //   };
  // }, []);

  const dismissSnackBar = () => {
    setIsVisible(false);
  };



  const onSubmit = async () => {
    
    
    if (propertySize.trim() === "") {
      setErrorMessage("Property size is missing");
      setIsVisible(true);
      return;
    }
    // const property = JSON.parse(await AsyncStorage.getItem("property"));
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
    // // console.log(property);
    // AsyncStorage.setItem("property", JSON.stringify(property));
    props.setPropertyDetails(property);
    // // console.log(property);
    if (propertyFor.toLowerCase() === "Rent".toLowerCase()) {
      navigation.navigate("RentDetailsForm");
    } else if (propertyFor.toLowerCase() === "Sell".toLowerCase()) {
      navigation.navigate("SellDetailsForm");
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
    console.log(`newSelectedIndices: ${newSelectedIndicesPropertyType}`);
    // Query update is handled by useEffect after state change
  }

  const onIdealForSelect = index => {
    // // console.log(index);
    const temp = [...idealForArray];
    // // console.log(temp[index]);
    const tempChecked = temp[index].checked;
    temp[index].checked = !tempChecked;
    // // console.log(temp);
    setIdealForArray(temp);
    if (!tempChecked === true) {
      idealForSelectArray.push(temp[index].name);
    } else {
      var filteredAry = idealForSelectArray.filter(e => e !== temp[index].name);
      setIdealForSelectArray(filteredAry);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "rgba(245,245,245, 0.2)" }}>
      <KeyboardAwareScrollView onPress={Keyboard.dismiss}>
        <ScrollView style={styles.container}>
          <View style={{ paddingTop: 30, marginLeft: 10, marginRight: 0 }}>
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
            

            <Text>Ideal For*(Multi Select)</Text>
            <View style={styles.propSubSection}>

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

            
            </View>

            <Text>Parkings</Text>
            <View style={styles.doubleColSection}>
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
                  console.log(`Button pressed: ${button.text} (Index: ${index})`);
                  setParkingType(button.text);
                  // Query update is handled by useEffect after state change
                }}
              />

              
            </View>
            <Text>Property Age*</Text>
            <View style={styles.propSubSection}>
            
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
                  console.log(`Button pressed: ${button.text} (Index: ${index})`);
                  setPropertyAge(button.text);
                  // Query update is handled by useEffect after state change
                }}
              />
              
            </View>
            <Text>Power Backup*</Text>
            <View style={styles.propSubSection}>
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
                  console.log(`Button pressed: ${button.text} (Index: ${index})`);
                  setPowerBackup(button.text);
                  // Query update is handled by useEffect after state change
                }}
              />

             
            </View>
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

// export default PropertyDetails;
