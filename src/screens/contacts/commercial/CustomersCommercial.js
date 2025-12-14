import React, { useState, useEffect, useCallback, useRef } from "react";
import { MdSearch, MdSort, MdFilterList, MdRestartAlt, MdAddCircleOutline } from "react-icons/md";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { useNavigate, useLocation } from "react-router-dom";
// import {
//   FlatList,
//   View,
//   Text,
//   SafeAreaView,
//   StyleSheet,
//   TouchableOpacity,
//   ScrollView,
//   TextInput,
//   ActivityIndicator,
// } from "react-native";
// import { useFocusEffect } from '@react-navigation/native';

import { connect } from "react-redux";
// import { CheckBox } from "@rneui/themed";
// import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
// import Icon from "react-native-vector-icons/MaterialCommunityIcons";
// import AntDesign from "react-native-vector-icons/AntDesign";

// import { BottomSheet } from "react-native-btr";
// import { ButtonGroup } from "@rneui/themed";
// import { HelperText, useTheme } from "react-native-paper";
import Button from "./../../../components/Button";
// import { Divider } from "react-native-paper";
// import { SocialIcon } from "@rneui/themed";
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
// import { useIsFocused } from '@react-navigation/native'; //
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
    const location = useLocation();
    const { displayCheckBox, disableDrawer, displayCheckBoxForEmployee, employeeObj, didDbCall = false, displayFilterButton = true } = location.state || {};
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
    const isFetching = useRef(false);

    const [reqWithin, setReqWithin] = useState("");
    const [purpose, setPurpose] = useState("");
    const [selectedProperties, setSelectedProperties] = useState([]);
    const [selectedBuildingType, setSelectedBuildingType] = useState([]);

    // Select the 'shouldRefresh' state from the 'dataRefresh' slice
    const shouldRefresh = useSelector((state) => state.dataRefresh.shouldRefresh);
    const dispatch = useDispatch();
    // const isFocused = useIsFocused(); // To ensure refresh happens when screen comes into view

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
        if (shouldRefresh || didDbCall) {
            fetchData();
        }
    }, [shouldRefresh, fetchData, didDbCall]);


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

        if (isFetching.current) return;
        isFetching.current = true;

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
                isFetching.current = false;
            },
            error => {
                console.log(error);
                setLoading(false);
                isFetching.current = false;
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

    const navigate = useNavigate();

    const navigateToDetails = (item, propertyFor) => {
        props.setAnyItemDetails(item);
        if (propertyFor === "Rent") {
            navigate("/contacts/CustomerDetailsCommercialRentFromList", {
                state: {
                    item: item,
                    displayMatchCount: true,
                    displayMatchPercent: false
                }
            });
        } else if (propertyFor === "Buy") {
            navigate("/contacts/CustomerDetailsCommercialBuyFromList", {
                state: {
                    item: item,
                    displayMatchCount: true,
                    displayMatchPercent: false
                }
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
                    if (itemToClose.customer_status == 0) {
                        itemToClose.customer_status = 1
                    } else if (itemToClose.customer_status == 1) {
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
                    <div onClick={() => navigateToDetails(item, "Rent")} style={{ cursor: 'pointer' }}>
                        <CustomerCommercialRentCard navigation={navigation} item={item} deleteMe={deleteMe} closeMe={closeMe} displayCheckBox={displayCheckBox}
                            disableDrawer={disableDrawer} displayCheckBoxForEmployee={displayCheckBoxForEmployee} employeeObj={employeeObj} />
                    </div>
                );
            } else if (item.customer_locality.property_for === "Buy") {
                return (
                    <div onClick={() => navigateToDetails(item, "Buy")} style={{ cursor: 'pointer' }}>
                        <CustomerCommercialBuyCard navigation={navigation} item={item} deleteMe={deleteMe} closeMe={closeMe} displayCheckBox={displayCheckBox}
                            disableDrawer={disableDrawer} displayCheckBoxForEmployee={displayCheckBoxForEmployee} employeeObj={employeeObj} />
                    </div>
                );
            }
        }

        // // console.log("hi");
    };

    const ItemSeparatorView = () => {
        return (
            //Item Separator
            <div
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
            <div style={{ padding: 10, alignItems: 'center', textAlign: 'center' }}>
                <p style={{ color: '#000' }} data-testid="end_of_list">End</p>
            </div>
        );
    };

    return (
        <div style={{ flex: 1, backgroundColor: "#fff", height: '100vh', display: 'flex', flexDirection: 'column' }}>
            {loading ? (
                <div style={{ flex: 1, justifyContent: "center", alignItems: "center", display: 'flex' }}>
                    <span>Loading...</span>
                </div>
            ) : (
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                    <div className="flex flex-row items-center p-4 border-b border-gray-200">
                        <div className="flex-1 flex items-center bg-white rounded-lg border border-gray-300 px-3 py-2 shadow-sm">
                            <MdSearch size={24} className="text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search By Name, Address, Id, Mobile"
                                value={search}
                                onChange={(e) => searchFilterFunction(e.target.value)}
                                className="flex-1 bg-transparent border-none outline-none text-gray-700 placeholder-gray-500 text-base"
                            />
                        </div>
                    </div>

                    {data.length > 0 ? (
                        <div style={{ flex: 1, overflowY: 'auto' }}>
                            {data.map((item, index) => (
                                <div key={index}>
                                    <ItemView item={item} />
                                    <ItemSeparatorView />
                                </div>
                            ))}
                            <FlatListFooter />
                        </div>
                    ) : (
                        <div style={{ flex: 1, justifyContent: "center", alignItems: "center", display: 'flex', flexDirection: 'column' }}>
                            <span style={{ textAlign: "center" }}>
                                You have no customer
                            </span>
                            {props.userDetails && ((props.userDetails.works_for === props.userDetails.id) ||
                                (props.userDetails.user_type === "employee" && EMPLOYEE_ROLE.includes(props.userDetails.employee_role)
                                )) ?
                                <div onClick={() => navigateTo()} style={{ cursor: 'pointer', marginTop: 20 }}>
                                    <span style={{ color: "#00BFFF", textAlign: "center" }}>
                                        Add New Customer
                                    </span>
                                </div> : null}
                        </div>
                    )}


                </div>
            )}

            {visible && (
                <div className="fixed inset-0 flex justify-center items-end z-50" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }} onClick={toggleBottomNavigationView}>
                    <div className="bg-white w-full p-4 pb-20 rounded-t-lg max-h-[50vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-center items-center relative mb-4 sticky top-0 bg-white z-10">
                            <h3 className="text-lg font-bold text-black">Filter</h3>
                            <div
                                onClick={resetFilter}
                                className="absolute top-0 right-0 cursor-pointer"
                            >
                                <MdRestartAlt
                                    color={"#000000"}
                                    size={30}
                                />
                            </div>
                        </div>

                        <div className="mb-4">
                            <h4 className="font-semibold mb-2 text-black">Looking For</h4>
                            <CustomButtonGroup
                                buttons={porposeForOptions}
                                selectedIndices={[porposeForOptions.findIndex(option => option.text === purpose)]}
                                isMultiSelect={false}
                                buttonStyle={{ backgroundColor: '#fff', borderColor: 'rgba(173, 181, 189, .5)', borderWidth: 1 }}
                                selectedButtonStyle={{ backgroundColor: '#00a36c' }}
                                buttonTextStyle={{ color: '#000' }}
                                selectedButtonTextStyle={{ color: '#fff' }}
                                onButtonPress={(index, button) => setPurpose(button.text)}
                            />
                        </div>

                        <div className="mb-4">
                            <h4 className="font-semibold mb-2 text-black">Property Type</h4>
                            <CustomButtonGroup
                                buttons={propertyTypeOptions}
                                selectedIndices={selectedProperties.map(item => propertyTypeOptions.findIndex(option => option.text === item))}
                                isMultiSelect={true}
                                buttonStyle={{ backgroundColor: '#fff', borderColor: 'rgba(173, 181, 189, .5)', borderWidth: 1 }}
                                selectedButtonStyle={{ backgroundColor: '#00a36c' }}
                                buttonTextStyle={{ color: '#000' }}
                                selectedButtonTextStyle={{ color: '#fff' }}
                                onButtonPress={(index, button) => selectPropertyType(index, button)}
                            />
                        </div>

                        <div className="mb-4">
                            <h4 className="font-semibold mb-2 text-black">Building Type</h4>
                            <CustomButtonGroup
                                buttons={buildingTypeOption}
                                selectedIndices={selectedBuildingType.map(item => buildingTypeOption.findIndex(option => option.text === item))}
                                isMultiSelect={true}
                                buttonStyle={{ backgroundColor: '#fff', borderColor: 'rgba(173, 181, 189, .5)', borderWidth: 1 }}
                                selectedButtonStyle={{ backgroundColor: '#00a36c' }}
                                buttonTextStyle={{ color: '#000' }}
                                selectedButtonTextStyle={{ color: '#fff' }}
                                onButtonPress={(index, button) => selectbuildingType(index, button)}
                            />
                        </div>

                        {purpose === "Rent" && (
                            <div className="mb-4">
                                <h4 className="font-semibold mb-2 text-black">Rent Range</h4>
                                <Slider
                                    min={5000}
                                    max={500000}
                                    onSlide={handlePriceRangeChange}
                                />
                            </div>
                        )}

                        {purpose === "Buy" && (
                            <div className="mb-4">
                                <h4 className="font-semibold mb-2 text-black">Sell Price Range</h4>
                                <SliderCr
                                    min={1000000}
                                    max={100000000}
                                    onSlide={handlePriceRangeChangeCr}
                                />
                            </div>
                        )}

                        <div className="mb-4">
                            <h4 className="font-semibold mb-2 text-black">Availability</h4>
                            <CustomButtonGroup
                                buttons={reqWithinOptions}
                                selectedIndices={[reqWithinOptions.findIndex(option => option.text === reqWithin)]}
                                isMultiSelect={false}
                                buttonStyle={{ backgroundColor: '#fff', borderColor: 'rgba(173, 181, 189, .5)', borderWidth: 1 }}
                                selectedButtonStyle={{ backgroundColor: '#00a36c' }}
                                buttonTextStyle={{ color: '#000' }}
                                selectedButtonTextStyle={{ color: '#fff' }}
                                onButtonPress={(index, button) => setReqWithin(button.text)}
                            />
                        </div>

                        <div className="mb-4">
                            <h4 className="font-semibold mb-2 text-black">Buildup Area Range</h4>
                            <SliderSmallNum
                                min={50}
                                max={15000}
                                onSlide={handleBuildupAreaRange}
                            />
                        </div>

                        <div className="mb-4">
                            <Button title="Apply" onPress={onFilter} />
                        </div>
                    </div>
                </div>
            )}

            {visibleSorting && (
                <div className="fixed inset-0 flex justify-center items-end z-50" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }} onClick={toggleSortingBottomNavigationView}>
                    <div className="bg-white w-full p-4 pb-20 rounded-t-lg max-h-[50vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-center items-center relative mb-4 sticky top-0 bg-white z-10">
                            <h3 className="text-lg font-bold text-black">Sort</h3>
                            <div
                                onClick={resetSortBy}
                                className="absolute top-0 right-0 cursor-pointer"
                            >
                                <MdRestartAlt
                                    color={"#000000"}
                                    size={30}
                                />
                            </div>
                        </div>

                        <div className="mb-4">
                            <h4 className="font-semibold mb-2 text-black">Looking For</h4>
                            <CustomButtonGroup
                                buttons={lookingForArraySortBy.map(item => ({ text: item }))}
                                selectedIndices={[lookingForIndexSortBy]}
                                isMultiSelect={false}
                                buttonStyle={{ backgroundColor: '#fff', borderColor: 'rgba(173, 181, 189, .5)', borderWidth: 1 }}
                                selectedButtonStyle={{ backgroundColor: '#00a36c' }}
                                buttonTextStyle={{ color: '#000' }}
                                selectedButtonTextStyle={{ color: '#fff' }}
                                onButtonPress={(index) => selectLookingForIndexSortBy(index)}
                            />
                        </div>

                        <div className="mb-4">
                            <h4 className="font-semibold mb-2 text-black">Sort By Name</h4>
                            <CustomButtonGroup
                                buttons={sortByNameArray.map(item => ({ text: item }))}
                                selectedIndices={[sortByNameIndex]}
                                isMultiSelect={false}
                                buttonStyle={{ backgroundColor: '#fff', borderColor: 'rgba(173, 181, 189, .5)', borderWidth: 1 }}
                                selectedButtonStyle={{ backgroundColor: '#00a36c' }}
                                buttonTextStyle={{ color: '#000' }}
                                selectedButtonTextStyle={{ color: '#fff' }}
                                onButtonPress={(index) => sortByName(index)}
                            />
                        </div>

                        <div className="mb-4">
                            <h4 className="font-semibold mb-2 text-black">Sort By Posted Date</h4>
                            <CustomButtonGroup
                                buttons={sortByPostedDateArray.map(item => ({ text: item }))}
                                selectedIndices={[sortByPostedDateIndex]}
                                isMultiSelect={false}
                                buttonStyle={{ backgroundColor: '#fff', borderColor: 'rgba(173, 181, 189, .5)', borderWidth: 1 }}
                                selectedButtonStyle={{ backgroundColor: '#00a36c' }}
                                buttonTextStyle={{ color: '#000' }}
                                selectedButtonTextStyle={{ color: '#fff' }}
                                onButtonPress={(index) => sortByPostedDate(index)}
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Filter/Sort FAB */}
            {!visible && !visibleSorting && (
                <div
                    style={{
                        display: 'flex',
                        flexDirection: "row",
                        position: "fixed",
                        width: '130px',
                        height: '35px',
                        alignItems: "center",
                        justifyContent: "center",
                        left: '50%',
                        transform: 'translateX(-50%)',
                        bottom: '70px',
                        backgroundColor: "#00a36c",
                        borderRadius: '30px',
                        zIndex: 100,
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.2), 0 2px 4px -1px rgba(0, 0, 0, 0.1)'
                    }}
                >
                    <div
                        onClick={() => toggleSortingBottomNavigationView()}
                        style={{ paddingRight: '20px', cursor: 'pointer' }}
                    >
                        <MdSort color={"#ffffff"} size={26} />
                    </div>
                    <div style={{ height: "100%", width: '2px', backgroundColor: "#ffffff" }}></div>
                    <div
                        onClick={() => toggleBottomNavigationView()}
                        style={{ paddingLeft: '20px', cursor: 'pointer' }}
                    >
                        <MdFilterList
                            color={"#ffffff"}
                            size={26}
                        />
                    </div>
                </div>
            )}

            {props.userDetails && ((props.userDetails.works_for === props.userDetails.id) ||
                (props.userDetails.user_type === "employee" && EMPLOYEE_ROLE.includes(props.userDetails.employee_role)
                )) ?
                <div
                    style={{
                        alignItems: "center",
                        justifyContent: "center",
                        position: "fixed",
                        bottom: '70px',
                        right: '25px',
                        backgroundColor: "rgba(50, 195, 77, 0.59)",
                        borderRadius: 100,
                        cursor: 'pointer',
                        zIndex: 100
                    }}
                    onClick={() => navigateTo()}
                >
                    <AiOutlinePlusCircle size={40} color="#ffffff" />
                </div> : null}

            <Snackbar
                visible={isVisible}
                textMessage={errorMessage}
                position={"top"}
                actionHandler={dismissSnackBar}
                actionText="OK"
            />
        </div>
    );
};

const styles = {
    fab: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        cursor: 'pointer'
    },
    fabIcon1: {
        backgroundColor: '#00A36C',
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10
    },
    fabIcon2: {
        backgroundColor: '#00A36C',
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10
    },
    verticalLine: {
        height: 20,
        width: 1,
        backgroundColor: '#00A36C',
        marginBottom: 10
    },
    propSubSection: {
        marginBottom: 10
    },
    marginBottom10: {
        marginBottom: 10
    }
};

const mapStateToProps = state => ({
    commercialCustomerList: state.AppReducer.commercialCustomerList,
    userDetails: state.AppReducer.userDetails
});
const mapDispatchToProps = {
    setCommercialCustomerList,
    setAnyItemDetails
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(CustomersCommercial);
