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
        let filterList = [...props.commercialPropertyList];
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
        let filterList = [...props.commercialPropertyList];
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
        let filterList = [...props.commercialPropertyList];
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
        let filterList = [...props.commercialPropertyList];
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
                    item.owner_details.name +
                    item.owner_details.mobile1;

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
            <div className="flex flex-row items-center bg-white p-2 shadow-sm">
                <div className="relative flex-1">
                    <input
                        type="text"
                        className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:border-blue-500"
                        placeholder="GLocal Search..."
                        value={search}
                        onChange={e => searchFilterFunction(e.target.value)}
                    />
                    <div className="absolute left-3 top-2.5 text-gray-400">
                        <MdSearch size={20} />
                    </div>
                </div>
            </div>

            {data.length > 0 ? (
                <div className="flex-1 overflow-y-auto p-2">
                    {data.map((item, index) => (
                        <ItemView item={item} index={index} key={index} />
                    ))}

                    <div className="absolute bottom-5 right-5 flex flex-col items-center space-y-2">
                        <button
                            onClick={() => setVisibleSorting(!visibleSorting)}
                            className="bg-blue-500 text-white p-3 rounded-full shadow-lg hover:bg-blue-600 focus:outline-none"
                        >
                            <MdSort size={24} />
                        </button>
                        <button
                            onClick={() => setVisible(!visible)}
                            className="bg-blue-500 text-white p-3 rounded-full shadow-lg hover:bg-blue-600 focus:outline-none"
                        >
                            <MdFilterList size={24} />
                        </button>
                    </div>
                </div>
            ) : (
                <div className="flex flex-1 justify-center items-center h-full">
                    <span className="text-gray-500">You have no property listing</span>
                </div>
            )}

            {/* Filter Modal/Drawer */}
            {visible && (
                <div className="fixed inset-0 z-50 flex justify-end bg-black bg-opacity-50">
                    <div className="w-full max-w-md bg-white h-full overflow-y-auto p-5 animate-slide-in-right">
                        <div className="flex justify-between items-center mb-5">
                            <h2 className="text-xl font-bold">Filter</h2>
                            <button onClick={() => resetFilter()}>
                                <MdRestartAlt size={24} />
                            </button>
                        </div>

                        <div className="mb-5">
                            <p className="mb-2 font-semibold">Looking For</p>
                            <CustomButtonGroup
                                buttons={lookingForArray.map(text => ({ text }))}
                                selectedIndices={[lookingForIndex]}
                                onButtonPress={selectLookingForIndex}
                            />
                        </div>

                        <div className="mb-5">
                            <p className="mb-2 font-semibold">Prop type</p>
                            <CustomButtonGroup
                                buttons={propertyTypeArray.map(text => ({ text }))}
                                selectedIndices={[propertyTypeIndex]}
                                onButtonPress={selectPropertyTypeIndex}
                                vertical={true}
                            />
                        </div>

                        <div className="mb-5">
                            <p className="mb-2 font-semibold">Building type</p>
                            <div className="grid grid-cols-2 gap-2">
                                {buildingTypeArray.map((item, index) => (
                                    <div key={index} className="flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={checkBoxSelectArray.indexOf(item) > -1}
                                            onChange={() => onCheckBoxSelect(item)}
                                            className="mr-2"
                                        />
                                        <span>{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <button
                            onClick={() => onFilter()}
                            className="mt-5 w-full bg-blue-500 text-white p-3 rounded hover:bg-blue-600"
                        >
                            Apply
                        </button>
                    </div>
                </div>
            )}

            {/* Sorting Modal/Drawer */}
            {visibleSorting && (
                <div className="fixed inset-0 z-50 flex justify-end bg-black bg-opacity-50">
                    <div className="w-full max-w-md bg-white h-full overflow-y-auto p-5 animate-slide-in-right">
                        <div className="flex justify-between items-center mb-5">
                            <h2 className="text-xl font-bold">Sort By</h2>
                            <button onClick={() => resetSortBy()}>
                                <MdRestartAlt size={24} />
                            </button>
                        </div>

                        <div className="mb-5">
                            <p className="mb-2 font-semibold">Looking For</p>
                            <CustomButtonGroup
                                buttons={lookingForArraySortBy.map(text => ({ text }))}
                                selectedIndices={[lookingForIndexSortBy]}
                                onButtonPress={selectLookingForIndexSortBy}
                            />
                        </div>

                        <div className="mb-5">
                            <p className="mb-2 font-semibold">Sort By Rent</p>
                            <CustomButtonGroup
                                buttons={sortByRentArray.map(text => ({ text }))}
                                selectedIndices={[sortByRentIndex]}
                                onButtonPress={sortByRent}
                            />
                        </div>

                        <div className="mb-5">
                            <p className="mb-2 font-semibold">Sort By Availability</p>
                            <CustomButtonGroup
                                buttons={sortByAvailabilityArray.map(text => ({ text }))}
                                selectedIndices={[sortByAvailabilityIndex]}
                                onButtonPress={sortByAvailability}
                            />
                        </div>

                        <div className="mb-5">
                            <p className="mb-2 font-semibold">Sort By Posted Date</p>
                            <CustomButtonGroup
                                buttons={sortByPostedDateArray.map(text => ({ text }))}
                                selectedIndices={[sortByPostedDateIndex]}
                                onButtonPress={sortByPostedDate}
                            />
                        </div>

                        <button
                            onClick={() => setVisibleSorting(false)}
                            className="mt-5 w-full bg-blue-500 text-white p-3 rounded hover:bg-blue-600"
                        >
                            Apply
                        </button>
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
