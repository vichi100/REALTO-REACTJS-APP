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
import { setUserDetails } from "./../../reducers/Action";
import { connect } from "react-redux";
import {SERVER_URL} from "./../../utils/Constant";

import axios from "axios";

const ProfileForm = props => {
  const { navigation } = props;
  const {updateDbCall} = props.route.params;

  const [name, setName] = useState(props.userDetails.name || "");
  const [city, setCity] = useState(props.userDetails.city || "");
  const [company, setCompany] = useState(props.userDetails.company_name || "");
  const [email, setEmail] = useState(props.userDetails.email || "");

  const [errorMessage, setErrorMessage] = useState("");
  const [isVisible, setIsVisible] = useState(false);

  const dismissSnackBar = () => {
    setIsVisible(false);
  };

  React.useEffect(() => {
      const unsubscribe = navigation.addListener('beforeRemove', (e) => {
        // Prevent default back action (optional)
        // e.preventDefault();
  
        // Call your function here
        myBackFunction();
      });
  
      return unsubscribe;
    }, [navigation]);

  const myBackFunction = () => {
    console.log('Back navigation detected!');
    updateDbCall(false); 
    // Do something (e.g., show confirmation, save data)
  };

  const onSubmit = () => {
    if (name.trim() === "") {
      setErrorMessage("Name is missing");
      setIsVisible(true);
      return;
    } else if (city.trim() === "") {
      setErrorMessage("City is missing");
      setIsVisible(true);
      return;
    }
    // // console.log("0");
    const profileDetails = {
      req_user_id: props.userDetails.works_for,
      user_id: props.userDetails.id,
      name: name.trim(),
      company: company.trim(),
      city: city.trim(),
      email: email.trim()
    };
    // // console.log(property);

    updateUserProfile(profileDetails);
  };


  const updateUserProfile = profileDetails => {
    // also update agent employee details 

    axios(SERVER_URL+"/updateUserProfile", {
      method: "post",
      headers: {
        "Content-type": "Application/json",
        Accept: "Application/json"
      },
      data: profileDetails
    }).then(
      response => {
        if (response.data === "success") {
          // AsyncStorage.setItem("property", JSON.stringify(property));
          // console.log("1: " + JSON.stringify(props.userDetails));
          props.userDetails["name"] = profileDetails.name;
          props.userDetails["city"] = profileDetails.city;
          props.userDetails["company_name"] =
            profileDetails.company;
          props.userDetails["email"] = profileDetails.email;
          props.setUserDetails({ ...props.userDetails });

          // updateAsyncStorageData(profileDetails);
          updateDbCall(true); 
          navigation.navigate("Profile");
        }
      },
      error => {
        // console.log(error);
      }
    );
  };

  const updateAsyncStorageData = async profileDetails => {
    const userDetailsDataX = await AsyncStorage.getItem("user_details");
    // console.log("userDetailsDataX: " + userDetailsDataX);
    const userDetailsData = JSON.parse(userDetailsDataX);
    userDetailsData.user_details["name"] = profileDetails.name;
    userDetailsData.user_details["city"] = profileDetails.city;
    userDetailsData.user_details["company_name"] = profileDetails.company;
    userDetailsData.user_details["email"] = profileDetails.email;
    // console.log("userDetailsDataX2: " + JSON.stringify(userDetailsData));
    AsyncStorage.setItem("user_details", JSON.stringify(userDetailsData));
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#ffffff" }}>
      <KeyboardAwareScrollView onPress={Keyboard.dismiss}>
        <ScrollView style={styles.container}>
          {/* <View style={[styles.header, { marginTop: 30 }]}>
            <Text>Update Details</Text>
          </View> */}
          <View style={styles.propSection}>
            <TextInput
              label="Name*"
              value={name}
              // returnKeyType={"done"}
              onChangeText={text => setName(text)}
              onFocus={() => setIsVisible(false)}
              style={{ backgroundColor: "#ffffff" }}
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
              label="City*"
              value={city}
              // returnKeyType={"done"}
              onChangeText={text => setCity(text)}
              onFocus={() => setIsVisible(false)}
              style={{ backgroundColor: "#ffffff", marginTop: 8 }}
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
              label="Company"
              value={company}
              // returnKeyType={"done"}
              onChangeText={text => setCompany(text)}
              onFocus={() => setIsVisible(false)}
              style={{ backgroundColor: "#ffffff", marginTop: 8 }}
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
              label="Email"
              value={email}
              // returnKeyType={"done"}
              onChangeText={text => setEmail(text)}
              onFocus={() => setIsVisible(false)}
              style={{ backgroundColor: "#ffffff", marginTop: 8 }}
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
          </View>
          <View style={{ marginTop: 20 }}>
            <Button title="DONE" onPress={() => onSubmit()} />
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
  userDetails: state.AppReducer.userDetails
});
const mapDispatchToProps = {
  setUserDetails
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProfileForm);

// export default ProfileForm;
