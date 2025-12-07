import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Platform,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Keyboard,
  Switch
} from "react-native";
import { TextInput, Divider } from "react-native-paper";
import Button from "./../../components/Button";
import { ButtonGroup } from "@rneui/themed";
import Ionicons from "react-native-vector-icons/Ionicons";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Snackbar from "./../../components/SnackbarComponent";
import axios from "axios";
import { setEmployeeList } from "./../../reducers/Action";
import { connect } from "react-redux";
import { SERVER_URL } from "./../../utils/Constant";

const ManageEmployee = props => {
  const { navigation } = props;
  const { empData = {},
    editEmp = false
  } = props.route.params || {};
  const [employeeName, setEmployeeName] = useState("");
  const [employeeMobile, setEmployeeMobile] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isViewEnabled, setIsViewEnabled] = useState(true);
  const [isMasterEnabled, setIsMasterEnabled] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isAddEnabled, setIsAddEnabled] = useState(false);
  const [isAdminEnabled, setIsAdminEnabled] = useState(false);
  const [role, setRole] = useState(empData ? empData.employee_role : "view");

  const [employeeList, setEmployeeList] = useState([]);

  const calculateRole = (view, add, master, admin) => {
    if (admin) {
      return "admin";
    }
    if (master) {
      return "master";
    }
    if (add) {
      return "add";
    }
    if (view) {
      return "view";
    }
    return "view"; // Default role
  };
  
  const toggleViewSwitch = () => {
    const newState = !isViewEnabled;
    setIsViewEnabled(newState);
    const newRole = calculateRole(newState, isAddEnabled, isMasterEnabled, isAdminEnabled);
    setRole(newRole);
    console.log(newRole); // Log the calculated role
  };
  
  const toggleAddSwitch = () => {
    const newState = !isAddEnabled;
    setIsAddEnabled(newState);
    const newRole = calculateRole(isViewEnabled, newState, isMasterEnabled, isAdminEnabled);
    setRole(newRole);
    console.log(newRole); // Log the calculated role
  };
  
  const toggleMasterSwitch = () => {
    const newState = !isMasterEnabled;
    setIsMasterEnabled(newState);
    const newRole = calculateRole(isViewEnabled, isAddEnabled, newState, isAdminEnabled);
    setRole(newRole);
    console.log(newRole); // Log the calculated role
  };
  
  const toggleAdminSwitch = () => {
    const newState = !isAdminEnabled;
    setIsAdminEnabled(newState);
    const newRole = calculateRole(isViewEnabled, isAddEnabled, isMasterEnabled, newState);
    setRole(newRole);
    console.log(newRole); // Log the calculated role
  };
  
  

  const dismissSnackBar = () => {
    setIsVisible(false);
  };

  const onSubmit = () => {
    if (employeeName.trim() === "") {
      setErrorMessage("Employee name is missing");
      setIsVisible(true);
      return;
    } else if (employeeMobile.trim() === "") {
      setErrorMessage("Employee mobile is missing");
      setIsVisible(true);
      return;
    }

  // Ensure default role is "view" if no switches are toggled
  const calculatedRole = calculateRole(isViewEnabled, isAddEnabled, isMasterEnabled, isAdminEnabled);
  const finalRole = calculatedRole || "view"; // Fallback to "view"

    const user = {
      req_user_id: props.userDetails.works_for,// agent_id
      agent_id: props.userDetails.works_for,
      user_type: "employee",
      company_name: props.userDetails.company_name,
      address: props.userDetails.address,
      city: props.userDetails.city,
      emp_name: employeeName.trim(),
      emp_mobile: employeeMobile.trim(),
      employee_role: finalRole
    };
    axios(SERVER_URL + "/addEmployee", {
      method: "post",
      headers: {
        "Content-type": "Application/json",
        Accept: "Application/json"
      },
      data: user
    }).then(
      response => {
        // console.log(response.data);
        if (response.data) {
          const x = [response.data, ...props.employeeList];
          props.setEmployeeList(x);
          navigation.goBack();
          // navigation.navigate("EmployeeList", {
          //   itemForAddEmplyee: null,
          //   disableDrawer: false,
          //   displayCheckBox: false
          // });
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
        console.error("Error adding employee:", error);
        setErrorMessage("An unexpected error occurred. Please try again.");
        setIsVisible(true);
      }
    });
  };

  const updateEmployeeDetails = () => {
    if (employeeName.trim() === "") {
      setErrorMessage("Employee name is missing");
      setIsVisible(true);
      return;
    } else if (employeeMobile.trim() === "") {
      setErrorMessage("Employee mobile is missing");
      setIsVisible(true);
      return;
    }
    const user = {
      req_user_id: props.userDetails.works_for,// agent_id
      agent_id: props.userDetails.works_for,
      emp_id: empData.id,
      emp_name: employeeName.trim(),
      emp_mobile: employeeMobile.trim(),
      employee_role: role
    };
    axios(SERVER_URL + "/updateEmployeeDetails", {
      method: "post",
      headers: {
        "Content-type": "Application/json",
        Accept: "Application/json"
      },
      data: user
    }).then(
      response => {
        // console.log(response.data);
        if (response.data) {
          const x = [response.data, ...props.employeeList];
          props.setEmployeeList(x);
          // navigation.navigate("EmployeeList", {
          //   itemForAddEmplyee: null,
          //   disableDrawer: false,
          //   displayCheckBox: false
          // });
          navigation.goBack();
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
        console.error("Error adding employee:", error);
        setErrorMessage("An unexpected error occurred. Please try again.");
        setIsVisible(true);
      }
    });
  };

  useEffect(() => {
    if (empData && empData.employee_role) {
      switch (empData.employee_role.toLowerCase()) {
        case "admin":
          setIsAdminEnabled(true);
          setIsMasterEnabled(true);
          setIsAddEnabled(true);
          setIsViewEnabled(true);
          break;
        case "master":
          setIsAdminEnabled(false);
          setIsMasterEnabled(true);
          setIsAddEnabled(true);
          setIsViewEnabled(true);
          break;
        case "add":
          setIsAdminEnabled(false);
          setIsMasterEnabled(false);
          setIsAddEnabled(true);
          setIsViewEnabled(true);
          break;
        case "view":
          setIsAdminEnabled(false);
          setIsMasterEnabled(false);
          setIsAddEnabled(false);
          setIsViewEnabled(true);
          break;
        default:
          setIsAdminEnabled(false);
          setIsMasterEnabled(false);
          setIsAddEnabled(false);
          setIsViewEnabled(true); // Default role
          break;
      }
    }
  }, [empData.employee_role]);

  useEffect(() => {
    setEmployeeName(empData.name || ""); // Fallback to an empty string if undefined
    setEmployeeMobile(empData.mobile || ""); // Fallback to an empty string if undefined
    getEmployeeList();
  }, []);

  const getEmployeeList = () => {
    // console.log("user_id: " + JSON.stringify(props.userDetails));
    const user = {
      req_user_id: props.userDetails.works_for,
      user_id: props.userDetails.id
    };
    axios(SERVER_URL + "/getEmployeeList", {
      method: "post",
      headers: {
        "Content-type": "Application/json",
        Accept: "Application/json"
      },
      data: user
    }).then(
      response => {
        // console.log("emp list: " + JSON.stringify(response.data));
        props.setEmployeeList(response.data);
      },
      error => {
        // console.log(error);
      }
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#ffffff" }}>
      <KeyboardAwareScrollView onPress={Keyboard.dismiss}>
        <ScrollView style={styles.container}>
          <View>
            <Text style={{ marginTop: 10, marginBottom: 10, fontSize: 14, fontWeight: 500 }}>
              Add employees so they can have access/edit rights for your
              properties listing, you can any time change any employees rights
            </Text>
            <Divider />

            <TextInput
              label="Employee Name*"
              value={employeeName}
              onChangeText={text => setEmployeeName(text)}
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
              label="Employee Mobile*"
              value={employeeMobile}
              onChangeText={text => setEmployeeMobile(text)}
              onFocus={() => setIsVisible(false)}
              keyboardType={"numeric"}
              returnKeyType={"done"}
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

            <Text style={{ marginTop: 20, marginBottom: 10, fontSize: 14 }}>
              Grant access right
            </Text>
            <View style={{}}>
              <View style={{ flexDirection: "row", marginLeft: 5, flexWrap: "wrap" }}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Text>View</Text>
                  <Switch
                    trackColor={{
                      false: "#767577",
                      true: "rgba(0,250,154, .5)"
                    }}
                    thumbColor={isViewEnabled ? "#ffffff" : "#f4f3f4"}
                    ios_backgroundColor="rgba(211,211,211, .3)"
                    // onValueChange={toggleReadSwitch}
                    value={true} //{isReadEnabled}
                    style={{ transform: [{ scaleX: 0.7 }, { scaleY: 0.7 }] }}
                  />
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginLeft: 30
                  }}
                >
                  <Text>Add</Text>
                  <Switch
                    trackColor={{
                      false: "#767577",
                      true: "rgba(25, 181, 254, .8)"
                    }}
                    thumbColor={isAddEnabled ? "#ffffff" : "#f4f3f4"}
                    ios_backgroundColor="rgba(211,211,211, .3)"
                    onValueChange={toggleAddSwitch}
                    value={isAddEnabled} //{isReadEnabled}
                    style={{ transform: [{ scaleX: 0.7 }, { scaleY: 0.7 }] }}
                    accessibilityLabel="emp_role_add"
                  />
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginLeft: 30
                  }}
                >
                  <Text>Master</Text>
                  <Switch
                    trackColor={{
                      false: "#767577",
                      true: "rgba(249, 105, 14, .6)"
                    }}
                    thumbColor={isMasterEnabled ? "#ffffff" : "#f4f3f4"}
                    ios_backgroundColor="rgba(211,211,211, .3)"
                    onValueChange={toggleMasterSwitch}
                    value={isMasterEnabled}
                    style={{ transform: [{ scaleX: 0.7 }, { scaleY: 0.7 }] }}
                    accessibilityLabel="emp_role_master"
                  />
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    // marginLeft: 30
                  }}
                >
                  <Text>Admin</Text>
                  <Switch
                    trackColor={{
                      false: "#767577",
                      true: "rgba(255, 76, 48, .9)"
                    }}
                    thumbColor={isAdminEnabled ? "#ffffff" : "#f4f3f4"}
                    ios_backgroundColor="rgba(211,211,211, .3)"
                    onValueChange={toggleAdminSwitch}
                    value={isAdminEnabled}
                    style={{ transform: [{ scaleX: 0.7 }, { scaleY: 0.7 }] }}
                    accessibilityLabel="emp_role_admin"
                  />
                </View>
              </View>
              {<Text style={{ marginTop: 10, fontWeight: "normal" }}>
                <Text style={{ color: "", fontWeight: "bold" }}>View:</Text> Enable View will allow employee to see the properties and customers which are assigned to him.
              </Text>}
              {isAddEnabled && <Text style={{ marginTop: 10, fontWeight: "normal" }}>
                <Text style={{ color: "", fontWeight: "bold" }}>Add:</Text> Enable Add will allow employee to add the new properties and and customers. Also will allow employee to see the properties and customers which are assigned to him.
              </Text>}
              {isMasterEnabled && <Text style={{ marginTop: 10, fontWeight: "normal" }}>
                <Text style={{ color: "red", fontWeight: "bold" }}>Warning:</Text> Enable Master will allow employee to see all the properties, customer and Employees details. Also will allow add the new properties and and customers
              </Text>}
              {isAdminEnabled && <Text style={{ marginTop: 10, fontWeight: "normal" }}>
                <Text style={{ color: "red", fontWeight: "bold" }}>Warning:</Text> Enable Admin will allow employee to see and delete all the properties, customers and Employee.
              </Text>}
            </View>

            <View
              style={{
                marginTop: 20,
                marginBottom: 20
                // marginLeft: 10,
                // marginRight: 10
              }}
            >
              {!editEmp ? (
                <Button
                  title="ADD"
                  onPress={() => onSubmit()}
                  accessibilityLabel="manage_employee_add_button"
                  testID="manage_employee_add_button"
                />
              ) : (
                <Button
                  title="UPDATE"
                  onPress={() => updateEmployeeDetails()}
                  accessibilityLabel="manage_employee_update_button"
                  testID="manage_employee_update_button"
                />
              )}
            </View>
          </View>
          {/* Property releted reminder list */}

          {/* <EmployeeList employeeList={props.employeeList} /> */}
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
    // padding: 10,
    marginTop: 20,
    marginLeft: 20,
    marginRight: 20
    // justifyContent: "center",
    // alignItems: "center",
    // backgroundColor: "#ffffff"
  },
  inputContainerStyle: {
    margin: 8
  },
  separator: {
    width: "80%",
    height: 1,
    borderWidth: 1
  },
  verticalLine: {
    height: "100%",
    width: 2,
    backgroundColor: "#ffffff"
  }
});

// export default ManageEmployee;

const mapStateToProps = state => ({
  employeeList: state.AppReducer.employeeList,
  userDetails: state.AppReducer.userDetails
});
const mapDispatchToProps = {
  setEmployeeList
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ManageEmployee);
