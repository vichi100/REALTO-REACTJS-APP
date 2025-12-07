import * as React from "react";
import { Text, View, TextInput, StyleSheet, StatusBar } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { Ionicons } from "@expo/vector-icons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import ListingResidential from "./../../screens/property/residential/ListingResidential";
import ListingCommercial from "./../../screens/property/commercial/ListingCommercial";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
  SafeAreaView
} from 'react-native-safe-area-context';

const Tab = createMaterialTopTabNavigator();

const ListingTopTab = ({ route })  => {

  const { displayCheckBox, disableDrawer, displayCheckBoxForEmployee, item} = route.params || {};

  return (
   
    <View style={{ flex: 1 }}>
      {/* <View style={styles.container}>
        <Text style={{textAlign:"center", fontSize:16, fontWeight:500}}>My Listings</Text>
      </View> */}
      <Tab.Navigator
        activeColor="rgb(135,206,235)"
        inactiveColor="rgb(105,105,105)"
        
        screenOptions={{
          // showIcon: true,
          showLabel: true,
          tabBarIndicatorStyle: {
            borderBottomWidth: 2,
            borderBottomColor: 'rgb(2,171,61)',
          },
          // tabBarActiveTintColor: 'tomato',
          // tabBarInactiveTintColor: 'gray',
          style: {
            // backgroundColor: "rgba(105,105,105, 0.1)",
            // flex: 1,
            flexDirection: "column"
          }
        }}
      // style={{
      //   backgroundColor: "#000000",
      //   height: 165,
      //   borderBottomColor: "#D3D3D3"
      // }}
      >
        <Tab.Screen
          name="Residential"
          component={ListingResidential}
          initialParams={{
            displayCheckBox: displayCheckBox, // Pass your argument here
            disableDrawer: disableDrawer,
            displayCheckBoxForEmployee: displayCheckBoxForEmployee,
            employeeObj: item,
          }}
          // color={"rgba(50, 195, 77, 0.59)"}
          options={{
            tabBarLabel: () => (
              <View
                style={{
                  flexDirection: "row"
                  // backgroundColor: "rgba(50, 195, 77, 0.59)"
                }}
              >
                <Ionicons name="home-outline" color="#616161" size={24} />
                <Text
                  style={{
                    marginLeft: 5,
                    paddingTop: 5,
                    fontSize: 12,
                    color: "#616161"
                  }}
                >
                  RESIDENTIAL PROPERTY
                </Text>
              </View>
            )
            // tabBarIcon: ({ color }) => (
            //   <Ionicons name="notifications-outline" color={color} size={20} />
            // )
          }}
        />
        <Tab.Screen
          name="Commercial"
          component={ListingCommercial}
          initialParams={{
            displayCheckBox: displayCheckBox, // Pass your argument here
            disableDrawer: disableDrawer,
            displayCheckBoxForEmployee: displayCheckBoxForEmployee,
            employeeObj: item,
          }}
          options={{
            tabBarLabel: () => (
              <View style={{ flexDirection: "row" }}>
                <MaterialCommunityIcons
                  name="city-variant-outline"
                  color="#616161"
                  size={24}
                />
                <Text
                  style={{
                    marginLeft: 5,
                    paddingTop: 5,
                    fontSize: 12,
                    color: "#616161"
                  }}
                >
                  COMMERCIAL PROPERTY
                </Text>
              </View>
            )
            // tabBarIcon: ({ color }) => (
            //   <Ionicons name="notifications-outline" color={color} size={20} />
            // )
          }}
        />
      </Tab.Navigator>
    </View>
    
  );
};

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    margin: 5,
    backgroundColor: 'transparent',
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

export default ListingTopTab;
