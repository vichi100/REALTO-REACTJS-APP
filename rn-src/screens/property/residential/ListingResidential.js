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
  ActivityIndicator,
  AsyncStorage,
  StatusBar,
  RefreshControl
} from "react-native";
import { connect } from "react-redux";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import AntDesign from "react-native-vector-icons/AntDesign";

import { BottomSheet } from "react-native-btr";
import { ButtonGroup } from "@rneui/themed";
import { HelperText, useTheme } from "react-native-paper";
import Button from "./../../../components/Button";
import { Divider } from "react-native-paper";
import { SocialIcon } from "@rneui/themed";
import Slider from "./../../../components/Slider";
import SliderCr from "./../../../components/SliderCr";
import CardResidentialRent from "./rent/ResidentialRentCard";
import CardResidentialSell from "./sell/ResidentialSellCard";
import axios from "axios";
import { SERVER_URL } from "./../../../utils/Constant";
import { EMPLOYEE_ROLE } from "./../../../utils/AppConstant";
import { getBottomSpace } from "react-native-iphone-x-helper";
import {
  setResidentialPropertyList,
  setAnyItemDetails,
  setPropertyDetails
} from "./../../../reducers/Action";
import { addDays, numDifferentiation } from "./../../../utils/methods";
import Snackbar from "./../../../components/SnackbarComponent";
import { useFocusEffect } from '@react-navigation/native';
import CustomButtonGroup from "./../../../components/CustomButtonGroup";

import { resetRefresh } from "./../../../reducers/dataRefreshReducer"; // Import the action creator
import { useIsFocused } from '@react-navigation/native'; //
import { useSelector, useDispatch } from 'react-redux'; // Import hooks

// Dynamic query
// https://stackoverflow.com/questions/29831164/how-to-filter-in-mongodb-dynamically#:~:text=answer%20was%20accepted%E2%80%A6-,var%20fName%3D%22John%22%2C%20fCountry%3D%22US%22,fName%7D)%3B%20%7D%20if%20(fCountry%20!%3D%3D

const lookingForArray = ["Rent", "Sell"];
const homeTypeArray = ["Apartment", "Villa", "Independent House"];
const bhkTypeArray = ["1RK", "1BHK", "2BHK", "3BHK", "4+BHK"];
const availabilityArray = ["7 Days", "15 Days", "30 Days", "60 Days", "60+ Days"];
const furnishingStatusArray = ["Full", "Semi", "Empty"];
const lookingForArraySortBy = ["Rent", "Sell"];
const sortByRentArray = ["Lowest First", "Highest First"];
const sortByAvailabilityArray = ["Earliest First", "Oldest First"];
const sortByPostedDateArray = ["Recent First", "Oldest Fist"];

const bhkOption = [
  { text: '1RK' },
  { text: '1BHK' },
  { text: '2BHK' },
  { text: '3BHK' },
  { text: '4+BHK' },
];

const reqWithinOptions = [
  { text: '7 Days' },
  { text: '15 Days' },
  { text: '30 Days' },
  { text: '60 Days' },
  { text: '60+ Days' },
];

const porposeForOptions = [
  { text: 'Rent' },
  { text: 'Sell' },
];

const furnishingStatusOptions = [
  { text: 'Full' },
  { text: 'Semi' },
  { text: 'Empty' },
]


const ListingResidential = props => {

  // const rent = useRef(0);;
  // const sell = useRef(0);;
  const { navigation } = props;
  const { displayCheckBox, disableDrawer, displayCheckBoxForEmployee, employeeObj, didDbCall = false } = props.route.params || {};
  const [isVisible, setIsVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [search, setSearch] = useState("");
  const [visible, setVisible] = useState(false);
  const [visibleSorting, setVisibleSorting] = useState(false);
  const [filteredDataSource, setFilteredDataSource] = useState([]);
  const [masterDataSource, setMasterDataSource] = useState([]);
  const [index, setIndex] = useState(null);
  const [data, setData] = useState([]);
  const [lookingForIndex, setLookingForIndex] = useState(-1);
  const [homeTypeIndex, setHomeTypeIndex] = useState(-1);
  const [bhkTypeIndex, setBHKTypeIndex] = useState(-1);
  const [availabilityIndex, setAvailabilityIndex] = useState(-1);
  const [furnishingIndex, setFurnishingIndex] = useState(-1);
  const [minRent, setMinRent] = useState(5000);
  const [maxRent, setMaxRent] = useState(500000);
  const [minSell, setMinSell] = useState(1000000);
  const [maxSell, setMaxSell] = useState(100000000);
  const [sortByRentIndex, setSortByRentIndex] = useState(-1);
  const [sortByAvailabilityIndex, setSortByAvailabilityIndex] = useState(-1);
  const [sortByPostedDateIndex, setSortByPostedDateIndex] = useState(-1);
  const [lookingForIndexSortBy, setLookingForIndexSortBy] = useState(-1);
  const [loading, setLoading] = useState(false);
  const [rentPropCount, setRentPropCount] = useState([]);
  const [sellPropCount, setSellPropCount] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  // filter
  const [selectedBHK, setSelectedBHK] = useState([]);
  const [reqWithin, setReqWithin] = useState("");
  const [purpose, setPurpose] = useState("");
  const [selectedFunishing, setSelectedFunishing] = useState([]);

  // Select the 'shouldRefresh' state from the 'dataRefresh' slice
  const shouldRefresh = useSelector((state) => state.dataRefresh.shouldRefresh);
  const dispatch = useDispatch();
  const isFocused = useIsFocused(); // To ensure refresh happens when screen comes into view


  const resetFilter = () => {
    setSelectedBHK([]);
    setReqWithin("");
    setPurpose("");
    setSelectedFunishing([]);
    setData(props.residentialPropertyList);
    setVisible(false);
    setMinRent(5000);
    setMaxRent(500000);
    setMinSell(1000000);
    setMaxSell(100000000);
  };


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
  //     if (didDbCall || shouldRefresh) {
  //       fetchData();
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
    setSortByRentIndex(-1);
    setSortByAvailabilityIndex(-1);
    setSortByPostedDateIndex(-1);
    setData(props.residentialPropertyList);
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
    let filterList = props.residentialPropertyList;
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
    setSortByRentIndex(-1);
    setSortByPostedDateIndex(-1);
    setVisibleSorting(false);
    let filterList = props.residentialPropertyList;
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
    console.log("onFilter:     ", props.residentialPropertyList);
    if (lookingForIndexSortBy === -1) {
      setErrorMessage("Looking for is missing in filter");
      setIsVisible(true);
      return;
    }
    setSortByRentIndex(index);
    setSortByAvailabilityIndex(-1);
    setSortByPostedDateIndex(-1);
    setVisibleSorting(false);
    let filterList = props.residentialPropertyList;
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





  const dismissSnackBar = () => {
    setIsVisible(false);
  };

  const selectLookingForIndexSortBy = index => {
    setLookingForIndexSortBy(index);
    setSortByRentIndex(-1);
    setSortByAvailabilityIndex(-1);
    setSortByPostedDateIndex(-1);
    setIsVisible(false);
  };

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

  const getListing = () => {
    // const agentDetailsX = getAgentDetails();
    // console.log("props.userDetail3 " + JSON.stringify(props.userDetails));
    if (props.userDetails === null) {
      setData([]);
      props.setResidentialPropertyList([]);
      return;
    }
    const user = {
      req_user_id: props.userDetails.id,
      agent_id: props.userDetails.works_for,
    };
    setLoading(true);
    // // console.log(JSON.stringify(user));
    axios(SERVER_URL + "/residentialPropertyListings", {
      method: "post",
      headers: {
        "Content-type": "Application/json",
        Accept: "Application/json"
      },
      data: user
    }).then(
      response => {
        // console.log("response.data:      ", response.data);
        response.data.map(item => {
          item.image_urls.map(image => {
            image.url = SERVER_URL + image.url
          })
        })
        setData(response.data);
        props.setResidentialPropertyList(response.data);
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
  };

  const searchFilterFunction = text => {
    // Check if searched text is not blank
    if (text) {
      // Inserted text is not blank
      // Filter the masterDataSource and update FilteredDataSource
      const newData = props.residentialPropertyList.filter(function (item) {
        // Applying filter for the inserted text in search bar
        const itemData =
          item.property_address.building_name +
          item.property_address.landmark_or_street +
          item.property_address.formatted_address +
          item.owner_details.name +
          item.owner_details.mobile1 +
          item.property_id;

        const textData = text.toUpperCase();
        return itemData.toUpperCase().indexOf(textData) > -1;
      });
      setData(newData);
      setSearch(text);
    } else {
      // Inserted text is blank
      // Update FilteredDataSource with masterDataSource
      setData(props.residentialPropertyList);
      setSearch(text);
    }
  };

  const navigateToDetails = (item, propertyFor) => {
    // props.setAnyItemDetails(item);
    console.log("props.setPropertyDetails(item: )", item);
    props.setPropertyDetails(item);

    if (propertyFor === "Rent") {
      navigation.navigate("PropDetailsFromListing", {
        item: item,
        displayMatchCount: true, displayMatchPercent: false
      });
    } else if (propertyFor === "Sell") {
      navigation.navigate("PropDetailsFromListingForSell", {
        item: item,
        displayMatchCount: true, displayMatchPercent: false
      });
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
          if(itemToClose.property_status == 0){
            itemToClose.property_status = 1
          }else if(itemToClose.property_status == 1){
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

  const ItemView = ({ item, index }) => {

    if (item.property_type.toLowerCase() === "Residential".toLowerCase()) {
      if (item.property_for.toLowerCase() === "Rent".toLowerCase()) {
        // rentPropCount.push("1");
        // console.log(rentPropCount.length);
        return (
          <TouchableOpacity onPress={() => navigateToDetails(item, "Rent")} accessibilityLabelId={`residential-rent-${index}`}
            testID={`residential-rent-${index}`}>
            <CardResidentialRent navigation={navigation} item={item} deleteMe={deleteMe} closeMe={closeMe} displayCheckBox={displayCheckBox}
              disableDrawer={disableDrawer} displayCheckBoxForEmployee={displayCheckBoxForEmployee} employeeObj={employeeObj}
            />

          </TouchableOpacity>
        );
      } else if (item.property_for.toLowerCase() === "Sell".toLowerCase()) {
        // sellPropCount.push("1");
        return (
          <TouchableOpacity onPress={() => navigateToDetails(item, "Sell")} accessibilityLabelId={`residential-rent-${index}`}
            testID={`residential-rent-${index}`}>
            <CardResidentialSell navigation={navigation} item={item} deleteMe={deleteMe} closeMe={closeMe} displayCheckBox={displayCheckBox}
              disableDrawer={disableDrawer} displayCheckBoxForEmployee={displayCheckBoxForEmployee} employeeObj={employeeObj}
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
        style={{ height: 5, width: "100%", backgroundColor: "#C8C8C8" }}
      />
    );
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
    navigation.navigate("Add");
  };

  const setRentRange = values => {
    // // console.log("slider value min: ", values[0]);
    // // console.log("slider value max: ", values[1]);
    setMinRent(values[0]);
    setMaxRent(values[1]);
  };

  const setSellRange = values => {
    // console.log("slider value min: ", values[0]);
    // console.log("slider value max: ", values[1]);
    setMinSell(values[0]);
    setMaxSell(values[1]);
  };

  useEffect(() => {
    if (props.residentialPropertyList.length > 0) {
      // console.log("residentialPropertyList: ", props.residentialPropertyList);
      setData(props.residentialPropertyList)
    }

  }, [props.residentialPropertyList])


  // Filter methods

  const handlePriceRangeChange = useCallback((values) => {
    setRentRange(values);
  }, []);

  const handlePriceRangeChangeCr = useCallback((values) => {
    setSellRange(values);
  }, []);

  const selectBHK = (index, button) => {
    let newSelectedIndicesBHK;
    newSelectedIndicesBHK = [...selectedBHK];
    if (newSelectedIndicesBHK.includes(button.text)) {
      newSelectedIndicesBHK.splice(newSelectedIndicesBHK.indexOf(button.text), 1);
    } else {
      newSelectedIndicesBHK.push(button.text);
    }
    setSelectedBHK(newSelectedIndicesBHK);
    console.log(`newSelectedIndices: ${newSelectedIndicesBHK}`);
    // Query update is handled by useEffect after state change
  }

  const selectFurnishings = (index, button) => {
    let newSelectedIndicesFurnishing;
    newSelectedIndicesFurnishing = [...selectedFunishing];
    if (newSelectedIndicesFurnishing.includes(button.text)) {
      newSelectedIndicesFurnishing.splice(newSelectedIndicesFurnishing.indexOf(button.text), 1);
    } else {
      newSelectedIndicesFurnishing.push(button.text);
    }
    setSelectedFunishing(newSelectedIndicesFurnishing);
    console.log(`newSelectedIndices: ${newSelectedIndicesFurnishing}`);
    // Query update is handled by useEffect after state change
  }

  const onFilter = () => {
    console.log("onFilter:     ", props.residentialPropertyList);
    if (purpose.trim() === "") {
      setErrorMessage("Looking for is missing in filter");
      setIsVisible(true);
      return;
    }
    let filterList = props.residentialPropertyList;
    if (purpose.trim() !== "") {
      filterList = filterList.filter(
        item => item.property_for === purpose
      );
    }
    // if (homeTypeIndex > -1) {
    //   filterList = filterList.filter(
    //     item =>
    //       item.property_details.house_type === homeTypeArray[homeTypeIndex]
    //   );
    // }
    if (selectedBHK.length > 0) {
      filterList = filterList.filter(
        item => selectedBHK.includes(item.property_details.bhk_type)
      );
    }

    if (purpose === "Rent" && reqWithin !== "") {
      const today = new Date();
      let possessionDate;

      if (reqWithin === "7 Days") {
        possessionDate = addDays(today, 7);
        filterList = filterList.filter(
          item => new Date(item.rent_details.available_from) <= possessionDate
        );
      } else if (reqWithin === "15 Days") {
        possessionDate = addDays(today, 15);
        filterList = filterList.filter(
          item => new Date(item.rent_details.available_from) <= possessionDate
        );
      } else if (reqWithin === "30 Days") {
        possessionDate = addDays(today, 30);
        filterList = filterList.filter(
          item => new Date(item.rent_details.available_from) <= possessionDate
        );
      } else if (reqWithin === "60 Days") {
        possessionDate = addDays(today, 60);
        filterList = filterList.filter(
          item => new Date(item.rent_details.available_from) <= possessionDate
        );
      } else if (reqWithin === "60+ Days") {
        possessionDate = addDays(today, 60);
        filterList = filterList.filter(
          item => new Date(item.rent_details.available_from) > possessionDate
        );
      }
    }

    else if (purpose === "Sell" && reqWithin !== "") {
      const today = new Date();
      let possessionDate;

      if (reqWithin === "7 Days") {
        possessionDate = addDays(today, 7);
        filterList = filterList.filter(
          item => new Date(item.sell_details.available_from) <= possessionDate
        );
      } else if (reqWithin === "15 Days") {
        possessionDate = addDays(today, 15);
        filterList = filterList.filter(
          item => new Date(item.sell_details.available_from) <= possessionDate
        );
      } else if (reqWithin === "30 Days") {
        possessionDate = addDays(today, 30);
        filterList = filterList.filter(
          item => new Date(item.sell_details.available_from) <= possessionDate
        );
      } else if (reqWithin === "60 Days") {
        possessionDate = addDays(today, 60);
        filterList = filterList.filter(
          item => new Date(item.sell_details.available_from) <= possessionDate
        );
      } else if (reqWithin === "60+ Days") {
        possessionDate = addDays(today, 60);
        filterList = filterList.filter(
          item => new Date(item.sell_details.available_from) > possessionDate
        );
      }
    }

    if (selectedFunishing.length > 0) {
      filterList = filterList.filter(
        item => selectedFunishing.includes(item.property_details.furnishing_status)
      );
    }

    if (purpose === "Rent") {
      if (minRent > 5000 || maxRent < 500000) {
        // console.log("rent");
        filterList = filterList.filter(
          item =>
            item.rent_details.expected_rent >= minRent &&
            item.rent_details.expected_rent <= maxRent
        );
      }
    } else if (purpose === "Sell") {
      if (minSell > 1000000 || maxSell < 100000000) {
        // console.log("rent");
        filterList = filterList.filter(
          item =>
            item.sell_details.expected_sell_price >= minRent &&
            item.sell_details.expected_sell_price <= maxRent
        );
      }
    }

    setData(filterList);
    setVisible(false);
  };

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
              ItemSeparatorComponent={ItemSeparatorView}
              //Item Separator View
              renderItem={ItemView}
              keyExtractor={(item, index) => index.toString()}
              // refreshControl={
              //   <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              // }
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
                You have no property listing
              </Text>
              {props.userDetails && ((props.userDetails.works_for === props.userDetails.id) ||
                (props.userDetails.user_type === "employee" && EMPLOYEE_ROLE.includes(props.userDetails.employee_role))) ?
                <TouchableOpacity onPress={() => navigateTo()}>
                  <Text
                    style={{ color: "#00BFFF", textAlign: "center", marginTop: 20 }}
                  >
                    Add New Property
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

          <View style={[styles.bottomNavigationView, { margin: 0 }]}>
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
              <Text style={styles.marginBottom10}>Looking For</Text>
              <View style={styles.propSubSection}>
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

              <Text style={styles.marginBottom10}>BHK Type</Text>
              <View style={styles.propSubSection}>
                <CustomButtonGroup
                  buttons={bhkOption}
                  accessibilityLabelId="bhk_type"
                  isMultiSelect={true}
                  buttonStyle={{ backgroundColor: '#fff', borderColor: 'rgba(173, 181, 189, .5)', borderWidth: 1 }}
                  selectedButtonStyle={{ backgroundColor: 'rgba(0, 163, 108, .2)' }}
                  buttonTextStyle={{ color: '#000' }}
                  selectedButtonTextStyle={{ color: '#000' }}
                  selectedIndices={selectedBHK.map((item) =>
                    bhkOption.findIndex((option) => option.text === item)
                  )}
                  onButtonPress={(index, button) => {
                    selectBHK(index, button);
                  }}
                />
              </View>
              {purpose === "" ? null : purpose === "Rent" ? (
                <View>
                  <Text style={{ marginBottom: 15 }}>Rent Range</Text>
                  <Slider
                    min={10000}
                    max={400000}
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
              <Text style={styles.marginBottom10}>Availability</Text>
              <View style={styles.propSubSection}>

                <CustomButtonGroup
                  buttons={reqWithinOptions}
                  accessibilityLabelId="req_with_in"
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
              <Text style={styles.marginBottom10}>Furnishing</Text>
              <View style={styles.propSubSection}>

                <CustomButtonGroup
                  buttons={furnishingStatusOptions}
                  accessibilityLabelId="furnishing_status"
                  isMultiSelect={true}
                  buttonStyle={{ backgroundColor: '#fff', borderColor: 'rgba(173, 181, 189, .5)', borderWidth: 1 }}
                  selectedButtonStyle={{ backgroundColor: 'rgba(0, 163, 108, .2)' }}
                  buttonTextStyle={{ color: '#000' }}
                  selectedButtonTextStyle={{ color: '#000' }}
                  selectedIndices={selectedFunishing.map((item) =>
                    furnishingStatusOptions.findIndex((option) => option.text === item)
                  )}
                  onButtonPress={(index, button) => {
                    console.log(`Button pressed: ${button.text} (Index: ${index})`);
                    selectFurnishings(index, button);
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
            <ScrollView style={{ marginTop: 15, marginBottom: 20 }}>
              <Text style={styles.marginBottom10}>Looking For</Text>
              <View style={styles.propSubSection}>
                <ButtonGroup
                  selectedButtonStyle={{ backgroundColor: "#00a36c4d" }}
                  // selectedBackgroundColor="rgba(0, 163, 108, .2)"
                  onPress={selectLookingForIndexSortBy}
                  selectedIndex={lookingForIndexSortBy}
                  buttons={lookingForArraySortBy}
                  // containerStyle={{ height: 30 }}
                  textStyle={{ textAlign: "center" }}
                  selectedTextStyle={{ color: "#000" }}
                  containerStyle={{ borderRadius: 10, width: 350 }}
                  containerBorderRadius={10}
                />
              </View>
              <Text style={styles.marginBottom10}>Rent</Text>
              <View style={styles.propSubSection}>
                <ButtonGroup
                  selectedButtonStyle={{ backgroundColor: "#00a36c4d" }}
                  onPress={sortByRent}
                  selectedIndex={sortByRentIndex}
                  buttons={sortByRentArray}
                  // containerStyle={{ height: 30 }}
                  textStyle={{ textAlign: "center" }}
                  selectedTextStyle={{ color: "#000" }}
                  containerStyle={{ borderRadius: 10, width: 350 }}
                  containerBorderRadius={10}
                />
              </View>
              <Text style={styles.marginBottom10}>Availability</Text>
              <View style={styles.propSubSection}>
                <ButtonGroup
                  selectedButtonStyle={{ backgroundColor: "#00a36c4d" }}
                  onPress={sortByAvailability}
                  selectedIndex={sortByAvailabilityIndex}
                  buttons={sortByAvailabilityArray}
                  // containerStyle={{ height: 30 }}
                  textStyle={{ textAlign: "center" }}
                  selectedTextStyle={{ color: "#000" }}
                  containerStyle={{ borderRadius: 10, width: 350 }}
                  containerBorderRadius={10}
                />
              </View>

              <Text style={styles.marginBottom10}>Posted date</Text>
              <View style={styles.propSubSection}>
                <ButtonGroup
                  selectedButtonStyle={{ backgroundColor: "#00a36c4d" }}
                  onPress={sortByPostedDate}
                  selectedIndex={sortByPostedDateIndex}
                  buttons={sortByPostedDateArray}
                  // containerStyle={{ height: 30 }}
                  textStyle={{ textAlign: "center" }}
                  selectedTextStyle={{ color: "#000" }}
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
            accessibilityLabel="add_property_icon"
            // accessibilityRole="button"
            // accessible={true}
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
          </TouchableOpacity> : null}
      </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 5,

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
  }
});

const mapStateToProps = state => ({
  userDetails: state.AppReducer.userDetails,
  residentialPropertyList: state.AppReducer.residentialPropertyList
});
const mapDispatchToProps = {
  setResidentialPropertyList,
  setAnyItemDetails,
  setPropertyDetails
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ListingResidential);

// export default ListingResidential;
