import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  FlatList,
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  AsyncStorage,
  ActivityIndicator,
} from "react-native";

import { connect } from "react-redux";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import AntDesign from "react-native-vector-icons/AntDesign";

import { HelperText, useTheme } from "react-native-paper";
import Button from "./../../components/Button";
import { Divider } from "react-native-paper";
import { SocialIcon } from "@rneui/themed";
import axios from "axios";
import { SERVER_URL } from "./../../utils/Constant";
import { EMPLOYEE_ROLE } from "./../../utils/AppConstant";
import { getBottomSpace } from "react-native-iphone-x-helper";

import { setEmployeeList } from "./../../reducers/Action";
import EmployeeCard from "../employee/EmployeeCard";
import { useFocusEffect } from '@react-navigation/native';

import { useDispatch } from 'react-redux'; // For functional components
import { triggerRefresh } from './../../reducers/dataRefreshReducer'; // Import the action creator

const EmployeeList = props => {
  const { navigation } = props;
  const {
    itemForAddEmplyee = null, // this will pass value from property or customer card
    disableDrawer = false,
    displayCheckBox = false
  } = props.route.params || {}; // Add null check and default values
  const [search, setSearch] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState(false); // Add a state to trigger re-render

  const dispatch = useDispatch();


  useFocusEffect(
    useCallback(() => {
      // This function will be called when Screen A comes into focus
      console.log("useFocusEffect")
      getListing();

      // Optional: Return a cleanup function if needed
      return () => {
        // This function will be called when Screen A loses focus
        // You can perform cleanup here if necessary
      };
    }, []) // Re-run the effect if fetchData function changes (unlikely here)
  );


  useEffect(() => {
    if (
      props.userDetails &&
      props.userDetails.works_for !== null
    ) {
      getListing();
    }
  }, [props.userDetails]);

  const getListing = () => {
    const user = {
      req_user_id: props.userDetails.works_for,
      agent_id: props.userDetails.works_for
    };
    setLoading(true);
    axios(SERVER_URL + "/employeeList", {
      method: "post",
      headers: {
        "Content-type": "Application/json",
        Accept: "Application/json"
      },
      data: user
    }).then(
      response => {
        setData(response.data);
        props.setEmployeeList(response.data);
        setLoading(false);
      },
      error => {
        console.log(error);
        setLoading(false);
      }
    );
  };

  const searchFilterFunction = text => {
    if (text) {
      const newData = props.employeeList.filter(function (item) {
        const itemData = item.name + item.mobile;
        const textData = text.toUpperCase();
        return itemData.toUpperCase().indexOf(textData) > -1;
      });
      setData(newData);
      setSearch(text);
    } else {
      setData(props.residentialCustomerList);
      setSearch(text);
    }
  };

  // delete employee
  const deleteMe = (empObj) => {
    const user = {
      req_user_id: props.userDetails.id,
      agent_id: props.userDetails.works_for,
      employee_id: empObj.id
    };
    axios(SERVER_URL + "/deleteEmployee", {
      method: "post",
      headers: {
        "Content-type": "Application/json",
        Accept: "Application/json"
      },
      data: user
    }).then(
      response => {
        // console.log(response.data);
        if (response.data === "success") {
          const x = props.employeeList.filter(function (el) {
            return el.id !== empObj.id;
          });
          props.setEmployeeList([...x]);
          // After successful DB update, dispatch the refresh action
          dispatch(triggerRefresh());
        }
        // setData(response.data);
      },
      error => {
        // console.log(error);
      }
    );
    setData((data) => data.filter((item) => item.id !== empObj.id));
    setRefresh(!refresh); // Trigger re-render
  }

  const ItemView = ({ item }) => (
    <EmployeeCard
      navigation={navigation}
      item={item}
      itemForAddEmplyee={itemForAddEmplyee}
      deleteMe={deleteMe}
      disableDrawer={disableDrawer}
      displayCheckBox={displayCheckBox}
    />
  );

  const ItemSeparatorView = () => (
    <View style={{ height: 0.5, width: "100%", backgroundColor: "#C8C8C8" }} />
  );

  const FlatListFooter = () => {
    return (
      <View style={{ padding: 10, alignItems: 'center' }}>
        <Text style={{ color: '#fff' }} testID="end_of_list">End</Text>
      </View>
    );
  };

  const navigateTo = () => {
    navigation.navigate("ManageEmployee");
  };

  useEffect(() => {
    if (props.residentialCustomerList.length > 0) {
      setData(props.residentialCustomerList)
    }
  }, [props.residentialCustomerList])

  return (
    loading ? <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(245,245,245, .4)'
      }}
    >
      <ActivityIndicator animating size="large" color={'#000'} />
    </View> :
      <View style={{ flex: 1 }}>
        <View style={styles.searchBar}>
          <AntDesign name="search1" size={20} color="#999" style={{ marginRight: 5, }} />
          <TextInput
            style={styles.textInputStyle}
            onChangeText={text => searchFilterFunction(text)}
            value={search}
            underlineColorAndroid="transparent"
            placeholder="Search By Name, Mobile"
            placeholderTextColor="#000"
          />
        </View>
        {data.length > 0 ? (
          <View style={styles.container}>
            <FlatList
              data={data}
              renderItem={ItemView}
              keyExtractor={(item, index) => index.toString()}
              ListFooterComponent={FlatListFooter} // Pass the footer component here
            />
            <View style={styles.fab}>
              <TouchableOpacity
                onPress={() => console.log("Sort")}
                style={styles.fabIcon1}
              >
                <MaterialCommunityIcons name="sort" color={"#ffffff"} size={26} />
              </TouchableOpacity>
              <View style={styles.verticalLine}></View>
              <TouchableOpacity
                onPress={() => console.log("Filter")}
                style={styles.fabIcon2}
              >
                <MaterialCommunityIcons
                  name="filter-variant-plus"
                  color={"#ffffff"}
                  size={26}
                />
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.container}>
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                textAlign: "center"
              }}
            >
              <Text style={{ textAlign: "center" }}>
                You have no Employee
              </Text>

              {props.userDetails && ((props.userDetails.works_for === props.userDetails.id) ||
                (props.userDetails.user_type === "employee" && EMPLOYEE_ROLE.includes(props.userDetails.employee_role)
                )) ?
                <TouchableOpacity onPress={() => navigateTo()}>

                  <Text
                    style={{ color: "#00BFFF", textAlign: "center", marginTop: 20 }}
                  >
                    Add New Employee
                  </Text>
                </TouchableOpacity> : null}
            </View>
          </View>)}
        {props.userDetails && ((props.userDetails.works_for === props.userDetails.id) ||
          (props.userDetails.user_type === "employee" && EMPLOYEE_ROLE.includes(props.userDetails.employee_role)
          )) ?
          <TouchableOpacity
            style={styles.addButton}
            accessibilityLabel="add_employee_icon"
            onPress={() => navigation.navigate("ManageEmployee")}
          >
            <AntDesign name="pluscircleo" size={40} color="#ffffff" />
          </TouchableOpacity> : null}
      </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 5
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  fab: {
    flexDirection: "row",
    position: "absolute",
    width: 130,
    height: 35,
    alignItems: "center",
    justifyContent: "center",
    right: "33%",
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
  addButton: {
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    bottom: 15,
    right: 10,
    backgroundColor: "rgba(255, 148, 112, 1)",
    borderRadius: 100
  },
  textInputStyle: {
    width: "98%",
    height: 40,
    paddingLeft: 20,
    margin: 5,
    borderRadius: 10,
    backgroundColor: "#FFFFFF"
  },
});

const mapStateToProps = state => ({
  userDetails: state.AppReducer.userDetails,
  residentialCustomerList: state.AppReducer.residentialCustomerList,
  employeeList: state.AppReducer.employeeList
});
const mapDispatchToProps = {
  setEmployeeList
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EmployeeList);