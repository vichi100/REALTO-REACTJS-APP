import * as React from "react";
import { Text, View, SafeAreaView, TextInput, StyleSheet, StatusBar } from "react-native";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { createStackNavigator } from "@react-navigation/stack";
import Listing from "./../../screens/property/residential/ListingResidential";
import Meeting from "./../../screens/meeting/Meeting";
import PropDetailsFromListing from "./../../screens/property/residential/rent/PropDetailsFromListing";
import PropDetailsFromListingForSell from "./../../screens/property/residential/sell/PropDetailsFromListingForSell";
import ListingTopTab from "../tabs/ListingTopTabNavigator";
import CommercialRentPropDetails from "./../../screens/property/commercial/rent/CommercialRentPropDetails";
import CommercialSellPropDetails from "./../../screens/property/commercial/sell/CommercialSellPropDetails";
import AddNewPropertyStack from "./AddPropertyStack";
import CustomerMeetingDetails from "././../../screens/contacts/CustomerMeetingDetails";
import CustomerListForMeeting from "./../../screens/meeting/CustomerListForMeeting";
import PropertyListForMeeting from "./../../screens/contacts/PropertyListForMeeting";
import AddNewContactsStack from "./AddCustomerStack"
import ContactsResidential from "./../../screens/contacts/residential/ContactsResidential"
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import CustomerMeeting from "../../screens/contacts/CustomerMeeting";
import MatchedCustomers from "./../../screens/contacts/MatchedCustomers";
import MatchedProperties from "./../../screens/property/MatchedProperties";
import CustomerDetailsResidentialRentFromList from "./../../screens/contacts/residential/rent/CustomerDetailsResidentialRentFromList";
import CustomerDetailsResidentialBuyFromList from "./../../screens/contacts/residential/buy/CustomerDetailsResidentialBuyFromList";
import CustomerDetailsCommercialRentFromList from "./../../screens/contacts/commercial/rent/CustomerDetailsCommercialRentFromList";
import CustomerDetailsCommercialBuyFromList from "./../../screens/contacts/commercial/buy/CustomerDetailsCommercialBuyFromList";
import EmployeeList from "./../../screens/employee/EmployeeList";

const Stack = createStackNavigator();
export const hideTabBarComponents = ["ProductDetails"];

const ListingStack = ({ navigation, route }) => {
  React.useLayoutEffect(() => {
    const routeName = getFocusedRouteNameFromRoute(route);
    if (routeName === 'ResidentialMatchedCustomerList') {
      navigation.getParent()?.setOptions({ tabBarStyle: { display: 'none' } });
    } else {
      navigation.getParent()?.setOptions({ tabBarStyle: { display: 'flex' } });
    }
  }, [navigation, route]);

  const insets = useSafeAreaInsets();
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
        name="Listing"
        component={ListingTopTab}
        options={{ headerShown: false }}
      // options={{ tabBarLabel: "Home!" }}
      />
      {/* <Stack.Screen
        name="Card"
        component={Card}
        options={{ title: "Meeting Schedules" }}
      /> */}

      <Stack.Screen 
        name="Meeting"
        component={Meeting}
        options={{ title: "Reminders", tabBarVisible: false , headerBackTitle: "Back"}}
        navigationOptions={{ tabBarVisible: false }}
      />

      <Stack.Screen
        name="PropDetailsFromListing"
        component={PropDetailsFromListing}
        navigationOptions={{ tabBarVisible: false }}
        options={{
          title: "Property Details", headerBackTitle: "Back"
        }}
      />

      <Stack.Screen
        name="MatchedCustomers"
        component={MatchedCustomers}
        navigationOptions={{ tabBarVisible: true }}
        options={{
          title: "Matched Customers",
           headerBackTitle: "Back"
          // tabBarStyle: {
          //   display: "none",
          // },
          // tabBarButton: () => null,
        }}

      />
      <Stack.Screen
        name="MatchedProperties"
        component={MatchedProperties}
        options={{ title: "Matched Properties", headerBackTitle: "Back" }}
      />

      <Stack.Screen
        name="PropDetailsFromListingForSell"
        component={PropDetailsFromListingForSell}
        navigationOptions={{ tabBarVisible: false }}
        options={{
          title: "Property Details", headerBackTitle: "Back"
        }}
      />

      <Stack.Screen
        name="CommercialRentPropDetails"
        component={CommercialRentPropDetails}
        navigationOptions={{ tabBarVisible: false }}
        options={{
          title: "Property Details", headerBackTitle: "Back"
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

      <Stack.Screen
        name="AddNewCustomerStack"
        component={AddNewContactsStack}
        options={{
          headerShown: false,
          tabBarLabel: "",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              name="view-grid-plus-outline"
              color={color}
              size={26}
            />
          )
        }}
      />

      <Stack.Screen
        name="Add"
        component={AddNewPropertyStack}
        options={{
          headerShown: false,
          tabBarLabel: "",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              name="view-grid-plus-outline"
              color={color}
              size={26}
            />
          )
        }}
      />

      <Stack.Screen
        name="CustomerMeetingDetails"
        component={CustomerMeetingDetails}
        options={{ title: "Meeting Details" , headerBackTitle: "Back"}}
      />
      <Stack.Screen
        name="CustomerListForMeeting"
        component={CustomerListForMeeting}
        options={{ title: "Customer List" , headerBackTitle: "Back"}}
      />
      <Stack.Screen
        name="CustomerMeeting"
        component={CustomerMeeting}
        options={{ title: "Reminders", tabBarVisible: false , headerBackTitle: "Back"}}
        navigationOptions={{ tabBarVisible: false }}
      />
      <Stack.Screen
        name="CustomerDetailsResidentialRentFromList"
        component={CustomerDetailsResidentialRentFromList}
        options={{ title: "Customer Details" , headerBackTitle: "Back"}}
      />
      <Stack.Screen
        name="CustomerDetailsResidentialBuyFromList"
        component={CustomerDetailsResidentialBuyFromList}
        options={{ title: "Customer Details" , headerBackTitle: "Back"}}
      />
      <Stack.Screen
        name="CustomerDetailsCommercialRentFromList"
        component={CustomerDetailsCommercialRentFromList}
        options={{ title: "Customer Details" , headerBackTitle: "Back"}}
      />
      <Stack.Screen
        name="CustomerDetailsCommercialBuyFromList"
        component={CustomerDetailsCommercialBuyFromList}
        options={{ title: "Customer Details" , headerBackTitle: "Back"}}
      />
      <Stack.Screen
        name="PropertyListForMeeting"
        component={PropertyListForMeeting}
        options={{ title: "Property List", tabBarVisible: false , headerBackTitle: "Back"}}
        navigationOptions={{ tabBarVisible: false }}
      />

      <Stack.Screen
              name="EmployeeListOfListing"
              component={EmployeeList}
              options={{ title: "Employee" }}
            />

    </Stack.Navigator>
  );
};

export default ListingStack;
