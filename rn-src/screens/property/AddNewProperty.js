import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Image,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  AsyncStorage,
  StatusBar
} from "react-native";
import { TextInput, HelperText, useTheme } from "react-native-paper";
import { connect } from "react-redux";
import Button from "./../../components/Button";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Snackbar from "./../../components/SnackbarComponent";
import { setPropertyType, setPropertyDetails } from "./../../reducers/Action";
import CustomButtonGroup from "./../../components/CustomButtonGroup";


const selectedPropTypeOption = [
  { text: 'Residential' },
  { text: 'Commercial' },
];

const propertyForOption = [
  { text: 'Rent' },
  { text: 'Sell' },
];

const propertyForArray = ["Rent", "Sell"];

const AddNewProperty = props => {
  const { navigation } = props;
  const [propertyForIndex, setPropertyForIndex] = useState(-1);
  // const [selectedPropType, setSelectedPropType] = useState(null);
  const [ownerName, setOwnerName] = useState("");
  const [ownerMobile, setOwnerMobile] = useState("");
  const [ownerAddress, setOwnerAddress] = useState("");

  const [errorMessage, setErrorMessage] = useState("");
  const [isVisible, setIsVisible] = useState(false);

  const [selectedPropType, setSelectedPropType] = useState("Residential");
  const [propertyFor, setPropertyFor] = useState("Rent");



  const dismissSnackBar = () => {
    setIsVisible(false);
  };

  const onSubmit = () => {
    // console.log("-1");
    if (ownerName.trim() === "") {
      setErrorMessage("Owner name is missing");
      setIsVisible(true);
      return;
    } else if (ownerMobile.trim() === "") {
      setErrorMessage("Owner mobile is missing");
      setIsVisible(true);
      return;
    }
    console.log("props.userDetails: " + JSON.stringify(props.userDetails));
    const property = {
      // agent_id: props.userDetails.works_for,
      property_type: selectedPropType,
      property_for: propertyFor,
      property_status: "open",
      owner_details: {
        name: ownerName.trim(),
        mobile1: ownerMobile.trim(),
        mobile2: ownerMobile.trim(),
        address: ownerAddress.trim()
      }
    };
    // console.log(property);
    // AsyncStorage.setItem("property", JSON.stringify(property));
    // // console.log("1");
    props.setPropertyDetails(property);
    navigation.navigate("LocalityDetailsForm");
  };

  return (
    <View
      style={{ flex: 1, backgroundColor: "rgba(254,254,250, 0.1)" }}
    >
      <KeyboardAwareScrollView onPress={Keyboard.dismiss}>
        <ScrollView style={styles.container}>
          <View style={styles.header}>
            <Text>Select Property Type</Text>
          </View>
          <View style={styles.propSection}>
            <CustomButtonGroup
              buttons={selectedPropTypeOption}
              accessibilityLabelId="property_type"
              selectedIndices={[selectedPropTypeOption.findIndex(option => option.text === selectedPropType)]}
              isMultiSelect={false}
              buttonStyle={{ backgroundColor: '#fff' }}
              selectedButtonStyle={{ backgroundColor: 'rgba(0, 163, 108, .2)' }}
              buttonTextStyle={{ color: '#000' }}
              selectedButtonTextStyle={{ color: '#000' }}
              onButtonPress={(index, button) => {
                console.log(`Button pressed: ${button.text} (Index: ${index})`);
                setSelectedPropType(button.text);
                // Query update is handled by useEffect after state change
              }}
            />

          </View>
          <View style={{ marginTop: 20 }}>
            <Text>Select Property For</Text>
          </View>
          <View
            style={[{ marginBottom: 10, marginTop: 15 }]}
          >
            {/* <Text>Select Property For</Text> */}
            <CustomButtonGroup
              buttons={propertyForOption}
              accessibilityLabelId="property_for"
              selectedIndices={[propertyForOption.findIndex(option => option.text === propertyFor)]}
              isMultiSelect={false}
              buttonStyle={{ backgroundColor: '#fff' }}
              selectedButtonStyle={{ backgroundColor: 'rgba(0, 163, 108, .2)' }}
              buttonTextStyle={{ color: '#000' }}
              selectedButtonTextStyle={{ color: '#000' }}
              onButtonPress={(index, button) => {
                console.log(`Button pressed: ${button.text} (Index: ${index})`);
                setPropertyFor(button.text);
                // Query update is handled by useEffect after state change
              }}
            />


          </View>

          <View style={[styles.header, { marginTop: 30 }]}>
            <Text>Owner Details</Text>
          </View>
          <View style={styles.propSection}>
            <TextInput
              testID="ownerNameInput"
              label="Name*"
              value={ownerName}
              // returnKeyType={"done"}
              onChangeText={text => setOwnerName(text)}
              onFocus={() => setIsVisible(false)}
              style={{ backgroundColor: "rgba(245,245,245, 0.1)" }}
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
              testID="ownerMobileInput"
              label="Mobile*"
              value={ownerMobile}
              onChangeText={text => setOwnerMobile(text)}
              onFocus={() => setIsVisible(false)}
              keyboardType={"numeric"}
              returnKeyType={"done"}
              style={{
                backgroundColor: "rgba(245,245,245, 0.1)",
                marginTop: 8
              }}
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
              testID="ownerAddressInput"
              label="Address*"
              value={ownerAddress}
              // returnKeyType={"done"}
              onChangeText={text => setOwnerAddress(text)}
              onFocus={() => setIsVisible(false)}
              style={{
                backgroundColor: "rgba(245,245,245, 0.1)",
                marginTop: 8
              }}
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
            label="Address"
            placeholder="Address"
            value={locality}
            keyboardType={"numeric"}
            returnKeyType={"done"}
            onChangeText={locality => setLocality(locality)}
          /> */}
          </View>
          <View style={{ marginTop: 20 }}>
            <Button title="NEXT" onPress={() => onSubmit()} />
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
    flex: 1,
    marginTop: 30,
    marginLeft: 20,
    marginRight: 20
    // backgroundColor: "rgba(245,245,245, 0.8)"
  },
  header: {
    alignContent: "flex-start"
  },
  propSection: {
    marginTop: 20
  },
  propSubSection: {
    // marginTop: 50,
    marginBottom: 10,
    marginLeft: 10
  },
  inputContainerStyle: {
    margin: 8,
    backgroundColor: "#ffffff"
    // borderColor: "black",
    // borderWidth: 1
  }
  // propSubSection: {
  //   marginTop: 5,
  //   marginBottom: 5
  // },
});

const mapStateToProps = state => ({
  userDetails: state.AppReducer.userDetails,
  propertyDetails: state.AppReducer.propertyDetails,
});
const mapDispatchToProps = {
  setPropertyType,
  setPropertyDetails
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddNewProperty);
// export default AddNewProperty;
