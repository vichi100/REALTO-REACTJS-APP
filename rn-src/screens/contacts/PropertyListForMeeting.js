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
import CardResidentialRent from "../property/residential/rent/ResidentialRentCard";
import CardResidentialSell from "../property/residential/sell/ResidentialSellCard";
import axios from "axios";
import { SERVER_URL } from "./../../utils/Constant";
import { EMPLOYEE_ROLE } from "./../../utils/AppConstant";
import { getBottomSpace } from "react-native-iphone-x-helper";

import CardRent from "../property/commercial/rent/CommercialRentCard";
import CardSell from "../property/commercial/sell/CommercialSellCard"; //"../property/commercial/sell/CommercialSellCard";
import { setPropertyListingForMeeting } from "./../../reducers/Action";

const PropertyListForMeeting = props => {
  const { navigation } = props;
  // console.log("props.customerDetails.customer_locality : ", props.customerDetails.customer_locality)
  const propertyType = props.customerDetails.customer_locality.property_type;
  const propertyFor = props.customerDetails.customer_locality.property_for;
  const [search, setSearch] = useState("");
  const [filteredDataSource, setFilteredDataSource] = useState([]);
  const [masterDataSource, setMasterDataSource] = useState([]);
  const [index, setIndex] = useState(null);
  const [data, setData] = useState([]);

  useEffect(() => {
    // // console.log(
    //   "props.userDetail33 " +
    //     JSON.stringify(props.userDetails.works_for)
    // );
    if (
      props.userDetails &&
      props.userDetails.works_for !== null
    ) {
      getListing();
    }
    // console.log("residential Listing useEffect");
  }, [props.userDetails]);


  useEffect(() => {
    if (props.commercialPropertyList.length > 0 || props.residentialPropertyList.length > 0) {
      getListing()
    }
  }, [props.commercialPropertyList, props.residentialPropertyList])

  const getListing = () => {
    // const agentDetailsX = getAgentDetails();
    // console.log("props.userDetail3 " + JSON.stringify(props.userDetails));
    const user = {
      req_user_id: props.userDetails.works_for,
      agent_id: props.userDetails.works_for,
      property_type: propertyType,
      property_for: propertyFor,
      customer_id: props.customerDetails.customer_id,
      agent_id_of_client: props.customerDetails.agent_id,
    };
    // console.log(JSON.stringify(user));
    axios(SERVER_URL + "/getPropertyListingForMeeting", {
      // getPropertyListingForMeeting
      method: "post",
      headers: {
        "Content-type": "Application/json",
        Accept: "Application/json"
      },
      data: user
    }).then(
      response => {
        // // console.log(response.data);
        response.data.map(item => {
          item.image_urls.map(image => {
            image.url = SERVER_URL + image.url
          })
        })
        setData(response.data);
        props.setPropertyListingForMeeting(response.data);
      },
      error => {
        // console.log(error);
      }
    );
  };

  const updateIndex = index => {
    setIndex(index);
  };

  const searchFilterFunction = text => {
    // Check if searched text is not blank
    if (text) {
      // Inserted text is not blank
      // Filter the masterDataSource and update FilteredDataSource
      const newData = props.propertyListingForMeeting.filter(function (item) {
        // Applying filter for the inserted text in search bar
        const itemData =
          item.property_address.building_name +
          item.property_address.landmark_or_street +
          item.property_address.formatted_address +
          item.owner_details.name +
          item.owner_details.mobile1;

        const textData = text.toUpperCase();
        return itemData.toUpperCase().indexOf(textData) > -1;
      });
      setData(newData);
      setSearch(text);
    } else {
      // Inserted text is blank
      // Update FilteredDataSource with masterDataSource
      setData(props.propertyListingForMeeting);
      setSearch(text);
    }
  };

  const ItemView = ({ item }) => {
    // // console.log(item);
    if (item.property_type === "Residential") {
      if (item.property_for === "Rent") {
        return (
          <TouchableOpacity
            onPress={() => navigation.navigate("PropDetailsFromListing", {
              item:item,
              displayMatchCount: false,  
              displayMatchPercent: true 
            })
          }
          >
            <CardResidentialRent
              navigation={navigation}
              item={item}
              disableDrawer={true}
              displayCheckBox={true}
              displayMatchCount={false}
              displayMatchPercent={true}
            />
          </TouchableOpacity>
        );
      } else if (item.property_for === "Sell") {
        return (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("PropDetailsFromListingForSell", {
                item:item,
                displayMatchCount: false,
                displayMatchPercent: true
              })
            }
          >
            <CardResidentialSell
              navigation={navigation}
              item={item}
              disableDrawer={true}
              displayCheckBox={true}
              displayMatchCount={false}
              displayMatchPercent={true}
            />
          </TouchableOpacity>
        );
      }
    } else if (item.property_type === "Commercial") {
      if (item.property_for === "Rent") {
        return (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("CommercialRentPropDetails", {
                item:item,
                displayMatchCount: false,
                displayMatchPercent: true
              })
            }
          >
            <CardRent
              navigation={navigation}
              item={item}
              disableDrawer={true}
              displayCheckBox={true}
              displayMatchCount={false}
              displayMatchPercent={true}
            />
          </TouchableOpacity>
        );
      } else if (item.property_for === "Sell") {
        return (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("CommercialSellPropDetails", {
                item:item,
                displayMatchCount: false,
                displayMatchPercent: true
              })
            }
          >
            <CardSell
              navigation={navigation}
              item={item}
              disableDrawer={true}
              displayCheckBox={true}
              displayMatchCount={false}
              displayMatchPercent={true}
            />
          </TouchableOpacity>
        );
      }
    }
  };

  const ItemSeparatorView = () => {
    return (
      //Item Separator
      <View
        style={{ height: 0.5, width: "100%", backgroundColor: "#C8C8C8" }}
      />
    );
  };

  const [visible, setVisible] = useState(false);
  const [visibleSorting, setVisibleSorting] = useState(false);

  const toggleBottomNavigationView = () => {
    //Toggling the visibility state of the bottom sheet
    setVisible(!visible);
  };

  const toggleSortingBottomNavigationView = () => {
    //Toggling the visibility state of the bottom sheet
    setVisibleSorting(!visibleSorting);
  };

  const navigateTo = () => {
    navigation.navigate("Add");
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.searchBarContainer}>
        <TextInput
          style={styles.textInputStyle}
          onChangeText={text => searchFilterFunction(text)}
          value={search}
          underlineColorAndroid="transparent"
          placeholder="Search by property address, owner"
          placeholderTextColor="#696969"
        />
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
          <View style={styles.fab}>
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
          </View>
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
          <Text style={{ textAlign: "center" }}>
            You have no property listing
          </Text>
          {props.userDetails && ((props.userDetails.works_for === props.userDetails.id) ||
                    (props.userDetails.user_type === "employee" && EMPLOYEE_ROLE.includes(props.userDetails.employee_role)
                  )) ?
                  <TouchableOpacity onPress={() => navigateTo()}>
            <Text
              style={{ color: "#00BFFF", textAlign: "center", marginTop: 20 }}
            >
              Add New Property
            </Text>
          </TouchableOpacity>: null}
        </View>
      )}
      {/* Bottom for filters */}
      <BottomSheet
        visible={visible}
        //setting the visibility state of the bottom shee
        onBackButtonPress={toggleBottomNavigationView}
        //Toggling the visibility state on the click of the back botton
        onBackdropPress={toggleBottomNavigationView}
      //Toggling the visibility state on the clicking out side of the sheet
      >
        {/*Bottom Sheet inner View*/}

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
            {/* <Text style={styles.marginBottom10}>Property type</Text>
            <View style={styles.propSubSection}>
              <ButtonGroup
                selectedBackgroundColor="rgba(27, 106, 158, 0.85)"
                onPress={updateIndex}
                selectedIndex={index}
                buttons={["Residential", "Commercial", "Any"]}
                // containerStyle={{ height: 30 }}
                textStyle={{ textAlign: "center" }}
                selectedTextStyle={{ color: "#fff" }}
                containerStyle={{ borderRadius: 10, width: 350 }}
                containerBorderRadius={10}
              />
            </View> */}
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
      </BottomSheet>

      {/* Bottom sheet for sorting */}
      <BottomSheet
        visible={visibleSorting}
        //setting the visibility state of the bottom shee
        onBackButtonPress={toggleSortingBottomNavigationView}
        //Toggling the visibility state on the click of the back botton
        onBackdropPress={toggleSortingBottomNavigationView}
      //Toggling the visibility state on the clicking out side of the sheet
      >
        {/*Bottom Sheet inner View*/}

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
      </BottomSheet>
      {props.userDetails && ((props.userDetails.works_for === props.userDetails.id) ||
                (props.userDetails.user_type === "employee" && EMPLOYEE_ROLE.includes(props.userDetails.employee_role)
              )) ?
              <TouchableOpacity
        style={{
          // borderWidth: 1,
          // borderColor: "rgba(0,0,0,0.2)",
          alignItems: "center",
          justifyContent: "center",
          // width: 40,
          position: "absolute",
          bottom: 15,
          right: 10,
          // height: 40,
          backgroundColor: "rgba(50, 195, 77, 0.59)",
          borderRadius: 100
        }}
        onPress={() => navigation.navigate("Add")}
      >
        <AntDesign name="pluscircleo" size={40} color="#ffffff" />
        {/* <Image style={{ width: 50, height: 50, resizeMode: 'contain' }} source={require('assets/imgs/group.png')} /> */}
      </TouchableOpacity>: null }
    </View>
  );
};

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

const mapStateToProps = state => ({
  userDetails: state.AppReducer.userDetails,
  propertyListingForMeeting: state.AppReducer.propertyListingForMeeting,
  residentialCustomerList: state.AppReducer.residentialCustomerList,
  commercialPropertyList: state.AppReducer.commercialPropertyList,
  residentialPropertyList: state.AppReducer.residentialPropertyList,
  customerDetails: state.AppReducer.customerDetails
});
const mapDispatchToProps = {
  setPropertyListingForMeeting
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PropertyListForMeeting);

// export default ListingResidential;
