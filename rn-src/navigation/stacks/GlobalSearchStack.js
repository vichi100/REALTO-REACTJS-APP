import * as React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import GlobalSearch from "./../../screens/search/GlobalSearch";
import GlobalResidentialPropertySearchResult from "./../../screens/search/GlobalResidentialPropertySearchResult";
import GlobalCommercialPropertySearchResult from "./../../screens/search/GlobalCommercialPropertySearchResult";
import GlobalResidentialContactsSearchResult from "./../../screens/search/GlobalResidentialContactsSearchResult";
import GlobalCommercialCustomersSearchResult from "./../../screens/search/GlobalCommercialCustomersSearchResult";
import PropDetailsFromListingForSell from "./../../screens/property/residential/sell/PropDetailsFromListingForSell";
import CustomerMeetingDetails from "././../../screens/contacts/CustomerMeetingDetails";
import MatchedCustomers from "./../../screens/contacts/MatchedCustomers";
import MatchedProperties from "./../../screens/property/MatchedProperties";
import CustomerDetailsResidentialRentFromList from "./../../screens/contacts/residential/rent/CustomerDetailsResidentialRentFromList";
import CustomerDetailsResidentialBuyFromList from "./../../screens/contacts/residential/buy/CustomerDetailsResidentialBuyFromList";
import Meeting from "./../../screens/meeting/Meeting";
import CustomerMeeting from "../../screens/contacts/CustomerMeeting";
import PropertyListForMeeting from "./../../screens/contacts/PropertyListForMeeting";
import PropDetailsFromListing from "./../../screens/property/residential/rent/PropDetailsFromListing";
import CustomerListForMeeting from "./../../screens/meeting/CustomerListForMeeting";
import EmployeeList from "./../../screens/employee/EmployeeList";

const Stack = createStackNavigator();

const GlobalSearchStackNav = () => {
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
        name="GlobalSearch"
        component={GlobalSearch}
        options={{ title: "Global Search", tabBarLabel: "Home!", tabBarVisible: false, headerShown: false, headerBackTitle: "Back" }}
      />
      <Stack.Screen
        name="GlobalResidentialPropertySearchResult"
        component={GlobalResidentialPropertySearchResult}
        options={{ title: "Results", tabBarLabel: "Home!", tabBarVisible: false, headerShown: true }}
      />
      <Stack.Screen
        name="GlobalCommercialPropertySearchResult"
        component={GlobalCommercialPropertySearchResult}
        options={{ title: "Results", tabBarLabel: "Home!", tabBarVisible: false, headerShown: true }}
      />
      <Stack.Screen
        name="GlobalResidentialContactsSearchResult"
        component={GlobalResidentialContactsSearchResult}
        options={{ title: "Results", tabBarLabel: "Home!", tabBarVisible: false, headerShown: true }}
      />
      <Stack.Screen
        name="GlobalCommercialCustomersSearchResult"
        component={GlobalCommercialCustomersSearchResult}
        options={{ title: "Results", tabBarLabel: "Home!", tabBarVisible: false, headerShown: true }}
      />
      {/* <Stack.Screen
        name="PropDetailsFromListing"
        component={PropDetailsFromListing}
        navigationOptions={{ tabBarVisible: false }}
        options={{
          title: "Property Details",
          headerShown: true
        }}
      /> */}
      <Stack.Screen
        name="CustomerMeetingDetails"
        component={CustomerMeetingDetails}
        options={{ title: "Meeting Details", headerShown: true, headerBackTitle: "Back" }}
      />

      <Stack.Screen
        name="MatchedCustomers"
        component={MatchedCustomers}
        options={{
          title: "Matched Customers",
          tabBarStyle: {
            display: "none",
          },
          tabBarButton: () => null,
        }}

      />
      <Stack.Screen
        name="MatchedProperties"
        component={MatchedProperties}
        options={{ title: "Matched Properties", headerBackTitle: "Back" }}
      />

      <Stack.Screen
        name="CustomerDetailsResidentialRentFromList"
        component={CustomerDetailsResidentialRentFromList}
        options={{ title: "Customer Details", headerBackTitle: "Back" }}
      />
      <Stack.Screen
        name="CustomerDetailsResidentialBuyFromList"
        component={CustomerDetailsResidentialBuyFromList}
        options={{ title: "Customer Details", headerBackTitle: "Back" }}
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
        name="Meeting"
        component={Meeting}
        options={{ title: "Reminders", tabBarVisible: false }}
        navigationOptions={{ tabBarVisible: false }}
      />

      <Stack.Screen
        name="CustomerMeeting"
        component={CustomerMeeting}
        options={{ title: "Reminders", tabBarVisible: false }}
        navigationOptions={{ tabBarVisible: false }}
      />

      <Stack.Screen
        name="PropertyListForMeeting"
        component={PropertyListForMeeting}
        options={{ title: "Property List", tabBarVisible: false }}
        navigationOptions={{ tabBarVisible: false }}
      />

      <Stack.Screen
        name="CustomerListForMeeting"
        component={CustomerListForMeeting}
        options={{ title: "Customer List", headerBackTitle: "Back" }}
      />

      <Stack.Screen
        name="EmployeeListOfListing"
        component={EmployeeList}
        options={{ title: "Employee", headerBackTitle: "Back" }}
      />

    </Stack.Navigator>
  );
};

export default GlobalSearchStackNav;
