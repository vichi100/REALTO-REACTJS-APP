import React from "react";
import { View, Button, Text, StyleSheet, SafeAreaView } from "react-native";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { createMaterialBottomTabNavigator } from "react-native-paper/react-navigation";
import { Ionicons } from "@expo/vector-icons";
import { createStackNavigator } from "@react-navigation/stack";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import AntDesign from "react-native-vector-icons/AntDesign";

// import Ionicons from "react-native-vector-icons/MaterialCommunityIcons";

import ListingStack from "../stacks/ListingStack";
import ContactsStack from "../stacks/ContactsStack";
// import Notification from "./../../screens/notification/Notification";
import NotificationStack from "../stacks/NotificationStack";
import ProfileStack from "../stacks/ProfileStack";
// import NotificationTopTab from "./NotificationTopTabNavigator";
import GlobalSearchStackNav from "../stacks/GlobalSearchStack";


const BottomTabScreen = () => {
  const Tab = createMaterialBottomTabNavigator();
  const Stack = createStackNavigator();
  const insets = useSafeAreaInsets();
  return (
    

    <Tab.Navigator
      // initialRouteName="Home"
      lazy={false}
      // activeColor="rgba(65, 147, 169, 1)"
      inactiveColor="#828282"
      shifting={false} // Enables individual tabBarColor
      // inactiveColor="rgb(105,105,105)"
      barStyle={{ backgroundColor: "#ffffff", paddingBottom: 0, height: 50+insets.bottom}}
      // https://github.com/callstack/react-native-paper/issues/3248
      theme={{colors: {secondaryContainer: '#ffffff'}}}
      // tabBarStyle={{height: 0}}
      // tabBarOptions={{
      //   style: {
      //     backgroundColor: "red",
      //   }
      // }}
      >
      
    
      {/* <Tab.Screen
        name="Home"
        component={HomeStackNav}
        options={{
          tabBarLabel: "",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="home" color={color} size={26} />
          )
        }}
      /> */}
      <Tab.Screen
        name="GlobalSearchStackNav"
        component={GlobalSearchStackNav}
        options={{
          tabBarAccessibilityLabel: "bottom_tab_global_search_icon",
          tabBarLabel: "",
          tabBarIcon: ({ focused }) => (
            <MaterialCommunityIcons name="web" color={focused ? '#ff5733' : '#828282'} size={26} />
          )
        }}
      />


      <Tab.Screen
        // lazy={false}
        name="ListingStack"
        component={ListingStack}
        title="My Properties"
        options={{
          tabBarAccessibilityLabel: "bottom_tab_properties_icon",
          tabBarLabel: "",
          tabBarColor: "#ffffff",
          tabBarIcon: ({ focused }) => (
            <MaterialCommunityIcons
              name="view-grid-outline"
              color={focused ? 'rgba(63, 195, 128, 1)' : '#828282'}
              size={26}
            />
          )
        }}
      />

      <Tab.Screen
        // lazy={false}
        name="Contact"
        component={ContactsStack}
        options={{
          tabBarAccessibilityLabel: "bottom_tab_contacts_icon",
          tabBarLabel: "",
          tabBarIcon: ({ focused }) => (
            <AntDesign name="contacts" color={focused ? '#33aaff' : '#828282'} size={26}/>
          )
        }}
      />

      {/* <Tab.Screen
        name="Add"
        component={AddNewPropertyStack}
        options={{
          tabBarLabel: "",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              name="view-grid-plus-outline"
              color={color}
              size={26}
            />
          )
        }}
      /> */}



      <Tab.Screen
        name="NotificationStack"
        component={NotificationStack}
        options={{
          tabBarAccessibilityLabel: "bottom_tab_reminders_icon",
          tabBarLabel: "",
          tabBarIcon: ({ focused }) => (
            <Ionicons name="notifications-outline" color={focused ? '#FFAA1D' : '#828282'} size={26} />
          )
        }}
      />

      <Tab.Screen
        name="ProfileStack"
        component={ProfileStack}
        options={{
          tabBarAccessibilityLabel: "bottom_tab_profile_icon",
          tabBarLabel: "",
          tabBarIcon: ({ focused }) => (
            <MaterialCommunityIcons name="account" color={focused ? 'rgba(148, 124, 176, 1)' : '#828282'} size={26} />
          )
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  }
});

export default BottomTabScreen;
