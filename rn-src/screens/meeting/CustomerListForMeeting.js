import React, { useState, useEffect } from "react";
import {
  FlatList,
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  AsyncStorage
} from "react-native";

import { connect } from "react-redux";
import {
  setUserMobile,
  setUserDetails,
  setPropReminderList,
  setCustomerListForMeeting
} from "./../../reducers/Action";
import ContactResidentialRentCard from "../contacts/residential/rent/ContactResidentialRentCard";
import ContactResidentialSellCard from "../contacts/residential/buy/ContactResidentialSellCard";
import CustomerCommercialRentCard from "../contacts/commercial/rent/CustomerCommercialRentCard";
import CustomerCommercialBuyCard from "../contacts/commercial/buy/CustomerCommercialBuyCard";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import AntDesign from "react-native-vector-icons/AntDesign";

import { BottomSheet } from "react-native-btr";
import { ButtonGroup } from "@rneui/themed";
import { HelperText, useTheme } from "react-native-paper";
import Button from "./../../components/Button";
import { Divider } from "react-native-paper";
import { SocialIcon } from "@rneui/themed";
import Slider from "./../../components/Slider";
import axios from "axios";
import { SERVER_URL } from "./../../utils/Constant";
import { EMPLOYEE_ROLE } from "./../../utils/AppConstant";
import { getBottomSpace } from "react-native-iphone-x-helper";

CustomerListForMeeting = props => {
  const { navigation } = props;
  // console.log("props.propertyDetails.property_type: ", props.propertyDetails.property_type)
  const propertyType = props.propertyDetails.property_type;
  const propertyFor = props.propertyDetails.property_for;
  const propertyAgentId = props.propertyDetails.agent_id;
  const [search, setSearch] = useState("");
  const [filteredDataSource, setFilteredDataSource] = useState([]);
  const [masterDataSource, setMasterDataSource] = useState([]);
  const [index, setIndex] = useState(null);
  const [data, setData] = useState([]);
  const [visible, setVisible] = useState(false);
  const [visibleSorting, setVisibleSorting] = useState(false);

  useEffect(() => {
    if (
      props.userDetails &&
      props.userDetails.works_for !== null
    ) {
      getCustomerList();
    }
    // // console.log("residential Listing useEffect");
  }, [props.userDetails]);

  const getCustomerList = () => {
    // const agentDetailsX = getAgentDetails();
    // console.log("props.route.params. " + JSON.stringify(props.route.params));

    // console.log("props.userDetail3 " + JSON.stringify(props.userDetails));
    const queryObj = {
      req_user_id: props.userDetails.works_for,
      agent_id: props.userDetails.works_for,
      property_type: propertyType,
      property_for: propertyFor,
      property_id: props.propertyDetails.property_id,
      property_agent_id: propertyAgentId
    };
    // console.log(JSON.stringify(queryObj));
    axios(SERVER_URL + "/getCustomerListForMeeting", {
      method: "post",
      headers: {
        "Content-type": "Application/json",
        Accept: "Application/json"
      },
      data: queryObj
    }).then(
      response => {
        // console.log("getCustomerList response.data:    ", response.data);
        setData(response.data);
        props.setCustomerListForMeeting(response.data);
      },
      error => {
        // console.log(error);
      }
    );
  };

  const ItemView = ({ item }) => {
    // // console.log(item);
    if (item.customer_locality.property_type === "Residential") {
      if (item.customer_locality.property_for === "Rent") {
        return (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate(
                "CustomerDetailsResidentialRentFromList",
                { item: item, displayMatchCount:false }
              )
            }
          >
            <ContactResidentialRentCard
              navigation={navigation}
              item={item}
              disableDrawer={true}
              displayCheckBox={true}
              navigatedFrom={"dont_show_matched_count"}
              displayMatchCount={false}
              displayMatchPercent={true}
            />
          </TouchableOpacity>
        );
      } else if (item.customer_locality.property_for === "Buy") {
        return (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("CustomerDetailsResidentialBuyFromList", { item: item, displayMatchCount:false })
            }
          >
            <ContactResidentialSellCard
              navigation={navigation}
              item={item}
              disableDrawer={true}
              displayCheckBox={true}
              navigatedFrom={"dont_show_matched_count"}
              displayMatchCount={false}
              displayMatchPercent={true}
            />
          </TouchableOpacity>
        );
      }
    } else if (item.customer_locality.property_type === "Commercial") {
      if (item.customer_locality.property_for === "Rent") {
        return (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate(
                "CustomerDetailsCommercialRentFromList",
                { item: item , displayMatchCount:false, displayMatchCount:false}
              )
            }
          >
            <CustomerCommercialRentCard
              navigation={navigation}
              item={item}
              disableDrawer={true}
              displayCheckBox={true}
              navigatedFrom={"dont_show_matched_count"}
              displayMatchCount={false}
              displayMatchPercent={true}
            />
          </TouchableOpacity>
        );
      } else if (item.customer_locality.property_for === "Buy") {
        return (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("CustomerDetailsCommercialBuyFromList", { item: item, displayMatchCount:false })
            }
          >
            <CustomerCommercialBuyCard
              navigation={navigation}
              item={item}
              disableDrawer={true}
              displayCheckBox={true}
              navigatedFrom={"dont_show_matched_count"}
              displayMatchCount={false}
              displayMatchPercent={true}
            />
          </TouchableOpacity>
        );
      }
    }
  };

  const updateIndex = index => {
    setIndex(index);
  };
  const toggleBottomNavigationView = () => {
    //Toggling the visibility state of the bottom sheet
    setVisible(!visible);
  };

  const toggleSortingBottomNavigationView = () => {
    //Toggling the visibility state of the bottom sheet
    setVisibleSorting(!visibleSorting);
  };

  const navigateTo = () => {
    navigation.navigate("AddNewCustomerStack");
  };

  const searchFilterFunction = text => {
    // Check if searched text is not blank
    if (text) {
      // Inserted text is not blank
      // Filter the masterDataSource and update FilteredDataSource
      const newData = props.customerListForMeeting.filter(function (item) {
        // Applying filter for the inserted text in search bar
        const itemData =
          item.customer_details.name +
          item.customer_details.address +
          item.customer_details.mobile1 +
          item.customer_locality.location_area.map(item => item.main_text).join(', ')+
          item.customer_id;
        // item.customer_locality.location_area;

        const textData = text.toUpperCase();
        return itemData.toUpperCase().indexOf(textData) > -1;
      });
      setData(newData);
      setSearch(text);
    } else {
      // Inserted text is blank
      // Update FilteredDataSource with masterDataSource
      setData(props.customerListForMeeting);
      setSearch(text);
    }
  };

  useEffect(() => {
    if (props.residentialCustomerList.length > 0 || props.commercialCustomerList.length) {
      getCustomerList();
    }
  }, [props.residentialCustomerList, props.commercialCustomerList])

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.searchBarContainer}>
        <View style={styles.searchBar}>
          <AntDesign name="search1" size={20} color="#999" style={{ marginRight: 5, }} />
          {/* <View style={{ flexDirection: "row", margin: 10, justifyContent: "space-between" }}>
                    <Text>For Rent: {rentPropCount.length}</Text>
                    <Text>For Sell: {sellPropCount.length}</Text>
                  </View> */}
          <TextInput
            style={styles.textInputStyle}
            onChangeText={text => searchFilterFunction(text)}
            value={search}
            underlineColorAndroid="transparent"
            placeholder="Search By Name, Address, Id, Mobile"
            placeholderTextColor="#696969"
          />
        </View>

      </View>
      {data.length > 0 ? (
        <View style={styles.container}>
          <FlatList
            data={data}
            //data defined in constructor
            // ItemSeparatorComponent={ItemSeparatorView}
            //Item Separator View
            renderItem={ItemView}
            keyExtractor={(item, index) => index.toString()}
          />
          {/* <View style={styles.fab}>
            <TouchableOpacity
              onPress={() => toggleSortingBottomNavigationView()}
              style={styles.fabIcon1}
            >
              <MaterialCommunityIcons name="sort" color={"#ffffff"} size={26} />
            </TouchableOpacity>
            <View style={styles.verticalLine}></View>
            <TouchableOpacity
              onPress={() => toggleBottomNavigationView()}
              style={styles.fabIcon2}
            >
              <MaterialCommunityIcons
                name="filter-variant-plus"
                color={"#ffffff"}
                size={26}
              />
            </TouchableOpacity>
          </View> */}
        </View>
      ) : (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center"
          }}
        >
          <Text style={{ textAlign: "center" }}>You have no customer</Text>
          {props.userDetails && ((props.userDetails.works_for === props.userDetails.id) ||
            (props.userDetails.user_type === "employee" && EMPLOYEE_ROLE.includes(props.userDetails.employee_role)
            )) ?
            <TouchableOpacity onPress={() => navigateTo()}>
              <Text
                style={{ color: "#00BFFF", textAlign: "center", marginTop: 20 }}
              >
                Add New Customer
              </Text>
            </TouchableOpacity> : null}
        </View>
      )}
      {/* Bottom for filters */}
      {/* <BottomSheet
        visible={visible}
        //setting the visibility state of the bottom shee
        onBackButtonPress={toggleBottomNavigationView}
        //Toggling the visibility state on the click of the back botton
        onBackdropPress={toggleBottomNavigationView}
      //Toggling the visibility state on the clicking out side of the sheet
      >
        

        <View style={styles.bottomNavigationView}>
          <Text style={{ marginTop: 15, fontSize: 16, fontWeight: "600" }}>
            Filter
          </Text>
          <TouchableOpacity
            onPress={() => toggleBottomNavigationView()}
            style={{ position: "absolute", top: 10, right: 10 }}
          >
            <MaterialCommunityIcons
              name="restart"
              color={"#000000"}
              size={30}
            />
          </TouchableOpacity>
          <ScrollView style={{ marginTop: 10, marginBottom: 20 }}>
            <Text style={styles.marginBottom10}>Looking For</Text>
            <View style={styles.propSubSection}>
              <ButtonGroup
                selectedBackgroundColor="rgba(27, 106, 158, 0.85)"
                onPress={updateIndex}
                selectedIndex={index}
                buttons={["RENT", "Sell"]}
                // containerStyle={{ height: 30 }}
                textStyle={{ textAlign: "center" }}
                selectedTextStyle={{ color: "#fff" }}
                containerStyle={{ borderRadius: 10, width: 350 }}
                containerBorderRadius={10}
              />
            </View>
            
            <Text style={styles.marginBottom10}>Home type</Text>
            <View style={styles.propSubSection}>
              <ButtonGroup
                selectedBackgroundColor="rgba(27, 106, 158, 0.85)"
                onPress={updateIndex}
                selectedIndex={index}
                buttons={["Apartment", "Villa", "Independent House", "Any"]}
                // containerStyle={{ height: 30 }}
                textStyle={{ textAlign: "center" }}
                selectedTextStyle={{ color: "#fff" }}
                containerStyle={{ borderRadius: 10, width: 350 }}
                containerBorderRadius={10}
              />
            </View>
            <Text style={styles.marginBottom10}>BHK type</Text>
            <View style={styles.propSubSection}>
              <ButtonGroup
                selectedBackgroundColor="rgba(27, 106, 158, 0.85)"
                onPress={updateIndex}
                selectedIndex={index}
                buttons={["1RK", "1BHK", "2BHK", "3BHK", "4BHK", "4+BHK"]}
                // containerStyle={{ height: 30 }}
                textStyle={{ textAlign: "center" }}
                selectedTextStyle={{ color: "#fff" }}
                containerStyle={{ borderRadius: 10, width: 350 }}
                containerBorderRadius={10}
              />
            </View>
            <Text>Rent Range</Text>
            <Slider />
            <Text style={styles.marginBottom10}>Availability</Text>
            <View style={styles.propSubSection}>
              <ButtonGroup
                selectedBackgroundColor="rgba(27, 106, 158, 0.85)"
                onPress={updateIndex}
                selectedIndex={index}
                buttons={["Immediate", "15 Days", "30 Days", "30+ Days"]}
                // containerStyle={{ height: 30 }}
                textStyle={{ textAlign: "center" }}
                selectedTextStyle={{ color: "#fff" }}
                containerStyle={{ borderRadius: 10, width: 350 }}
                containerBorderRadius={10}
              />
            </View>
            <Text style={styles.marginBottom10}>Furnishing</Text>
            <View style={styles.propSubSection}>
              <ButtonGroup
                selectedBackgroundColor="rgba(27, 106, 158, 0.85)"
                onPress={updateIndex}
                selectedIndex={index}
                buttons={["Full", "Semi", "Empty", "Any"]}
                // containerStyle={{ height: 30 }}
                textStyle={{ textAlign: "center" }}
                selectedTextStyle={{ color: "#fff" }}
                containerStyle={{ borderRadius: 10, width: 350 }}
                containerBorderRadius={10}
              />
            </View>
            <Button
              title="Apply"
              onPress={() => navigation.navigate("AddImages")}
            />
          </ScrollView>
        </View>
      </BottomSheet> */}

      {/* Bottom sheet for sorting */}
      {/* <BottomSheet
        visible={visibleSorting}
        //setting the visibility state of the bottom shee
        onBackButtonPress={toggleSortingBottomNavigationView}
        //Toggling the visibility state on the click of the back botton
        onBackdropPress={toggleSortingBottomNavigationView}
      //Toggling the visibility state on the clicking out side of the sheet
      >
        

        <View style={styles.sortingBottomNavigationView}>
          <Text style={{ marginTop: 15, fontSize: 16, fontWeight: "600" }}>
            Sort By
          </Text>

          <ScrollView style={{ marginTop: 10, marginBottom: 20 }}>
            <Text style={styles.marginBottom10}>Rent</Text>
            <View style={styles.propSubSection}>
              <ButtonGroup
                selectedBackgroundColor="rgba(27, 106, 158, 0.85)"
                onPress={updateIndex}
                selectedIndex={index}
                buttons={["Lowest First", "Highest First"]}
                // containerStyle={{ height: 30 }}
                textStyle={{ textAlign: "center" }}
                selectedTextStyle={{ color: "#fff" }}
                containerStyle={{ borderRadius: 10, width: 350 }}
                containerBorderRadius={10}
              />
            </View>
            <Text style={styles.marginBottom10}>Availability</Text>
            <View style={styles.propSubSection}>
              <ButtonGroup
                selectedBackgroundColor="rgba(27, 106, 158, 0.85)"
                onPress={updateIndex}
                selectedIndex={index}
                buttons={["Earliest First", "Oldest First"]}
                // containerStyle={{ height: 30 }}
                textStyle={{ textAlign: "center" }}
                selectedTextStyle={{ color: "#fff" }}
                containerStyle={{ borderRadius: 10, width: 350 }}
                containerBorderRadius={10}
              />
            </View>

            <Text style={styles.marginBottom10}>Posted date</Text>
            <View style={styles.propSubSection}>
              <ButtonGroup
                selectedBackgroundColor="rgba(27, 106, 158, 0.85)"
                onPress={updateIndex}
                selectedIndex={index}
                buttons={["Recent First", "Oldest Fist"]}
                // containerStyle={{ height: 30 }}
                textStyle={{ textAlign: "center" }}
                selectedTextStyle={{ color: "#fff" }}
                containerStyle={{ borderRadius: 10, width: 350 }}
                containerBorderRadius={10}
              />
            </View>
          </ScrollView>
        </View>
      </BottomSheet> */}
      {props.userDetails && ((props.userDetails.works_for === props.userDetails.id) ||
        (props.userDetails.user_type === "employee" && EMPLOYEE_ROLE.includes(props.userDetails.employee_role)
        ))
        //   ? 
        //   <TouchableOpacity
        //     style={{
        //       // borderWidth: 1,
        //       // borderColor: "rgba(0,0,0,0.2)",
        //       alignItems: "center",
        //       justifyContent: "center",
        //       // width: 40,
        //       position: "absolute",
        //       bottom: 15,
        //       right: 10,
        //       // height: 40,
        //       backgroundColor: "#01a699",
        //       borderRadius: 100
        //     }}
        //     onPress={() => navigation.navigate("AddNewCustomerStack")}
        //   >
        //   <AntDesign name="pluscircleo" size={40} color="#ffffff" />
        //   {/* <Image style={{ width: 50, height: 50, resizeMode: 'contain' }} source={require('assets/imgs/group.png')} /> */}
        // </TouchableOpacity> 
        // : null
      }
    </View>
  );
};

const mapStateToProps = state => ({
  userDetails: state.AppReducer.userDetails,
  propReminderList: state.AppReducer.propReminderList,
  customerListForMeeting: state.AppReducer.customerListForMeeting,
  propertyDetails: state.AppReducer.propertyDetails,
  commercialCustomerList: state.AppReducer.commercialCustomerList,
  residentialCustomerList: state.AppReducer.residentialCustomerList
});

const mapDispatchToProps = {
  setUserMobile,
  setUserDetails,
  setPropReminderList,
  setCustomerListForMeeting
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CustomerListForMeeting);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 5
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
    paddingLeft: 0,
    margin: 5,
    // marginBottom: 5,
    borderRadius: 10,
    // borderColor: "#009688",
    backgroundColor: "#FFFFFF"
  },
  marginBottom10: {
    marginBottom: 10
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
});
