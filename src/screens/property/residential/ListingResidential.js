import React, { useState, useEffect, useCallback } from "react";
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
import Slider from "./../../../components/Slider";
import SliderCr from "./../../../components/SliderCr";
import CardResidentialRent from "./rent/ResidentialRentCard";
import CardResidentialSell from "./sell/ResidentialSellCard";
import axios from "axios";
import { SERVER_URL } from "./../../../utils/Constant";
import { EMPLOYEE_ROLE } from "./../../../utils/AppConstant";
import {
    setResidentialPropertyList,
    setAnyItemDetails,
    setPropertyDetails
} from "./../../../reducers/Action";
import { addDays } from "./../../../utils/methods";
import Snackbar from "./../../../components/SnackbarComponent";
import CustomButtonGroup from "./../../../components/CustomButtonGroup";
import { resetRefresh } from "./../../../reducers/dataRefreshReducer";
import { useSelector, useDispatch } from 'react-redux';

const lookingForArray = ["Rent", "Sell"];
const homeTypeArray = ["Apartment", "Villa", "Independent House"];
const bhkTypeArray = ["1RK", "1BHK", "2BHK", "3BHK", "4+BHK"];
const availabilityArray = ["7 Days", "15 Days", "30 Days", "60 Days", "60+ Days"];
const furnishingStatusArray = ["Full", "Semi", "Empty"];
const lookingForArraySortBy = ["Rent", "Sell"];
const sortByRentArray = ["Lowest First", "Highest First"];
const sortByAvailabilityArray = ["Earliest First", "Oldest First"];
const sortByPostedDateArray = ["Recent First", "Oldest First"];

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
    const [isVisible, setIsVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [search, setSearch] = useState("");
    const [visible, setVisible] = useState(false);
    const [visibleSorting, setVisibleSorting] = useState(false);
    const [data, setData] = useState([]);
    const [minRent, setMinRent] = useState(5000);
    const [maxRent, setMaxRent] = useState(500000);
    const [minSell, setMinSell] = useState(1000000);
    const [maxSell, setMaxSell] = useState(100000000);
    const [sortByRentIndex, setSortByRentIndex] = useState(-1);
    const [sortByAvailabilityIndex, setSortByAvailabilityIndex] = useState(-1);
    const [sortByPostedDateIndex, setSortByPostedDateIndex] = useState(-1);
    const [lookingForIndexSortBy, setLookingForIndexSortBy] = useState(-1);
    const [loading, setLoading] = useState(false);

    // filter
    const [selectedBHK, setSelectedBHK] = useState([]);
    const [reqWithin, setReqWithin] = useState("");
    const [purpose, setPurpose] = useState("");
    const [selectedFunishing, setSelectedFunishing] = useState([]);

    const shouldRefresh = useSelector((state) => state.dataRefresh.shouldRefresh);
    const dispatch = useDispatch();

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
        try {
            getListing();
        } catch (error) {
            console.error('Failed to fetch data for ScreenA:', error);
            setData('Error loading data.');
        } finally {
            setLoading(false);
            dispatch(resetRefresh());
        }
    }, [dispatch, props.userDetails, employeeObj]);

    useEffect(() => {
        if (shouldRefresh || didDbCall || (props.userDetails && props.userDetails.works_for !== null)) {
            fetchData();
        }
    }, [fetchData, shouldRefresh, didDbCall]);

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
        setSortByAvailabilityIndex(-1);
        setSortByPostedDateIndex(-1);
        setVisibleSorting(false);
        let filterList = props.residentialPropertyList;
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



    const isFetching = React.useRef(false);

    const getListing = () => {
        if (props.userDetails === null) {
            setData([]);
            props.setResidentialPropertyList([]);
            return;
        }

        if (isFetching.current) return;
        isFetching.current = true;

        const user = {
            req_user_id: props.userDetails.id,
            agent_id: props.userDetails.works_for,
        };
        setLoading(true);
        axios(SERVER_URL + "/residentialPropertyListings", {
            method: "post",
            headers: {
                "Content-type": "Application/json",
                Accept: "Application/json"
            },
            data: user
        }).then(
            response => {
                isFetching.current = false;
                response.data.map(item => {
                    item.image_urls.map(image => {
                        image.url = SERVER_URL + image.url
                    })
                })
                setData(response.data);
                props.setResidentialPropertyList(response.data);
                setLoading(false);
                dispatch(resetRefresh());
            },
            error => {
                isFetching.current = false;
                setLoading(false);
                console.error("ListingResidential: Error fetching data:", error);
            }
        );
    };

    const searchFilterFunction = text => {
        if (text) {
            const newData = props.residentialPropertyList.filter(function (item) {
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
            setData(props.residentialPropertyList);
            setSearch(text);
        }
    };



    const navigateToDetails = (item, propertyFor) => {
        props.setPropertyDetails(item);
        if (propertyFor === "Rent") {
            navigate("/listing/PropDetailsFromListing", {
                state: {
                    item: item,
                    displayMatchCount: true,
                    displayMatchPercent: false
                }
            });
        } else if (propertyFor === "Sell") {
            navigate("/listing/PropDetailsFromListingForSell", {
                state: {
                    item: item,
                    displayMatchCount: true,
                    displayMatchPercent: false
                }
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
        if (item.property_type.toLowerCase() === "Residential".toLowerCase()) {
            if (item.property_for.toLowerCase() === "Rent".toLowerCase()) {
                return (
                    <div onClick={() => navigateToDetails(item, "Rent")} key={index}>
                        <CardResidentialRent navigation={navigation} item={item} deleteMe={deleteMe} closeMe={closeMe} displayCheckBox={displayCheckBox}
                            disableDrawer={disableDrawer} displayCheckBoxForEmployee={displayCheckBoxForEmployee} employeeObj={employeeObj}
                        />
                    </div>
                );
            } else if (item.property_for.toLowerCase() === "Sell".toLowerCase()) {
                return (
                    <div onClick={() => navigateToDetails(item, "Sell")} key={index}>
                        <CardResidentialSell navigation={navigation} item={item} deleteMe={deleteMe} closeMe={closeMe} displayCheckBox={displayCheckBox}
                            disableDrawer={disableDrawer} displayCheckBoxForEmployee={displayCheckBoxForEmployee} employeeObj={employeeObj}
                        />
                    </div>
                );
            }
        }
    };

    const toggleBottomNavigationView = () => {
        setVisible(!visible);
    };

    const toggleSortingBottomNavigationView = () => {
        setVisibleSorting(!visibleSorting);
    };

    const navigateTo = () => {
        navigate("/listing/Add");
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
        if (props.residentialPropertyList.length > 0) {
            setData(props.residentialPropertyList)
        }
    }, [props.residentialPropertyList])

    const selectBHK = (index, button) => {
        let newSelectedIndicesBHK;
        newSelectedIndicesBHK = [...selectedBHK];
        if (newSelectedIndicesBHK.includes(button.text)) {
            newSelectedIndicesBHK.splice(newSelectedIndicesBHK.indexOf(button.text), 1);
        } else {
            newSelectedIndicesBHK.push(button.text);
        }
        setSelectedBHK(newSelectedIndicesBHK);
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
    }

    const onFilter = () => {
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
                filterList = filterList.filter(
                    item =>
                        item.rent_details.expected_rent >= minRent &&
                        item.rent_details.expected_rent <= maxRent
                );
            }
        } else if (purpose === "Sell") {
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

    return (
        <div className="flex flex-col h-full bg-white relative">
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

            <div className="flex-1 overflow-y-auto">
                {loading ? (
                    <div className="flex justify-center items-center h-full">
                        Loading...
                    </div>
                ) : (
                    data.map((item, index) => (
                        <ItemView item={item} index={index} key={index} />
                    ))
                )}
            </div>

            {visible && (
                <div className="fixed inset-0 flex justify-center items-end z-50" style={{ backgroundColor: 'rgba(0, 0, 0, 0.1)' }} onClick={toggleBottomNavigationView}>
                    <div className="bg-white w-full p-4 pb-20 rounded-t-lg max-h-[50vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-center items-center relative mb-4 sticky top-0 bg-white z-10">
                            <h3 className="text-lg font-bold text-black">Filter</h3>
                            <div
                                onClick={toggleBottomNavigationView}
                                className="absolute top-0 right-0 cursor-pointer"
                            >
                                <MdRestartAlt
                                    color={"#000000"}
                                    size={30}
                                    onClick={resetFilter}
                                />
                            </div>
                        </div>

                        <div className="mb-4">
                            <h4 className="font-semibold mb-2 text-black">Looking For</h4>
                            <CustomButtonGroup
                                buttons={porposeForOptions}
                                onButtonPress={(index, button) => setPurpose(button.text)}
                                selectedIndices={[porposeForOptions.findIndex(option => option.text === purpose)]}
                                isMultiSelect={false}
                                buttonStyle={{ backgroundColor: '#fff', borderColor: 'rgba(173, 181, 189, .5)', borderWidth: 1 }}
                                selectedButtonStyle={{ backgroundColor: '#00a36c' }}
                                buttonTextStyle={{ color: '#000' }}
                                selectedButtonTextStyle={{ color: '#fff' }}
                            />
                        </div>

                        <div className="mb-4">
                            <h4 className="font-semibold mb-2 text-black">BHK Type</h4>
                            <CustomButtonGroup
                                buttons={bhkOption}
                                isMultiSelect={true}
                                selectedIndices={selectedBHK.map((item) =>
                                    bhkOption.findIndex((option) => option.text === item)
                                )}
                                onButtonPress={(index, button) => {
                                    selectBHK(index, button);
                                }}
                                buttonStyle={{ backgroundColor: '#fff', borderColor: 'rgba(173, 181, 189, .5)', borderWidth: 1 }}
                                selectedButtonStyle={{ backgroundColor: '#00a36c' }}
                                buttonTextStyle={{ color: '#000' }}
                                selectedButtonTextStyle={{ color: '#fff' }}
                            />
                        </div>

                        {purpose === "" ? null : purpose === "Rent" ? (
                            <div className="mb-4">
                                <h4 className="font-semibold mb-2 text-black">Rent Range</h4>
                                <Slider
                                    min={5000}
                                    max={500000}
                                    onSlide={setRentRange}
                                />
                            </div>
                        ) : (
                            <div className="mb-4">
                                <h4 className="font-semibold mb-2 text-black">Sell Price Range</h4>
                                <SliderCr
                                    min={1000000}
                                    max={100000000}
                                    onSlide={setSellRange}
                                />
                            </div>
                        )}

                        <div className="mb-4">
                            <h4 className="font-semibold mb-2 text-black">Availability</h4>
                            <CustomButtonGroup
                                buttons={reqWithinOptions}
                                onButtonPress={(index, button) => setReqWithin(button.text)}
                                selectedIndices={[reqWithinOptions.findIndex(option => option.text === reqWithin)]}
                                isMultiSelect={false}
                                buttonStyle={{ backgroundColor: '#fff', borderColor: 'rgba(173, 181, 189, .5)', borderWidth: 1 }}
                                selectedButtonStyle={{ backgroundColor: '#00a36c' }}
                                buttonTextStyle={{ color: '#000' }}
                                selectedButtonTextStyle={{ color: '#fff' }}
                            />
                        </div>

                        <div className="mb-4">
                            <h4 className="font-semibold mb-2 text-black">Furnishing</h4>
                            <CustomButtonGroup
                                buttons={furnishingStatusOptions}
                                isMultiSelect={true}
                                selectedIndices={selectedFunishing.map((item) =>
                                    furnishingStatusOptions.findIndex((option) => option.text === item)
                                )}
                                onButtonPress={(index, button) => {
                                    selectFurnishings(index, button);
                                }}
                                buttonStyle={{ backgroundColor: '#fff', borderColor: 'rgba(173, 181, 189, .5)', borderWidth: 1 }}
                                selectedButtonStyle={{ backgroundColor: '#00a36c' }}
                                buttonTextStyle={{ color: '#000' }}
                                selectedButtonTextStyle={{ color: '#fff' }}
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
                            <h3 className="text-lg font-bold text-black">Sort By</h3>
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
                                buttons={lookingForArraySortBy.map(text => ({ text }))}
                                onButtonPress={(index) => selectLookingForIndexSortBy(index)}
                                selectedIndices={[lookingForIndexSortBy]}
                                isSegmented={true}
                                containerStyle={{ width: '100%' }}
                                buttonStyle={{ flex: 1, backgroundColor: '#fff', borderColor: 'rgba(173, 181, 189, .5)', borderWidth: 1 }}
                                selectedButtonStyle={{ backgroundColor: '#00a36c4d' }}
                                buttonTextStyle={{ color: '#000' }}
                                selectedButtonTextStyle={{ color: '#000' }}
                            />
                        </div>

                        <div className="mb-4">
                            <h4 className="font-semibold mb-2 text-black">Rent</h4>
                            <CustomButtonGroup
                                buttons={sortByRentArray.map(text => ({ text }))}
                                onButtonPress={(index) => sortByRent(index)}
                                selectedIndices={[sortByRentIndex]}
                                isSegmented={true}
                                containerStyle={{ width: '100%' }}
                                buttonStyle={{ flex: 1, backgroundColor: '#fff', borderColor: 'rgba(173, 181, 189, .5)', borderWidth: 1 }}
                                selectedButtonStyle={{ backgroundColor: '#00a36c4d' }}
                                buttonTextStyle={{ color: '#000' }}
                                selectedButtonTextStyle={{ color: '#000' }}
                            />
                        </div>

                        <div className="mb-4">
                            <h4 className="font-semibold mb-2 text-black">Availability</h4>
                            <CustomButtonGroup
                                buttons={sortByAvailabilityArray.map(text => ({ text }))}
                                onButtonPress={(index) => sortByAvailability(index)}
                                selectedIndices={[sortByAvailabilityIndex]}
                                isSegmented={true}
                                containerStyle={{ width: '100%' }}
                                buttonStyle={{ flex: 1, backgroundColor: '#fff', borderColor: 'rgba(173, 181, 189, .5)', borderWidth: 1 }}
                                selectedButtonStyle={{ backgroundColor: '#00a36c4d' }}
                                buttonTextStyle={{ color: '#000' }}
                                selectedButtonTextStyle={{ color: '#000' }}
                            />
                        </div>

                        <div className="mb-4">
                            <h4 className="font-semibold mb-2 text-black">Posted date</h4>
                            <CustomButtonGroup
                                buttons={sortByPostedDateArray.map(text => ({ text }))}
                                onButtonPress={(index) => sortByPostedDate(index)}
                                selectedIndices={[sortByPostedDateIndex]}
                                isSegmented={true}
                                containerStyle={{ width: '100%' }}
                                buttonStyle={{ flex: 1, backgroundColor: '#fff', borderColor: 'rgba(173, 181, 189, .5)', borderWidth: 1 }}
                                selectedButtonStyle={{ backgroundColor: '#00a36c4d' }}
                                buttonTextStyle={{ color: '#000' }}
                                selectedButtonTextStyle={{ color: '#000' }}
                            />
                        </div>

                    </div>
                </div>
            )}


            {
                !visible && !visibleSorting && props.residentialPropertyList && props.residentialPropertyList.length > 0 && (
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
            {
                props.userDetails && ((props.userDetails.works_for === props.userDetails.id) ||
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
                    </div> : null
            }

            <Snackbar
                visible={isVisible}
                textMessage={errorMessage}
                actionHandler={dismissSnackBar}
                actionText="OK"
            />
        </div >
    );
};

const mapStateToProps = state => {
    return {
        residentialPropertyList: state.AppReducer.residentialPropertyList,
        userDetails: state.AppReducer.userDetails,
    };
};

const mapDispatchToProps = {
    setResidentialPropertyList,
    setAnyItemDetails,
    setPropertyDetails
};

export default connect(mapStateToProps, mapDispatchToProps)(ListingResidential);
