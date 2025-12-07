import React, { useState, useRef, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Platform,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  TouchableHighlight,
  Modal,
  Keyboard,
  ActivityIndicator
} from "react-native";
import { connect } from "react-redux";
import { DatePickerModal, TimePickerModal } from "react-native-paper-dates";
import { TextInput, Divider } from "react-native-paper";
import Button from "./../../components/Button";
import { ButtonGroup } from "@rneui/themed";
import AntDesign from "react-native-vector-icons/AntDesign";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Snackbar from "./../../components/SnackbarComponent";
import axios from "axios";
import { dateFormat } from "./../../utils/methods";
import {
  setUserMobile,
  setUserDetails,
  setPropReminderList,
  setPropListForMeeting,
  setCustomerDetailsForMeeting
} from "./../../reducers/Action";
import PropertyReminder from '../property/PropertyReminder';
import { SERVER_URL } from "./../../utils/Constant";
import DatePicker, { RangeOutput, SingleOutput } from 'react-native-neat-date-picker';
import * as  AppConstant from "./../../utils/AppConstant";
import CustomButtonGroup from "./../../components/CustomButtonGroup"; // Assuming you have a CustomButtonGroup component


const reminderForArray = ["Call", "Meeting", "Property Visit"];
const ampmArray = ["AM", "PM"];


// This from property list when click on meeting/clock icon

const Meeting = props => {
  const { navigation } = props;
  const item = props.route.params.item; // property item
  const category = props.route.params.category;
  // console.log("route.params: " + JSON.stringify(props.route.params));
  const inputRef = useRef(null);
  // // console.log(item);
  const date = new Date();
  const [newDate, setNewDate] = React.useState("");
  const [newTime, setNewTime] = React.useState("");
  const [clientName, setClientName] = useState("");
  const [clientMobile, setClientMobile] = useState("");
  const [clientId, setClientId] = useState("");
  const [reminderForIndex, setReminderForIndex] = React.useState(-1);
  const [isVisible, setIsVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [hour, setHour] = useState(null);
  const [minutes, setMinutes] = useState(null);
  const [ampmIndex, setAMPMIndex] = useState(-1);
  const [propertyIdX, setPropertyIdX] = useState(item.property_id);
  const [loading, setLoading] = useState(false);
  const [reminderListX, setReminderListX] = useState([]);

  const [remiderType, setReminderType] = useState("Call");


  const clearState = () => {
    setNewDate("");
    setNewTime("");
    setClientName("");
    setClientMobile("");
    setReminderForIndex(-1);
    setHour(null);
    setMinutes(null);
    setAMPMIndex(-1);
    props.setCustomerDetailsForMeeting(null);
  };
  useEffect(() => {
    // console.log("useEffect in Meeting propertyIdX:  ", propertyIdX);
    setClientName("");
    setClientMobile("");
    setClientId("");
  }, []);

  useEffect(() => {
    // console.log("useEffect", props.customerDetailsForMeeting);
    if (props.customerDetailsForMeeting) {
      setClientName(props.customerDetailsForMeeting.name);
      setClientMobile(props.customerDetailsForMeeting.mobile);
      setClientId(props.customerDetailsForMeeting.customer_id);
    }
  }, [props.customerDetailsForMeeting]);

  const setModalVisibleTemp = flag => {
    // // console.log("setModalVisible: " + flag);
    setModalVisible(flag);
  };
  const setModalVisibleTemp1 = flag => {
    // // console.log("setModalVisible1: " + flag);
    setModalVisible(flag);
    inputRef.current.blur();
  };

  const checkHourValidation = hour => {
    setIsVisible(false);
    if (parseInt(hour) > 24 || parseInt(hour) < 0) {
      setErrorMessage("Hours can between 0 to 24 only");
      setHour(hour);
      setIsVisible(true);
      return;
    }
    setHour(hour);
  };

  const checkMinutesValidation = minutes => {
    setIsVisible(false);
    if (parseInt(minutes) > 59 || parseInt(minutes) < 0) {
      setErrorMessage("Minutes can between 0 to 59 only");
      setMinutes(minutes);
      setIsVisible(true);
      return;
    }
    setMinutes(minutes);
  };

  const selectReminderForIndex = index => {
    setReminderForIndex(index);
    setIsVisible(false);
  };

  const dismissSnackBar = () => {
    setIsVisible(false);
  };

  const [visible, setVisible] = React.useState(false);
  const onDismiss = React.useCallback(() => {
    // // console.log("date");
    setVisible(false);
    setIsVisible(false);
    Keyboard.dismiss();
  }, [setVisible]);

  const onChange = React.useCallback(({ date }) => {
    setVisible(false);
    setIsVisible(false);
    // const x = date.toString().split("00:00");
    // setNewDate(x[0]);
    const x = dateFormat(date.toString());
    setNewDate(x);
    Keyboard.dismiss();
    // // console.log(new Date(date).getDay());
    // // console.log(date.toString());
  }, []);

  const [timeVisible, setTimeVisible] = React.useState(false);
  const onDismissTimePicker = React.useCallback(() => {
    setTimeVisible(false);
    // setIsVisible(false);
  }, [setTimeVisible]);

  const onConfirmTimePicker = React.useCallback(
    ({ hours, minutes }) => {
      setTimeVisible(false);
      // setIsVisible(false);
      // console.log({ hours, minutes });
      setNewTime(hours + ":" + minutes);
    },
    [setTimeVisible]
  );

  const selectAMPMIndex = index => {
    // console.log(index);
    setAMPMIndex(index);
  };

  const onApply = () => {
    // console.log();
    if (ampmIndex === -1) {
      setErrorMessage("AM / PM is missing");
      setIsVisible(true);
      return;
    }
    const timeX = hour + ":" + minutes + " " + ampmArray[ampmIndex];
    inputRef.current.blur();
    setNewTime(timeX);
    setModalVisibleTemp(false);
    inputRef.current.blur();
    // refs.timeInput.blur();
  };

  const onSubmit = () => {
    if (clientName.trim() === "") {
      setErrorMessage("Client name is missing");
      setIsVisible(true);
      return;
    } else if (clientMobile.trim() === "") {
      setErrorMessage("Client mobile is missing");
      setIsVisible(true);
      return;
    } else if (newDate.trim() === "") {
      setErrorMessage("Date is missing");
      setIsVisible(true);
      return;
    }
    // else if (newTime.trim() === "") {
    //   setErrorMessage("Time is missing");
    //   setIsVisible(true);
    //   return;
    // }
    // navigation.navigate("AddImages");
    send();
  };

  const send = () => {
    try {


      // console.log("item: " + JSON.stringify(item));

      const reminderDetails = {
        req_user_id: props.userDetails.works_for,// agent_id
        meeting_creator_id: props.userDetails.id,// user id
        agent_id_of_client: props.customerDetailsForMeeting.agent_id,
        category: category,
        category_ids: [item.property_id],
        category_type: item.property_type,
        category_for: item.property_for,
        reminder_for: remiderType,
        client_name: clientName.trim(),
        client_mobile: clientMobile.trim(),
        client_id: clientId,
        meeting_date: newDate.trim(),
        meeting_time: newTime.trim() // newTime.trim()
      };
      axios
        .post(
          SERVER_URL + "/addNewReminder",
          reminderDetails
        )
        .then(
          response => {
            // console.log("response.data ", response.data);
            // navigation.navigate("CardDetails");
            if (response.data !== "fail") {
              const x = [reminderDetails, ...props.propReminderList];
              reminderListX.push(reminderDetails);
              const m = [...reminderListX];
              props.setPropReminderList(x);
              setReminderListX(m);
            }
            clearState();
          },
          error => {
            // console.log(error);
            clearState();
          }
        );
    } catch (error) {
      console.log("error: " + JSON.stringify(error));

    }
  };

  const getPropReminders = () => {
    // console.log("item getPropReminders: " + propertyIdX);
    const propertyId = {
      req_user_id: props.userDetails.id,
      agent_id: props.userDetails.works_for,
      property_id: propertyIdX
    };
    setLoading(true);

    axios
      .post(
        SERVER_URL + "/getPropReminderList",
        propertyId
      )
      .then(
        response => {
          // console.log("response.data.length: " + response.data.length);
          // navigation.navigate("CardDetails");
          if (response.data && response.data.length > 0) {
            // const x = [...props.propReminderList, ...response.data];
            // // console.log("X: " + x);
            props.setPropReminderList(response.data);
            setReminderListX(response.data);
            setLoading(false);
          } else {
            props.setPropReminderList(response.data);
            setReminderListX([]);
            setLoading(false);
          }
        },
        error => {
          setLoading(false);
          console.log(error);
        }
      );
  };

  useEffect(() => {
    // console.log("useEffect called: " + props.propReminderList.length);
    // if (props.propReminderList.length === 0) {
    // console.log("getPropReminders called");
    getPropReminders();
    // }
  }, [propertyIdX]);

  // useEffect(() => {
  //   // console.log("propertyIdX: " + propertyIdX);
  //   props.setPropReminderList([]);
  // }, [propertyIdX]);

  return (
    <View style={{ flex: 1, backgroundColor: "rgba(245,245,245, 0.2)" }}>
      <KeyboardAwareScrollView onPress={Keyboard.dismiss}>
        <ScrollView style={styles.container}>
          <View>
            <Text style={{ marginTop: 10, marginBottom: 10, fontSize: 14 }}>
              Create a call/visiting schedule to show property to client and get
              reminder on time
            </Text>
            <Divider />
            <Text style={{ marginTop: 20, marginBottom: 15, fontSize: 14 }}>
              Reminder For ?
            </Text>

            <View style={styles.propSubSection}>

              <CustomButtonGroup
                buttons={AppConstant.REMINDER_FOR_OPTION}
                accessibilityLabelId="reminder_type"
                selectedIndices={[AppConstant.REMINDER_FOR_OPTION.findIndex(option => option.text === remiderType)]}
                isMultiSelect={false}
                buttonStyle={{ backgroundColor: '#fff' }}
                selectedButtonStyle={{ backgroundColor: 'rgba(0, 163, 108, .2)' }}
                buttonTextStyle={{ color: '#000' }}
                selectedButtonTextStyle={{ color: '#000' }}
                width={100}
                onButtonPress={(index, button) => {
                  console.log(`Button pressed: ${button.text} (Index: ${index})`);
                  setReminderType(button.text);
                  // Query update is handled by useEffect after state change
                }}
              />

              {/* <ButtonGroup
                selectedBackgroundColor="rgba(27, 106, 158, 0.85)"
                onPress={selectReminderForIndex}
                selectedIndex={reminderForIndex}
                buttons={reminderForArray}
                // containerStyle={{ height: 30 }}
                textStyle={{ textAlign: "center" }}
                selectedTextStyle={{ color: "#fff" }}
                containerStyle={{ borderRadius: 10, width: 300 }}
                containerBorderRadius={10}
              /> */}
            </View>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("CustomerListForMeeting", {
                  displayMatchCount: false,
                  displayMatchPercent: true
                })
              }
            >
              <View style={{ flexDirection: "row", marginTop: 20 }}>
                <AntDesign name="pluscircleo" color={"#00BFFF"} size={26} />
                <Text
                  style={{ color: "#00BFFF", paddingLeft: 10, paddingTop: 5, fontWeight: "500" }}
                >
                  Add Customer For Meeting.
                </Text>
              </View>
            </TouchableOpacity>
            <DatePicker
              isVisible={visible}
              mode={'single'}
              initialDate={new Date()}
              minDate={new Date()}
              onCancel={onDismiss}
              onConfirm={onChange}
              dateStringFormat={"dd-mmm-yyyy"}
            />
            {clientName ? (
              <View>
                <TextInput
                  disabled={true}
                  label="Customer Name*"
                  value={clientName}
                  onChangeText={text => setClientName(text)}
                  onFocus={() => setIsVisible(false)}
                  style={{ backgroundColor: "#ffffff", marginTop: 25 }}
                  textColor="#555555"
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
                  disabled={true}
                  label="Customer Mobile*"
                  value={clientMobile}
                  onChangeText={text => setClientMobile(text)}
                  onFocus={() => setIsVisible(false)}
                  keyboardType={"numeric"}
                  returnKeyType={"done"}
                  style={{ backgroundColor: "#ffffff", marginTop: 8 }}
                  textColor="#555555"
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
            ) : null}
            <View style={{ flexDirection: "row", marginTop: 25 }}>
              <TextInput
                mode="outlined"
                style={styles.inputContainerStyle}
                label="Date*"
                placeholder="Date*"
                value={newDate}
                showSoftInputOnFocus={false}
                // onChangeText={newDate => setNewDate(newDate)}
                onFocus={() => setVisible(true)}
                // style={{ width: "50%" }}
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
                ref={inputRef}
                mode="outlined"
                style={styles.inputContainerStyle}
                label="Time*"
                placeholder="Time*"
                value={newTime}
                onChangeText={() => setModalVisibleTemp(false)}
                onFocus={() => setModalVisibleTemp1(true)}
                // style={{ width: "30%", marginLeft: 10 }}
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
            <View
              style={{
                marginTop: 20,
                marginBottom: 20
                // marginLeft: 10,
                // marginRight: 10
              }}
            >
              <Button title="Save" onPress={() => onSubmit()} />
            </View>
          </View>
          {/* Property releted reminder list */}
          {loading ? <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'rgba(245,245,245, .4)'
            }}
          >
            <ActivityIndicator animating size="large" color={'#000'} />
            {/* <ActivityIndicator animating size="large" /> */}
          </View> : <PropertyReminder navigation={navigation} reminderListX={reminderListX} />}
        </ScrollView>

      </KeyboardAwareScrollView>


      <TimePickerModal
        visible={timeVisible}
        onDismiss={onDismissTimePicker}
        onConfirm={onConfirmTimePicker}
        hours={12} // default: current hours
        minutes={15} // default: current minutes
        label="Select time" // optional, default 'Select time'
        cancelLabel="Cancel" // optional, default: 'Cancel'
        confirmLabel="Ok" // optional, default: 'Ok'
        animationType="fade" // optional, default is 'none'
        locale={"en"} // optional, default is automically detected by your system
      />
      <Snackbar
        visible={isVisible}
        textMessage={errorMessage}
        position={"top"}
        actionHandler={() => dismissSnackBar()}
        actionText="OK"
      />

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          setModalVisibleTemp(false);
        }}
      >
        <View style={styles.centeredView1}>
          <View style={styles.modalView}>
            <View style={{ flexDirection: "row" }}>
              <TextInput
                mode="outlined"
                keyboardType={"numeric"}
                returnKeyType={"done"}
                style={[
                  styles.inputContainerStyle,
                  { width: 80, textAlign: "center" }
                ]}
                label={"Hour*"}
                // label="Expected Rent*"
                placeholder="Hour"
                value={hour}
                // keyboardType={"numeric"}
                onChangeText={text => checkHourValidation(text)}
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
              <TextInput
                mode="outlined"
                keyboardType={"numeric"}
                returnKeyType={"done"}
                style={[
                  styles.inputContainerStyle,
                  { width: 90, textAlign: "center" }
                ]}
                label={"Minute*"}
                // label="Expected Rent*"
                placeholder="Minute"
                value={minutes}
                // keyboardType={"numeric"}
                onChangeText={text => checkMinutesValidation(text)}
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
              <ButtonGroup
                selectedBackgroundColor="rgba(27, 106, 158, 0.85)"
                onPress={selectAMPMIndex}
                selectedIndex={ampmIndex}
                buttons={ampmArray}
                // containerStyle={{ height: 30 }}
                textStyle={{ textAlign: "center" }}
                selectedTextStyle={{ color: "#fff" }}
                containerStyle={{ borderRadius: 5, width: 70, height: 80 }}
                containerBorderRadius={10}
                vertical={true}
              />
            </View>

            <View
              style={{
                position: "absolute",
                flexDirection: "row",
                right: 0,
                bottom: 0,
                marginTop: 20,
                marginBottom: 15,
                padding: 20
                // justifyContent: "flex-end"
              }}
            >
              <TouchableHighlight
                style={{ ...styles.cancelButton }}
                onPress={() => {
                  setModalVisibleTemp(!modalVisible);
                }}
              >
                <Text style={styles.textStyle}>Cancel</Text>
              </TouchableHighlight>
              <TouchableHighlight
                style={{ ...styles.applyButton }}
                onPress={() => {
                  onApply(!modalVisible);
                }}
              >
                <Text style={styles.textStyle}>Apply</Text>
              </TouchableHighlight>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // padding: 10,
    marginTop: 20,
    marginLeft: 5,
    marginRight: 5
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
    height: 200,
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

const mapStateToProps = state => ({
  userDetails: state.AppReducer.userDetails,
  propReminderList: state.AppReducer.propReminderList,
  customerDetailsForMeeting: state.AppReducer.customerDetailsForMeeting
});

const mapDispatchToProps = {
  setUserMobile,
  setUserDetails,
  setPropReminderList,
  setPropListForMeeting,
  setCustomerDetailsForMeeting
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Meeting);

// export default Meeting;
