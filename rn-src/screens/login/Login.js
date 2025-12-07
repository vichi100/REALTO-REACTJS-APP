// import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  TextInput,
  Image,
  TouchableOpacity,
  AsyncStorage,
  ImageBackground
} from "react-native";
import Entypo from "react-native-vector-icons/Entypo";
import { setUserMobile, setUserDetails } from "./../../reducers/Action";
import { connect } from "react-redux";
import { LinearGradient } from 'expo-linear-gradient';

const Login = props => {
  const { navigation } = props;
  const [mobileNumber, setMobileNumber] = useState("");

  const setMobileNumberX = (text) => {
    setMobileNumber(text)
  }


  // useEffect(() => {
  //   // console.log("Login");
  //   // const userDetails = getUserDetails().then(// console.log(userDetails));
  //   // console.log("userDetails1: " + JSON.stringify(props.userDetails));
  //   if (props.userDetails !== null) {
  //     // props.setUserDetails(userDetails);
  //     // console.log("Login useffect: " + JSON.stringify(props.userDetails));
  //     navigation.navigate("BottomTabScreen");
  //   } else {
  //     getUserDetails();
  //   }
  // }, [props.userDetails]);

  // const getUserDetails = async () => {
  //   // AsyncStorage.setItem("agent_details", JSON.stringify(agentDetails));

  //   // AsyncStorage.clear();
  //   // userDetailsStr: { "user_details": { "user_type": "agent", "id": "15476a82-997a-4bef-bf1b-b1236f6c177e", "expo_token": null, "name": null, "company_name": null, "mobile": "9833097595", "address": null, "city": null, "access_rights": "all", "works_for": ["15476a82-997a-4bef-bf1b-b1236f6c177e"] } }

  //   const userDetailsStr = await AsyncStorage.getItem("user_details");
  //   // console.log("userDetailsStr: " + userDetailsStr);
  //   if (userDetailsStr !== null) {
  //     props.setUserDetails(JSON.parse(userDetailsStr));
  //   }
  // };

  const onSkip = () => {
    navigation.navigate("BottomTabScreen");
  };

  const onNext = () => {
    // console.log(mobileNumber);
    props.setUserMobile(mobileNumber);
    navigation.navigate("OtpScreen", {
      needToEnterOTP: true
    });
  };

  return (
    // ../../assets/images/rbg.jpeg
    <View style={{ flex: 1, backgroundColor: "#ffffff" }}>

      <ImageBackground source={require("../../../assets/images/rbg.jpeg")} resizeMode="cover" style={{
        flex: 1,
      }}>
        <LinearGradient
          // Background Linear Gradient
          colors={['rgba(0,0,0,0.8)', 'transparent']}
          style={styles.background}
        />
        <View
          style={{
            flex: 1,
            // width: "100%",
            marginTop: "20%",
            marginLeft: 30,
            marginRight: 30,
            justifyContent: "center",
            alignItems: "center"
          }}
        >

          <Image
            style={{ width: 200, height: 200 }}
            source={require("../../../assets/images/logo.png")}
          />
          <View>
            <Text style={{
              // borderWidth: 1, // size/width of the border
              // borderColor: "lightgrey", // color of the border
              paddingLeft: 10,
              width: "80%",
              height: 45,
              color: "#ffffff",
              fontWeight: "500",
              // borderRadius: 5
              fontSize: 18
            }}>Supercharge Your Property Broking</Text>
          </View>


          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
              // marginTop: 20
              marginBottom: "55%"
            }}
          >

            <TextInput
              testID="mobileInput"  // Add this
              style={{
                borderWidth: 1, // size/width of the border
                borderColor: "lightgrey", // color of the border
                paddingLeft: 10,
                width: "80%",
                height: 45,
                color: "#ffffff",
                // fontWeight: "800",
                // borderRadius: 5
                fontSize: 16
              }}
              onChangeText={text => setMobileNumberX(text)}
              placeholder="Enter Mobile Number"
              textAlign={'center'}
              keyboardType={'numeric'}
              returnKeyType={'done'}
              placeholderTextColor={'#DCDCDC'}
              placeholderStyle={{ fontSize: 16 }}
            // value={mobileNumber.length === 0 ? "+91-": mobileNumber}
            />
            <TouchableOpacity
              accessibilityLabel="controller_play_login_icon"
              testID="controller_play_login_icon"  // Add this line
              onPress={() => onNext()}
              style={{
                padding: 5,
                paddingTop: 15,
                // width: 200,
                // justifyContent: "flex-end",
                // flexDirection: "row",
                // backgroundColor: "rgba(60,179,113, .9)",
                left: 0
              }}
            >
              {/* <Text style={{ padding: 5, textAlign: "center" }}>NEXT</Text> */}
              <Entypo
                name="controller-play"
                color={"#ffffff"}
                size={50}
              // color={"rgba(60,179,113, .9)"}
              />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          style={{
            position: "absolute",
            bottom: 10,
            right: 10,
            margin: 20
            // backgroundColor: "rgba(60,179,113, .9)"
          }}
          onPress={() => onSkip()}
        >
          <Text
            style={{ color: "#fff" }}
          >
            Skip
          </Text>
        </TouchableOpacity>
      </ImageBackground>

    </View>

  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'orange',
  },
  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: '100%',
    flex: 1
  },
  button: {
    padding: 15,
    alignItems: 'center',
    borderRadius: 5,
  },
  text: {
    backgroundColor: 'transparent',
    fontSize: 15,
    color: '#fff',
  },
});

const mapStateToProps = state => ({
  userMobileNumber: state.AppReducer.userMobileNumber,
  userDetails: state.AppReducer.userDetails
});
const mapDispatchToProps = {
  setUserMobile,
  setUserDetails
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Login);

// export default Login;
