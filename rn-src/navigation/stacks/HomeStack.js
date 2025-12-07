import * as React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Home from "./../../screens/dashboard/Home";

const HomeStack = createStackNavigator();

const HomeStackNav = () => {
  return (
    <HomeStack.Navigator
      screenOptions={{
        headerShown: false,
        headerTitleAlign: "center",
        // headerTintColor: "#fff",
        headerStyle: {
          backgroundColor: "#ffffff"
        },
        headerBackTitleVisible: false,
        headerTintColor: "rgba(105,105,105, .9)"
      }}
    >
      <HomeStack.Screen
        name="Home"
        component={Home}
        options={{ tabBarLabel: "Home!", tabBarVisible: false }}
      />
    </HomeStack.Navigator>
  );
};

export default HomeStackNav;
