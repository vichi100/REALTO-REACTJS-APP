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
import { SERVER_URL } from "./../../utils/Constant";
import { makeCall } from "././../../utils/methods";
import {formatIsoDateToCustomString, formatClientNameForDisplay} from "../../utils/methods"; 

const CustomerReminder = props => {
  const { navigation, item } = props;
  const [reminderList, setReminderList] = useState([]);
  // useEffect(() => {
  //   console.log("props.item: ", props.item);
  //   setReminderList(props.propReminderList);
  // }, [props.propReminderList]);


  useEffect(() => {
    if (reminderList.length > 0) {
      return;
    }
    const agentId = {
      req_user_id: props.userDetails.works_for,
      // customer_id: item.customer_id
    };
    axios
      .post(
        SERVER_URL + "/getReminderList",
        agentId
      )
      .then(
        response => {
          // console.log(response.data);
          setReminderList(response.data);
          // navigation.navigate("CardDetails");
        },
        error => {
          // console.log(error);
        }
      );
  }, []);



  // const makeCall = mobile => {
  //   const url = "tel://" + mobile;
  //   Linking.openURL(url);
  // };

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
            <Text>+91 {item.client_mobile}</Text>
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
            <Text>+91 {item.client_mobile}</Text>
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
            <Text>+91 {item.client_mobile}</Text>
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

  return (
    <View style={{ flex: 1, backgroundColor: "#ffffff" }}>
      <ScrollView>
        <FlatList
          data={reminderList}
          //data defined in constructor
          ItemSeparatorComponent={ItemSeparatorView}
          //Item Separator View
          renderItem={ItemView}
          keyExtractor={(item, index) => index.toString()}
        />
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
)(CustomerReminder);

// export default Reminder;
