import React, { useState, useEffect, useRef } from "react";
import { connect } from "react-redux";
import {
    MdSort,
    MdFilterList,
    MdRestartAlt,
} from "react-icons/md";
import Button from "./../../components/Button";
import CardResidentialRent from '../property/residential/rent/ResidentialRentCard';
import CardResidentialSell from '../property/residential/sell/ResidentialSellCard';
import CardCommercialRent from "./commercial/rent/CommercialRentCard";
import CardCommercialSell from "./commercial/sell/CommercialSellCard";
import axios from "axios";
import { SERVER_URL } from "./../../utils/Constant";
import {
    setResidentialPropertyList,
    setAnyItemDetails,
    setPropertyDetails
} from "./../../reducers/Action";
import { addDays } from "./../../utils/methods";
import Snackbar from "./../../components/SnackbarComponent";
import CustomButtonGroup from "./../../components/CustomButtonGroup";
import { resetRefresh } from "./../../reducers/dataRefreshReducer";
import { useDispatch } from 'react-redux';

const lookingForArray = ["Rent", "Sell"];
const homeTypeArray = ["Apartment", "Villa", "Independent House"];
const bhkTypeArray = ["1RK", "1BHK", "2BHK", "3BHK", "4BHK", "4+BHK"];
const availabilityArray = ["Immediate", "15 Days", "30 Days", "30+ Days"];
const furnishingStatusArray = ["Full", "Semi", "Empty"];
const lookingForArraySortBy = ["Rent", "Sell"];
const sortByRentArray = ["Lowest First", "Highest First"];
const sortByAvailabilityArray = ["Earliest First", "Oldest First"];
const sortByPostedDateArray = ["Recent First", "Oldest Fist"];

const MatchedProperties = props => {
    const { navigation, route } = props;
    // route.params might be undefined if not passed correctly, handling gracefully
    const matchedCustomerItem = route?.params?.matchedCustomerItem || {};
    const dispatch = useDispatch();

    const [isVisible, setIsVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [search, setSearch] = useState("");
    const [visible, setVisible] = useState(false);
    const [visibleSorting, setVisibleSorting] = useState(false);
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

    const [matchedPropertiesDetailsMine, setMatchedPropertiesDetailsMine] = useState([]);
    const [matchedPropertiesDetailsOther, setMatchedPropertiesDetailsOther] = useState([]);

    const [reqUserId, setReqUserId] = useState(props.userDetails?.works_for);
    const [customerAgentId, setCustomerAgentId] = useState(matchedCustomerItem.agent_id);

    const [selectedTab, setSelectedTab] = useState(reqUserId === customerAgentId ? 0 : 1);

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
                filterList.sort((a, b) => new Date(a.create_date_time).getTime() - new Date(b.create_date_time).getTime());
            } else if (sortByPostedDateArray[index] === "Oldest Fist") {
                filterList.sort((a, b) => new Date(b.create_date_time).getTime() - new Date(a.create_date_time).getTime());
            }
            setData(filterList);
        } else if (lookingForIndexSortBy === 1) {
            filterList = filterList.filter(item => item.property_for === "Sell");
            if (sortByPostedDateArray[index] === "Recent First") {
                filterList.sort((a, b) => new Date(a.create_date_time).getTime() - new Date(b.create_date_time).getTime());
            } else if (sortByPostedDateArray[index] === "Oldest Fist") {
                filterList.sort((a, b) => new Date(b.create_date_time).getTime() - new Date(a.create_date_time).getTime());
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
                filterList.sort((a, b) => new Date(a.rent_details.available_from).getTime() - new Date(b.rent_details.available_from).getTime());
            } else if (sortByAvailabilityArray[index] === "Oldest First") {
                filterList.sort((a, b) => new Date(b.rent_details.available_from).getTime() - new Date(a.rent_details.available_from).getTime());
            }
            setData(filterList);
        } else if (lookingForIndexSortBy === 1) {
            filterList = filterList.filter(item => item.property_for === "Sell");
            if (sortByAvailabilityArray[index] === "Earliest First") {
                filterList.sort((a, b) => new Date(a.rent_details.available_from).getTime() - new Date(b.rent_details.available_from).getTime());
            } else if (sortByAvailabilityArray[index] === "Oldest First") {
                filterList.sort((a, b) => new Date(b.rent_details.available_from).getTime() - new Date(a.rent_details.available_from).getTime());
            }
            setData(filterList);
        }
    };

    const sortByRent = index => {
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
            if (sortByRentArray[index] === "Lowest First") {
                filterList.sort((a, b) => parseFloat(a.rent_details.expected_rent) - parseFloat(b.rent_details.expected_rent));
            } else if (sortByRentArray[index] === "Highest First") {
                filterList.sort((a, b) => parseFloat(b.rent_details.expected_rent) - parseFloat(a.rent_details.expected_rent));
            }
            setData(filterList);
        } else if (lookingForIndexSortBy === 1) {
            filterList = filterList.filter(item => item.property_for === "Sell");
            if (sortByRentArray[index] === "Lowest First") {
                filterList.sort((a, b) => parseFloat(a.sell_details.expected_sell_price) - parseFloat(b.sell_details.expected_sell_price));
            } else if (sortByRentArray[index] === "Highest First") {
                filterList.sort((a, b) => parseFloat(b.sell_details.expected_sell_price) - parseFloat(a.sell_details.expected_sell_price));
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
        if (lookingForIndex === -1) {
            setErrorMessage("Looking for is missing in filter");
            setIsVisible(true);
            return;
        }
        let filterList = [...props.residentialPropertyList];
        if (lookingForIndex > -1) {
            filterList = filterList.filter(item => item.property_for === lookingForArray[lookingForIndex]);
        }
        if (homeTypeIndex > -1) {
            filterList = filterList.filter(item => item.property_details.house_type === homeTypeArray[homeTypeIndex]);
        }
        if (bhkTypeIndex > -1) {
            filterList = filterList.filter(item => item.property_details.bhk_type === bhkTypeArray[bhkTypeIndex]);
        }

        if (availabilityIndex > -1) {
            let possessionDate = new Date();
            const today = new Date();
            if (availabilityArray[availabilityIndex] === "Immediate") {
                possessionDate = addDays(today, 7);
                filterList = filterList.filter(item => possessionDate > new Date(item.rent_details.available_from));
            } else if (availabilityArray[availabilityIndex] === "15 Days") {
                possessionDate = addDays(today, 15);
                filterList = filterList.filter(item => possessionDate > new Date(item.rent_details.available_from));
            } else if (availabilityArray[availabilityIndex] === "30 Days") {
                possessionDate = addDays(today, 30);
                filterList = filterList.filter(item => possessionDate > new Date(item.rent_details.available_from));
            } else if (availabilityArray[availabilityIndex] === "30+ Days") {
                possessionDate = addDays(today, 30);
                filterList = filterList.filter(item => new Date(item.rent_details.available_from) > possessionDate);
            }
        }

        if (furnishingIndex > -1) {
            filterList = filterList.filter(item => item.property_details.furnishing_status === furnishingStatusArray[furnishingIndex]);
        }

        if (lookingForIndex === 0) {
            if (minRent > 5000 || maxRent < 500000) {
                filterList = filterList.filter(item => item.rent_details.expected_rent >= minRent && item.rent_details.expected_rent <= maxRent);
            }
        } else if (lookingForIndex === 1) {
            if (minSell > 1000000 || maxSell < 100000000) {
                filterList = filterList.filter(item => item.sell_details.expected_sell_price >= minRent && item.sell_details.expected_sell_price <= maxRent);
            }
        }

        setData(filterList);
        setVisible(false);
    };

    const dismissSnackBar = () => {
        setIsVisible(false);
    };

    useEffect(() => {
        if (props.userDetails && props.userDetails.works_for !== null) {
            getListing();
        }
    }, [props.userDetails]);

    const getListing = () => {
        const customer = {
            req_user_id: props.userDetails.works_for,
            customer_id: matchedCustomerItem.customer_id,
        };
        let finalURL;

        if (matchedCustomerItem.customer_locality?.property_type == "Commercial") {
            if (matchedCustomerItem.customer_locality?.property_for == "Rent") {
                finalURL = SERVER_URL + "/matchedCommercialProptiesRentList";
            } else if (matchedCustomerItem.customer_locality?.property_for == "Buy") {
                finalURL = SERVER_URL + "/matchedCommercialProptiesBuyList";
            }
        } else if (matchedCustomerItem.customer_locality?.property_type == "Residential") {
            if (matchedCustomerItem.customer_locality?.property_for == "Rent") {
                finalURL = SERVER_URL + "/matchedResidentialProptiesRentList";
            } else if (matchedCustomerItem.customer_locality?.property_for == "Buy") {
                finalURL = SERVER_URL + "/matchedResidentialProptiesBuyList";
            }
        }

        if (!finalURL) return;

        setLoading(true);
        axios(finalURL, {
            method: "post",
            headers: {
                "Content-type": "Application/json",
                Accept: "Application/json"
            },
            data: customer
        }).then(
            response => {
                response.data.matchedPropertyDetailsMine.map(item => {
                    item.image_urls.map(image => {
                        image.url = SERVER_URL + image.url
                    })
                })
                response.data.matchedPropertyDetailsOther.map(item => {
                    item.image_urls.map(image => {
                        image.url = SERVER_URL + image.url
                    })
                })
                setMatchedPropertiesDetailsMine(response.data.matchedPropertyDetailsMine);
                setMatchedPropertiesDetailsOther(response.data.matchedPropertyDetailsOther);
                props.setResidentialPropertyList(response.data);
                setLoading(false);
            },
            error => {
                setLoading(false);
                console.log(error);
            }
        );
    };

    const navigateToDetails = (item, propertyFor) => {
        props.setPropertyDetails(item);

        if (propertyFor === "Rent") {
            navigation.navigate("PropDetailsFromListing", {
                item: item,
                displayMatchCount: false,
                displayMatchPercent: true
            });
        } else if (propertyFor === "Sell") {
            navigation.navigate("PropDetailsFromListingForSell", {
                item: item,
                displayMatchCount: false,
                displayMatchPercent: true
            });
        }
    };

    const deleteMe = (itemToDelete) => {
        setData((data) => data.filter((item) => item.property_id !== itemToDelete.property_id));
    }

    const closeMe = (itemToClose) => {
        setLoading(true);
        const reqData = {
            req_user_id: props.userDetails.id,
            agent_id: props.userDetails.works_for,
            dataToClose: itemToClose
        };
        axios(SERVER_URL + "/closeCommercialProperty", {
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

    const ItemView = ({ item, index }) => {
        if (item.property_type.toLowerCase() === "Residential".toLowerCase()) {
            if (item.property_for.toLowerCase() === "Rent".toLowerCase()) {
                return (
                    <div onClick={() => navigateToDetails(item, "Rent")} key={index}>
                        <CardResidentialRent navigation={navigation} item={item} deleteMe={deleteMe} closeMe={closeMe} displayMatchCount={false} displayMatchPercent={true} />
                    </div>
                );
            } else if (item.property_for.toLowerCase() === "Sell".toLowerCase()) {
                return (
                    <div onClick={() => navigateToDetails(item, "Sell")} key={index}>
                        <CardResidentialSell navigation={navigation} item={item} deleteMe={deleteMe} closeMe={closeMe} displayMatchCount={false} displayMatchPercent={true} />
                    </div>
                );
            }
        } else if (item.property_type.toLowerCase() === "Commercial".toLowerCase()) {
            if (item.property_for.toLowerCase() === "Rent".toLowerCase()) {
                return (
                    <div onClick={() => navigateToDetails(item, "Rent")} key={index}>
                        <CardCommercialRent navigation={navigation} item={item} deleteMe={deleteMe} closeMe={closeMe} displayMatchCount={false} displayMatchPercent={true} />
                    </div>
                );
            } else if (item.property_for.toLowerCase() === "Sell".toLowerCase()) {
                return (
                    <div onClick={() => navigateToDetails(item, "Sell")} key={index}>
                        <CardCommercialSell navigation={navigation} item={item} deleteMe={deleteMe} closeMe={closeMe} displayMatchCount={false} displayMatchPercent={true} />
                    </div>
                );
            }
        }
    };

    useEffect(() => {
        if (props.residentialPropertyList.length > 0) {
            setData(props.residentialPropertyList)
        }
    }, [props.residentialPropertyList])

    return (
        <div className="flex flex-col h-full bg-gray-100">
            {loading ? (
                <div className="flex flex-1 justify-center items-center bg-gray-100 bg-opacity-40">
                    <div className="loader">Loading...</div>
                </div>
            ) : (
                <div className="flex flex-col flex-1">
                    <div className="flex flex-row justify-around bg-white p-2 shadow-sm">
                        {reqUserId === customerAgentId && (
                            <div
                                className={`cursor-pointer p-2 border-b-2 ${selectedTab === 0 ? 'border-blue-500 text-blue-500' : 'border-transparent text-gray-500'}`}
                                onClick={() => setSelectedTab(0)}
                            >
                                My Properties
                            </div>
                        )}
                        <div
                            className={`cursor-pointer p-2 border-b-2 ${selectedTab === 1 ? 'border-blue-500 text-blue-500' : 'border-transparent text-gray-500'}`}
                            onClick={() => setSelectedTab(1)}
                        >
                            {reqUserId === customerAgentId ? "Other's Properties" : "My Properties"}
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-2">
                        {selectedTab === 0 && (
                            matchedPropertiesDetailsMine.length > 0 ? (
                                matchedPropertiesDetailsMine.map((item, index) => (
                                    <ItemView item={item} index={index} key={index} />
                                ))
                            ) : (
                                <div className="flex flex-1 justify-center items-center h-full">
                                    <span className="text-gray-500">No Matched Customer Found</span>
                                </div>
                            )
                        )}
                        {selectedTab === 1 && (
                            matchedPropertiesDetailsOther.length > 0 ? (
                                matchedPropertiesDetailsOther.map((item, index) => (
                                    <ItemView item={item} index={index} key={index} />
                                ))
                            ) : (
                                <div className="flex flex-1 justify-center items-center h-full">
                                    <span className="text-gray-500">No Matched Customer Found</span>
                                </div>
                            )
                        )}
                    </div>

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

                        {/* Add other filter sections here similarly */}

                        <button
                            onClick={() => setVisible(false)}
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

                        {/* Add other sort sections here similarly */}

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
    residentialPropertyList: state.AppReducer.residentialPropertyList,
});
const mapDispatchToProps = {
    setResidentialPropertyList,
    setAnyItemDetails,
    setPropertyDetails
};
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(MatchedProperties);
