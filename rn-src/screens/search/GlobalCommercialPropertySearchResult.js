import React, { useState, useEffect, useCallback } from "react";
import { useFocusEffect } from '@react-navigation/native';
import {
  FlatList,
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput
} from "react-native";
import { connect } from "react-redux";
import { CheckBox } from "@rneui/themed";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import AntDesign from "react-native-vector-icons/AntDesign";
import { BottomSheet } from "react-native-btr";
import { ButtonGroup } from "@rneui/themed";
import { HelperText, useTheme } from "react-native-paper";
import Button from "./../../components/Button";
import { Divider } from "react-native-paper";
import { SocialIcon } from "@rneui/themed";
import Slider from "./../../components/Slider";
import SliderX from "./../../components/SliderX";
import CardRent from "../property/commercial/rent/CommercialRentCard";
import CardSell from "../property/commercial/sell/CommercialSellCard";
import axios from "axios";
import { SERVER_URL } from "./../../utils/Constant";
import { setCommercialPropertyList } from "./../../reducers/Action";
import { addDays, numDifferentiation } from "./../../utils/methods";
import Snackbar from "./../../components/SnackbarComponent";
import AppConstant from "./../../utils/AppConstant";

import { resetRefresh } from './../../reducers/dataRefreshReducer'; // Import the action creator ./reducers/dataRefreshReducer
import { useIsFocused } from '@react-navigation/native'; //
import { useSelector, useDispatch } from 'react-redux'; // Import hooks

const buildingTypeArray = [
  "Businesses park ",
  "Mall",
  "StandAlone",
  "Industrial",
  "Shopping complex"
];

const lookingForArray = ["Rent", "Sell"];
const propertyTypeArray = [
  "Shop",
  "Office",
  "Showroom",
  "Godown",
  "Restaurant/Cafe"
];
const availabilityArray = ["Immediate", "15 Days", "30 Days", "30+ Days"];
const sortByRentArray = ["Lowest First", "Highest First"];
const sortByAvailabilityArray = ["Earliest First", "Oldest First"];
const sortByPostedDateArray = ["Recent First", "Oldest Fist"];
const lookingForArraySortBy = ["Rent", "Sell"];

const GlobalCommercialPropertySearchResult = props => {
  const { navigation, route } = props;
  const { searchGlobalResult } = route.params || {};
  const [search, setSearch] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [filteredDataSource, setFilteredDataSource] = useState([]);
  const [masterDataSource, setMasterDataSource] = useState([]);
  const [index, setIndex] = useState(null);
  const [data, setData] = useState([]);
  const [lookingForIndex, setLookingForIndex] = useState(-1);
  const [propertyTypeIndex, setPropertyTypeIndex] = useState(-1);
  const [checkBoxSelectArray, setCheckBoxSelectArray] = useState([]);
  const [availabilityIndex, setAvailabilityIndex] = useState(-1);
  const [minRent, setMinRent] = useState(5000);
  const [maxRent, setMaxRent] = useState(500000);
  const [minSell, setMinSell] = useState(1000000);
  const [maxSell, setMaxSell] = useState(100000000);
  const [minBuildupArea, setMinBuildupArea] = useState(50);
  const [maxBuildupArea, setMaxBuildupArea] = useState(15000);
  // sorting
  const [sortByRentIndex, setSortByRentIndex] = useState(-1);
  const [sortByAvailabilityIndex, setSortByAvailabilityIndex] = useState(-1);
  const [sortByPostedDateIndex, setSortByPostedDateIndex] = useState(-1);
  const [lookingForIndexSortBy, setLookingForIndexSortBy] = useState(-1);
  const [loading, setLoading] = useState(false);

  // Select the 'shouldRefresh' state from the 'dataRefresh' slice
  const shouldRefresh = useSelector((state) => state.dataRefresh.shouldRefresh);
  const dispatch = useDispatch();
  const isFocused = useIsFocused();

  // Use useFocusEffect to refresh when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      console.log('Screen focused - refreshing data');
      if (searchGlobalResult) {
        searchGlobalResult();
        // Update local data with Redux state after search completes

      } else {
        // If no searchGlobalResult function passed, use existing data
        setData(props.globalSearchResult);
      }
    }, [])
  );

  // Also refresh when shouldRefresh changes
  useEffect(() => {
    if (shouldRefresh) {
      console.log('Refresh triggered by Redux');
      if (searchGlobalResult) {
        searchGlobalResult();
      }
      setData(props.globalSearchResult);
      dispatch(resetRefresh());
    }
  }, [shouldRefresh, searchGlobalResult, props.globalSearchResult, dispatch]);

  // Update data when globalSearchResult changes
  useEffect(() => {
    console.log('globalSearchResult updated, setting data');
    setData(props.globalSearchResult);
  }, [props.globalSearchResult]);



  const resetSortBy = () => {
    setLookingForIndexSortBy(-1);
    setSortByRentIndex(-1);
    setSortByAvailabilityIndex(-1);
    setSortByPostedDateIndex(-1);
    setData(props.commercialPropertyList);
  };

  const sortByPostedDate = index => {
    if (lookingForIndexSortBy === -1) {
      setErrorMessage("Looking for is missing in filter");
      setIsVisible(true);
      return;
    }
    setSortByPostedDateIndex(index);
    setSortByRentIndex(-1);
    setSortByAvailabilityIndex(-1);
    setVisibleSorting(false);
    let filterList = props.commercialPropertyList;
    if (lookingForIndexSortBy === 0) {
      filterList = filterList.filter(item => item.property_for === "Rent");
      if (sortByPostedDateArray[index] === "Recent First") {
        filterList.sort((a, b) => {
          return (
            new Date(a.create_date_time).getTime() -
            new Date(b.create_date_time).getTime()
          );
        });
      } else if (sortByPostedDateArray[index] === "Oldest Fist") {
        filterList.sort(
          (a, b) =>
            new Date(b.create_date_time).getTime() -
            new Date(a.create_date_time).getTime()
        );
      }
      setData(filterList);
    } else if (lookingForIndexSortBy === 1) {
      filterList = filterList.filter(item => item.property_for === "Sell");
      if (sortByPostedDateArray[index] === "Recent First") {
        filterList.sort((a, b) => {
          // console.log("a", a);
          return (
            new Date(a.create_date_time).getTime() -
            new Date(b.create_date_time).getTime()
          );
        });
      } else if (sortByPostedDateArray[index] === "Oldest Fist") {
        filterList.sort(
          (a, b) =>
            new Date(b.create_date_time).getTime() -
            new Date(a.create_date_time).getTime()
        );
      }
      setData(filterList);
    }
  };

  const sortByAvailability = index => {
    if (lookingForIndexSortBy === -1) {
      setErrorMessage("Looking for is missing in filter");
      setIsVisible(true);
      return;
    }
    setSortByAvailabilityIndex(index);
    setSortByPostedDateIndex(-1);
    setSortByRentIndex(-1);
    setVisibleSorting(false);
    let filterList = props.commercialPropertyList;
    if (lookingForIndexSortBy === 0) {
      filterList = filterList.filter(item => item.property_for === "Rent");
      if (sortByAvailabilityArray[index] === "Earliest First") {
        filterList.sort((a, b) => {
          // console.log("a", a);
          return (
            new Date(a.rent_details.available_from).getTime() -
            new Date(b.rent_details.available_from).getTime()
          );
        });
      } else if (sortByAvailabilityArray[index] === "Oldest First") {
        filterList.sort(
          (a, b) =>
            new Date(b.rent_details.available_from).getTime() -
            new Date(a.rent_details.available_from).getTime()
        );
      }
      setData(filterList);
    } else if (lookingForIndexSortBy === 1) {
      filterList = filterList.filter(item => item.property_for === "Sell");
      if (sortByAvailabilityArray[index] === "Earliest First") {
        filterList.sort((a, b) => {
          // console.log("a", a);
          return (
            new Date(a.rent_details.available_from).getTime() -
            new Date(b.rent_details.available_from).getTime()
          );
        });
      } else if (sortByAvailabilityArray[index] === "Oldest First") {
        filterList.sort(
          (a, b) =>
            new Date(b.rent_details.available_from).getTime() -
            new Date(a.rent_details.available_from).getTime()
        );
      }
      setData(filterList);
    }
  };

  const sortByRent = index => {
    console.log("onFilter:     ", props.commercialPropertyList);
    if (lookingForIndexSortBy === -1) {
      setErrorMessage("Looking for is missing in filter");
      setIsVisible(true);
      return;
    }
    setSortByRentIndex(index);
    setSortByPostedDateIndex(-1);
    setSortByAvailabilityIndex(-1);
    setVisibleSorting(false);
    let filterList = props.commercialPropertyList;
    if (lookingForIndexSortBy === 0) {
      filterList = filterList.filter(item => item.property_for === "Rent");
      // const x = filterList;
      console.log("filterList:   ", filterList);
      if (sortByRentArray[index] === "Lowest First") {
        filterList.sort((a, b) => {
          // console.log("a", a);
          return (
            parseFloat(a.rent_details.expected_rent) -
            parseFloat(b.rent_details.expected_rent)
          );
        });
      } else if (sortByRentArray[index] === "Highest First") {
        filterList.sort(
          (a, b) =>
            parseFloat(b.rent_details.expected_rent) -
            parseFloat(a.rent_details.expected_rent)
        );
      }
      setData(filterList);
    } else if (lookingForIndexSortBy === 1) {
      filterList = filterList.filter(item => item.property_for === "Sell");
      // const x = filterList;
      // console.log("filterList:   ", filterList);
      if (sortByRentArray[index] === "Lowest First") {
        filterList.sort((a, b) => {
          // console.log("a", a);
          return (
            parseFloat(a.sell_details.expected_sell_price) -
            parseFloat(b.sell_details.expected_sell_price)
          );
        });
      } else if (sortByRentArray[index] === "Highest First") {
        filterList.sort(
          (a, b) =>
            parseFloat(b.sell_details.expected_sell_price) -
            parseFloat(a.sell_details.expected_sell_price)
        );
      }
      setData(filterList);
    }
  };

  const selectLookingForIndexSortBy = index => {
    setLookingForIndexSortBy(index);
    setSortByRentIndex(-1);
    setSortByAvailabilityIndex(-1);
    setSortByPostedDateIndex(-1);
    setIsVisible(false);
  };

  const resetFilter = () => {
    setLookingForIndex(-1);
    setPropertyTypeIndex(-1);
    setCheckBoxSelectArray([]);
    setAvailabilityIndex(-1);
    setMinRent(5000);
    setMaxRent(500000);
    setMinSell(1000000);
    setMaxSell(100000000);
    setMinBuildupArea(50);
    setMaxBuildupArea(15000);
    setVisible(false);
  };

  const onFilter = () => {
    console.log("onFilter:     ", props.commercialPropertyList);
    if (lookingForIndex === -1) {
      setErrorMessage("Looking for is missing in filter");
      setIsVisible(true);
      return;
    }
    let filterList = props.commercialPropertyList;
    if (lookingForIndex > -1) {
      filterList = filterList.filter(
        item => item.property_for === lookingForArray[lookingForIndex]
      );
    }

    if (propertyTypeIndex > -1) {
      filterList = filterList.filter(item => {
        const all = [
          item.property_details.property_used_for,
          ...item.property_details.ideal_for
        ];
        return all.indexOf(propertyTypeArray[propertyTypeIndex]) > -1;
      });
    }

    if (checkBoxSelectArray.length > 0) {
      console.log(checkBoxSelectArray);
      console.log(
        checkBoxSelectArray.indexOf(
          filterList[0].property_details.building_type
        )
      );

      filterList = filterList.filter(
        item =>
          checkBoxSelectArray.indexOf(item.property_details.building_type) > -1
      );
    }

    if (lookingForIndex === 0) {
      if (minRent > 5000 || maxRent < 500000) {
        // console.log("rent");
        filterList = filterList.filter(
          item =>
            item.rent_details.expected_rent >= minRent &&
            item.rent_details.expected_rent <= maxRent
        );
      }
    } else if (lookingForIndex === 1) {
      if (minSell > 1000000 || maxSell < 100000000) {
        // console.log("rent");
        filterList = filterList.filter(
          item =>
            item.sell_details.expected_sell_price >= minRent &&
            item.sell_details.expected_sell_price <= maxRent
        );
      }
    }

    if (minBuildupArea > 5000 || maxBuildupArea < 500000) {
      // console.log("rent");
      filterList = filterList.filter(
        item =>
          item.property_details.property_size >= minBuildupArea &&
          item.property_details.property_size <= maxBuildupArea
      );
    }

    if (availabilityIndex > -1) {
      const oneDay = 24 * 60 * 60 * 1000;
      let possessionDate = new Date();
      const today = new Date();
      if (availabilityArray[availabilityIndex] === "Immediate") {
        possessionDate = addDays(today, 7); //new Date(today.getTime() + 15*24*60*60*1000)
        filterList = filterList.filter(
          item => possessionDate > new Date(item.rent_details.available_from)
        );
        console.log(
          "possessionDate: ",
          new Date(filterList[0].rent_details.available_from)
        );
      } else if (availabilityArray[availabilityIndex] === "15 Days") {
        possessionDate = addDays(today, 15);
        filterList = filterList.filter(
          item => possessionDate > new Date(item.rent_details.available_from)
        );
      } else if (availabilityArray[availabilityIndex] === "30 Days") {
        possessionDate = addDays(today, 30);
        filterList = filterList.filter(
          item => possessionDate > new Date(item.rent_details.available_from)
        );
      } else if (availabilityArray[availabilityIndex] === "30+ Days") {
        possessionDate = addDays(today, 30);
        filterList = filterList.filter(
          item => new Date(item.rent_details.available_from) > possessionDate
        );
      }
    }
    setData(filterList);
    setVisible(false);
  };

  const dismissSnackBar = () => {
    setIsVisible(false);
  };

  const setBuildupAreaRange = values => {
    // console.log("slider value min: ", values[0]);
    // console.log("slider value max: ", values[1]);
    setMinBuildupArea(values[0]);
    setMaxBuildupArea(values[1]);
  };

  const setRentRange = values => {
    // console.log("slider value min: ", values[0]);
    // console.log("slider value max: ", values[1]);
    setMinRent(values[0]);
    setMaxRent(values[1]);
  };

  const setSellRange = values => {
    // console.log("slider value min: ", values[0]);
    // console.log("slider value max: ", values[1]);
    setMinSell(values[0]);
    setMaxSell(values[1]);
  };
  const selectLookingForIndex = index => {
    setLookingForIndex(index);
    setIsVisible(false);
  };

  const selectPropertyTypeIndex = index => {
    setPropertyTypeIndex(index);
  };

  const onCheckBoxSelect = item => {
    console.log(item);
    if (checkBoxSelectArray.indexOf(item) > -1) {
      const x = checkBoxSelectArray.filter(z => z !== item);
      setCheckBoxSelectArray(x);
    } else {
      const x = [item, ...checkBoxSelectArray];
      setCheckBoxSelectArray(x);
    }
  };

  const selectAvailabilityIndex = index => {
    setAvailabilityIndex(index);
  };

  useEffect(() => {
    if (data.length === 0) {
      setData(props.globalSearchResult);
    }
  }, [props.globalSearchResult]);

  const getListing = () => {
    console.log("props.userDetails4 " + JSON.stringify(props.userDetails));
    const user = {
      req_user_id: props.userDetails.works_for,
      agent_id: props.userDetails.works_for
    };

    axios(SERVER_URL + "/commercialPropertyListings", {
      method: "post",
      headers: {
        "Content-type": "Application/json",
        Accept: "Application/json"
      },
      data: user
    }).then(
      response => {
        // console.log(response.data);
        setData(response.data);
        props.setCommercialPropertyList(response.data);
      },
      error => {
        console.log(error);
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
      const newData = props.commercialPropertyList.filter(function (item) {
        // Applying filter for the inserted text in search bar
        const itemData =
          item.property_address.building_name +
          item.property_address.landmark_or_street +
          item.property_address.location_area +
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
      setData(props.commercialPropertyList);
      setSearch(text);
    }
  };
  const closeMe = (itemToClose) => {
    setLoading(true);
    const reqData = {
      req_user_id: props.userDetails.id,
      agent_id: props.userDetails.works_for,
      dataToClose: itemToClose
    };
    // delete the item from the database
    axios(SERVER_URL + "/closeResidentialProperty", {
      method: "post",
      headers: {
        "Content-type": "Application/json",
        Accept: "Application/json"
      },
      data: reqData
    }).then(
      response => {
        // console.log("response.data:      ", response.data);
        // response.data.map(item => {
        //   item.image_urls.map(image => {
        //     image.url = SERVER_URL + image.url
        //   })
        // })
        // setData(response.data);
        // props.setResidentialPropertyList(response.data);
        if (response.data === "success") {
          // setData(data);
          if (itemToClose.property_status == 0) {
            itemToClose.property_status = 1
          } else if (itemToClose.property_status == 1) {
            itemToClose.property_status = 0
          }
          setData(data => data.map(item =>
            item.property_id === itemToClose.property_id ? itemToClose : item
          ));
        } else {
          setErrorMessage(response.data || "Failed to delete property");
        }

        setLoading(false);
        // console.log("response.data:      ", response.data);
        // After successfully fetching, reset the Redux refresh flag
        dispatch(resetRefresh());
      },
      error => {
        // console.log(error);
        setLoading(false);
        console.log(error);
      }
    );

  }

  const deleteMe = (itemToDelete) => {
    setLoading(true);
    const reqData = {
      req_user_id: props.userDetails.id,
      agent_id: props.userDetails.works_for,
      dataToDelete: itemToDelete
    };
    // delete the item from the database
    axios(SERVER_URL + "/deleteResidentialProperty", {
      method: "post",
      headers: {
        "Content-type": "Application/json",
        Accept: "Application/json"
      },
      data: reqData
    }).then(
      response => {
        // console.log("response.data:      ", response.data);
        // response.data.map(item => {
        //   item.image_urls.map(image => {
        //     image.url = SERVER_URL + image.url
        //   })
        // })
        // setData(response.data);
        // props.setResidentialPropertyList(response.data);
        if (response.data === "success") {
          setData((data) => data.filter((item) => item.property_id !== itemToDelete.property_id));
        } else {
          setErrorMessage(response.data || "Failed to delete property");
        }

        setLoading(false);
        // console.log("response.data:      ", response.data);
        // After successfully fetching, reset the Redux refresh flag
        dispatch(resetRefresh());
      },
      error => {
        // console.log(error);
        setLoading(false);
        console.log(error);
      }
    );

  }

  const ItemView = ({ item }) => {
    if (item.property_type === "Commercial") {
      if (item.property_for === "Rent") {
        return (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("CommercialRentPropDetails", {
                item: item,
                displayMatchCount: true, displayMatchPercent: false
              })
            }
          >
            <CardRent
              navigation={navigation}
              item={item}
              deleteMe={deleteMe}
              closeMe={closeMe}
              displayChat={false}
              disableDrawer={false}
              displayCheckBox={false}
            />
          </TouchableOpacity>
        );
      } else if (item.property_for === "Sell") {
        return (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("CommercialSellPropDetails", {
                item: item,
                displayMatchCount: true, displayMatchPercent: false
              })
            }
          >
            <CardSell
              navigation={navigation}
              item={item}
              deleteMe={deleteMe}
              closeMe={closeMe}
              displayChat={true}
              disableDrawer={true}
              displayCheckBox={false}
            />
          </TouchableOpacity>
        );
      }
    }

    // console.log("hi");
  };

  const ItemSeparatorView = () => {
    return (
      //Item Separator
      <View
        style={{ height: 0.5, width: "100%", backgroundColor: "#C8C8C8" }}
      />
    );
  };

  const navigateTo = () => {
    navigation.navigate("Add");
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

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.searchBarContainer}>
        <TextInput
          style={styles.textInputStyle}
          onChangeText={text => searchFilterFunction(text)}
          value={search}
          underlineColorAndroid="transparent"
          placeholder="GLocal Search..."
          // onFocus={() => navigation.navigate("GlobalSearch")}
          placeholderTextColor="#696969"
        />
        <View style={{ position: "absolute", right: 5, paddingTop: 10 }}>
          <MaterialCommunityIcons
            name="search-web"
            color={"#ff5733"}
            size={26}
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
          {/* <TouchableOpacity onPress={() => navigateTo()}>
            <Text
              style={{ color: "#00BFFF", textAlign: "center", marginTop: 20 }}
            >
              Add New Property
            </Text>
          </TouchableOpacity> */}
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
            onPress={() => resetFilter()}
            style={{ position: "absolute", top: 10, right: 10 }}
          >
            <MaterialCommunityIcons
              name="restart"
              color={"#000000"}
              size={30}
            />
          </TouchableOpacity>
          <ScrollView style={{ marginTop: 20, marginBottom: 20 }}>
            <Text style={styles.marginBottom10}>Looking For</Text>
            <View style={styles.propSubSection}>
              <ButtonGroup
                selectedBackgroundColor="rgba(27, 106, 158, 0.85)"
                onPress={selectLookingForIndex}
                selectedIndex={lookingForIndex}
                buttons={lookingForArray}
                // containerStyle={{ height: 30 }}
                textStyle={{ textAlign: "center" }}
                selectedTextStyle={{ color: "#fff" }}
                containerStyle={{ borderRadius: 10, width: 350 }}
                containerBorderRadius={10}
              />
            </View>

            <Text style={styles.marginBottom10}>Prop type</Text>
            <View style={styles.propSubSection}>
              <ButtonGroup
                selectedBackgroundColor="rgba(27, 106, 158, 0.85)"
                onPress={selectPropertyTypeIndex}
                selectedIndex={propertyTypeIndex}
                buttons={propertyTypeArray}
                // containerStyle={{ height: 30 }}
                textStyle={{ textAlign: "center" }}
                selectedTextStyle={{ color: "#fff" }}
                containerStyle={{ borderRadius: 10, width: 350 }}
                containerBorderRadius={10}
                vertical={true}
              />
            </View>
            <Text style={styles.marginBottom10}>Building type</Text>
            <View style={styles.propSubSection}>
              <FlatList
                data={buildingTypeArray}
                renderItem={({ item }) => (
                  <View style={{ flex: 1, flexDirection: "column", margin: 1 }}>
                    {/* <Text>{item}</Text> */}
                    <CheckBox
                      title={item}
                      checked={checkBoxSelectArray.indexOf(item) > -1}
                      onPress={() => onCheckBoxSelect(item)}
                      containerStyle={{
                        backgroundColor: "#ffffff",
                        borderColor: "#ffffff",
                        margin: 0
                      }}
                      textStyle={{
                        fontSize: 12,
                        fontWeight: "400"
                      }}
                    />
                  </View>
                )}
                //Setting the number of column
                numColumns={2}
                keyExtractor={(item, index) => index}
              />
              {/* <ButtonGroup
                selectedBackgroundColor="rgba(27, 106, 158, 0.85)"
                onPress={updateIndex}
                selectedIndex={index}
                buttons={[
                  "Businesses park ",
                  "Mall",
                  "StandAlone",
                  "Industrial",
                  "Shopping complex"
                ]}
                // containerStyle={{ height: 30 }}
                textStyle={{ textAlign: "center" }}
                selectedTextStyle={{ color: "#fff" }}
                containerStyle={{ borderRadius: 10, width: 350 }}
                containerBorderRadius={10}
              /> */}
            </View>
            {lookingForIndex === -1 ? null : lookingForIndex === 0 ? (
              <View>
                <Text>Rent Range</Text>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginTop: 10
                  }}
                >
                  <View>
                    <Text style={{ color: "rgba(108, 122, 137, 1)" }}>
                      {numDifferentiation(minRent)}
                    </Text>
                    <Text style={{ color: "rgba(108, 122, 137, 1)" }}>Min</Text>
                  </View>
                  <View>
                    <Text style={{ color: "rgba(108, 122, 137, 1)" }}>
                      {numDifferentiation(maxRent)}
                    </Text>
                    <Text style={{ color: "rgba(108, 122, 137, 1)" }}>Max</Text>
                  </View>
                </View>

                <Slider
                  min={15000}
                  max={1000000}
                  step={5000}
                  onSlide={values => setRentRange(values)}
                />
              </View>
            ) : (
              <View>
                <Text>Sell Price Range</Text>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginTop: 10
                  }}
                >
                  <View>
                    <Text style={{ color: "rgba(108, 122, 137, 1)" }}>
                      {numDifferentiation(minSell)}
                    </Text>
                    <Text style={{ color: "rgba(108, 122, 137, 1)" }}>Min</Text>
                  </View>
                  <View>
                    <Text style={{ color: "rgba(108, 122, 137, 1)" }}>
                      {numDifferentiation(maxSell)}
                    </Text>
                    <Text style={{ color: "rgba(108, 122, 137, 1)" }}>Max</Text>
                  </View>
                </View>
                <SliderX
                  min={minSell}
                  max={maxSell}
                  step={500000}
                  onSlide={values => setSellRange(values)}
                />
              </View>
            )}
            <Text>Builtup area Range</Text>
            <Slider
              min={50}
              max={10000}
              step={50}
              onSlide={values => setBuildupAreaRange(values)}
            />
            <Text style={styles.marginBottom10}>Availability</Text>
            <View style={styles.propSubSection}>
              <ButtonGroup
                selectedBackgroundColor="rgba(27, 106, 158, 0.85)"
                onPress={selectAvailabilityIndex}
                selectedIndex={availabilityIndex}
                buttons={availabilityArray}
                // containerStyle={{ height: 30 }}
                textStyle={{ textAlign: "center" }}
                selectedTextStyle={{ color: "#fff" }}
                containerStyle={{ borderRadius: 10, width: 350 }}
                containerBorderRadius={10}
              />
            </View>

            <Button title="Apply" onPress={() => onFilter()} />
          </ScrollView>
          <Snackbar
            visible={isVisible}
            textMessage={errorMessage}
            position={"top"}
            actionHandler={() => dismissSnackBar()}
            actionText="OK"
          />
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
          <TouchableOpacity
            onPress={() => resetSortBy()}
            style={{ position: "absolute", top: 10, right: 10 }}
          >
            <MaterialCommunityIcons
              name="restart"
              color={"#000000"}
              size={30}
            />
          </TouchableOpacity>
          <ScrollView style={{ marginTop: 15, marginBottom: 20 }}>
            <Text style={styles.marginBottom10}>Looking For</Text>
            <View style={styles.propSubSection}>
              <ButtonGroup
                selectedBackgroundColor="rgba(27, 106, 158, 0.85)"
                onPress={selectLookingForIndexSortBy}
                selectedIndex={lookingForIndexSortBy}
                buttons={lookingForArraySortBy}
                // containerStyle={{ height: 30 }}
                textStyle={{ textAlign: "center" }}
                selectedTextStyle={{ color: "#fff" }}
                containerStyle={{ borderRadius: 10, width: 350 }}
                containerBorderRadius={10}
              />
            </View>
            <Text style={styles.marginBottom10}>Rent</Text>
            <View style={styles.propSubSection}>
              <ButtonGroup
                selectedBackgroundColor="rgba(27, 106, 158, 0.85)"
                onPress={sortByRent}
                selectedIndex={sortByRentIndex}
                buttons={sortByRentArray}
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
                onPress={sortByAvailability}
                selectedIndex={sortByAvailabilityIndex}
                buttons={sortByAvailabilityArray}
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
                onPress={sortByPostedDate}
                selectedIndex={sortByPostedDateIndex}
                buttons={sortByPostedDateArray}
                // containerStyle={{ height: 30 }}
                textStyle={{ textAlign: "center" }}
                selectedTextStyle={{ color: "#fff" }}
                containerStyle={{ borderRadius: 10, width: 350 }}
                containerBorderRadius={10}
              />
            </View>
          </ScrollView>
          <Snackbar
            visible={isVisible}
            textMessage={errorMessage}
            position={"top"}
            actionHandler={() => dismissSnackBar()}
            actionText="OK"
          />
        </View>
      </BottomSheet>

      {/* <TouchableOpacity
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
        </TouchableOpacity> */}
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
  commercialPropertyList: state.AppReducer.commercialPropertyList,
  globalSearchResult: state.AppReducer.globalSearchResult
});
const mapDispatchToProps = {
  setCommercialPropertyList
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GlobalCommercialPropertySearchResult);
// export default ListingCommercial;
