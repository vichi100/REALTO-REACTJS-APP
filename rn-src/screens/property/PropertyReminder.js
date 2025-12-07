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
  style,
  FlatList,
  Linking
} from "react-native";
import { connect } from "react-redux";
import Ionicons from "react-native-vector-icons/Ionicons";
import axios from "axios";
import { makeCall } from "././../../utils/methods";
import { formatIsoDateToCustomString, formatClientNameForDisplay, formatMobileNumber } from "../../utils/methods";


const PropertyReminder = props => {
  const {
    navigation,
    reminderListX,

  } = props;
  const [reminderList, setReminderList] = useState([]);
  const [futureReminderList, setFutureReminderList] = useState([]);
  const [pastReminderList, setPastReminderList] = useState([]);


  useEffect(() => {
    // console.log("props.propReminderList: ", props.propReminderList);
    const dataArr = reminderListX;
    const future = [];
    const past = [];
    for (const value of dataArr) {
      const todayDateTime = new Date();
      // Convert stored date to a proper local date with meeting time
      const meetingDate = new Date(value.meeting_date);
      const meetingTime = value.meeting_time || "12:00 AM";

      // Parse "11:30 AM" → hours/minutes
      const [time, modifier] = meetingTime.split(" ");
      let [hours, minutes] = time.split(":").map(Number);
      if (modifier === "PM" && hours < 12) hours += 12;
      if (modifier === "AM" && hours === 12) hours = 0;

      // Combine local date + time
      const meetingDateTime = new Date(meetingDate);
      meetingDateTime.setHours(hours, minutes, 0, 0);

      console.log("todayDateTime:", todayDateTime);
      console.log("meetingDateTime:", meetingDateTime);

      if (meetingDateTime > todayDateTime) {
        future.push(value);
      } else {
        past.push(value);
      }

    }
    // console.log("getReminderList:   ", response.data);
    setFutureReminderList(future);
    setPastReminderList(past);
    setReminderList(props.propReminderList);
  }, [props.propReminderList]);




  const ItemView = ({ item }) => {
    return item.reminder_for.toLowerCase() === "meeting".toLowerCase() ? (
      <View
        style={{
          flexDirection: "row",
          flex: 1,
          justifyContent: "space-between",
          backgroundColor: "rgba(135,206,250, 0.5)",
          borderRadius: 5,
          marginTop: 2
          // alignContent: "center"
          // alignItems: "center"
        }}
      >
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("CustomerMeetingDetails", {
              item: item,
              category: "property"
            })
          }
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            width: "80%"
          }}
        >
          <View style={{ padding: 10, fontSize: 16, paddingTop: 15 }}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: "600",
                color: "rgba(0,0,0, 0.7)"
              }}
              numberOfLines={2} // <<-- This will limit the text to one line
              ellipsizeMode="tail" // <<-- This will add "..." at the end if it overflows
            >
              {formatClientNameForDisplay(item.client_name)}
            </Text>
            <Text>{formatMobileNumber(item.client_mobile)}</Text>
            <Text>
              {"Reference id: " + item.property_reference_id}
            </Text>
          </View>
          <View>
            <View style={{ padding: 10 }}>
              <Text>{item.reminder_for}</Text>
              <Text>{item.meeting_time}</Text>
              <Text>{formatIsoDateToCustomString(item.meeting_date)}</Text>
            </View>
          </View>
        </TouchableOpacity>
        <View style={styles.verticalLine} />
        <TouchableOpacity
          onPress={() => makeCall(item.client_mobile)}
          style={{
            padding: 15,
            marginTop: 7,
            paddingRight: 20
          }}
        >
          <Ionicons name="call" color={"#ffffff"} size={26} />
        </TouchableOpacity>
      </View>
    ) : item.reminder_for.toLowerCase() === "call".toLowerCase() ? (
      <View
        style={{
          flexDirection: "row",
          flex: 1,
          justifyContent: "space-between",
          backgroundColor: "rgba(64,224,208, 0.5)",
          borderRadius: 5,
          marginTop: 2
          // alignContent: "center"
          // alignItems: "center"
        }}
      >
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("CustomerMeetingDetails", {
              item: item,
              category: "property"
            })
          }
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            width: "80%"
          }}
        >
          <View style={{ padding: 10, fontSize: 16, paddingTop: 15 }}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: "600",
                color: "rgba(0,0,0, 0.7)"
              }}
              numberOfLines={2} // <<-- This will limit the text to one line
              ellipsizeMode="tail" // <<-- This will add "..." at the end if it overflows
            >
              {formatClientNameForDisplay(item.client_name)}
            </Text>
            <Text>{formatMobileNumber(item.client_mobile)}</Text>
          </View>
          <View>
            <View style={{ padding: 10 }}>
              <Text>{item.reminder_for}</Text>
              <Text>{item.meeting_time}</Text>
              <Text>{formatIsoDateToCustomString(item.meeting_date)}</Text>
            </View>
          </View>
        </TouchableOpacity>
        <View style={styles.verticalLine} />
        <TouchableOpacity
          onPress={() => makeCall(item.client_mobile)}
          style={{
            padding: 15,
            marginTop: 7,
            paddingRight: 20
          }}
        >
          <Ionicons name="call" color={"#ffffff"} size={26} />
        </TouchableOpacity>
      </View>
    ) : (
      <View
        style={{
          flexDirection: "row",
          flex: 1,
          justifyContent: "space-between",
          backgroundColor: "rgba(255,182,193, 0.5)",
          borderRadius: 5,
          marginTop: 2
          // alignContent: "center"
          // alignItems: "center"
        }}
      >
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("CustomerMeetingDetails", {
              item: item,
              category: "property"
            })
          }
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            width: "80%"
          }}
        >
          <View style={{ padding: 10, fontSize: 16, paddingTop: 15 }}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: "600",
                color: "rgba(0,0,0, 0.7)"
              }}
              numberOfLines={2} // <<-- This will limit the text to one line
              ellipsizeMode="tail" // <<-- This will add "..." at the end if it overflows
            >
              {formatClientNameForDisplay(item.client_name)}
            </Text>
            <Text>{formatMobileNumber(item.client_mobile)}</Text>
          </View>
          <View>
            <View style={{ padding: 10 }}>
              <Text>{item.reminder_for}</Text>
              <Text>{item.meeting_time}</Text>
              <Text>{formatIsoDateToCustomString(item.meeting_date)}</Text>
            </View>
          </View>
        </TouchableOpacity>
        <View style={styles.verticalLine} />
        <TouchableOpacity
          onPress={() => makeCall(item.client_mobile)}
          style={{
            padding: 15,
            marginTop: 7,
            paddingRight: 20
          }}
        >
          <Ionicons name="call" color={"#ffffff"} size={26} />
        </TouchableOpacity>
      </View>
    );
  };

  const ItemSeparatorView = () => {
    return (
      //Item Separator
      <View
        style={{ height: 0.5, width: "100%", backgroundColor: "#C8C8C8" }}
      />
    );
  };

  const FlatListFooter = () => {
    return (
      <View style={{ padding: 10, alignItems: 'center' }}>
        <Text style={{ color: '#fff' }} testID="end_of_list">End</Text>
      </View>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#ffffff" }}>
      <ScrollView>
        <Text style={{ textAlign: "center", fontSize: 16, fontWeight: 500, marginTop: 10, marginBottom: 10 }}>
          Upcoming Meetings
        </Text>
        {futureReminderList.length > 0 ? <FlatList
          data={futureReminderList}
          //data defined in constructor
          ItemSeparatorComponent={ItemSeparatorView}
          //Item Separator View
          renderItem={ItemView}
          keyExtractor={(item, index) => index.toString()}
        /> :
          <View style={{ flex: 1, alignContent: 'center', justifyContent: 'center', backgroundColor: "rgba(239, 239, 240, .9)" }}>
            <Text style={{ textAlign: "center", fontSize: 15, fontWeight: 300, marginTop: 0, marginBottom: 20, marginTop: 20 }}>
              No Meetings
            </Text>
          </View>
        }
        <Text style={{ textAlign: "center", fontSize: 16, fontWeight: 500, marginTop: 15, marginBottom: 10 }}>
          Past Meetings
        </Text>
        {pastReminderList.length > 0 ? <FlatList
          data={pastReminderList}
          //data defined in constructor
          ItemSeparatorComponent={ItemSeparatorView}
          //Item Separator View
          renderItem={ItemView}
          keyExtractor={(item, index) => index.toString()}
          ListFooterComponent={FlatListFooter} // Pass the footer component here
        /> : <View style={{ flex: 1, alignContent: 'center', justifyContent: 'center', backgroundColor: "rgba(239, 239, 240, .9)" }}>
          <Text style={{ textAlign: "center", fontSize: 15, fontWeight: 300, marginTop: 0, marginBottom: 20, marginTop: 20 }}>
            No Meetings
          </Text>
        </View>}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  verticalLine: {
    height: "100%",
    width: 2,
    backgroundColor: "#ffffff"
  }
});

const mapStateToProps = state => ({
  userDetails: state.AppReducer.userDetails,
  propReminderList: state.AppReducer.propReminderList
});
export default connect(
  mapStateToProps,
  null
)(PropertyReminder);

// export default Reminder;
