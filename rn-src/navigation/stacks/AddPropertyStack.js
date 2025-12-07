import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";

import AddNewProperty from "./../../screens/property/AddNewProperty";
import LocalityDetailsForm from "./../../screens/property/LocalityDetailsForm";
import ResidentialPropertyDetailsForm from "./../../screens/property/residential/ResidentialPropertyDetailsForm";
import CommercialPropertyDetailsForm from "./../../screens/property/commercial/CommercialPropertyDetailsForm";

import RentDetailsForm from "./../../screens/property/residential/rent/RentDetailsForm";
import SellDetailsForm from "./../../screens/property/residential/sell/SellDetailsForm";
import AddImages from "./../../screens/property/AddImages";
import AddNewPropFinalDetails from "./../../screens/property/residential/rent/AddNewPropFinalDetails";
import AddNewPropSellFinalDetails from "./../../screens/property/residential/sell/AddNewPropSellFinalDetails";

import AddNewPropCommercialRentFinalDetails from "./../../screens/property/commercial/rent/AddNewPropCommercialRentFinalDetails";
import AddNewPropCommercialSellFinalDetails from "./../../screens/property/commercial/sell/AddNewPropCommercialSellFinalDetails";

const Stack = createStackNavigator();
const AddNewPropertyStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
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
        name="AddNewProperty"
        component={AddNewProperty}
        options={{
          title: "Add New Property",
          headerBackTitleVisible: false
          // headerShown: false
          // headerLeft: () => {
          //   return null;
          // }
        }}
      />
      <Stack.Screen
        name="LocalityDetailsForm"
        component={LocalityDetailsForm}
        options={{ title: "Locality Details" ,headerBackTitle: "Back",}}
      />

      <Stack.Screen
        name="ResidentialPropertyDetailsForm"
        component={ResidentialPropertyDetailsForm}
        options={{ title: "Property Details" ,headerBackTitle: "Back"}}
      />

      <Stack.Screen
        name="CommercialPropertyDetailsForm"
        component={CommercialPropertyDetailsForm}
        options={{ title: "Property Details" ,headerBackTitle: "Back"}}
      />

      <Stack.Screen
        name="RentDetailsForm"
        component={RentDetailsForm}
        options={{ title: "Rent Details" ,headerBackTitle: "Back"}}
      />

      <Stack.Screen
        name="SellDetailsForm"
        component={SellDetailsForm}
        options={{ title: "Sell Details" ,headerBackTitle: "Back"}}
      />

      <Stack.Screen
        name="AddImages"
        component={AddImages}
        options={{ title: "Add Images" ,headerBackTitle: "Back"}}
      />
      <Stack.Screen
        name="AddNewPropFinalDetails"
        component={AddNewPropFinalDetails}
        options={{ title: "Final Details",headerBackTitle: "Back" }}
      />

      <Stack.Screen
        name="AddNewPropSellFinalDetails"
        component={AddNewPropSellFinalDetails}
        options={{ title: "Final Details" ,headerBackTitle: "Back"}}
      />

      <Stack.Screen
        name="AddNewPropCommercialRentFinalDetails"
        component={AddNewPropCommercialRentFinalDetails}
        options={{ title: "Final Details" }}
      />
      <Stack.Screen
        name="AddNewPropCommercialSellFinalDetails"
        component={AddNewPropCommercialSellFinalDetails}
        options={{ title: "Final Details" ,headerBackTitle: "Back"}}
      />
    </Stack.Navigator>
  );
};

export default AddNewPropertyStack;
