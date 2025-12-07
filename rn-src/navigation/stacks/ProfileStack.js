import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { createMaterialBottomTabNavigator } from "react-native-paper/react-navigation";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import AntDesign from "react-native-vector-icons/AntDesign";

import Profile from "./../../screens/profile/Profile";
import ManageEmployee from "./../../screens/employee/ManageEmployee";
import EmployeeList from "./../../screens/employee/EmployeeList";
import ListingStack from "./ListingStack";
import ContactsStack from "./ContactsStack";
import ListingTopTab from "../tabs/ListingTopTabNavigator";
import ContactsTopTab from "../tabs/ContactsTopTabNavigator";

import PropDetailsFromListingForSell from "./../../screens/property/residential/sell/PropDetailsFromListingForSell";
import PropDetailsFromListing from "./../../screens/property/residential/rent/PropDetailsFromListing";
import CommercialRentPropDetails from "./../../screens/property/commercial/rent/CommercialRentPropDetails";
import CommercialSellPropDetails from "./../../screens/property/commercial/sell/CommercialSellPropDetails";

import CustomerDetailsResidentialRentFromList from "./../../screens/contacts/residential/rent/CustomerDetailsResidentialRentFromList";
import CustomerDetailsResidentialBuyFromList from "./../../screens/contacts/residential/buy/CustomerDetailsResidentialBuyFromList";
import CustomerDetailsCommercialRentFromList from "./../../screens/contacts/commercial/rent/CustomerDetailsCommercialRentFromList";
import CustomerDetailsCommercialBuyFromList from "./../../screens/contacts/commercial/buy/CustomerDetailsCommercialBuyFromList";
import MainScreen from "../main/AppNavigator";
import Login from "./../../screens/login/Login";

const Stack = createStackNavigator();

const ProfileStack = ({ route }) => {
  const { displayCheckBox, disableDrawer, displayCheckBoxForEmployee, item } = route.params || {};
  return (
    <Stack.Navigator
      screenOptions={{
        headerTitleAlign: "center",
        headerStyle: {
          backgroundColor: "#ffffff",
        },
        headerBackTitleVisible: false,
        headerTintColor: "rgba(105,105,105, .9)",
      }}
    >
      <Stack.Screen
        name="Profile"
        component={Profile}
        options={{ title: "Profile", headerShown: false }}
      />
      <Stack.Screen
        name="ManageEmployee"
        component={ManageEmployee}
        options={{ title: "Add New Employee" , headerBackTitle: "Back"}}
      />
      <Stack.Screen
        name="EmployeeList"
        component={EmployeeList}
        options={{ title: "Employee" }}
      />
      <Stack.Screen
        name="PropertyListing"
        component={ListingTopTab}
        initialParams={{
          displayCheckBox: false, // Pass your argument here
          disableDrawer: true,
          displayCheckBoxForEmployee: true,
          // employeeObj: item,
        }}
        options={{ title: "Properties", headerShown: true, tabBarLabel: "Home!" , headerBackTitle: "Back"}}
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
        name="ContactsListing"
        component={ContactsTopTab}
        options={{ title: "Customers", headerShown: true, tabBarLabel: "Home!" }}
        initialParams={{
          displayCheckBox: false, // Pass your argument here
          disableDrawer: true,
          displayCheckBoxForEmployee: true,
          // employeeObj: item,
        }}
      // options={{ tabBarLabel: "Home!" }}
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
        name="Login"
        component={Login}
        options={{
          headerShown: false, // Hide the header (optional)
          gestureEnabled: false, // Disable swipe back gesture
        }}
      />



    </Stack.Navigator>
  );
};

export default ProfileStack;