import * as React from "react";
import { Text, View, SafeAreaView, TextInput, StyleSheet, StatusBar } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";

import Meeting from "./../../screens/meeting/Meeting";
import Reminder from "./../../screens/common/Reminder";
import Message from "./../../screens/messages/Message";

const Tab = createMaterialTopTabNavigator();

const NotificationTopTab = () => {
  return (
    <View style={{ flex: 1, marginTop: StatusBar.currentHeight }}>
      {/* <View style={styles.searchBarContainer}>
        <TextInput
          style={styles.textInputStyle}
          onChangeText={text => searchFilterFunction(text)}
          value={"search"}
          underlineColorAndroid="transparent"
          placeholder="Search Here"
        />
      </View> */}
      <Tab.Navigator
      screenOptions={{
        // showIcon: true,
        showLabel: true,
        tabBarIndicatorStyle: {
          borderBottomWidth: 2,
          borderBottomColor: 'rgb(2,171,61)',
        },
        tabBarLabelStyle: {
          fontSize: 18, // Adjust the font size
          fontWeight: '500', // Make the text bold
          color: 'black', // Set the text color
          textTransform: 'capitalize', // Capitalize the text
        },
        tabBarStyle: {
          backgroundColor: '#f8f8f8', // Optional: Set a background color for the tab bar
        },
        // tabBarActiveTintColor: 'tomato',
        // tabBarInactiveTintColor: 'gray',
        style: {
          // backgroundColor: "rgba(105,105,105, 0.1)",
          // flex: 1,
          flexDirection: "column"
        }
      }}
      >
        {/* <Tab.Screen name="Message" component={Message} /> */}
        <Tab.Screen name="Reminders" component={Reminder} />
        {/* <Tab.Screen name="General" component={Reminder} /> */}
      </Tab.Navigator>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 5
    // alignContent: "center"
  },
  fab: {
    flexDirection: "row",
    position: "absolute",
    width: 130,
    height: 35,
    alignItems: "center",
    justifyContent: "center",
    right: "33%",
    // left: 0,
    bottom: 10,
    backgroundColor: "rgba(128,128,128, 0.8)",
    borderRadius: 30,
    elevation: 8
  },
  verticalLine: {
    height: "100%",
    width: 2,
    backgroundColor: "#ffffff"
  },
  fabIcon1: {
    paddingRight: 20
  },
  fabIcon2: {
    paddingLeft: 20
  },
  bottomNavigationView: {
    backgroundColor: "#fff",
    width: "100%",
    height: "70%",
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30
  },
  sortingBottomNavigationView: {
    backgroundColor: "#fff",
    width: "100%",
    height: "45%",
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center"
  },
  propSubSection: {
    marginBottom: 20
  },
  title: {
    fontSize: 16,
    fontWeight: "600"
  },
  bottomNavigationViewHeader: {
    position: "absolute",
    width: 130,
    // height: 35,
    alignItems: "center",
    justifyContent: "center",
    right: "33%",
    // left: 0,
    top: 10,
    marginBottom: 30
  },
  horizontal: {
    borderBottomColor: "black",
    borderBottomWidth: 5,
    marginLeft: 5,
    marginRight: 5
  },
  textInputStyle: {
    width: "98%",
    height: 40,
    // borderWidth: 1,
    paddingLeft: 20,
    margin: 5,
    // marginBottom: 5,
    borderRadius: 10,
    // borderColor: "#009688",
    backgroundColor: "#FFFFFF"
  },
  marginBottom10: {
    marginBottom: 10
  }
});

export default NotificationTopTab;
