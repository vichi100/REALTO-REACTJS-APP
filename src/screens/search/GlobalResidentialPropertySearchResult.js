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
import CardResidentialRent from "../property/residential/rent/ResidentialRentCard";
import CardResidentialSell from "../property/residential/sell/ResidentialSellCard";
import axios from "axios";
import { SERVER_URL } from "./../../utils/Constant";
import { setResidentialPropertyList } from "./../../reducers/Action";
import { addDays, numDifferentiation } from "./../../utils/methods";
import Snackbar from "./../../components/SnackbarComponent";
import CustomButtonGroup from "./../../components/CustomButtonGroup";
import SliderX from "./../../components/SliderX";
import { resetRefresh } from './../../reducers/dataRefreshReducer';
import { useSelector, useDispatch } from 'react-redux';

const lookingForArray = ["Rent", "Sell"];
const homeTypeArray = ["Apartment", "Villa", "Independent House"];
const bhkTypeArray = ["1RK", "1BHK", "2BHK", "3BHK", "4BHK", "4+BHK"];
const availabilityArray = ["Immediate", "15 Days", "30 Days", "30+ Days"];
const furnishingStatusArray = ["Full", "Semi", "Empty"];
const lookingForArraySortBy = ["Rent", "Sell"];
const sortByRentArray = ["Lowest First", "Highest First"];
const sortByAvailabilityArray = ["Earliest First", "Oldest First"];
const sortByPostedDateArray = ["Recent First", "Oldest Fist"];

const GlobalResidentialPropertySearchResult = props => {
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
        let filterList = [...props.residentialPropertyList];
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
        let filterList = [...props.residentialPropertyList];
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
        let filterList = [...props.residentialPropertyList];
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

    const resetFilter = () => {
        setLookingForIndex(-1);
        setHomeTypeIndex(-1);
        setBHKTypeIndex(-1);
        setAvailabilityIndex(-1);
        setFurnishingIndex(-1);
        setData(props.residentialPropertyList);
        setVisible(false);
        setMinRent(5000);
        setMaxRent(500000);
        setMinSell(1000000);
        setMaxSell(100000000);
    };

    const onFilter = () => {
        console.log("onFilter:     ", props.residentialPropertyList);
        if (lookingForIndex === -1) {
            setErrorMessage("Looking for is missing in filter");
            setIsVisible(true);
            return;
        }
        let filterList = [...props.residentialPropertyList];
        if (lookingForIndex > -1) {
            filterList = filterList.filter(
                item => item.property_for === lookingForArray[lookingForIndex]
            );
        }
        if (homeTypeIndex > -1) {
            filterList = filterList.filter(
                item =>
                    item.property_details.house_type === homeTypeArray[homeTypeIndex]
            );
        }
        if (bhkTypeIndex > -1) {
            filterList = filterList.filter(
                item => item.property_details.bhk_type === bhkTypeArray[bhkTypeIndex]
            );
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

        if (furnishingIndex > -1) {
            filterList = filterList.filter(
                item =>
                    item.property_details.furnishing_status ===
                    furnishingStatusArray[furnishingIndex]
            );
        }

        if (lookingForIndex === 0) {
            if (minRent > 5000 || maxRent < 500000) {
                filterList = filterList.filter(
                    item =>
                        item.rent_details.expected_rent >= minRent &&
                        item.rent_details.expected_rent <= maxRent
                );
            }
        } else if (lookingForIndex === 1) {
            if (minSell > 1000000 || maxSell < 100000000) {
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

    const selectLookingForIndexSortBy = index => {
        setLookingForIndexSortBy(index);
        setSortByRentIndex(-1);
        setSortByAvailabilityIndex(-1);
        setSortByPostedDateIndex(-1);
        setIsVisible(false);
    };

    const setRentRange = values => {
        setMinRent(values[0]);
        setMaxRent(values[1]);
    };

    const setSellRange = values => {
        setMinSell(values[0]);
        setMaxSell(values[1]);
    };

    useEffect(() => {
        if (data.length === 0) {
            setData(props.globalSearchResult);
        }
    }, [props.globalSearchResult]);

    const searchFilterFunction = text => {
        if (text) {
            const newData = props.residentialPropertyList.filter(function (item) {
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
            setData(props.residentialPropertyList);
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
        if (item.property_type === "Residential") {
            if (item.property_for === "Rent") {
                return (
                    <div
                        key={index}
                        onClick={() => navigation.navigate("PropDetailsFromListing",
                            { item: item, displayMatchCount: true, displayMatchPercent: false })}
                    >
                        <CardResidentialRent
                            navigation={navigation}
                            item={item}
                            deleteMe={deleteMe}
                            closeMe={closeMe}
                            disableDrawer={false}
                            displayChat={false}
                            displayMatchCount={true}
                            displayMatchPercent={false}
                        />
                    </div>
                );
            } else if (item.property_for === "Sell") {
                return (
                    <div
                        key={index}
                        onClick={() =>
                            navigation.navigate("PropDetailsFromListingForSell",
                                { item: item, displayMatchCount: true, displayMatchPercent: false })
                        }
                    >
                        <CardResidentialSell
                            navigation={navigation}
                            item={item}
                            deleteMe={deleteMe}
                            closeMe={closeMe}
                            disableDrawer={false}
                            displayChat={false}
                            displayMatchCount={true}
                            displayMatchPercent={false}
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
            navigate('/listing');
        }
    };

    return (
        <div className="flex flex-col h-full bg-gray-100">
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
                            data-testid="sort-button"
                            onClick={() => setVisibleSorting(!visibleSorting)}
                            className="bg-blue-500 text-white p-3 rounded-full shadow-lg hover:bg-blue-600 focus:outline-none"
                        >
                            <MdSort size={24} />
                        </button>
                        <button
                            data-testid="filter-button"
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
                            <p className="mb-2 font-semibold">Home type</p>
                            <CustomButtonGroup
                                buttons={homeTypeArray.map(text => ({ text }))}
                                selectedIndices={[homeTypeIndex]}
                                onButtonPress={selectHomeTypeIndex}
                                vertical={true}
                            />
                        </div>

                        <div className="mb-5">
                            <p className="mb-2 font-semibold">BHK type</p>
                            <CustomButtonGroup
                                buttons={bhkTypeArray.map(text => ({ text }))}
                                selectedIndices={[bhkTypeIndex]}
                                onButtonPress={selectBHKTypeIndex}
                            />
                        </div>

                        {lookingForIndex === 0 && (
                            <div className="mb-5">
                                <p className="mb-2 font-semibold">Rent Range</p>
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
                                <p className="mb-2 font-semibold">Sell Range</p>
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
                            <p className="mb-2 font-semibold">Availability</p>
                            <CustomButtonGroup
                                buttons={availabilityArray.map(text => ({ text }))}
                                selectedIndices={[availabilityIndex]}
                                onButtonPress={selectAvailabilityIndex}
                            />
                        </div>

                        <div className="mb-5">
                            <p className="mb-2 font-semibold">Furnishing Status</p>
                            <CustomButtonGroup
                                buttons={furnishingStatusArray.map(text => ({ text }))}
                                selectedIndices={[furnishingIndex]}
                                onButtonPress={selectFurnishingIndex}
                            />
                        </div>

                        <button
                            data-testid="apply-filter-button"
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
                            data-testid="apply-sort-button"
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
    residentialPropertyList: state.AppReducer.residentialPropertyList,
    globalSearchResult: state.AppReducer.globalSearchResult,
});
const mapDispatchToProps = {
    setResidentialPropertyList
};
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(GlobalResidentialPropertySearchResult);
