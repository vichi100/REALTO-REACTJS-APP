import React, { useState, useEffect, useCallback } from "react";
import { connect } from "react-redux";
import {
    MdSort,
    MdFilterList,
    MdRestartAlt,
    MdSearch,
    MdArrowBack
} from "react-icons/md";
import { useNavigate } from "react-router-dom";

import Button from "./../../components/Button";
import ContactResidentialRentCard from "../contacts/residential/rent/ContactResidentialRentCard";
import ContactResidentialSellCard from "../contacts/residential/buy/ContactResidentialSellCard";
import axios from "axios";
import { SERVER_URL } from "./../../utils/Constant";
import { setResidentialCustomerList } from "./../../reducers/Action";
import { addDays, numDifferentiation } from "./../../utils/methods";
import Snackbar from "./../../components/SnackbarComponent";
import CustomButtonGroup from "./../../components/CustomButtonGroup";
import SliderX from "./../../components/SliderX";
import { resetRefresh } from './../../reducers/dataRefreshReducer';
import { useSelector, useDispatch } from 'react-redux';

const lookingForArray = ["Rent", "Buy"];
const homeTypeArray = ["Apartment", "Villa", "Independent House"];
const bhkTypeArray = ["1RK", "1BHK", "2BHK", "3BHK", "4BHK", "4+BHK"];
const availabilityArray = ["Immediate", "15 Days", "30 Days", "30+ Days"];
const furnishingStatusArray = ["Full", "Semi", "Empty"];

const sortByNameArray = ["A First", "Z First"];
const lookingForArraySortBy = ["Rent", "Buy"];
const sortByPostedDateArray = ["Recent First", "Oldest Fist"];

const GlobalResidentialContactsSearchResult = props => {
    const { navigation, route } = props;
    const { searchGlobalResult } = route?.params || {};
    const [isVisible, setIsVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [search, setSearch] = useState("");
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
    // sorting
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
        if (search) {
            const newData = props.globalSearchResult.filter(function (item) {
                const itemData =
                    item.customer_details.name +
                    item.customer_details.address +
                    item.customer_details.mobile1 +
                    item.customer_locality.location_area +
                    item.customer_id;
                const textData = search.toUpperCase();
                return itemData.toUpperCase().indexOf(textData) > -1;
            });
            setData(newData);
        } else {
            setData(props.globalSearchResult);
        }
    };

    const sortByPostedDate = index => {
        console.log("sortByName", props.globalSearchResult);
        if (lookingForIndexSortBy === -1) {
            setErrorMessage("Looking for is missing in filter");
            setIsVisible(true);
            return;
        }
        setSortByPostedDateIndex(index);
        setSortByNameIndex(-1);
        setVisibleSorting(false);
        let filterList = search ? [...props.globalSearchResult] : [...props.globalSearchResult];
        if (search) {
            filterList = filterList.filter(function (item) {
                const itemData =
                    item.customer_details.name +
                    item.customer_details.address +
                    item.customer_details.mobile1 +
                    item.customer_locality.location_area +
                    item.customer_id;
                const textData = search.toUpperCase();
                return itemData.toUpperCase().indexOf(textData) > -1;
            });
        }
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
        console.log("sortByName", props.globalSearchResult);
        if (lookingForIndexSortBy === -1) {
            setErrorMessage("Looking for is missing in filter");
            setIsVisible(true);
            return;
        }
        setSortByPostedDateIndex(-1);
        setSortByNameIndex(index);
        setVisibleSorting(false);
        let filterList = search ? [...props.globalSearchResult] : [...props.globalSearchResult];
        if (search) {
            filterList = filterList.filter(function (item) {
                const itemData =
                    item.customer_details.name +
                    item.customer_details.address +
                    item.customer_details.mobile1 +
                    item.customer_locality.location_area +
                    item.customer_id;
                const textData = search.toUpperCase();
                return itemData.toUpperCase().indexOf(textData) > -1;
            });
        }
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
        setIsVisible(false);
        setSortByNameIndex(-1);
        setSortByPostedDateIndex(-1);
    };

    const resetFilter = () => {
        setLookingForIndex(-1);
        setHomeTypeIndex(-1);
        setBHKTypeIndex(-1);
        setAvailabilityIndex(-1);
        setFurnishingIndex(-1);
        setData(props.globalSearchResult);
        setSearch("");
        setVisible(false);
        setMinRent(5000);
        setMaxRent(500000);
        setMinSell(1000000);
        setMaxSell(100000000);
    };

    const onFilter = () => {
        console.log("onFilter:     ", props.globalSearchResult);
        if (lookingForIndex === -1) {
            setErrorMessage("Looking for is missing in filter");
            setIsVisible(true);
            return;
        }
        let filterList = search ? [...props.globalSearchResult] : [...props.globalSearchResult];
        if (search) {
            filterList = filterList.filter(function (item) {
                const itemData =
                    item.customer_details.name +
                    item.customer_details.address +
                    item.customer_details.mobile1 +
                    item.customer_locality.location_area +
                    item.customer_id;
                const textData = search.toUpperCase();
                return itemData.toUpperCase().indexOf(textData) > -1;
            });
        }
        if (lookingForIndex > -1) {
            filterList = filterList.filter(
                item =>
                    item.customer_locality.property_for ===
                    lookingForArray[lookingForIndex]
            );
        }
        if (homeTypeIndex > -1) {
            filterList = filterList.filter(
                item =>
                    item.customer_property_details.house_type ===
                    homeTypeArray[homeTypeIndex]
            );
        }
        if (bhkTypeIndex > -1) {
            filterList = filterList.filter(
                item =>
                    item.customer_property_details.bhk_type === bhkTypeArray[bhkTypeIndex]
            );
        }

        if (availabilityIndex > -1) {
            let possessionDate = new Date();
            const today = new Date();
            if (availabilityArray[availabilityIndex] === "Immediate") {
                possessionDate = addDays(today, 7);
                filterList = filterList.filter(
                    item =>
                        possessionDate > new Date(item.customer_rent_details.available_from)
                );
            } else if (availabilityArray[availabilityIndex] === "15 Days") {
                possessionDate = addDays(today, 15);
                filterList = filterList.filter(
                    item =>
                        possessionDate > new Date(item.customer_rent_details.available_from)
                );
            } else if (availabilityArray[availabilityIndex] === "30 Days") {
                possessionDate = addDays(today, 30);
                filterList = filterList.filter(
                    item =>
                        possessionDate > new Date(item.customer_rent_details.available_from)
                );
            } else if (availabilityArray[availabilityIndex] === "30+ Days") {
                possessionDate = addDays(today, 30);
                filterList = filterList.filter(
                    item =>
                        new Date(item.customer_rent_details.available_from) > possessionDate
                );
            }
        }

        if (furnishingIndex > -1) {
            filterList = filterList.filter(
                item =>
                    item.customer_property_details.furnishing_status ===
                    furnishingStatusArray[furnishingIndex]
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

        setData(filterList);
        setVisible(false);
    };

    const dismissSnackBar = () => {
        setIsVisible(false);
    };
    const selectFurnishingIndex = index => {
        setFurnishingIndex(index);
    };

    const selectAvailabilityIndex = index => {
        setAvailabilityIndex(index);
    };

    const selectBHKTypeIndex = index => {
        setBHKTypeIndex(index);
    };

    const selectHomeTypeIndex = index => {
        setHomeTypeIndex(index);
    };

    const selectLookingForIndex = index => {
        setLookingForIndex(index);
    };

    const setRentRange = values => {
        setMinRent(values[0]);
        setMaxRent(values[1]);
    };

    const setSellRange = values => {
        setMinSell(values[0]);
        setMaxSell(values[1]);
    };

    const searchFilterFunction = text => {
        if (text) {
            const newData = props.globalSearchResult.filter(function (item) {
                const itemData =
                    item.customer_details.name +
                    item.customer_details.address +
                    item.customer_details.mobile1 +
                    item.customer_locality.location_area +
                    item.customer_id;

                const textData = text.toUpperCase();
                return itemData.toUpperCase().indexOf(textData) > -1;
            });
            setData(newData);
            setSearch(text);
        } else {
            setData(props.globalSearchResult);
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
        if (item.customer_locality.property_type === "Residential") {
            if (item.customer_locality.property_for === "Rent") {
                return (
                    <div
                        key={index}
                        onClick={() =>
                            navigation.navigate(
                                "CustomerDetailsResidentialRentFromList",
                                { item: item, displayMatchCount: true, displayMatchPercent: false }
                            )
                        }
                    >
                        <ContactResidentialRentCard
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
                            navigation.navigate("CustomerDetailsResidentialBuyFromList",
                                { item: item, displayMatchCount: true, displayMatchPercent: false })
                        }
                    >
                        <ContactResidentialSellCard
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

    const navigate = useNavigate();

    const handleBack = () => {
        if (window.history.length > 1 && window.history.state && window.history.state.idx > 0) {
            navigate(-1);
        } else {
            navigate('/contacts');
        }
    };

    return (
        <div className="flex flex-col h-full bg-white relative">
            <div className="bg-white border-b border-gray-200 flex items-center p-4 shadow-sm">
                <div onClick={handleBack} className="cursor-pointer mr-4 flex items-center">
                    <MdArrowBack size={24} color="#333" />
                </div>
                <h1 className="text-lg font-semibold text-gray-800">Search Results</h1>
            </div>
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


            {/* Filter Modal/Drawer */}
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
                            <h4 className="font-semibold mb-2 text-black">Home type</h4>
                            <CustomButtonGroup
                                buttons={homeTypeArray.map(text => ({ text }))}
                                selectedIndices={[homeTypeIndex]}
                                onButtonPress={selectHomeTypeIndex}
                                vertical={true}
                                buttonStyle={{ backgroundColor: '#fff', borderColor: 'rgba(173, 181, 189, .5)', borderWidth: 1 }}
                                selectedButtonStyle={{ backgroundColor: '#00a36c4d' }}
                                buttonTextStyle={{ color: '#000' }}
                                selectedButtonTextStyle={{ color: '#000' }}
                            />
                        </div>

                        <div className="mb-5">
                            <h4 className="font-semibold mb-2 text-black">BHK type</h4>
                            <CustomButtonGroup
                                buttons={bhkTypeArray.map(text => ({ text }))}
                                selectedIndices={[bhkTypeIndex]}
                                onButtonPress={selectBHKTypeIndex}
                                buttonStyle={{ backgroundColor: '#fff', borderColor: 'rgba(173, 181, 189, .5)', borderWidth: 1 }}
                                selectedButtonStyle={{ backgroundColor: '#00a36c4d' }}
                                buttonTextStyle={{ color: '#000' }}
                                selectedButtonTextStyle={{ color: '#000' }}
                            />
                        </div>

                        {lookingForIndex === 0 && (
                            <div className="mb-5">
                                <h4 className="font-semibold mb-2 text-black">Rent Range</h4>
                                <div className="flex justify-between mt-2">
                                    <div>
                                        <span className="text-gray-500">{numDifferentiation(minRent)}</span>
                                        <span className="text-gray-500 ml-1">Min</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-500">{numDifferentiation(maxRent)}</span>
                                        <span className="text-gray-500 ml-1">Max</span>
                                    </div>
                                </div>
                                <SliderX
                                    min={5000}
                                    max={500000}
                                    step={5000}
                                    initialValues={[minRent, maxRent]}
                                    onSlide={setRentRange}
                                />
                            </div>
                        )}

                        {lookingForIndex === 1 && (
                            <div className="mb-5">
                                <h4 className="font-semibold mb-2 text-black">Sell Range</h4>
                                <div className="flex justify-between mt-2">
                                    <div>
                                        <span className="text-gray-500">{numDifferentiation(minSell)}</span>
                                        <span className="text-gray-500 ml-1">Min</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-500">{numDifferentiation(maxSell)}</span>
                                        <span className="text-gray-500 ml-1">Max</span>
                                    </div>
                                </div>
                                <SliderX
                                    min={1000000}
                                    max={100000000}
                                    step={100000}
                                    initialValues={[minSell, maxSell]}
                                    onSlide={setSellRange}
                                />
                            </div>
                        )}

                        <div className="mb-5">
                            <h4 className="font-semibold mb-2 text-black">Availability</h4>
                            <CustomButtonGroup
                                buttons={availabilityArray.map(text => ({ text }))}
                                selectedIndices={[availabilityIndex]}
                                onButtonPress={selectAvailabilityIndex}
                                buttonStyle={{ backgroundColor: '#fff', borderColor: 'rgba(173, 181, 189, .5)', borderWidth: 1 }}
                                selectedButtonStyle={{ backgroundColor: '#00a36c4d' }}
                                buttonTextStyle={{ color: '#000' }}
                                selectedButtonTextStyle={{ color: '#000' }}
                            />
                        </div>

                        <div className="mb-5">
                            <h4 className="font-semibold mb-2 text-black">Furnishing Status</h4>
                            <CustomButtonGroup
                                buttons={furnishingStatusArray.map(text => ({ text }))}
                                selectedIndices={[furnishingIndex]}
                                onButtonPress={selectFurnishingIndex}
                                buttonStyle={{ backgroundColor: '#fff', borderColor: 'rgba(173, 181, 189, .5)', borderWidth: 1 }}
                                selectedButtonStyle={{ backgroundColor: '#00a36c4d' }}
                                buttonTextStyle={{ color: '#000' }}
                                selectedButtonTextStyle={{ color: '#000' }}
                            />
                        </div>

                        <div className="mt-5">
                            <Button title="Apply" onPress={() => onFilter()} />
                        </div>
                    </div>
                </div>
            )}

            {/* Sorting Modal/Drawer */}
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
                            <h4 className="font-semibold mb-2 text-black">Sort By Name</h4>
                            <CustomButtonGroup
                                buttons={sortByNameArray.map(text => ({ text }))}
                                selectedIndices={[sortByNameIndex]}
                                onButtonPress={sortByName}
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
    residentialCustomerList: state.AppReducer.residentialCustomerList,
    globalSearchResult: state.AppReducer.globalSearchResult,
});
const mapDispatchToProps = {
    setResidentialCustomerList
};
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(GlobalResidentialContactsSearchResult);
