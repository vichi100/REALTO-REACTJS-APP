import React, { useState, useEffect, useCallback } from "react";
import {
  FlatList,
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { useFocusEffect } from '@react-navigation/native';

import { connect } from "react-redux";
import { CheckBox } from "@rneui/themed";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import AntDesign from "react-native-vector-icons/AntDesign";

import { BottomSheet } from "react-native-btr";
import { ButtonGroup } from "@rneui/themed";
import { HelperText, useTheme } from "react-native-paper";
import Button from "./../../../components/Button";
import { Divider } from "react-native-paper";
import { SocialIcon } from "@rneui/themed";
import CustomerCommercialRentCard from "./rent/CustomerCommercialRentCard";
import CustomerCommercialBuyCard from "./buy/CustomerCommercialBuyCard";
import axios from "axios";
import { SERVER_URL } from "./../../../utils/Constant";
import { EMPLOYEE_ROLE } from "./../../../utils/AppConstant";
import Slider from "./../../../components/Slider";
import SliderCr from "./../../../components/SliderCr";
import SliderSmallNum from "./../../../components/SliderSmallNum";
import {
  setCommercialCustomerList,
  setAnyItemDetails
} from "./../../../reducers/Action";
import { addDays, numDifferentiation } from "./../../../utils/methods";
import Snackbar from "./../../../components/SnackbarComponent";
import CustomButtonGroup from "./../../../components/CustomButtonGroup";

import { resetRefresh } from './../../../reducers/dataRefreshReducer'; // Import the action creator
import { useIsFocused } from '@react-navigation/native'; //
import { useSelector, useDispatch } from 'react-redux'; // Import hooks



const buildingTypeArray = [
  "Businesses park ",
  "Mall",
  "StandAlone",
  "Industrial",
  "Shopping complex"
];

const lookingForArray = ["Rent", "Buy"];
const propertyTypeArray = [
  "Shop",
  "Office",
  "Showroom",
  "Godown",
  "Restaurant/Cafe"
];
const availabilityArray = ["Immediate", "15 Days", "30 Days", "30+ Days"];

// const buildingTypeArray = [
//   "Businesses park ",
//   "Mall",
//   "StandAlone",
//   "Industrial",
//   "Shopping complex"
// ];

const sortByNameArray = ["A First", "Z First"];
const lookingForArraySortBy = ["Rent", "Buy"];
const sortByPostedDateArray = ["Recent First", "Oldest Fist"];


const reqWithinOptions = [
  { text: '7 Days' },
  { text: '15 Days' },
  { text: '30 Days' },
  { text: '60 Days' },
  { text: '60+ Days' },
];

const porposeForOptions = [
  { text: 'Rent' },
  { text: 'Buy' },
];
const propertyTypeOptions = [
  { text: 'Shop' },
  { text: 'Office' },
  { text: 'Showroom' },
  { text: ' Restaurant/Cafe' },
  { text: 'Pub/Night Club' },
  { text: 'Clinic' },
  { text: 'Godown' },
];

const buildingTypeOption = [
  { text: 'Mall' },
  { text: 'Businesses Park' },
  { text: 'StandAlone' },
  { text: 'Industrial' },
  { text: 'Shopping Complex' },
  { text: 'Commersial Complex' },
];


const CustomersCommercial = props => {
  const { navigation } = props;
  const { displayCheckBox, disableDrawer, displayCheckBoxForEmployee, employeeObj, didDbCall = false } = props.route.params || {};
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
  //sorting
  const [sortByNameIndex, setSortByNameIndex] = useState(-1);
  const [sortByPostedDateIndex, setSortByPostedDateIndex] = useState(-1);
  const [lookingForIndexSortBy, setLookingForIndexSortBy] = useState(-1);
  const [loading, setLoading] = useState(false);

  const [reqWithin, setReqWithin] = useState("");
  const [purpose, setPurpose] = useState("");
  const [selectedProperties, setSelectedProperties] = useState([]);
  const [selectedBuildingType, setSelectedBuildingType] = useState([]);

  // Select the 'shouldRefresh' state from the 'dataRefresh' slice
  const shouldRefresh = useSelector((state) => state.dataRefresh.shouldRefresh);
  const dispatch = useDispatch();
  const isFocused = useIsFocused(); // To ensure refresh happens when screen comes into view

  const fetchData = useCallback(async () => {
    // setLoading(true);
    try {
      console.log('ScreenA: Fetching latest data...');
      // Replace with your actual data fetching logic from DB/API
      getListing();
    } catch (error) {
      console.error('Failed to fetch data for ScreenA:', error);
      setData('Error loading data.');
    } finally {
      setLoading(false);
      // After successfully fetching, reset the Redux refresh flag
      dispatch(resetRefresh());
      console.log('ScreenA: Data fetched and refresh flag reset.');
    }
  }, [dispatch]);

  // Use useEffect to trigger fetch when:
  // 1. The screen gains focus (e.g., navigated back to it)
  // 2. The Redux 'shouldRefresh' flag becomes true (signaled by ScreenD)
  useEffect(() => {
    if (isFocused || shouldRefresh || didDbCall) {
      fetchData();
    }
  }, [isFocused, shouldRefresh, fetchData, didDbCall]);


  // useFocusEffect(
  //   useCallback(() => {
  //     // This function will be called when Screen A comes into focus
  //     console.log("useFocusEffect")
  //     if (didDbCall) {
  //       getListing();
  //     }

  //     // Optional: Return a cleanup function if needed
  //     return () => {
  //       // This function will be called when Screen A loses focus
  //       // You can perform cleanup here if necessary
  //     };
  //   }, []) // Re-run the effect if fetchData function changes (unlikely here)
  // );

  const resetSortBy = () => {
    setLookingForIndexSortBy(-1);
    setSortByNameIndex(-1);
    setSortByPostedDateIndex(-1);
    setData(props.commercialCustomerList);
  };

  const sortByPostedDate = index => {
    console.log("sortByName", props.commercialCustomerList);
    if (lookingForIndexSortBy === -1) {
      setErrorMessage("Looking for is missing in filter");
      setIsVisible(true);
      return;
    }
    setSortByPostedDateIndex(index);
    setSortByNameIndex(-1);
    setVisibleSorting(false);
    let filterList = props.commercialCustomerList;
    console.log("lookingForIndexSortBy: ", lookingForIndexSortBy);
    if (lookingForIndexSortBy === 0) {
      filterList = filterList.filter(
        item => item.customer_locality.property_for === "Rent"
      );
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
      filterList = filterList.filter(
        item => item.customer_locality.property_for === "Buy"
      );
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

  const sortByName = index => {
    console.log("sortByName", props.commercialCustomerList);
    if (lookingForIndexSortBy === -1) {
      setErrorMessage("Looking for is missing in filter");
      setIsVisible(true);
      return;
    }
    setSortByPostedDateIndex(-1);
    setSortByNameIndex(index);
    setVisibleSorting(false);
    let filterList = props.commercialCustomerList;
    console.log("lookingForIndexSortBy: ", lookingForIndexSortBy);
    if (lookingForIndexSortBy === 0) {
      filterList = filterList.filter(
        item => item.customer_locality.property_for === "Rent"
      );
      console.log("lookingForIndexSortBy: ", sortByNameArray[index]);
      if (sortByNameArray[index] === "A First") {
        filterList.sort((a, b) => {
          return a.customer_details.name.localeCompare(b.customer_details.name);
        });
      } else if (sortByNameArray[index] === "Z Fist") {
        filterList.sort((a, b) => {
          return b.customer_details.name.localeCompare(a.customer_details.name);
        });
      }
      setData(filterList);
    } else if (lookingForIndexSortBy === 1) {
      filterList = filterList.filter(
        item => item.customer_locality.property_for === "Buy"
      );
      if (sortByNameArray[index] === "A First") {
        filterList.sort((a, b) => {
          // console.log("a", a);
          return a.customer_details.name.localeCompare(b.customer_details.name);
        });
      } else if (sortByNameArray[index] === "Z Fist") {
        filterList.sort((a, b) =>
          b.customer_details.name.localeCompare(a.customer_details.name)
        );
      }
      setData(filterList);
    }
  };

  const selectLookingForIndexSortBy = index => {
    setLookingForIndexSortBy(index);
    setSortByNameIndex(-1);
    setSortByPostedDateIndex(-1);
    setIsVisible(false);
  };


  // Filter methods

  const handlePriceRangeChange = useCallback((values) => {
    setRentRange(values);
  }, []);

  const handlePriceRangeChangeCr = useCallback((values) => {
    setSellRange(values);
  }, []);

  const handleBuildupAreaRange = useCallback((values) => {
    setBuildupAreaRange(values);
  }, []);

  const selectPropertyType = (index, button) => {
    let newSelectedIndicesPropertyType;
    newSelectedIndicesPropertyType = [...selectedProperties];
    if (newSelectedIndicesPropertyType.includes(button.text)) {
      newSelectedIndicesPropertyType.splice(newSelectedIndicesPropertyType.indexOf(button.text), 1);
    } else {
      newSelectedIndicesPropertyType.push(button.text);
    }
    setSelectedProperties(newSelectedIndicesPropertyType);
    console.log(`newSelectedIndices: ${newSelectedIndicesPropertyType}`);
    // Query update is handled by useEffect after state change
  }
  const selectbuildingType = (index, button) => {
    let newSelectedIndicesBuildingType;
    newSelectedIndicesBuildingType = [...selectedBuildingType];
    if (newSelectedIndicesBuildingType.includes(button.text)) {
      newSelectedIndicesBuildingType.splice(newSelectedIndicesBuildingType.indexOf(button.text), 1);
    } else {
      newSelectedIndicesBuildingType.push(button.text);
    }
    setSelectedBuildingType(newSelectedIndicesBuildingType);
    console.log(`newSelectedIndices: ${newSelectedIndicesBuildingType}`);
    // Query update is handled by useEffect after state change
  }


  const resetFilter = () => {
    setReqWithin("");
    setPurpose("");
    setSelectedProperties([]);
    setReqWithin("");
    setSelectedBuildingType([]);
    setData(props.commercialCustomerList);
    setMinRent(5000);
    setMaxRent(500000);
    setMinSell(1000000);
    setMaxSell(100000000);
    setMinBuildupArea(50);
    setMaxBuildupArea(15000);
    setVisible(false);
  };

  const onFilter = () => {

    console.log("onFilter:     ", props.commercialCustomerList);
    if (purpose === "") {
      setErrorMessage("Looking for is missing in filter");
      setIsVisible(true);
      return;
    }
    let filterList = props.commercialCustomerList;
    if (purpose !== "") {
      filterList = filterList.filter(
        item =>
          item.customer_locality.property_for ===
          purpose
      );
    }


    if (selectedProperties.length > 0) {
      filterList = filterList.filter(
        item => selectedProperties.includes(item.customer_property_details.property_used_for)
      );
    }

    if (selectedBuildingType.length > 0) {
      filterList = filterList.filter(
        item => selectedBuildingType.includes(item.customer_property_details.building_type)
      );
    }


    if (purpose === "Rent") {
      if (minRent > 5000 || maxRent < 500000) {
        // console.log("rent");
        filterList = filterList.filter(
          item =>
            item.customer_rent_details.expected_rent >= minRent &&
            item.customer_rent_details.expected_rent <= maxRent
        );
      }
    } else if (purpose === "Buy") {
      if (minSell > 1000000 || maxSell < 100000000) {
        // console.log("rent");
        filterList = filterList.filter(
          item =>
            item.customer_buy_details.expected_buy_price >= minSell &&
            item.customer_buy_details.expected_buy_price <= maxSell
        );
      }
    }

    if (minBuildupArea > 5000 || maxBuildupArea < 500000) {
      // console.log("rent");
      filterList = filterList.filter(
        item =>
          item.customer_property_details.property_size >= minBuildupArea &&
          item.customer_property_details.property_size <= maxBuildupArea
      );
    }



    if (purpose === "Rent" && reqWithin !== "") {
      const today = new Date();
      let possessionDate;

      if (reqWithin === "7 Days") {
        possessionDate = addDays(today, 7);
        filterList = filterList.filter(
          item => new Date(item.customer_rent_details.available_from) <= possessionDate
        );
      } else if (reqWithin === "15 Days") {
        possessionDate = addDays(today, 15);
        filterList = filterList.filter(
          item => new Date(item.customer_rent_details.available_from) <= possessionDate
        );
      } else if (reqWithin === "30 Days") {
        possessionDate = addDays(today, 30);
        filterList = filterList.filter(
          item => new Date(item.customer_rent_details.available_from) <= possessionDate
        );
      } else if (reqWithin === "60 Days") {
        possessionDate = addDays(today, 60);
        filterList = filterList.filter(
          item => new Date(item.customer_rent_details.available_from) <= possessionDate
        );
      } else if (reqWithin === "60+ Days") {
        possessionDate = addDays(today, 60);
        filterList = filterList.filter(
          item => new Date(item.customer_rent_details.available_from) > possessionDate
        );
      }
    }

    else if (purpose === "Buy" && reqWithin !== "") {
      const today = new Date();
      let possessionDate;

      if (reqWithin === "7 Days") {
        possessionDate = addDays(today, 7);
        filterList = filterList.filter(
          item => new Date(item.customer_buy_details.available_from) <= possessionDate
        );
      } else if (reqWithin === "15 Days") {
        possessionDate = addDays(today, 15);
        filterList = filterList.filter(
          item => new Date(item.customer_buy_details.available_from) <= possessionDate
        );
      } else if (reqWithin === "30 Days") {
        possessionDate = addDays(today, 30);
        filterList = filterList.filter(
          item => new Date(item.customer_buy_details.available_from) <= possessionDate
        );
      } else if (reqWithin === "60 Days") {
        possessionDate = addDays(today, 60);
        filterList = filterList.filter(
          item => new Date(item.customer_buy_details.available_from) <= possessionDate
        );
      } else if (reqWithin === "60+ Days") {
        possessionDate = addDays(today, 60);
        filterList = filterList.filter(
          item => new Date(item.customer_buy_details.available_from) > possessionDate
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
    getListing();
    // console.log("commercial Listing useEffect");
  }, []);

  const getListing = () => {
    // console.log("props.userDetails4 " + JSON.stringify(props.userDetails));
    if (props.userDetails === null) {
      setData([]);
      props.setCommercialCustomerList([]);
      return;
    }

    const user = {
      req_user_id: props.userDetails.id,
      agent_id: props.userDetails.works_for// here we get null pointer excpetion when user is created first time
    };

    setLoading(true);

    axios(SERVER_URL + "/commercialCustomerList", {
      method: "post",
      headers: {
        "Content-type": "Application/json",
        Accept: "Application/json"
      },
      data: user
    }).then(
      response => {
        // // console.log(response.data);
        props.setCommercialCustomerList(response.data);
        setData(response.data);
        setLoading(false);
      },
      error => {
        console.log(error);
        setLoading(false);
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
      const newData = props.commercialCustomerList.filter(function (item) {
        // Applying filter for the inserted text in search bar
        console.log(item)
        const itemData =
          item.customer_details.name +
          item.customer_details.address +
          item.customer_details.mobile1 +
          item.customer_id +
          item.customer_locality.location_area.map(item => item.main_text).join(', ')
        // item.customer_locality.location_area;

        const textData = text.toUpperCase();
        return itemData.toUpperCase().indexOf(textData) > -1;
      });
      setData(newData);
      setSearch(text);
    } else {
      // Inserted text is blank
      // Update FilteredDataSource with masterDataSource
      setData(props.commercialCustomerList);
      setSearch(text);
    }
  };

  const navigateToDetails = (item, propertyFor) => {
    props.setAnyItemDetails(item);
    if (propertyFor === "Rent") {
      navigation.navigate("CustomerDetailsCommercialRentFromList", {
        item: item,
        displayMatchCount: true, displayMatchPercent: false
      });
    } else if (propertyFor === "Buy") {
      navigation.navigate("CustomerDetailsCommercialBuyFromList", {
        item: item,
        displayMatchCount: true, displayMatchPercent: false
      });
    }
  };



  const deleteMe = (itemToDelete) => {
    setLoading(true);
    const reqData = {
      req_user_id: props.userDetails.id,
      agent_id: props.userDetails.works_for,
      dataToDelete: itemToDelete
    };
    // delete the item from the database
    axios(SERVER_URL + "/deleteCommercialCustomer", {
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
          setData((data) => data.filter((item) => item.customer_id !== itemToDelete.customer_id));
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


  const closeMe = (itemToClose) => {
    setLoading(true);
    const reqData = {
      req_user_id: props.userDetails.id,
      agent_id: props.userDetails.works_for,
      dataToClose: itemToClose
    };
    // delete the item from the database
    axios(SERVER_URL + "/closeCommercialCustomer", {
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
          if(itemToClose.customer_status == 0){
            itemToClose.customer_status = 1
          }else if(itemToClose.customer_status == 1){
            itemToClose.customer_status = 0
          }
          setData(data => data.map(item => 
            item.customer_id === itemToClose.customer_id ? itemToClose : item
          ));
        } else {
          setErrorMessage(response.data || "Failed to delete customer");
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

  // const deleteMe = (itemToDelete) => {
  //   // console.log("props.setPropertyDetails(item: deleteMe: )", itemToDelete);
  //   setData((data) => data.filter((item) => item.customer_id !== itemToDelete.customer_id));
  //   //Fist delete for data


  // }

  const ItemView = ({ item }) => {
    if (item.customer_locality.property_type === "Commercial") {
      if (item.customer_locality.property_for === "Rent") {
        return (
          <TouchableOpacity onPress={() => navigateToDetails(item, "Rent")}>
            <CustomerCommercialRentCard navigation={navigation} item={item} deleteMe={deleteMe} closeMe={closeMe} displayCheckBox={displayCheckBox}
              disableDrawer={disableDrawer} displayCheckBoxForEmployee={displayCheckBoxForEmployee} employeeObj={employeeObj} />
          </TouchableOpacity>
        );
      } else if (item.customer_locality.property_for === "Buy") {
        return (
          <TouchableOpacity onPress={() => navigateToDetails(item, "Buy")}>
            <CustomerCommercialBuyCard navigation={navigation} item={item} deleteMe={deleteMe} closeMe={closeMe} displayCheckBox={displayCheckBox}
              disableDrawer={disableDrawer} displayCheckBoxForEmployee={displayCheckBoxForEmployee} employeeObj={employeeObj} />
          </TouchableOpacity>
        );
      }
    }

    // // console.log("hi");
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
    navigation.navigate("AddNewCustomerStack");
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

  useEffect(() => {
    if (props.commercialCustomerList.length > 0) {
      setData(props.commercialCustomerList)
    }
  }, [props.commercialCustomerList]);

  const FlatListFooter = () => {
    return (
      <View style={{ padding: 10, alignItems: 'center' }}>
        <Text style={{ color: '#fff' }} testID="end_of_list">End</Text>
      </View>
    );
  };


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
      {/* <ActivityIndicator animating size="large" /> */}
    </View> :
      <View style={{ flex: 1 }}>

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
        {data.length > 0 ? (
          <View style={styles.container}>
            <FlatList
              data={data}
              //data defined in constructor
              // ItemSeparatorComponent={ItemSeparatorView}
              //Item Separator View
              renderItem={ItemView}
              keyExtractor={(item, index) => index.toString()}
              ListFooterComponent={FlatListFooter} // Pass the footer component here
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
                You have no customer
              </Text>
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
          </View>)}
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
            <ScrollView style={{ marginTop: 20, marginBottom: 20, margin: 10 }}>
              <Text style={styles.marginBottom20}>Looking For</Text>
              <View style={styles.propSubSection}>
                {/* <ButtonGroup
                  selectedButtonStyle={{ backgroundColor: "#00a36c4d" }} 
                  onPress={selectLookingForIndex}
                  selectedIndex={lookingForIndex}
                  buttons={lookingForArray}
                  // containerStyle={{ height: 30 }}
                  textStyle={{ textAlign: "center" }}
                  selectedTextStyle={{ color: "#000" }}
                  containerStyle={{ borderRadius: 10, width: 350 }}
                  containerBorderRadius={10}
                /> */}
                <CustomButtonGroup
                  buttons={porposeForOptions}
                  accessibilityLabelId="porpose_for"
                  selectedIndices={[porposeForOptions.findIndex(option => option.text === purpose)]}
                  isMultiSelect={false}
                  buttonStyle={{ backgroundColor: '#fff', borderColor: 'rgba(173, 181, 189, .5)', borderWidth: 1 }}
                  selectedButtonStyle={{ backgroundColor: 'rgba(0, 163, 108, .2)' }}
                  buttonTextStyle={{ color: '#000' }}
                  selectedButtonTextStyle={{ color: '#000' }}
                  onButtonPress={(index, button) => {
                    console.log(`Button pressed: ${button.text} (Index: ${index})`);
                    setPurpose(button.text);
                    // Query update is handled by useEffect after state change
                  }}
                />
              </View>

              <Text style={styles.marginBottom20}>Prop type</Text>
              <View style={styles.propSubSection}>
                {/* <ButtonGroup
                  selectedButtonStyle={{ backgroundColor: "#00a36c4d" }} 
                  onPress={selectPropertyTypeIndex}
                  selectedIndex={propertyTypeIndex}
                  buttons={propertyTypeArray}
                  // containerStyle={{ height: 30 }}
                  textStyle={{ textAlign: "center" }}
                  selectedTextStyle={{ color: "#000" }}
                  containerStyle={{ borderRadius: 10, width: 350 }}
                  containerBorderRadius={10}
                  vertical={true}
                /> */}
                <CustomButtonGroup
                  buttons={propertyTypeOptions}
                  accessibilityLabelId="property_type"
                  isMultiSelect={true}
                  buttonStyle={{ backgroundColor: '#fff', borderColor: 'rgba(173, 181, 189, .5)', borderWidth: 1 }}
                  selectedButtonStyle={{ backgroundColor: 'rgba(0, 163, 108, .2)' }}
                  buttonTextStyle={{ color: '#000' }}
                  selectedButtonTextStyle={{ color: '#000' }}
                  selectedIndices={selectedProperties.map((item) =>
                    propertyTypeOptions.findIndex((option) => option.text === item)
                  )}
                  onButtonPress={(index, button) => {
                    selectPropertyType(index, button);
                  }}
                />

              </View>
              <Text style={styles.marginBottom20}>Building type</Text>
              <View style={styles.propSubSection}>

                <CustomButtonGroup
                  buttons={buildingTypeOption}
                  accessibilityLabelId="building_type"
                  isMultiSelect={true}
                  buttonStyle={{ backgroundColor: '#fff', borderColor: 'rgba(173, 181, 189, .5)', borderWidth: 1 }}
                  selectedButtonStyle={{ backgroundColor: 'rgba(0, 163, 108, .2)' }}
                  buttonTextStyle={{ color: '#000' }}
                  selectedButtonTextStyle={{ color: '#000' }}
                  selectedIndices={selectedBuildingType.map((item) =>
                    buildingTypeOption.findIndex((option) => option.text === item)
                  )}
                  onButtonPress={(index, button) => {
                    selectbuildingType(index, button);
                  }}
                />

              </View>
              {purpose === "" ? null : purpose === "Rent" ? (
                <View>
                  <Text style={{ marginBottom: 10 }}>Rent Range</Text>


                  <Slider
                    min={10000}
                    max={1000000}
                    onSlide={handlePriceRangeChange}
                  />
                </View>
              ) : (
                <View>
                  <Text style={{ marginBottom: 10 }}>Sell Price Range</Text>

                  <SliderCr
                    min={1000000}
                    max={100000000}
                    onSlide={handlePriceRangeChangeCr}
                  />
                </View>
              )}
              <Text style={{ marginBottom: 10, marginTop: 10 }}>Builtup area Range</Text>

              <SliderSmallNum
                min={50}
                max={10000}
                onSlide={handleBuildupAreaRange}
              />
              <Text style={styles.marginBottom20}>Availability</Text>
              <View style={styles.propSubSection}>
                <CustomButtonGroup
                  buttons={reqWithinOptions}
                  accessibilityLabelId="req_within"
                  selectedIndices={[reqWithinOptions.findIndex(option => option.text === reqWithin)]}
                  isMultiSelect={false}
                  buttonStyle={{ backgroundColor: '#fff', borderColor: 'rgba(173, 181, 189, .5)', borderWidth: 1 }}
                  selectedButtonStyle={{ backgroundColor: 'rgba(0, 163, 108, .2)' }}
                  buttonTextStyle={{ color: '#000' }}
                  selectedButtonTextStyle={{ color: '#000' }}
                  onButtonPress={(index, button) => {
                    console.log(`Button pressed: ${button.text} (Index: ${index})`);
                    setReqWithin(button.text);
                    // Query update is handled by useEffect after state change
                  }}
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

            <ScrollView style={{ marginTop: 10, marginBottom: 20 }}>
              <Text style={styles.marginBottom10}>Customer Looking For</Text>
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
              <Text style={styles.marginBottom10}>Name</Text>
              <View style={styles.propSubSection}>
                <ButtonGroup
                  selectedBackgroundColor="rgba(27, 106, 158, 0.85)"
                  onPress={sortByName}
                  selectedIndex={sortByNameIndex}
                  buttons={sortByNameArray}
                  // containerStyle={{ height: 30 }}
                  textStyle={{ textAlign: "center" }}
                  selectedTextStyle={{ color: "#fff" }}
                  containerStyle={{ borderRadius: 10, width: 350 }}
                  containerBorderRadius={10}
                />
              </View>
              {/* <Text style={styles.marginBottom10}>Availability</Text>
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
            </View> */}

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
              backgroundColor: "rgba(0,191,255, .5)",
              borderRadius: 100
            }}
            onPress={() => navigation.navigate("AddNewCustomerStack")}
          >
            <AntDesign name="pluscircleo" size={40} color="#ffffff" />
            {/* <Image style={{ width: 50, height: 50, resizeMode: 'contain' }} source={require('assets/imgs/group.png')} /> */}
          </TouchableOpacity> : null}
      </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 5
    // alignContent: "center"
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
  marginBottom20: {
    marginBottom: 20
  }
});

const mapStateToProps = state => ({
  userDetails: state.AppReducer.userDetails,
  commercialCustomerList: state.AppReducer.commercialCustomerList,
});
const mapDispatchToProps = {
  setCommercialCustomerList,
  setAnyItemDetails
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CustomersCommercial);
// export default ListingCommercial;
