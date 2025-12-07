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
  AsyncStorage
} from "react-native";
import { TextInput, HelperText, useTheme } from "react-native-paper";
import Button from "./../../components/Button";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Snackbar from "./../../components/SnackbarComponent";
import { connect } from "react-redux";
import { setPropertyType, setPropertyDetails, setCustomerDetails } from "./../../reducers/Action";



const options = [
  {
    key: "Residential",
    text: "Residential"
  },
  {
    key: "Commercial",
    text: "Commercial"
  }
];

const propertyForArray = ["Rent", "Sell"];

const AddNewCustomer = props => {
  const { navigation } = props;
  const [propertyForIndex, setPropertyForIndex] = useState(-1);
  const [selectedPropType, setSelectedPropType] = useState(null);
  const [ownerName, setOwnerName] = useState("");
  const [ownerMobile, setOwnerMobile] = useState("");
  const [ownerAddress, setOwnerAddress] = useState("");

  const [errorMessage, setErrorMessage] = useState("");
  const [isVisible, setIsVisible] = useState(false);

  const onSelectPropType = item => {
    // // console.log(item);
    if (selectedPropType && selectedPropType.key === item.key) {
      setSelectedPropType(null);
    } else {
      setSelectedPropType(item);
    }
    setIsVisible(false);
  };

  const selectPropertyForIndex = index => {
    // // console.log(index);
    // // console.log(propertyForArray[index]);
    setPropertyForIndex(index);
    setIsVisible(false);
  };

  const dismissSnackBar = () => {
    setIsVisible(false);
  };

  const onSubmit = () => {
    // console.log("-1");
    // if (selectedPropType === null) {
    //   setErrorMessage("Select Property type missing");
    //   setIsVisible(true);
    //   return;
    // } else if (propertyForIndex === -1) {
    //   setErrorMessage("Select Property for missing");
    //   setIsVisible(true);
    //   return;
    // } else
    if (ownerName.trim() === "") {
      setErrorMessage("Owner name is missing");
      setIsVisible(true);
      return;
    } else if (ownerMobile.trim() === "") {
      setErrorMessage("Owner mobile is missing");
      setIsVisible(true);
      return;
    }
    // console.log("props.userDetails: " + JSON.stringify(props.userDetails));
    const customer = {
      // agent_id: props.userDetails.works_for,
      // property_type: selectedPropType.key,
      // property_for: propertyForArray[propertyForIndex],
      // property_status: "open",
      customer_details: {
        name: ownerName.trim(),
        mobile1: ownerMobile.trim(),
        mobile2: ownerMobile.trim(),
        address: ownerAddress.trim()
      }
    };
    console.log("customer: ", JSON.stringify(customer));
    // AsyncStorage.setItem("customer", JSON.stringify(customer));
    props.setCustomerDetails(customer);
    // // console.log("1");
    navigation.navigate("ContactLocalityDetailsForm");
  };

  return (
    <View
      style={{ flex: 1, backgroundColor: "rgba(254,254,250, 0.1)" }}
    >
      <KeyboardAwareScrollView onPress={Keyboard.dismiss}>
        <ScrollView style={styles.container}>
          <View>
            <Text>
              Add new customer details who is looking to rent or buy a property
            </Text>
          </View>
          {/* <View style={styles.header}>
            <Text>Select Property Type</Text>
          </View>
          <View style={styles.propSection}>
            <RadioButton
              selectedOption={selectedPropType}
              onSelect={onSelectPropType}
              options={options}
            />
          </View>
          <View style={styles.header}>
            <Text>Select Property For</Text>
          </View>
          <View
            style={[styles.propSubSection, { marginBottom: 10, marginTop: 15 }]}
          >
            <Text>Select Property For</Text>
            <ButtonGroup
              selectedBackgroundColor="rgba(27, 106, 158, 0.85)"
              onPress={selectPropertyForIndex}
              selectedIndex={propertyForIndex}
              buttons={propertyForArray}
              // containerStyle={{ height: 30 }}
              textStyle={{ textAlign: "center" }}
              selectedTextStyle={{ color: "#fff" }}
              containerStyle={{
                borderRadius: 10,
                width: 300
                // borderColor: "red"
              }}
              containerBorderRadius={10}
            />
          </View> */}

          <View style={[styles.header, { marginTop: 30 }]}>
            <Text>Customer Details</Text>
          </View>
          <View style={styles.propSection}>
            <TextInput
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

// const mapStateToProps = state => ({
//   userDetails: state.AppReducer.userDetails
// });
// export default connect(
//   mapStateToProps,
//   null
// )(AddNewCustomer);

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
)(AddNewCustomer);

