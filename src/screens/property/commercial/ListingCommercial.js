import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { connect } from "react-redux";
import {
    MdSort,
    MdFilterList,
    MdRestartAlt,
    MdSearch,
    MdAddCircleOutline
} from "react-icons/md";
import { AiOutlinePlusCircle } from "react-icons/ai";
import Button from "./../../../components/Button";
import CardRent from "./rent/CommercialRentCard";
import CardSell from "./sell/CommercialSellCard";
import axios from "axios";
import { SERVER_URL } from "./../../../utils/Constant";
import {
    setCommercialPropertyList,
    setAnyItemDetails,
    setPropertyDetails
} from "./../../../reducers/Action";
import { addDays } from "./../../../utils/methods";
import Snackbar from "./../../../components/SnackbarComponent";
import CustomButtonGroup from "./../../../components/CustomButtonGroup";
import { resetRefresh } from "./../../../reducers/dataRefreshReducer";
import { useSelector, useDispatch } from 'react-redux';

const sortByRentArray = ["Lowest First", "Highest First"];
const sortByAvailabilityArray = ["Earliest First", "Oldest First"];
const sortByPostedDateArray = ["Recent First", "Oldest Fist"];

const ListingCommercial = props => {
    const navigate = useNavigate();
    const location = useLocation();
    const navigation = {
        navigate: (path, params) => {
            if (!path.startsWith('/')) {
                navigate(`/listing/${path}`, { state: params });
            } else {
                navigate(path, { state: params });
            }
        },
        goBack: () => navigate(-1)
    };
    const { displayCheckBox, disableDrawer, displayCheckBoxForEmployee, item, didDbCall = false, displayFilterButton = true } = location.state || {};
    const employeeObj = item;
    const [search, setSearch] = useState("");
    const [isVisible, setIsVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [data, setData] = useState([]);
    const [lookingForIndexSortBy, setLookingForIndexSortBy] = useState(-1);
    const [checkBoxSelectArray, setCheckBoxSelectArray] = useState([]);
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
    const [loading, setLoading] = useState(false);
    const [visibleSorting, setVisibleSorting] = useState(false);
    const [visible, setVisible] = useState(false);
    const isFetching = useRef(false);

    const [reqWithin, setReqWithin] = useState("");
    const [purpose, setPurpose] = useState("");
    const [selectedProperties, setSelectedProperties] = useState([]);
    const [selectedBuildingType, setSelectedBuildingType] = useState([]);

    const shouldRefresh = useSelector((state) => state.dataRefresh.shouldRefresh);
    const dispatch = useDispatch();

    const fetchData = useCallback(async () => {
        try {
            getListing();
        } catch (error) {
            console.error('Failed to fetch data:', error);
            setData([]);
        } finally {
            setLoading(false);
            dispatch(resetRefresh());
        }
    }, [dispatch, employeeObj, props.userDetails]);

    useEffect(() => {
        if (shouldRefresh || didDbCall) {
            fetchData();
        }
    }, [shouldRefresh, fetchData, didDbCall]);

    useEffect(() => {
        fetchData();
    }, [fetchData, props.userDetails, employeeObj]);

    const getListing = () => {
        if (props.userDetails === null) {
            setData([]);
            props.setCommercialPropertyList([]);
            return;
        }
        const user = {
            req_user_id: props.userDetails.id,
            agent_id: props.userDetails.works_for
        };
        setLoading(true);

        if (isFetching.current) return;
        isFetching.current = true;

        axios(SERVER_URL + "/commercialPropertyListings", {
            method: "post",
            headers: {
                "Content-type": "Application/json",
                Accept: "Application/json"
            },
            data: user
        }).then(
            response => {
                if (response.data !== null) {
                    response.data.map(item => {
                        item.image_urls.map(image => {
                            image.url = SERVER_URL + image.url
                        })
                    })
                    setData(response.data);
                    props.setCommercialPropertyList(response.data);
                    setLoading(false);
                }
                isFetching.current = false;
            },
            error => {
                setLoading(false);
                isFetching.current = false;
                console.log(error);
            }
        );
    };

    const searchFilterFunction = text => {
        if (text) {
            const newData = props.commercialPropertyList.filter(function (item) {
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
            setData(props.commercialPropertyList);
            setSearch(text);
        }
    };



    const navigateToDetails = (item, propertyFor) => {
        props.setPropertyDetails(item);
        if (propertyFor === "Rent") {
            navigate("/listing/CommercialRentPropDetails", {
                state: {
                    item: item,
                    displayMatchCount: true,
                    displayMatchPercent: false
                }
            });
        } else if (propertyFor === "Sell") {
            navigate("/listing/CommercialSellPropDetails", {
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
        axios(SERVER_URL + "/deleteCommercialProperty", {
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

    const ItemView = ({ item }) => {
        if (item.property_type.toLowerCase() === "Commercial".toLowerCase()) {
            if (item.property_for.toLowerCase() === "Rent".toLowerCase()) {
                return (
                    <div onClick={() => navigateToDetails(item, "Rent")} style={{ cursor: 'pointer', borderBottom: '1px solid #C8C8C8' }}>
                        <CardRent navigation={navigation} item={item} deleteMe={deleteMe} closeMe={closeMe} displayCheckBox={displayCheckBox}
                            disableDrawer={disableDrawer} displayCheckBoxForEmployee={displayCheckBoxForEmployee} employeeObj={employeeObj} />
                    </div>
                );
            } else if (item.property_for.toLowerCase() === "Sell".toLowerCase()) {
                return (
                    <div onClick={() => navigateToDetails(item, "Sell")} style={{ cursor: 'pointer', borderBottom: '1px solid #C8C8C8' }}>
                        <CardSell navigation={navigation} item={item} deleteMe={deleteMe} closeMe={closeMe} displayCheckBox={displayCheckBox}
                            disableDrawer={disableDrawer} displayCheckBoxForEmployee={displayCheckBoxForEmployee} employeeObj={employeeObj} />
                    </div>
                );
            }
        }
    };

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
            if (sortByRentArray[index] === "Lowest First") {
                filterList.sort((a, b) => {
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
            if (sortByRentArray[index] === "Lowest First") {
                filterList.sort((a, b) => {
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


    const navigateTo = () => {
        navigate("/listing/Add");
    };

    return (
        <div className="flex flex-col h-full bg-white">
            <div className="flex flex-row items-center p-4 border-b border-gray-200">
                <div className="flex-1 flex items-center bg-white rounded-lg border border-gray-300 px-3 py-2 shadow-sm">
                    <MdSearch size={24} className="text-gray-400" />
                    <div className="h-6 w-0.5 bg-blue-500 mx-3"></div>
                    <input
                        type="text"
                        placeholder="Search By Name, Address, Id, Mobile"
                        value={search}
                        onChange={(e) => searchFilterFunction(e.target.value)}
                        className="flex-1 bg-transparent border-none outline-none text-gray-700 placeholder-gray-500 text-base"
                    />
                </div>
                {displayFilterButton && <div className="ml-2 flex flex-row">
                    <button onClick={() => setVisibleSorting(true)} className="p-2 hover:bg-gray-100 rounded-full">
                        <MdSort size={24} color="#000000" />
                    </button>
                    <button onClick={() => setVisible(true)} className="p-2 hover:bg-gray-100 rounded-full">
                        <MdFilterList size={24} color="#000000" />
                    </button>
                    <button onClick={() => {
                        setSearch("");
                        setData(props.commercialPropertyList);
                    }} className="p-2 hover:bg-gray-100 rounded-full">
                        <MdRestartAlt size={24} color="#000000" />
                    </button>
                    <button onClick={navigateTo} className="p-2 hover:bg-gray-100 rounded-full">
                        <MdAddCircleOutline size={24} color="#000000" />
                    </button>
                </div>}
            </div>

            {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                    <span>Loading...</span>
                </div>
            ) : (
                <div style={{ flex: 1, overflowY: 'auto' }}>
                    {data.map((item, index) => (
                        <ItemView key={index} item={item} />
                    ))}
                </div>
            )}

            {!displayCheckBox && (
                <div style={styles.fab} onClick={() => navigate("AddNewCustomer")}>
                    <AiOutlinePlusCircle size={50} color="#00A36C" />
                </div>
            )}
        </div>
    );
};

const styles = {
    fab: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        cursor: 'pointer'
    }
};

const mapStateToProps = state => ({
    commercialPropertyList: state.AppReducer.commercialPropertyList,
    userDetails: state.AppReducer.userDetails
});
const mapDispatchToProps = {
    setCommercialPropertyList,
    setAnyItemDetails,
    setPropertyDetails
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ListingCommercial);
