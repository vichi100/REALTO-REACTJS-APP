import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import Home from "./../../screens/dashboard/Home";
// Listing was unused/misreferenced — remove the import to avoid bundler errors

const Stack = createStackNavigator();

function MainStackNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={Home}
          options={{ title: "Home Screen" }}
        />
        
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default MainStackNavigator;
