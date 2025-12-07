import * as React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import LocalityDetails from "./../../screens/property/LocalityDetailsForm";

const Stack = createStackNavigator();

function LocalityDetailsNav() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="LocalityDetails"
        component={LocalityDetails}
        options={{ title: "Locality Details" , headerBackTitle: "Back"}}
      />
    </Stack.Navigator>
  );
}

export default LocalityDetailsNav;
