import * as React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import NotificationTopTab from "../tabs/NotificationTopTabNavigator";
import CustomerMeetingDetails from "./../../screens/contacts/CustomerMeetingDetails";
import PropDetailsFromListing from "./../../screens/property/residential/rent/PropDetailsFromListing";
import PropDetailsFromListingForSell from "./../../screens/property/residential/sell/PropDetailsFromListingForSell";
import CommercialRentPropDetails from "./../../screens/property/commercial/rent/CommercialRentPropDetails";
import CommercialSellPropDetails from "./../../screens/property/commercial/sell/CommercialSellPropDetails";

import MessageDetails from "./../../screens/messages/MessageDetails";
// import Message from "";

const Stack = createStackNavigator();

const NotificationStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        // headerShown: false,
        headerTitleAlign: "center",
        // headerTintColor: "#fff",
        headerStyle: {
          backgroundColor: "#ffffff"
        },
        headerBackTitleVisible: false,
        headerTintColor: "rgba(105,105,105, .9)"
      }}
    >
      <Stack.Screen
        name="NotificationTopTab"
        component={NotificationTopTab}
        options={{ headerShown: false }}
      // options={{ tabBarLabel: "Home!" }}
      />
      {/* <Stack.Screen
        name="Card"
        component={Card}
        options={{ title: "Meeting Schedules" }}
      /> */}

      <Stack.Screen
        name="CustomerMeetingDetails"
        component={CustomerMeetingDetails}
        options={{ title: "Meeting Details" }}
      />
      <Stack.Screen
        name="MessageDetails"
        component={MessageDetails}
        options={{ title: "Message Details" }}
      />
      <Stack.Screen
        name="PropDetailsFromListing"
        component={PropDetailsFromListing}
        navigationOptions={{ tabBarVisible: false }}
        options={{
          title: "Property Details"
        }}
      />
      <Stack.Screen
        name="PropDetailsFromListingForSell"
        component={PropDetailsFromListingForSell}
        navigationOptions={{ tabBarVisible: false }}
        options={{
          title: "Property Details"
        }}
      />

      <Stack.Screen
        name="CommercialRentPropDetails"
        component={CommercialRentPropDetails}
        navigationOptions={{ tabBarVisible: false }}
        options={{
          title: "Property Details"
        }}
      />
      <Stack.Screen
        name="CommercialSellPropDetails"
        component={CommercialSellPropDetails}
        navigationOptions={{ tabBarVisible: false }}
        options={{
          title: "Property Details", headerBackTitle: "Back"
        }}
      />
    </Stack.Navigator>
  );
};

export default NotificationStack;
