import React, { useState, useEffect, useCallback } from "react";
import { connect } from "react-redux";
import {
    MdSort,
    MdFilterList,
    MdRestartAlt,
    MdSearch
} from "react-icons/md";
import Button from "./../../components/Button";
import CustomerCommercialRentCard from "../contacts/commercial/rent/CustomerCommercialRentCard";
import CustomerCommercialBuyCard from "../contacts/commercial/buy/CustomerCommercialBuyCard";
import axios from "axios";
import { SERVER_URL } from "././../../utils/Constant";
import { setCommercialCustomerList } from "./../../reducers/Action";
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

const lookingForArray = ["Rent", "Buy"];
const propertyTypeArray = [
    "Shop",
    "Office",
    "Showroom",
    "Godown",
    "Restaurant/Cafe"
];
const availabilityArray = ["Immediate", "15 Days", "30 Days", "30+ Days"];

const sortByNameArray = ["A First", "Z First"];
const lookingForArraySortBy = ["Rent", "Buy"];
const sortByPostedDateArray = ["Recent First", "Oldest Fist"];

const GlobalCommercialCustomersSearchResult = props => {
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
    //sorting
    const [sortByNameIndex, setSortByNameIndex] = useState(-1);
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
        let filterList = [...props.commercialCustomerList];
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
        let filterList = [...props.commercialCustomerList];
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
        console.log("onFilter:     ", props.commercialCustomerList);
        if (lookingForIndex === -1) {
            setErrorMessage("Looking for is missing in filter");
            setIsVisible(true);
            return;
        }
        let filterList = [...props.commercialCustomerList];
        if (lookingForIndex > -1) {
            filterList = filterList.filter(
                item =>
                    item.customer_locality.property_for ===
                    lookingForArray[lookingForIndex]
            );
        }

        if (propertyTypeIndex > -1) {
            filterList = filterList.filter(item => {
                const all = [item.customer_property_details.property_used_for];
                return all.indexOf(propertyTypeArray[propertyTypeIndex]) > -1;
            });
        }

        if (checkBoxSelectArray.length > 0) {
            filterList = filterList.filter(
                item =>
                    checkBoxSelectArray.indexOf(
                        item.customer_property_details.building_type
                    ) > -1
            );
        }

        if (lookingForIndex === 0) {
            if (minRent > 5000 || maxRent < 500000) {
                filterList = filterList.filter(
                    item =>
                        item.customer_rent_details.expected_rent >= minRent &&
                        item.customer_rent_details.expected_rent <= maxRent
                );
            }
        } else if (lookingForIndex === 1) {
            if (minSell > 1000000 || maxSell < 100000000) {
                filterList = filterList.filter(
                    item =>
                        item.customer_buy_details.expected_buy_price >= minSell &&
                        item.customer_buy_details.expected_buy_price <= maxSell
                );
            }
        }

        if (availabilityIndex > -1) {
            let possessionDate = new Date();
            const today = new Date();
            if (availabilityArray[availabilityIndex] === "Immediate") {
                possessionDate = addDays(today, 7);
                filterList = filterList.filter(
                    item => possessionDate > new Date(item.rent_details.available_from)
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

    const searchFilterFunction = text => {
        if (text) {
            const newData = props.commercialCustomerList.filter(function (item) {
                const itemData =
                    item.customer_details.name +
                    item.customer_details.address +
                    item.customer_details.mobile1 +
                    item.customer_locality.location_area;

                const textData = text.toUpperCase();
                return itemData.toUpperCase().indexOf(textData) > -1;
            });
            setData(newData);
            setSearch(text);
        } else {
            setData(props.commercialCustomerList);
            setSearch(text);
        }
    };

    const deleteMe = (itemToDelete) => {
        setLoading(true);
        const reqData = {
            req_user_id: props.userDetails.id,
            agent_id: props.userDetails.works_for,
            dataToDelete: itemToDelete
        };
        axios(SERVER_URL + "/deleteResidintialCustomer", {
            method: "post",
            headers: {
                "Content-type": "Application/json",
                Accept: "Application/json"
            },
            data: reqData
        }).then(
            response => {
                if (response.data === "success") {
                    setData((data) => data.filter((item) => item.customer_id !== itemToDelete.customer_id));
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

    const closeMe = (itemToClose) => {
        setLoading(true);
        const reqData = {
            req_user_id: props.userDetails.id,
            agent_id: props.userDetails.works_for,
            dataToClose: itemToClose
        };
        axios(SERVER_URL + "/closeResidintialCustomer", {
            method: "post",
            headers: {
                "Content-type": "Application/json",
                Accept: "Application/json"
            },
            data: reqData
        }).then(
            response => {
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
                dispatch(resetRefresh());
            },
            error => {
                setLoading(false);
                console.log(error);
            }
        );
    }

    const ItemView = ({ item, index }) => {
        if (item.customer_locality.property_type === "Commercial") {
            if (item.customer_locality.property_for === "Rent") {
                return (
                    <div
                        key={index}
                        onClick={() =>
                            navigation.navigate("CustomerDetailsCommercialRentFromList", {
                                item: item,
                                displayMatchCount: true, displayMatchPercent: false
                            })
                        }
                    >
                        <CustomerCommercialRentCard
                            navigation={navigation}
                            item={item}
                            deleteMe={deleteMe}
                            closeMe={closeMe}
                            disableDrawer={false}
                            displayChat={false}
                        />
                    </div>
                );
            } else if (item.customer_locality.property_for === "Buy") {
                return (
                    <div
                        key={index}
                        onClick={() =>
                            navigation.navigate("CustomerDetailsCommercialBuyFromList",
                                { item: item, displayMatchCount: true, displayMatchPercent: false }
                            )
                        }
                    >
                        <CustomerCommercialBuyCard
                            navigation={navigation}
                            item={item}
                            deleteMe={deleteMe}
                            closeMe={closeMe}
                            disableDrawer={false}
                            displayChat={false}
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
                            <p className="mb-2 font-semibold">Sort By Name</p>
                            <CustomButtonGroup
                                buttons={sortByNameArray.map(text => ({ text }))}
                                selectedIndices={[sortByNameIndex]}
                                onButtonPress={sortByName}
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
    commercialCustomerList: state.AppReducer.commercialCustomerList,
    globalSearchResult: state.AppReducer.globalSearchResult,
});
const mapDispatchToProps = {
    setCommercialCustomerList
};
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(GlobalCommercialCustomersSearchResult);
