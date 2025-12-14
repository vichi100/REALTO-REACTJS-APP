import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { connect, useSelector, useDispatch } from "react-redux";
import {
    MdSort,
    MdFilterList,
    MdRestartAlt,
    MdSearch,
    MdAddCircleOutline
} from "react-icons/md";
import { AiOutlinePlusCircle } from "react-icons/ai";

// import { ButtonGroup } from "@rneui/themed";
import Button from "./../../../components/Button";
import Slider from "./../../../components/Slider";
import SliderCr from "./../../../components/SliderCr";
import ContactResidentialRentCard from "./rent/ContactResidentialRentCard";
import ContactResidentialSellCard from "./buy/ContactResidentialSellCard";
import axios from "axios";
import { SERVER_URL } from "./../../../utils/Constant";
import { EMPLOYEE_ROLE } from "./../../../utils/AppConstant";
import {
    setResidentialCustomerList,
    setAnyItemDetails
} from "./../../../reducers/Action";
import { addDays } from "./../../../utils/methods";
import Snackbar from "./../../../components/SnackbarComponent";
import CustomButtonGroup from "./../../../components/CustomButtonGroup";

import { resetRefresh } from './../../../reducers/dataRefreshReducer';

const lookingForArraySortBy = ["Rent", "Buy"];
const sortByNameArray = ["A First", "Z First"];
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
    { text: 'Buy' },
];

const furnishingStatusOptions = [
    { text: 'Full' },
    { text: 'Semi' },
    { text: 'Empty' },
]

const ContactsResidential = props => {
    const { navigation } = props;
    const location = useLocation();
    const { displayCheckBox, disableDrawer, displayCheckBoxForEmployee, employeeObj, didDbCall = false, displayFilterButton = true } = location.state || {};
    const [isVisible, setIsVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [search, setSearch] = useState("");
    const [data, setData] = useState([]);

    const [minRent, setMinRent] = useState(5000);
    const [maxRent, setMaxRent] = useState(500000);
    const [minSell, setMinSell] = useState(1000000);
    const [maxSell, setMaxSell] = useState(100000000);
    // sorting
    const [sortByNameIndex, setSortByNameIndex] = useState(-1);
    const [sortByPostedDateIndex, setSortByPostedDateIndex] = useState(-1);
    const [lookingForIndexSortBy, setLookingForIndexSortBy] = useState(-1);

    const [loading, setLoading] = useState(false);
    const isFetching = useRef(false);

    // filter
    const [selectedBHK, setSelectedBHK] = useState([]);
    const [reqWithin, setReqWithin] = useState("");
    const [purpose, setPurpose] = useState("");
    const [selectedFunishing, setSelectedFunishing] = useState([]);

    const shouldRefresh = useSelector((state) => state.dataRefresh.shouldRefresh);
    const dispatch = useDispatch();

    const fetchData = useCallback(async () => {
        try {
            console.log('ScreenA: Fetching latest data...');
            getListing();
        } catch (error) {
            console.error('Failed to fetch data for ScreenA:', error);
            setData('Error loading data.');
        } finally {
            setLoading(false);
            dispatch(resetRefresh());
            console.log('ScreenA: Data fetched and refresh flag reset.');
        }
    }, [dispatch]);

    useEffect(() => {
        if (shouldRefresh || didDbCall) {
            fetchData();
        }
    }, [shouldRefresh, fetchData, didDbCall]);

    const resetSortBy = () => {
        setLookingForIndexSortBy(-1);
        setSortByNameIndex(-1);
        setSortByPostedDateIndex(-1);
        setData(props.residentialCustomerList);
    };

    const sortByPostedDate = index => {
        if (lookingForIndexSortBy === -1) {
            setErrorMessage("Looking for is missing in filter");
            setIsVisible(true);
            return;
        }
        setSortByPostedDateIndex(index);
        setSortByNameIndex(-1);
        setVisibleSorting(false);
        let filterList = [...props.residentialCustomerList];
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
        if (lookingForIndexSortBy === -1) {
            setErrorMessage("Looking for is missing in filter");
            setIsVisible(true);
            return;
        }
        setSortByPostedDateIndex(-1);
        setSortByNameIndex(index);
        setVisibleSorting(false);
        let filterList = [...props.residentialCustomerList];
        if (lookingForIndexSortBy === 0) {
            filterList = filterList.filter(
                item => item.customer_locality.property_for === "Rent"
            );
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
        setSelectedBHK([]);
        setReqWithin("");
        setPurpose("");
        setSelectedFunishing([]);
        setData(props.residentialCustomerList);
        setVisible(false);
        setMinRent(5000);
        setMaxRent(500000);
        setMinSell(1000000);
        setMaxSell(100000000);
    };

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
        if (purpose === "") {
            setErrorMessage("Looking for is missing in filter");
            setIsVisible(true);
            return;
        }
        let filterList = props.residentialCustomerList;
        if (purpose !== "") {
            filterList = filterList.filter(
                item =>
                    item.customer_locality.property_for ===
                    purpose
            );
        }

        if (selectedBHK.length > 0) {
            filterList = filterList.filter(
                item => selectedBHK.includes(item.customer_property_details.bhk_type)
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

        if (selectedFunishing.length > 0) {
            filterList = filterList.filter(
                item => selectedFunishing.includes(item.customer_property_details.furnishing_status)
            );
        }


        if (purpose === "Rent") {
            if (minRent > 5000 || maxRent < 500000) {
                filterList = filterList.filter(
                    item =>
                        item.customer_rent_details.expected_rent >= minRent &&
                        item.customer_rent_details.expected_rent <= maxRent
                );
            }
        } else if (purpose === "Buy") {
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

    useEffect(() => {
        if (
            props.userDetails &&
            props.userDetails.works_for !== null
        ) {
            getListing();
        }
    }, [props.userDetails]);



    const getListing = () => {
        console.log("ContactsResidential: getListing called");
        console.log("ContactsResidential: userDetails:", props.userDetails);
        if (props.userDetails === null) {
            console.log("ContactsResidential: userDetails is null, returning");
            setData([]);
            props.setResidentialCustomerList([]);
            return;
        }


        const user = {
            req_user_id: props.userDetails.id,
            agent_id: props.userDetails.works_for
        };
        console.log("ContactsResidential: Fetching data with user:", user);

        if (isFetching.current) return;
        isFetching.current = true;

        setLoading(true);
        axios(SERVER_URL + "/residentialCustomerList", {
            method: "post",
            headers: {
                "Content-type": "Application/json",
                Accept: "Application/json"
            },
            data: user
        }).then(
            response => {
                isFetching.current = false;
                console.log("ContactsResidential: Data fetched successfully:", response.data.length);
                setData(response.data);
                props.setResidentialCustomerList(response.data);
                setLoading(false);
            },
            error => {
                isFetching.current = false;
                console.error("ContactsResidential: Error fetching data:", error);
                setLoading(false);
            }
        );
    };

    const searchFilterFunction = text => {
        if (text) {
            const newData = props.residentialCustomerList.filter(function (item) {
                const itemData =
                    item.customer_details.name +
                    item.customer_details.address +
                    item.customer_details.mobile1 +
                    item.customer_id +
                    item.customer_locality.location_area.map(item => item.main_text).join(', ')

                const textData = text.toUpperCase();
                return itemData.toUpperCase().indexOf(textData) > -1;
            });
            setData(newData);
            setSearch(text);
        } else {
            setData(props.residentialCustomerList);
            setSearch(text);
        }
    };

    const navigate = useNavigate();

    const navigateToDetails = (item, propertyFor) => {
        props.setAnyItemDetails(item);
        if (propertyFor === "Rent") {
            navigate("/contacts/CustomerDetailsResidentialRentFromList", {
                state: {
                    item: item,
                    displayMatchCount: true,
                    displayMatchPercent: false
                }
            });
        } else if (propertyFor === "Buy") {
            navigate("/contacts/CustomerDetailsResidentialBuyFromList", {
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

    const [visible, setVisible] = useState(false);
    const [visibleSorting, setVisibleSorting] = useState(false);

    const toggleBottomNavigationView = () => {
        setVisible(!visible);
    };

    const toggleSortingBottomNavigationView = () => {
        setVisibleSorting(!visibleSorting);
    };

    const navigateTo = () => {
        navigate("/contacts/AddNewCustomerStack");
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
        if (props.residentialCustomerList.length > 0) {
            setData(props.residentialCustomerList)
        }

    }, [props.residentialCustomerList])

    return (
        <div style={{ flex: 1, height: '100vh', display: 'flex', flexDirection: 'column' }}>
            {loading ? (
                <div
                    style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: 'rgba(245,245,245, .4)',
                        display: 'flex'
                    }}
                >
                    <div>Loading...</div>
                </div>
            ) : (
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

                    <div className="flex flex-row items-center p-4 border-b border-gray-200 bg-white">
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

                    </div>
                    {data.length > 0 ? (
                        <div className="flex-1 overflow-y-auto">
                            {data.map((item, index) => {
                                if (item.customer_locality.property_type === "Residential") {
                                    if (item.customer_locality.property_for === "Rent") {
                                        return (
                                            <div key={index} onClick={() => navigateToDetails(item, "Rent")} style={{ cursor: 'pointer' }}>
                                                <ContactResidentialRentCard navigation={navigation} item={item} deleteMe={deleteMe} closeMe={closeMe} displayCheckBox={displayCheckBox}
                                                    disableDrawer={disableDrawer} displayCheckBoxForEmployee={displayCheckBoxForEmployee} employeeObj={employeeObj} />
                                                <div style={{ height: 0.5, width: "100%", backgroundColor: "#C8C8C8" }} />
                                            </div>
                                        );
                                    } else if (item.customer_locality.property_for === "Buy") {
                                        return (
                                            <div key={index} onClick={() => navigateToDetails(item, "Buy")} style={{ cursor: 'pointer' }}>
                                                <ContactResidentialSellCard navigation={navigation} item={item} deleteMe={deleteMe} closeMe={closeMe} displayCheckBox={displayCheckBox}
                                                    disableDrawer={disableDrawer} displayCheckBoxForEmployee={displayCheckBoxForEmployee} employeeObj={employeeObj} />
                                                <div style={{ height: 0.5, width: "100%", backgroundColor: "#C8C8C8" }} />
                                            </div>
                                        );
                                    }
                                }
                                return null;
                            })}
                            <div style={{ padding: 10, alignItems: 'center', display: 'flex', justifyContent: 'center' }}>
                                <span style={{ color: '#000' }}>End</span>
                            </div>
                        </div>
                    ) : (
                        <div style={styles.container}>
                            <div
                                style={{
                                    flex: 1,
                                    justifyContent: "center",
                                    alignItems: "center",
                                    textAlign: "center",
                                    display: 'flex',
                                    flexDirection: 'column'
                                }}
                            >
                                <span style={{ textAlign: "center" }}>
                                    You have no customer
                                </span>
                            </div>
                        </div>)}

                    {/* Filter Modal */}
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
                                        onButtonPress={(index, button) => {
                                            setPurpose(button.text);
                                        }}
                                    />
                                </div>

                                <div className="mb-4">
                                    <h4 className="font-semibold mb-2 text-black">BHK Type</h4>
                                    <CustomButtonGroup
                                        buttons={bhkOption}
                                        isMultiSelect={true}
                                        buttonStyle={{ backgroundColor: '#fff', borderColor: 'rgba(173, 181, 189, .5)', borderWidth: 1 }}
                                        selectedButtonStyle={{ backgroundColor: '#00a36c' }}
                                        buttonTextStyle={{ color: '#000' }}
                                        selectedButtonTextStyle={{ color: '#fff' }}
                                        selectedIndices={selectedBHK.map((item) =>
                                            bhkOption.findIndex((option) => option.text === item)
                                        )}
                                        onButtonPress={(index, button) => {
                                            selectBHK(index, button);
                                        }}
                                    />
                                </div>

                                {purpose === "" ? null : purpose === "Rent" ? (
                                    <div className="mb-4">
                                        <h4 className="font-semibold mb-2 text-black">Rent Range</h4>
                                        <Slider
                                            min={10000}
                                            max={500000}
                                            onSlide={handlePriceRangeChange}
                                        />
                                    </div>
                                ) : (
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
                                        onButtonPress={(index, button) => {
                                            setReqWithin(button.text);
                                        }}
                                    />
                                </div>

                                <div className="mb-4">
                                    <h4 className="font-semibold mb-2 text-black">Furnishing</h4>
                                    <CustomButtonGroup
                                        buttons={furnishingStatusOptions}
                                        isMultiSelect={true}
                                        buttonStyle={{ backgroundColor: '#fff', borderColor: 'rgba(173, 181, 189, .5)', borderWidth: 1 }}
                                        selectedButtonStyle={{ backgroundColor: '#00a36c' }}
                                        buttonTextStyle={{ color: '#000' }}
                                        selectedButtonTextStyle={{ color: '#fff' }}
                                        selectedIndices={selectedFunishing.map((item) =>
                                            furnishingStatusOptions.findIndex((option) => option.text === item)
                                        )}
                                        onButtonPress={(index, button) => {
                                            selectFurnishings(index, button);
                                        }}
                                    />
                                </div>

                                <div className="mb-4">
                                    <Button title="Apply" onPress={() => onFilter()} />
                                </div>

                                <Snackbar
                                    visible={isVisible}
                                    textMessage={errorMessage}
                                    position={"top"}
                                    actionHandler={() => dismissSnackBar()}
                                    actionText="OK"
                                />
                            </div>
                        </div>
                    )}

                    {/* Sort Modal */}
                    {visibleSorting && (
                        <div className="fixed inset-0 flex justify-center items-end z-50" style={{ backgroundColor: 'rgba(0, 0, 0, 0.1)' }} onClick={toggleSortingBottomNavigationView}>
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
                                    <h4 className="font-semibold mb-2 text-black">Customer Looking For</h4>
                                    <CustomButtonGroup
                                        buttons={lookingForArraySortBy.map(text => ({ text }))}
                                        onButtonPress={(index) => selectLookingForIndexSortBy(index)}
                                        selectedIndices={[lookingForIndexSortBy]}
                                        isMultiSelect={false}
                                        buttonStyle={{ backgroundColor: '#fff', borderColor: 'rgba(173, 181, 189, .5)', borderWidth: 1 }}
                                        selectedButtonStyle={{ backgroundColor: '#00a36c' }}
                                        buttonTextStyle={{ color: '#000' }}
                                        selectedButtonTextStyle={{ color: '#fff' }}
                                    />
                                </div>

                                <div className="mb-4">
                                    <h4 className="font-semibold mb-2 text-black">Name</h4>
                                    <CustomButtonGroup
                                        buttons={sortByNameArray.map(text => ({ text }))}
                                        onButtonPress={(index) => sortByName(index)}
                                        selectedIndices={[sortByNameIndex]}
                                        isMultiSelect={false}
                                        buttonStyle={{ backgroundColor: '#fff', borderColor: 'rgba(173, 181, 189, .5)', borderWidth: 1 }}
                                        selectedButtonStyle={{ backgroundColor: '#00a36c' }}
                                        buttonTextStyle={{ color: '#000' }}
                                        selectedButtonTextStyle={{ color: '#fff' }}
                                    />
                                </div>

                                <div className="mb-4">
                                    <h4 className="font-semibold mb-2 text-black">Posted date</h4>
                                    <CustomButtonGroup
                                        buttons={sortByPostedDateArray.map(text => ({ text }))}
                                        onButtonPress={(index) => sortByPostedDate(index)}
                                        selectedIndices={[sortByPostedDateIndex]}
                                        isMultiSelect={false}
                                        buttonStyle={{ backgroundColor: '#fff', borderColor: 'rgba(173, 181, 189, .5)', borderWidth: 1 }}
                                        selectedButtonStyle={{ backgroundColor: '#00a36c' }}
                                        buttonTextStyle={{ color: '#000' }}
                                        selectedButtonTextStyle={{ color: '#fff' }}
                                    />
                                </div>

                                <Snackbar
                                    visible={isVisible}
                                    textMessage={errorMessage}
                                    position={"top"}
                                    actionHandler={() => dismissSnackBar()}
                                    actionText="OK"
                                />
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

                    {/* Add Fab */}
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
                </div>
            )
            }
        </div >
    );
};

const styles = {
    container: {
        flex: 1,
        margin: 5,
        display: 'flex',
        flexDirection: 'column',
        position: 'relative'
    },
    fab: {
        flexDirection: "row",
        position: "absolute",
        width: 130,
        height: 35,
        alignItems: "center",
        justifyContent: "center",
        right: "33%",
        bottom: 10,
        backgroundColor: "rgba(128,128,128, 0.8)",
        borderRadius: 30,
        boxShadow: '0px 4px 8px rgba(0,0,0,0.3)',
        display: 'flex'
    },
    verticalLine: {
        height: "100%",
        width: 2,
        backgroundColor: "#ffffff"
    },
    fabIcon1: {
        paddingRight: 20,
        display: 'flex',
        alignItems: 'center'
    },
    fabIcon2: {
        paddingLeft: 20,
        display: 'flex',
        alignItems: 'center'
    },
    propSubSection: {
        marginBottom: 20
    },
    marginBottom10: {
        marginBottom: 10
    }
};

const mapStateToProps = state => ({
    userDetails: state.AppReducer.userDetails,
    residentialCustomerList: state.AppReducer.residentialCustomerList
});
const mapDispatchToProps = {
    setResidentialCustomerList,
    setAnyItemDetails
};
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ContactsResidential);
