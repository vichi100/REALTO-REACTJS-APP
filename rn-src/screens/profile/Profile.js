import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  SafeAreaView,
  StyleSheet,
  Modal,
  TouchableHighlight,
  Share,
  Linking,
  AsyncStorage,
  StatusBar,
  ScrollView
} from "react-native";
import {
  // Avatar,
  Title,
  Caption,
  Text,
  TouchableRipple
} from "react-native-paper";
import { Avatar } from "@rneui/themed";
import { connect } from "react-redux";
import Button from "./../../components/Button";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import AntDesign from "react-native-vector-icons/AntDesign";
import { TouchableOpacity } from "react-native-gesture-handler";
import {
  setUserMobile,
  setUserDetails,
  setPropReminderList
} from "./../../reducers/Action";
import axios from "axios";
import { SERVER_URL, EMAIL_PDF_SERVER } from "./../../utils/Constant";
import { EMPLOYEE_ROLE_DELETE } from "./../../utils/AppConstant";
import Home from "../dashboard/Home";
import { useFocusEffect } from '@react-navigation/native';
import { makeCall } from "./../../utils/methods";

// import Share from "react-native-share";

// (base64 asset helper removed; restore/import if needed)

// https://github.com/itzpradip/Food-Finder-React-Native-App/blob/master/screens/EditProfileScreen.js
// https://www.youtube.com/watch?v=mjJzaiGkaQA

const Profile = props => {
  const { navigation } = props;
  const { didDbCall = true } = props.route?.params || {}; // Use optional chaining and fallback

  const [modalVisible, setModalVisible] = useState(false);
  const [dbCall, setDbCall] = useState(didDbCall);
  const [userDetails, setUserDetails] = useState(props.userDetails);
  const [userData, setUserData] = useState(null);


  useEffect(() => {
    // console.log("Profile useEffect: " + JSON.stringify(props.userDetails));
    setUserDetails(props.userDetails);
  }, [props.userDetails]);



  useFocusEffect(
    useCallback(() => {
      // This function will be called when Screen A comes into focus
      // console.log("useFocusEffect")
      if (dbCall) {
        getUserProfileDeatails();

      }

      // Optional: Return a cleanup function if needed
      return () => {
        // This function will be called when Screen A loses focus
        // You can perform cleanup here if necessary
        setDbCall(true); // Set dbCall to false after fetching data
      };
    }, [dbCall]) // Re-run the effect if fetchData function changes (unlikely here)
  );

  // useEffect(() => {
  //   // console.log(JSON.stringify(props.userDetails));
  // }, [props.userDetails]);

  const getUserProfileDeatails = () => {
    //   const reqUserId = obj.req_user_id;
    // const userType = obj.user_type; // agent or employee
    // const mobile = obj.mobile;

    const profileDetails = {
      req_user_id: props.userDetails.id,
      mobile: props.userDetails.mobile,
    };

    axios(SERVER_URL + "/getUserProfileDeatails", {
      method: "post",
      headers: {
        "Content-type": "Application/json",
        Accept: "Application/json"
      },
      data: profileDetails
    }).then(
      response => {
        if (response.status === 200) {
          setUserData(response.data);
          updateDbCall(true);
        }
      },
      error => {
        // console.log(error);
      }
    );
  };

  const updateDbCall = useCallback((value) => {
    // console.log(`Function 'a' in Screen A called with value: ${value}`);
    setDbCall(value); // Update state to show the effect
    // Perform any other actions needed in Screen A
  }, []); // useCallback ensures this function remains stable across re-renders

  const openEditProfile = () => {
    navigation.navigate("ProfileForm", {
      updateDbCall: updateDbCall
    });
  };

  const sendMail = () => {

    try {
      // check if email is available
      const email = props.userDetails.email;
      if (email && email.trim() !== "") {
        // call db to send email
        const profileDetails = {
          // property_id: '17434190437467368827447',
          req_user_id: props.userDetails.id,
          mobile: props.userDetails.mobile,
        };

        axios(EMAIL_PDF_SERVER + "/emailpdf/generate", {
          method: "post",
          headers: {
            "Content-type": "Application/json",
            Accept: "Application/json"
          },
          data: profileDetails
        }).then(
          response => {
            if (response.status === 200) {
              setUserData(response.data);
              updateDbCall(true);
            }
          },
          error => {
            // console.log(error);
          }
        );
      } else if (!email || email.trim() === "") {
        // open profile form to add email
        navigation.navigate("ProfileForm", {
          updateDbCall: updateDbCall
        });
      }
    } catch (error) {
      console.log("Error => ", error);
    }
  }

  // const makeCall = async () => {
  //   const url = "tel://+919833097595";
  //   Linking.openURL(url);
  // };

  const onShare = async () => {
    // https://docs.expo.io/versions/latest/react-native/share/
    try {
      const result = await Share.share({
        message:
          "Realto AI is a real estate app that Supercharge Your Property Broking!",
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const onSubmit = () => {
    navigation.navigate("ManageEmployee");
  };

  const openEmployeeList = () => {
    navigation.navigate("EmployeeList", {
      itemForAddEmplyee: null,
      disableDrawer: false,
      displayCheckBox: false
    });
  };
  const myCustomShare = async () => {
    const shareOptions = {
      message:
        "Order your next meal from FoodFinder App. I've already ordered more than 10 meals on it."
      // url: files.appLogo,
      // urls: [files.image1, files.image2]
    };

    try {
      //   const ShareResponse = await Share.open(shareOptions);
      //   // console.log(JSON.stringify(ShareResponse));
    } catch (error) {
      // console.log("Error => ", error);
    }
  };

  const deleteMe = () => {
    const user = props.userDetails;
    if (user.user_type === "employee") {
      deleteEmployee(user);
    } else if (user.user_type === "agent") {
      deleteAgentAccount(user);
    }
  }


  // delete employee
  const deleteEmployee = (empObj) => {
    const user = {
      req_user_id: props.userDetails.id,
      agent_id: props.userDetails.works_for,
      employee_id: empObj.id
    };
    axios(SERVER_URL + "/deleteEmployee", {
      method: "post",
      headers: {
        "Content-type": "Application/json",
        Accept: "Application/json"
      },
      data: user
    }).then(
      response => {
        // console.log(response.data);
        if (response.data === "success") {
          setModalVisible(false);
          setUserDetails(null);
          // props.userDetails = null
          props.setUserDetails(null);
          navigation.navigate("Login");
        }
      }
    ).catch((error) => {
      if (error.response && error.response.status === 409) {
        // Check for the custom error code
        if (error.response.data.errorCode === "EMPLOYEE_EXISTS") {
          setErrorMessage(error.response.data.message); // Display the error message
          setIsVisible(true);
        }
      } else {
        console.error("Error deleting employee:", error);
        setErrorMessage("An unexpected error occurred. Please try again.");
        setIsVisible(true);
      }
    });

  }

  const deleteAgentAccount = () => {
    const agent = {
      req_user_id: props.userDetails.works_for,
      agent_id: props.userDetails.id
    };
    axios(SERVER_URL + "/deleteAgentAccount", {
      method: "post",
      headers: {
        "Content-type": "Application/json",
        Accept: "Application/json"
      },
      data: agent
    }).then(
      response => {
        if (response.data === "success") {
          // console.log("1: " + JSON.stringify(props.userDetails));
          // props.userDetails["user_status"] = "suspend";
          setUserDetails(null);
          // props.userDetails = null;
          props.setUserDetails(null);
          setModalVisible(!modalVisible);
          navigation.navigate("Login");

        }
      }
    ).catch((error) => {
      if (error.response && error.response.status === 409) {
        // Check for the custom error code
        if (error.response.data.errorCode === "Unauthorized") {
          setErrorMessage(error.response.data.message); // Display the error message
          setIsVisible(true);
        }
      } else {
        console.error("Error deleting user, agent:", error);
        setErrorMessage("An unexpected error occurred. Please try again.");
        setIsVisible(true);
      }
    });;
  };

  const updateAsyncStorageData = async () => {
    const userDetailsDataX = await AsyncStorage.getItem("user_details");
    // console.log("userDetailsDataX: " + userDetailsDataX);
    const userDetailsData = JSON.parse(userDetailsDataX);
    userDetailsData.user_details["user_status"] = "suspend";
    AsyncStorage.setItem("user_details", JSON.stringify(userDetailsData));
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.userInfoSection}>
        <View style={{ flexDirection: "row", marginTop: 15 }}>
          {/* <Avatar.Image
            source={{
              // uri: "https://api.adorable.io/avatars/80/abott@adorable.png"
            }}
            size={80}
          /> */}
          <Avatar
            rounded
            size={80}
            title={
              props.userDetails &&
                props.userDetails.name
                ? props.userDetails.name.slice(0, 1)
                : "Guest".slice(0, 1)
              // item.customer_details.name &&
              // item.customer_details.name.slice(0, 1)
            }
            activeOpacity={0.7}
            titleStyle={{ color: "rgba(105,105,105, .9)" }}
            // source={{
            //   uri: props.item.photo
            // }}
            avatarStyle={{
              borderWidth: 2,
              borderColor: "rgba(127,255,212, .9)",
              // borderTopLeftRadius: 1,
              borderStyle: "solid"
            }}
          />
          <View style={{ marginLeft: 20 }}>
            <Title
              style={[
                styles.title,
                {
                  marginTop: 15,
                  marginBottom: 5
                }
              ]}
            >
              {props.userDetails &&
                props.userDetails.name
                ? props.userDetails.name
                : "Guest"}
            </Title>
            <Caption style={styles.caption}>
              {props.userDetails &&
                props.userDetails.company_name
                ? props.userDetails.company_name
                : "Company"}
            </Caption>
          </View>
        </View>
      </View>

      <View style={styles.userInfoSection}>
        <View style={styles.row}>
          <Icon name="map-marker-radius" color="#777777" size={20} />
          <Text style={{ color: "#777777", marginLeft: 20 }}>
            {props.userDetails &&
              props.userDetails.city
              ? props.userDetails.city
              : "Guest City"}
          </Text>
        </View>
        <View style={styles.row}>
          <Icon name="phone" color="#777777" size={20} />
          <Text style={{ color: "#777777", marginLeft: 20 }}>

            {props.userDetails && props.userDetails.mobile
              ? props.userDetails.mobile
              : "Add Mobile Number"}
          </Text>
        </View>
        {/* <View style={styles.row}>
          <Icon name="email" color="#777777" size={20} />
          <Text style={{ color: "#777777", marginLeft: 20 }}>
            john_doe@email.com
          </Text>
        </View> */}
      </View>
      {props.userDetails &&
        props.userDetails.user_type === "agent" ? (
        <View
          style={{
            flexDirection: "row",
            // flex: 1,
            justifyContent: "space-between",
            marginLeft: 40,
            marginRight: 40,
            marginBottom: 10
          }}
        >
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <Icon name="account-off" color="#777777" size={20} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => openEditProfile()}>
            <Icon name="account-edit" color="#777777" size={20} />
          </TouchableOpacity>
        </View>
      ) : null}

      {props.userDetails &&
        props.userDetails.user_type === "employee" ? (
        <View
          style={{
            flexDirection: "row",
            // flex: 1,
            justifyContent: "space-between",
            marginLeft: 40,
            marginRight: 40,
            marginBottom: 10
          }}
        >
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <Icon name="account-off" color="#777777" size={20} />
          </TouchableOpacity>

        </View>
      ) : null}
      {/* {
      props.userDetails &&
          ((props.userDetails.works_for === props.userDetails.id) ||
            (props.userDetails.user_type === "employee" && EMPLOYEE_ROLE_DELETE.includes(props.userDetails.employee_role)))
      } */}

      {props.userDetails &&
        ((props.userDetails.works_for === props.userDetails.id) ||
          (props.userDetails.user_type === "employee" && EMPLOYEE_ROLE_DELETE.includes(props.userDetails.employee_role))) ? (
        <View style={[{ flexDirection: "column", marginTop: 20 }]}>
          <View
            style={{
              marginTop: 10,
              marginBottom: 10,
              marginLeft: 10,
              marginRight: 10
            }}
          >
            <Button title="MY EMPLOYEE" onPress={() => openEmployeeList()} />
          </View>
        </View>
      ) : (
        <View
          style={{
            borderBottomColor: "rgba(211,211,211, 0.5)",
            borderBottomWidth: 1,
            marginTop: 30,
            marginLeft: 10,
            marginRight: 10
          }}
        />
      )}

      <View style={styles.menuWrapper}>
        <TouchableRipple onPress={() => onShare()}>
          <View style={styles.menuItem}>
            <Icon name="share-outline" color="rgb(183, 113, 229)" size={25} />
            <Text style={styles.menuItemText}>Tell Your Friends</Text>
          </View>
        </TouchableRipple>
        <TouchableRipple onPress={() => makeCall("+919833097595")}>
          <View style={styles.menuItem}>
            <AntDesign name="customerservice" color="#FF6347rgb(103, 174, 110)" size={25} />
            <Text style={styles.menuItemText}>Support</Text>
          </View>
        </TouchableRipple>
        {(props.userDetails &&
          props.userDetails.user_type === "agent") && (props.userDetails &&
            props.userDetails.id === props.userDetails.works_for) ? <TouchableRipple onPress={() => { sendMail() }}>
          <View style={{ flexDirection: "row", alignContent: "center", alignItems: "center", justifyContent: "space-between", marginRight: 15 }}>
            <View style={styles.menuItem}>
              <View style={{ flexDirection: "column", alignItems: "center" }}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Icon name="email-outline" color="rgb(61, 144, 215)" size={25} />
                  <Text style={styles.menuItemText}>Email your data to you</Text>
                </View>
                <Text style={{}}>{userData && userData.email ? userData.email : "email@gmail.com"}</Text>
              </View>

            </View>
            <Text style={{ color: "#0f1a20", marginLeft: 0, fontSize: 16 }}>
              {userData && userData.last_backup_date ? userData.last_backup_date : "29/Feb/2025"}
            </Text>
          </View>
        </TouchableRipple> : null}
        {/* <TouchableRipple onPress={() => { }}>
          <View style={styles.menuItem}>
            <Icon name="settings-outline" color="#FF6347" size={25} />
            <Text style={styles.menuItemText}>Settings</Text>
          </View>
        </TouchableRipple> */}
        <TouchableRipple onPress={() => { }}>
          <View style={styles.menuItem}>
            <MaterialIcons name="local-police" color="rgba(255, 99, 99, .9)" size={25} />
            <Text style={styles.menuItemText}>Privacy Policy</Text>
          </View>
        </TouchableRipple>
      </View>
      <Home />
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          setModalVisible(false);
        }}
      >
        <View style={styles.centeredView1}>
          <View style={styles.modalView}>
            <Text style={{ color: "rgba(255,0,0, .9)", marginBottom: 10, fontSize: 17, fontWeight: "500" }}>
              Do you really want to DELETE your account ?
            </Text>
            <Text style={[styles.modalText, { marginTop: 10, fontSize: 15 }]}>
              Please note once its removed, it can not be recovered.
            </Text>

            <View
              style={{
                position: "absolute",
                flexDirection: "row",
                right: 0,
                bottom: 0,
                // marginTop: 20,
                marginBottom: 20,
                padding: 20
                // justifyContent: "flex-end"
              }}
            >
              <TouchableHighlight
                style={{ ...styles.cancelButton }}
                onPress={() => {
                  setModalVisible(!modalVisible);
                }}
              >
                <Text style={styles.textStyle}>No</Text>
              </TouchableHighlight>
              <TouchableHighlight
                style={{ ...styles.applyButton }}
                onPress={() => {
                  deleteMe();
                }}
              >
                <Text style={styles.textStyle}>YES, DELETE NOW</Text>
              </TouchableHighlight>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const mapStateToProps = state => ({
  userDetails: state.AppReducer.userDetails
});

const mapDispatchToProps = {
  // setUserMobile,
  setUserDetails,
  // setPropReminderList
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Profile);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    marginTop: StatusBar.currentHeight
  },
  userInfoSection: {
    paddingHorizontal: 30,
    marginBottom: 25
  },
  title: {
    fontSize: 24,
    fontWeight: "bold"
  },
  caption: {
    fontSize: 14,
    lineHeight: 14,
    fontWeight: "500"
  },
  row: {
    flexDirection: "row",
    marginBottom: 10
  },
  infoBoxWrapper: {
    borderBottomColor: "#dddddd",
    borderBottomWidth: 1,
    borderTopColor: "#dddddd",
    borderTopWidth: 1,
    flexDirection: "row",
    height: 100
  },
  infoBox: {
    width: "50%",
    alignItems: "center",
    justifyContent: "center"
  },
  menuWrapper: {
    marginTop: 10
  },
  menuItem: {
    flexDirection: "row",
    paddingVertical: 15,
    paddingHorizontal: 30
  },
  menuItemText: {
    color: "#777777",
    marginLeft: 20,
    fontWeight: "600",
    fontSize: 16,
    lineHeight: 26
  },
  dealChart: {
    marginTop: 10
  },
  componentContainer: {
    // flex: 1,
    marginBottom: 20
  },
  cardContainer: {
    flexDirection: "row",
    margin: (10, 10, 10, 3)
    // width: "90%"
  },
  bar: {
    shadowOpacity: 0.0015 * 5 + 0.18,
    shadowRadius: 0.54 * 1,
    shadowOffset: {
      height: 0.6 * 1
    },
    backgroundColor: "#ffffff"
    // width: "90%"
    // marginLeft: 15,
    // marginRight: 15
  },
  barHeader: {
    fontSize: 16,
    fontWeight: "600",
    alignContent: "center",
    padding: 5,
    width: "100%",
    textAlign: "center"
  },
  card: {
    padding: 15,
    shadowOpacity: 0.0015 * 5 + 0.18,
    shadowRadius: 0.54 * 5,
    shadowOffset: {
      height: 0.6 * 5
    },
    backgroundColor: "#ffffff"
  },
  cardContent: {
    flexDirection: "row",
    margin: 10
  },
  innerCard: {
    shadowOpacity: 0.0015 * 5 + 0.18,
    shadowRadius: 0.54 * 5,
    shadowOffset: {
      height: 0.6 * 5
    },
    backgroundColor: "#ffffff",
    padding: 20
  },
  cardHeader1: {
    fontSize: 16,
    fontWeight: "600",
    alignContent: "center",
    textAlign: "left"
  },
  cardHeader2: {
    fontSize: 16,
    fontWeight: "600",
    alignContent: "center",
    textAlign: "right"
  },
  text: {
    color: "#101010",
    fontSize: 24,
    fontWeight: "bold",
    margin: 5
  },
  space: {
    margin: 5
  },
  buttonContainer: {
    backgroundColor: "#222",
    borderRadius: 5,
    padding: 10,
    margin: 20
  },
  buttonText: {
    fontSize: 20,
    color: "#fff"
  },
  card: {
    flex: 1,
    justifyContent: "center",
    shadowOpacity: 0.0015 * 5 + 0.18,
    shadowRadius: 0.54 * 5,
    shadowOffset: {
      height: 0.6 * 5
    },
    backgroundColor: "white"
  },
  cardImage: {
    // alignSelf: "stretch",
    marginBottom: 16,
    flex: 1,
    width: "100%",
    height: "auto"
    // justifyContent: "center",
    // alignItems: "stretch"
  },
  headerContainer: {
    flexDirection: "column",
    alignItems: "flex-start",
    paddingRight: 16,
    paddingLeft: 16,
    paddingBottom: 16,
    paddingTop: 16,
    width: "100%",
    backgroundColor: "#ffffff"
  },
  title: {
    fontSize: 16,
    fontWeight: "600"
  },
  subTitle: {
    fontSize: 14,
    fontWeight: "400",
    color: "rgba(255 ,255 ,255 , 0.87)"
  },
  detailsContainer: {
    // borderBottomWidth: 1,
    borderTopColor: "#fff59d",
    borderTopWidth: 1
  },

  details: {
    padding: 10,
    flexDirection: "row",
    justifyContent: "space-between"
  },
  subDetailsTitle: {
    fontSize: 12,
    fontWeight: "400"
  },
  subDetailsValue: {
    fontSize: 14,
    fontWeight: "600"
  },
  verticalLine: {
    height: "100%",
    width: 1,
    backgroundColor: "#909090"
  },
  MainContainer: {
    // flex: 1,
    // justifyContent: "center",
    // alignItems: "center"
  },

  Main_Sliding_Drawer_Container: {
    // flex: 1,
    flexDirection: "row",
    backgroundColor: "#616161",
    height: 67
    // paddingHorizontal: 10
    // justifyContent: "center",
    // alignItems: "center"
  },

  TextStyle: {
    fontSize: 25,
    padding: 10,
    textAlign: "center",
    color: "#FF5722"
  },
  centeredView1: {
    flex: 1,
    justifyContent: "center",
    alignContent: "center",
    marginTop: 22,
    marginBottom: 20
  },
  modalView: {
    margin: 20,
    height: 230,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  applyButton: {
    // backgroundColor: "#F194FF",
    // width: 150,
    // textAlign: "center",
    // borderRadius: 20,
    // paddingLeft: 60,
    // paddingRight: 20,
    // paddingTop: 10,
    // paddingBottom: 10,
    // elevation: 2,
    // marginTop: 20,
    marginLeft: 10,
    marginRight: 10
  },

  cancelButton: {
    // backgroundColor: "#F194FF",
    // width: 150,
    // textAlign: "center",
    // borderRadius: 20,
    // paddingLeft: 55,
    // paddingRight: 20,
    // paddingTop: 10,
    // paddingBottom: 10,
    // elevation: 2,
    // marginTop: 20,
    marginLeft: 10,
    marginRight: 30
  },
  modalText: {
    // marginBottom: 15,
    textAlign: "center"
  }
});
