import React, { useState, useEffect, useCallback } from "react";
import { connect } from "react-redux";
import {
    MdSort,
    MdFilterList,
    MdRestartAlt,
    MdSearch
} from "react-icons/md";
import Button from "./../../components/Button";
import CardRent from "../property/commercial/rent/CommercialRentCard";
import CardSell from "../property/commercial/sell/CommercialSellCard";
import axios from "axios";
import { SERVER_URL } from "./../../utils/Constant";
import { setCommercialPropertyList } from "./../../reducers/Action";
import { addDays } from "./../../utils/methods";
import Snackbar from "./../../components/SnackbarComponent";
import CustomButtonGroup from "./../../components/CustomButtonGroup";
import { resetRefresh } from './../../reducers/dataRefreshReducer';
import { useSelector, useDispatch } from 'react-redux';

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
    const { searchGlobalResult } = route?.params || {};
    const [search, setSearch] = useState("");
    const [isVisible, setIsVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
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

    const shouldRefresh = useSelector((state) => state.dataRefresh.shouldRefresh);
    const dispatch = useDispatch();

    useEffect(() => {
        console.log('Screen focused - refreshing data');
        if (searchGlobalResult) {
            searchGlobalResult();
        } else {
            setData(props.globalSearchResult);
        }
    }, []);

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

    useEffect(() => {
        console.log('globalSearchResult updated, setting data');
        setData(props.globalSearchResult);
    }, [props.globalSearchResult]);


    const resetSortBy = () => {
        setLookingForIndexSortBy(-1);
        setSortByRentIndex(-1);
        setSortByAvailabilityIndex(-1);
        setSortByPostedDateIndex(-1);

        if (search) {
            const newData = props.commercialPropertyList.filter(function (item) {
                const itemData =
                    item.property_address.building_name +
                    item.property_address.landmark_or_street +
                    item.property_address.location_area +
                    item.property_address.formatted_address +
                    item.owner_details.name +
                    item.owner_details.mobile1 +
                    item.property_id;
                const textData = search.toUpperCase();
                return itemData.toUpperCase().indexOf(textData) > -1;
            });
            setData(newData);
        } else {
            setData(props.globalSearchResult);
        }
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
        setVisibleSorting(false);
        let filterList = search ? [...props.commercialPropertyList] : [...props.globalSearchResult];
        if (search) {
            filterList = filterList.filter(function (item) {
                const itemData =
                    item.property_address.building_name +
                    item.property_address.landmark_or_street +
                    item.property_address.location_area +
                    item.property_address.formatted_address +
                    item.owner_details.name +
                    item.owner_details.mobile1 +
                    item.property_id;

                const textData = search.toUpperCase();
                return itemData.toUpperCase().indexOf(textData) > -1;
            });
        }
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
        setVisibleSorting(false);
        let filterList = search ? [...props.commercialPropertyList] : [...props.globalSearchResult];
        if (search) {
            filterList = filterList.filter(function (item) {
                const itemData =
                    item.property_address.building_name +
                    item.property_address.landmark_or_street +
                    item.property_address.location_area +
                    item.property_address.formatted_address +
                    item.owner_details.name +
                    item.owner_details.mobile1 +
                    item.property_id;

                const textData = search.toUpperCase();
                return itemData.toUpperCase().indexOf(textData) > -1;
            });
        }
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
        setVisibleSorting(false);
        let filterList = search ? [...props.commercialPropertyList] : [...props.globalSearchResult];
        if (search) {
            filterList = filterList.filter(function (item) {
                const itemData =
                    item.property_address.building_name +
                    item.property_address.landmark_or_street +
                    item.property_address.location_area +
                    item.property_address.formatted_address +
                    item.owner_details.name +
                    item.owner_details.mobile1 +
                    item.property_id;

                const textData = search.toUpperCase();
                return itemData.toUpperCase().indexOf(textData) > -1;
            });
        }
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
        setData(props.globalSearchResult);
        setSearch("");
        setVisible(false);
    };

    const onFilter = () => {
        // console.log("onFilter:     ", props.commercialPropertyList);
        if (lookingForIndex === -1) {
            setErrorMessage("Looking for is missing in filter");
            setIsVisible(true);
            return;
        }

        let filterList = search ? [...props.commercialPropertyList] : [...props.globalSearchResult];
        if (search) {
            filterList = filterList.filter(function (item) {
                const itemData =
                    item.property_address.building_name +
                    item.property_address.landmark_or_street +
                    item.property_address.location_area +
                    item.property_address.formatted_address +
                    item.owner_details.name +
                    item.owner_details.mobile1 +
                    item.property_id;

                const textData = search.toUpperCase();
                return itemData.toUpperCase().indexOf(textData) > -1;
            });
        }

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
            let possessionDate = new Date();
            const today = new Date();
            if (availabilityArray[availabilityIndex] === "Immediate") {
                possessionDate = addDays(today, 7); //new Date(today.getTime() + 15*24*60*60*1000)
                filterList = filterList.filter(
                    item => new Date(item.rent_details.available_from) <= possessionDate
                );
            } else if (availabilityArray[availabilityIndex] === "15 Days") {
                possessionDate = addDays(today, 15);
                filterList = filterList.filter(
                    item => new Date(item.rent_details.available_from) <= possessionDate
                );
            } else if (availabilityArray[availabilityIndex] === "30 Days") {
                possessionDate = addDays(today, 30);
                filterList = filterList.filter(
                    item => new Date(item.rent_details.available_from) <= possessionDate
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

    const searchFilterFunction = text => {
        if (text) {
            const newData = props.commercialPropertyList.filter(function (item) {
                const itemData =
                    item.property_address.building_name +
                    item.property_address.landmark_or_street +
                    item.property_address.location_area +
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
        axios(SERVER_URL + "/closeResidentialProperty", {
            method: "post",
            headers: {
                "Content-type": "Application/json",
                Accept: "Application/json"
            },
            data: reqData
        }).then(
            response => {
                if (response.data === "success") {
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
                dispatch(resetRefresh());
            },
            error => {
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
        axios(SERVER_URL + "/deleteResidentialProperty", {
            method: "post",
            headers: {
                "Content-type": "Application/json",
                Accept: "Application/json"
            },
            data: reqData
        }).then(
            response => {
                if (response.data === "success") {
                    setData((data) => data.filter((item) => item.property_id !== itemToDelete.property_id));
                } else {
                    setErrorMessage(response.data || "Failed to delete property");
                }

                setLoading(false);
                dispatch(resetRefresh());
            },
            error => {
                setLoading(false);
                console.log(error);
            }
        );

    }

    const ItemView = ({ item, index }) => {
        if (item.property_type === "Commercial") {
            if (item.property_for === "Rent") {
                return (
                    <div
                        key={index}
                        onClick={() =>
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
                    </div>
                );
            } else if (item.property_for === "Sell") {
                return (
                    <div
                        key={index}
                        onClick={() =>
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
                    </div>
                );
            }
        }
    };

    const [visible, setVisible] = useState(false);
    const [visibleSorting, setVisibleSorting] = useState(false);

    return (
        <div className="flex flex-col h-full bg-gray-100">
            {/* Search Bar - High Contrast */}
            <div className="flex flex-row items-center bg-white p-2 shadow-sm">
                <div className="relative flex-1">
                    <input
                        type="text"
                        className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-400 text-black placeholder-gray-500 focus:outline-none focus:border-blue-500"
                        placeholder="GLocal Search..."
                        value={search}
                        onChange={e => searchFilterFunction(e.target.value)}
                    />
                    <div className="absolute left-3 top-2.5 text-gray-600">
                        <MdSearch size={20} />
                    </div>
                </div>
            </div>

            {data.length > 0 ? (
                <div className="flex-1 overflow-y-auto p-2">
                    {data.map((item, index) => (
                        <ItemView item={item} index={index} key={index} />
                    ))}
                </div>
            ) : (
                <div className="flex flex-1 justify-center items-center h-full">
                    <span className="text-gray-500">You have no property listing</span>
                </div>
            )}

            {/* Centered Pill Filter/Sort Buttons */}
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
                        backgroundColor: "rgba(128,128,128, 0.8)",
                        borderRadius: '30px',
                        zIndex: 100,
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.2), 0 2px 4px -1px rgba(0, 0, 0, 0.1)'
                    }}
                >
                    <div
                        onClick={() => setVisibleSorting(!visibleSorting)}
                        style={{ paddingRight: '20px', cursor: 'pointer' }}
                    >
                        <MdSort color={"#ffffff"} size={26} />
                    </div>
                    <div style={{ height: "100%", width: '2px', backgroundColor: "#ffffff" }}></div>
                    <div
                        onClick={() => setVisible(!visible)}
                        style={{ paddingLeft: '20px', cursor: 'pointer' }}
                    >
                        <MdFilterList
                            color={"#ffffff"}
                            size={26}
                        />
                    </div>
                </div>
            )}

            {/* Filter Modal - Bottom Sheet */}
            {visible && (
                <div className="fixed inset-0 flex justify-center items-end z-50" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }} onClick={() => setVisible(false)}>
                    <div className="bg-white w-full p-4 pb-20 rounded-t-lg max-h-[50vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-center items-center relative mb-4 sticky top-0 bg-white z-50 -mt-4 -mx-4 px-4">
                            <h3 className="text-lg font-bold text-black">Filter</h3>
                            <div
                                onClick={() => resetFilter()}
                                className="absolute top-0 right-4 cursor-pointer"
                            >
                                <MdRestartAlt
                                    color={"#000000"}
                                    size={30}
                                />
                            </div>
                        </div>

                        <div className="mb-5">
                            <h4 className="font-semibold mb-2 text-black">Looking For</h4>
                            <CustomButtonGroup
                                buttons={lookingForArray.map(text => ({ text }))}
                                selectedIndices={[lookingForIndex]}
                                onButtonPress={selectLookingForIndex}
                                buttonStyle={{ backgroundColor: '#fff', borderColor: 'rgba(173, 181, 189, .5)', borderWidth: 1 }}
                                selectedButtonStyle={{ backgroundColor: '#00a36c4d' }}
                                buttonTextStyle={{ color: '#000' }}
                                selectedButtonTextStyle={{ color: '#000' }}
                            />
                        </div>

                        <div className="mb-5">
                            <h4 className="font-semibold mb-2 text-black">Prop type</h4>
                            <CustomButtonGroup
                                buttons={propertyTypeArray.map(text => ({ text }))}
                                selectedIndices={[propertyTypeIndex]}
                                onButtonPress={selectPropertyTypeIndex}
                                vertical={true}
                                buttonStyle={{ backgroundColor: '#fff', borderColor: 'rgba(173, 181, 189, .5)', borderWidth: 1 }}
                                selectedButtonStyle={{ backgroundColor: '#00a36c4d' }}
                                buttonTextStyle={{ color: '#000' }}
                                selectedButtonTextStyle={{ color: '#000' }}
                            />
                        </div>

                        <div className="mb-5">
                            <h4 className="font-semibold mb-2 text-black">Building type</h4>
                            <div className="grid grid-cols-2 gap-2">
                                {buildingTypeArray.map((item, index) => (
                                    <div key={index} className="flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={checkBoxSelectArray.indexOf(item) > -1}
                                            onChange={() => onCheckBoxSelect(item)}
                                            className="mr-2"
                                            style={{ accentColor: '#00a36c' }}
                                        />
                                        <span className="text-black">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="mt-5">
                            <Button title="Apply" onPress={() => onFilter()} />
                        </div>
                    </div>
                </div>
            )}

            {/* Sorting Modal - Bottom Sheet */}
            {visibleSorting && (
                <div className="fixed inset-0 flex justify-center items-end z-50" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }} onClick={() => setVisibleSorting(false)}>
                    <div className="bg-white w-full p-4 pb-20 rounded-t-lg max-h-[50vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-center items-center relative mb-4 sticky top-0 bg-white z-50 -mt-4 -mx-4 px-4">
                            <h3 className="text-lg font-bold text-black">Sort By</h3>
                            <div
                                onClick={() => resetSortBy()}
                                className="absolute top-0 right-4 cursor-pointer"
                            >
                                <MdRestartAlt
                                    color={"#000000"}
                                    size={30}
                                />
                            </div>
                        </div>

                        <div className="mb-5">
                            <h4 className="font-semibold mb-2 text-black">Looking For</h4>
                            <CustomButtonGroup
                                buttons={lookingForArraySortBy.map(text => ({ text }))}
                                selectedIndices={[lookingForIndexSortBy]}
                                onButtonPress={selectLookingForIndexSortBy}
                                buttonStyle={{ backgroundColor: '#fff', borderColor: 'rgba(173, 181, 189, .5)', borderWidth: 1 }}
                                selectedButtonStyle={{ backgroundColor: '#00a36c4d' }}
                                buttonTextStyle={{ color: '#000' }}
                                selectedButtonTextStyle={{ color: '#000' }}
                            />
                        </div>

                        <div className="mb-5">
                            <h4 className="font-semibold mb-2 text-black">Sort By Rent</h4>
                            <CustomButtonGroup
                                buttons={sortByRentArray.map(text => ({ text }))}
                                selectedIndices={[sortByRentIndex]}
                                onButtonPress={sortByRent}
                                buttonStyle={{ backgroundColor: '#fff', borderColor: 'rgba(173, 181, 189, .5)', borderWidth: 1 }}
                                selectedButtonStyle={{ backgroundColor: '#00a36c4d' }}
                                buttonTextStyle={{ color: '#000' }}
                                selectedButtonTextStyle={{ color: '#000' }}
                            />
                        </div>

                        <div className="mb-5">
                            <h4 className="font-semibold mb-2 text-black">Sort By Availability</h4>
                            <CustomButtonGroup
                                buttons={sortByAvailabilityArray.map(text => ({ text }))}
                                selectedIndices={[sortByAvailabilityIndex]}
                                onButtonPress={sortByAvailability}
                                buttonStyle={{ backgroundColor: '#fff', borderColor: 'rgba(173, 181, 189, .5)', borderWidth: 1 }}
                                selectedButtonStyle={{ backgroundColor: '#00a36c4d' }}
                                buttonTextStyle={{ color: '#000' }}
                                selectedButtonTextStyle={{ color: '#000' }}
                            />
                        </div>

                        <div className="mb-5">
                            <h4 className="font-semibold mb-2 text-black">Sort By Posted Date</h4>
                            <CustomButtonGroup
                                buttons={sortByPostedDateArray.map(text => ({ text }))}
                                selectedIndices={[sortByPostedDateIndex]}
                                onButtonPress={sortByPostedDate}
                                buttonStyle={{ backgroundColor: '#fff', borderColor: 'rgba(173, 181, 189, .5)', borderWidth: 1 }}
                                selectedButtonStyle={{ backgroundColor: '#00a36c4d' }}
                                buttonTextStyle={{ color: '#000' }}
                                selectedButtonTextStyle={{ color: '#000' }}
                            />
                        </div>


                    </div>
                </div>
            )}

            <Snackbar
                visible={isVisible}
                textMessage={errorMessage}
                actionHandler={dismissSnackBar}
                actionText="OK"
            />
        </div>
    );
};

const mapStateToProps = state => ({
    userDetails: state.AppReducer.userDetails,
    commercialPropertyList: state.AppReducer.commercialPropertyList,
    globalSearchResult: state.AppReducer.globalSearchResult,
});
const mapDispatchToProps = {
    setCommercialPropertyList
};
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(GlobalCommercialPropertySearchResult);
