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
import { setAnyItemDetails } from "./../../reducers/Action";
import {SERVER_URL} from "./../../utils/Constant";
import { makeCall } from "./../../utils/methods";

const Message = props => {
  const { navigation } = props;
  const [messageList, setMessageList] = useState([]);
  const [subjectDetails, setSubjectDetails] = useState(null);

  // const makeCall = item => {
  //   console.log("item make call:  ", item.sender_details.mobile);
  //   const url = "tel://" + item.sender_details.mobile;
  //   Linking.openURL(url);
  // };

  useEffect(() => {
    getMessagesList();
  }, []);

  const getMessagesList = () => {
    console.log("agent_id: ", props.userDetails);
    const agentId = {
      req_user_id: props.userDetails.works_for,
      // customer_id: item.customer_id
    };
    axios
      .post(
        SERVER_URL+"/getMessagesList",
        agentId
      )
      .then(
        response => {
          console.log("getReminderList:   ", response.data);
          setMessageList(response.data);
          // navigation.navigate("CardDetails");
        },
        error => {
          // console.log(error);
        }
      );
  };

  const getSubjectDetails = item => {
    // subject is property or customer

    /// CHECK THIS THIS DONT HAVE req_user_id: props.userDetails.works_for,


    console.log("item: ", item);
    //   const agentId = {
    // req_user_id: props.userDetails.works_for,
    //       agent_id: props.userDetails.works_for
    //   };
    axios
      .post(
        SERVER_URL+"/getSubjectDetails",
        item.subject
      )
      .then(
        response => {
          console.log("getSubjectDetails:   ", response.data);
          props.setAnyItemDetails(response.data);
          navigation.navigate("MessageDetails", {
            item: item
          });
          //   setSubjectDetails(response.data);
          // navigation.navigate("CardDetails");
        },
        error => {
          // console.log(error);
        }
      );
  };

  const onMessageDetails = item => {
    // console.log("item:  ", item);
    getSubjectDetails(item);
  };

  const ItemView = ({ item }) => {
    return (
      <View
        style={{
          flexDirection: "row",
          flex: 1,
          justifyContent: "space-between",
          // backgroundColor: "rgba(218, 223, 225, .5)",
          // backgroundColor: "rgba(238, 213, 183, .6)",
          backgroundColor: "rgba(176, 196, 222, .3)",

          //   backgroundColor: "#ffffff",
          borderRadius: 5,
          marginTop: 2
          // alignContent: "center"
          // alignItems: "center"
        }}
      >
        <TouchableOpacity
          onPress={() => onMessageDetails(item)}
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            width: "80%"
          }}
        >
          <View style={{ padding: 10, fontSize: 16, paddingTop: 15 }}>
            {item.subject.subject_category === "property" ? (
              <Text
                style={{
                  fontSize: 15,
                  // fontWeight: "600",
                  color: "#424242"
                }}
              >
                I have customer for your {item.subject.location_area},
                {item.subject.city} property. Please call me on +91{" "}
                {item.sender_details.mobile} - {item.subject.name}
              </Text>
            ) : (
              <Text
                style={{
                  fontSize: 15,
                  // fontWeight: "600",
                  color: "#424242"
                }}
              >
                I have property in {item.subject.location_area},
                {item.subject.city} for your customer. Please call me on +91{" "}
                {item.sender_details.mobile} - {item.subject.name}
              </Text>
            )}
            <View
              style={{ flexDirection: "row", justifyContent: "flex-start" }}
            >
              <Text
                style={{
                  textAlign: "right",
                  color: "#424242",
                  fontSize: 12,
                  marginTop: 5
                }}
              >
                {new Date(item.create_date_time).toDateString()}
              </Text>
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => makeCall(item)}
          style={{
            padding: 15,
            marginTop: 7,
            paddingRight: 20
          }}
        >
          <Ionicons name="call" color={"#29b6f6"} size={26} />
        </TouchableOpacity>
      </View>
    );
  };
  return (
    <View style={{ flex: 1, backgroundColor: "#ffffff" }}>
      {/* <ScrollView> */}
      <FlatList
        data={messageList}
        //data defined in constructor
        //   ItemSeparatorComponent={ItemSeparatorView}
        //Item Separator View
        renderItem={ItemView}
        keyExtractor={(item, index) => index.toString()}
      />
      {/* </ScrollView> */}
    </View>
  );
};

const mapStateToProps = state => ({
  userDetails: state.AppReducer.userDetails
});
const mapDispatchToProps = {
  setAnyItemDetails
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Message);

const styles = StyleSheet.create({
  verticalLine: {
    height: "100%",
    width: 2,
    backgroundColor: "#ffffff"
  }
});
