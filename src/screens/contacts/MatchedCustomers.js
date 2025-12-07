import React, { useState, useEffect } from "react";
import { connect, useDispatch } from "react-redux";
import {
    MdSort,
    MdFilterList,
    MdRestartAlt,
    MdSearch
} from "react-icons/md";
// import { ButtonGroup } from "@rneui/themed";
import CustomButtonGroup from "./../../components/CustomButtonGroup";
import Button from "./../../components/Button";
import Slider from "./../../components/Slider";
import SliderX from "./../../components/SliderX";
import ContactResidentialRentCard from "./residential/rent/ContactResidentialRentCard";
import ContactResidentialSellCard from "./residential/buy/ContactResidentialSellCard";
import ContactCommercialRentCard from "./commercial/rent/CustomerCommercialRentCard";
import ContactCommercialBuyCard from "./commercial/buy/CustomerCommercialBuyCard";
import axios from "axios";
import { SERVER_URL } from "./../../utils/Constant";
import {
    setResidentialCustomerList,
    setAnyItemDetails
} from "./../../reducers/Action";
import { addDays, numDifferentiation } from "./../../utils/methods";
import Snackbar from "./../../components/SnackbarComponent";
import { resetRefresh } from './../../reducers/dataRefreshReducer';

const lookingForArray = ["Rent", "Buy"];
const homeTypeArray = ["Apartment", "Villa", "Independent House"];
const bhkTypeArray = ["1RK", "1BHK", "2BHK", "3BHK", "4BHK", "4+BHK"];
const availabilityArray = ["Immediate", "15 Days", "30 Days", "30+ Days"];
const furnishingStatusArray = ["Full", "Semi", "Empty"];

const sortByNameArray = ["A First", "Z First"];
const lookingForArraySortBy = ["Rent", "Buy"];
const sortByPostedDateArray = ["Recent First", "Oldest Fist"];

const MatchedCustomers = props => {
    const { navigation, route } = props;
    const matchedProprtyItem = route?.params?.matchedProprtyItem || {};
    const [isVisible, setIsVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [data, setData] = useState([]);
    const [matchedCustomerDetailsMine, setMatchedCustomerDetailsMine] = useState([]);
    const [matchedCustomerDetailsOther, setMatchedCustomerDetailsOther] = useState([]);

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

    const [reqUserId, setReqUserId] = useState(props.userDetails.works_for);
    const [propertyAgentId, setPropertyAgentId] = useState(matchedProprtyItem.agent_id);
    const [selectedTab, setSelectedTab] = useState(reqUserId === propertyAgentId ? 0 : 1);

    const dispatch = useDispatch();

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
        setLookingForIndex(-1);
        setHomeTypeIndex(-1);
        setBHKTypeIndex(-1);
        setAvailabilityIndex(-1);
        setFurnishingIndex(-1);
        setData(props.residentialCustomerList);
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
        let filterList = props.residentialCustomerList;
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
        const property = {
            req_user_id: props.userDetails.works_for,
            property_id: matchedProprtyItem.property_id,
        };
        setLoading(true);

        let finalURL;

        if (matchedProprtyItem.property_type == "Commercial") {
            if (matchedProprtyItem.property_for == "Rent") {
                finalURL = SERVER_URL + "/matchedCommercialCustomerRentList";
            } else if (matchedProprtyItem.property_for == "Sell") {
                finalURL = SERVER_URL + "/matchedCommercialCustomerSellList";
            }

        } else if (matchedProprtyItem.property_type == "Residential") {
            if (matchedProprtyItem.property_for == "Rent") {
                finalURL = SERVER_URL + "/matchedResidentialCustomerRentList";
            } else if (matchedProprtyItem.property_for == "Sell") {
                finalURL = SERVER_URL + "/matchedResidentialCustomerBuyList";
            }
        }

        axios(finalURL, {
            method: "post",
            headers: {
                "Content-type": "Application/json",
                Accept: "Application/json"
            },
            data: property
        }).then(
            response => {
                setMatchedCustomerDetailsMine(response.data.matchedCustomerDetailsMine);
                setMatchedCustomerDetailsOther(response.data.matchedCustomerDetailsOther);
                props.setResidentialCustomerList(response.data);
                setLoading(false);
            },
            error => {
                console.log(error);
                setLoading(false);
            }
        );
    };

    const navigateToDetails = (item, property_type, propertyFor) => {
        props.setAnyItemDetails(item);
        if (property_type === "Residential") {
            if (propertyFor === "Rent") {
                navigation.navigate("CustomerDetailsResidentialRentFromList", { item: item, displayMatchCount: false, displayMatchPercent: false });
            } else if (propertyFor === "Buy") {
                navigation.navigate("CustomerDetailsResidentialBuyFromList", { item: item, displayMatchCount: false, displayMatchPercent: false });
            }
        } else if (property_type === "Commercial") {
            if (propertyFor === "Rent") {
                navigation.navigate("CustomerDetailsCommercialRentFromList", { item: item, displayMatchCount: false, displayMatchPercent: false });
            } else if (propertyFor === "Buy") {
                navigation.navigate("CustomerDetailsCommercialBuyFromList", { item: item, displayMatchCount: false, displayMatchPercent: false });
            }
        }
    };

    const deleteMe = (itemToDelete) => {
        setData((data) => data.filter((item) => item.customer_id !== itemToDelete.customer_id));
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
            {loading ? <div
                style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: 'rgba(245,245,245, .4)',
                    display: 'flex'
                }}
            >
                <div>Loading...</div>
            </div> :
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                    {1 > 0 ? (
                        <div style={styles.container}>
                            <div style={styles.tabContainer}>
                                {reqUserId === propertyAgentId && <div
                                    style={{ ...styles.tab, ...(selectedTab === 0 ? styles.activeTab : {}), cursor: 'pointer' }}
                                    onClick={() => setSelectedTab(0)}
                                >
                                    <span style={styles.tabText}>My Customer</span>
                                </div>}
                                <div
                                    style={{ ...styles.tab, ...(selectedTab === 1 ? styles.activeTab : {}), cursor: 'pointer' }}
                                    onClick={() => setSelectedTab(1)}
                                >
                                    <span style={styles.tabText}>{reqUserId === propertyAgentId ? "Other's Customer" : "My Customer"}</span>
                                </div>
                            </div>
                            <div style={{ overflowY: 'auto', flex: 1 }}>
                                {selectedTab === 0 && (
                                    matchedCustomerDetailsMine.length > 0 ? matchedCustomerDetailsMine.map((item, index) => {
                                        if (item.customer_locality.property_type === "Residential") {
                                            if (item.customer_locality.property_for === "Rent") {
                                                return (
                                                    <div key={index} onClick={() => navigateToDetails(item, "Residential", "Rent")} style={{ cursor: 'pointer' }}>
                                                        <ContactResidentialRentCard navigation={navigation} item={item} deleteMe={deleteMe} closeMe={closeMe}
                                                            navigatedFrom={"MatchedCustomers"} displayMatchCount={false} displayMatchPercent={true} />
                                                        <div style={{ height: 0.5, width: "100%", backgroundColor: "#C8C8C8" }} />
                                                    </div>
                                                );
                                            } else if (item.customer_locality.property_for === "Buy") {
                                                return (
                                                    <div key={index} onClick={() => navigateToDetails(item, "Residential", "Buy")} style={{ cursor: 'pointer' }}>
                                                        <ContactResidentialSellCard navigation={navigation} item={item} deleteMe={deleteMe} closeMe={closeMe}
                                                            displayMatchCount={false} displayMatchPercent={true} />
                                                        <div style={{ height: 0.5, width: "100%", backgroundColor: "#C8C8C8" }} />
                                                    </div>
                                                );
                                            }
                                        } else if (item.customer_locality.property_type === "Commercial") {
                                            if (item.customer_locality.property_for === "Rent") {
                                                return (
                                                    <div key={index} onClick={() => navigateToDetails(item, "Commercial", "Rent")} style={{ cursor: 'pointer' }}>
                                                        <ContactCommercialRentCard navigation={navigation} item={item} deleteMe={deleteMe} closeMe={closeMe}
                                                            navigatedFrom={"MatchedCustomers"} displayMatchCount={false} displayMatchPercent={true} />
                                                        <div style={{ height: 0.5, width: "100%", backgroundColor: "#C8C8C8" }} />
                                                    </div>
                                                );
                                            } else if (item.customer_locality.property_for === "Buy") {
                                                return (
                                                    <div key={index} onClick={() => navigateToDetails(item, "Commercial", "Buy")} style={{ cursor: 'pointer' }}>
                                                        <ContactCommercialBuyCard navigation={navigation} item={item} deleteMe={deleteMe} closeMe={closeMe}
                                                            displayMatchCount={false} displayMatchPercent={true} />
                                                        <div style={{ height: 0.5, width: "100%", backgroundColor: "#C8C8C8" }} />
                                                    </div>
                                                );
                                            }
                                        }
                                        return null;
                                    }) : <div style={{ flex: 1, justifyContent: 'center', alignItems: 'center', display: 'flex', height: '100%' }}>
                                        <span style={{ fontSize: 14 }}>No Matched Customer Found</span>
                                    </div>
                                )}
                                {selectedTab === 1 && (
                                    matchedCustomerDetailsOther.length > 0 ? matchedCustomerDetailsOther.map((item, index) => {
                                        if (item.customer_locality.property_type === "Residential") {
                                            if (item.customer_locality.property_for === "Rent") {
                                                return (
                                                    <div key={index} onClick={() => navigateToDetails(item, "Residential", "Rent")} style={{ cursor: 'pointer' }}>
                                                        <ContactResidentialRentCard navigation={navigation} item={item} deleteMe={deleteMe} closeMe={closeMe}
                                                            navigatedFrom={"MatchedCustomers"} displayMatchCount={false} displayMatchPercent={true} />
                                                        <div style={{ height: 0.5, width: "100%", backgroundColor: "#C8C8C8" }} />
                                                    </div>
                                                );
                                            } else if (item.customer_locality.property_for === "Buy") {
                                                return (
                                                    <div key={index} onClick={() => navigateToDetails(item, "Residential", "Buy")} style={{ cursor: 'pointer' }}>
                                                        <ContactResidentialSellCard navigation={navigation} item={item} deleteMe={deleteMe} closeMe={closeMe}
                                                            displayMatchCount={false} displayMatchPercent={true} />
                                                        <div style={{ height: 0.5, width: "100%", backgroundColor: "#C8C8C8" }} />
                                                    </div>
                                                );
                                            }
                                        } else if (item.customer_locality.property_type === "Commercial") {
                                            if (item.customer_locality.property_for === "Rent") {
                                                return (
                                                    <div key={index} onClick={() => navigateToDetails(item, "Commercial", "Rent")} style={{ cursor: 'pointer' }}>
                                                        <ContactCommercialRentCard navigation={navigation} item={item} deleteMe={deleteMe} closeMe={closeMe}
                                                            navigatedFrom={"MatchedCustomers"} displayMatchCount={false} displayMatchPercent={true} />
                                                        <div style={{ height: 0.5, width: "100%", backgroundColor: "#C8C8C8" }} />
                                                    </div>
                                                );
                                            } else if (item.customer_locality.property_for === "Buy") {
                                                return (
                                                    <div key={index} onClick={() => navigateToDetails(item, "Commercial", "Buy")} style={{ cursor: 'pointer' }}>
                                                        <ContactCommercialBuyCard navigation={navigation} item={item} deleteMe={deleteMe} closeMe={closeMe}
                                                            displayMatchCount={false} displayMatchPercent={true} />
                                                        <div style={{ height: 0.5, width: "100%", backgroundColor: "#C8C8C8" }} />
                                                    </div>
                                                );
                                            }
                                        }
                                        return null;
                                    }) : <div style={{ flex: 1, justifyContent: 'center', alignItems: 'center', display: 'flex', height: '100%' }}>
                                        <span style={{ fontSize: 14 }}>No Matched Customer Found</span>
                                    </div>
                                )}
                            </div>
                            <div style={styles.fab}>
                                <div
                                    onClick={() => toggleSortingBottomNavigationView()}
                                    style={{ ...styles.fabIcon1, cursor: 'pointer' }}
                                >
                                    <MdSort color={"#ffffff"} size={26} />
                                </div>
                                <div style={styles.verticalLine}></div>
                                <div
                                    onClick={() => toggleBottomNavigationView()}
                                    style={{ ...styles.fabIcon2, cursor: 'pointer' }}
                                >
                                    <MdFilterList
                                        color={"#ffffff"}
                                        size={26}
                                    />
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div style={styles.container}></div>
                    )}
                    {/* Bottom for filters */}
                    {visible && (
                        <div style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            backgroundColor: 'rgba(0,0,0,0.5)',
                            zIndex: 1000,
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'flex-end'
                        }} onClick={toggleBottomNavigationView}>
                            <div style={{
                                backgroundColor: "#fff",
                                width: "100%",
                                height: "70%",
                                borderTopLeftRadius: 20,
                                borderTopRightRadius: 20,
                                padding: 20,
                                overflowY: 'auto'
                            }} onClick={e => e.stopPropagation()}>
                                <div style={{ display: 'flex', justifyContent: 'center', position: 'relative' }}>
                                    <span style={{ marginTop: 15, fontSize: 16, fontWeight: "600" }}>
                                        Filter
                                    </span>
                                    <div
                                        onClick={() => resetFilter()}
                                        style={{ position: "absolute", top: 10, right: 10, cursor: 'pointer' }}
                                    >
                                        <MdRestartAlt
                                            color={"#000000"}
                                            size={30}
                                        />
                                    </div>
                                </div>

                                <div style={{ marginTop: 20, marginBottom: 20 }}>
                                    <p style={styles.marginBottom10}>Looking For</p>
                                    <div style={styles.propSubSection}>
                                        <CustomButtonGroup
                                            selectedButtonStyle={{ backgroundColor: "rgba(27, 106, 158, 0.85)" }}
                                            onButtonPress={(index) => selectLookingForIndex(index)}
                                            selectedIndices={[lookingForIndex]}
                                            buttons={lookingForArray.map(item => ({ text: item }))}
                                            buttonTextStyle={{ textAlign: "center" }}
                                            selectedButtonTextStyle={{ color: "#fff" }}
                                            containerStyle={{ borderRadius: 10, width: '100%' }}
                                        />
                                    </div>
                                    <p style={styles.marginBottom10}>Home type</p>
                                    <div style={styles.propSubSection}>
                                        <CustomButtonGroup
                                            selectedButtonStyle={{ backgroundColor: "rgba(27, 106, 158, 0.85)" }}
                                            onButtonPress={(index) => selectHomeTypeIndex(index)}
                                            selectedIndices={[homeTypeIndex]}
                                            buttons={homeTypeArray.map(item => ({ text: item }))}
                                            buttonTextStyle={{ textAlign: "center" }}
                                            selectedButtonTextStyle={{ color: "#fff" }}
                                            containerStyle={{ borderRadius: 10, width: '100%' }}
                                        />
                                    </div>
                                    <p style={styles.marginBottom10}>BHK type</p>
                                    <div style={styles.propSubSection}>
                                        <CustomButtonGroup
                                            selectedButtonStyle={{ backgroundColor: "rgba(27, 106, 158, 0.85)" }}
                                            onButtonPress={(index) => selectBHKTypeIndex(index)}
                                            selectedIndices={[bhkTypeIndex]}
                                            buttons={bhkTypeArray.map(item => ({ text: item }))}
                                            buttonTextStyle={{ textAlign: "center" }}
                                            selectedButtonTextStyle={{ color: "#fff" }}
                                            containerStyle={{ borderRadius: 10, width: '100%' }}
                                        />
                                    </div>
                                    {lookingForIndex === -1 ? null : lookingForIndex === 0 ? (
                                        <div>
                                            <p>Rent Range</p>
                                            <div
                                                style={{
                                                    flexDirection: "row",
                                                    justifyContent: "space-between",
                                                    marginTop: 10,
                                                    display: 'flex'
                                                }}
                                            >
                                                <div>
                                                    <span style={{ color: "rgba(108, 122, 137, 1)" }}>
                                                        {numDifferentiation(minRent)}
                                                    </span>
                                                    <span style={{ color: "rgba(108, 122, 137, 1)", marginLeft: 5 }}>Min</span>
                                                </div>
                                                <div>
                                                    <span style={{ color: "rgba(108, 122, 137, 1)" }}>
                                                        {numDifferentiation(maxRent)}
                                                    </span>
                                                    <span style={{ color: "rgba(108, 122, 137, 1)", marginLeft: 5 }}>Max</span>
                                                </div>
                                            </div>

                                            <Slider
                                                min={5000}
                                                max={500000}
                                                step={5000}
                                                onSlide={values => setRentRange(values)}
                                            />
                                        </div>
                                    ) : (
                                        <div>
                                            <p>Sell Price Range</p>
                                            <div
                                                style={{
                                                    flexDirection: "row",
                                                    justifyContent: "space-between",
                                                    marginTop: 10,
                                                    display: 'flex'
                                                }}
                                            >
                                                <div>
                                                    <span style={{ color: "rgba(108, 122, 137, 1)" }}>
                                                        {numDifferentiation(minSell)}
                                                    </span>
                                                    <span style={{ color: "rgba(108, 122, 137, 1)", marginLeft: 5 }}>Min</span>
                                                </div>
                                                <div>
                                                    <span style={{ color: "rgba(108, 122, 137, 1)" }}>
                                                        {numDifferentiation(maxSell)}
                                                    </span>
                                                    <span style={{ color: "rgba(108, 122, 137, 1)", marginLeft: 5 }}>Max</span>
                                                </div>
                                            </div>
                                            <SliderX
                                                min={minSell}
                                                max={maxSell}
                                                step={500000}
                                                onSlide={values => setSellRange(values)}
                                            />
                                        </div>
                                    )}
                                    <p style={styles.marginBottom10}>Availability</p>
                                    <div style={styles.propSubSection}>
                                        <CustomButtonGroup
                                            selectedButtonStyle={{ backgroundColor: "rgba(27, 106, 158, 0.85)" }}
                                            onButtonPress={(index) => selectAvailabilityIndex(index)}
                                            selectedIndices={[availabilityIndex]}
                                            buttons={availabilityArray.map(item => ({ text: item }))}
                                            buttonTextStyle={{ textAlign: "center" }}
                                            selectedButtonTextStyle={{ color: "#fff" }}
                                            containerStyle={{ borderRadius: 10, width: '100%' }}
                                        />
                                    </div>
                                    <p style={styles.marginBottom10}>Furnishing</p>
                                    <div style={styles.propSubSection}>
                                        <CustomButtonGroup
                                            selectedButtonStyle={{ backgroundColor: "rgba(27, 106, 158, 0.85)" }}
                                            onButtonPress={(index) => selectFurnishingIndex(index)}
                                            selectedIndices={[furnishingIndex]}
                                            buttons={furnishingStatusArray.map(item => ({ text: item }))}
                                            buttonTextStyle={{ textAlign: "center" }}
                                            selectedButtonTextStyle={{ color: "#fff" }}
                                            containerStyle={{ borderRadius: 10, width: '100%' }}
                                        />
                                    </div>
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

                    {/* Bottom sheet for sorting */}
                    {visibleSorting && (
                        <div style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            backgroundColor: 'rgba(0,0,0,0.5)',
                            zIndex: 1000,
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'flex-end'
                        }} onClick={toggleSortingBottomNavigationView}>
                            <div style={{
                                backgroundColor: "#fff",
                                width: "100%",
                                height: "50%",
                                borderTopLeftRadius: 20,
                                borderTopRightRadius: 20,
                                padding: 20,
                                overflowY: 'auto'
                            }} onClick={e => e.stopPropagation()}>
                                <div style={{ display: 'flex', justifyContent: 'center', position: 'relative' }}>
                                    <span style={{ marginTop: 15, fontSize: 16, fontWeight: "600" }}>
                                        Sort By
                                    </span>
                                    <div
                                        onClick={() => resetSortBy()}
                                        style={{ position: "absolute", top: 10, right: 10, cursor: 'pointer' }}
                                    >
                                        <MdRestartAlt
                                            color={"#000000"}
                                            size={30}
                                        />
                                    </div>
                                </div>

                                <div style={{ marginTop: 10, marginBottom: 20 }}>
                                    <p style={styles.marginBottom10}>Customer Looking For</p>
                                    <div style={styles.propSubSection}>
                                        <ButtonGroup
                                            selectedBackgroundColor="rgba(27, 106, 158, 0.85)"
                                            onPress={selectLookingForIndexSortBy}
                                            selectedIndex={lookingForIndexSortBy}
                                            buttons={lookingForArraySortBy}
                                            textStyle={{ textAlign: "center" }}
                                            selectedTextStyle={{ color: "#fff" }}
                                            containerStyle={{ borderRadius: 10, width: '100%' }}
                                            containerBorderRadius={10}
                                        />
                                    </div>
                                    <p style={styles.marginBottom10}>Name</p>
                                    <div style={styles.propSubSection}>
                                        <ButtonGroup
                                            selectedBackgroundColor="rgba(27, 106, 158, 0.85)"
                                            onPress={sortByName}
                                            selectedIndex={sortByNameIndex}
                                            buttons={sortByNameArray}
                                            textStyle={{ textAlign: "center" }}
                                            selectedTextStyle={{ color: "#fff" }}
                                            containerStyle={{ borderRadius: 10, width: '100%' }}
                                            containerBorderRadius={10}
                                        />
                                    </div>

                                    <p style={styles.marginBottom10}>Posted date</p>
                                    <div style={styles.propSubSection}>
                                        <ButtonGroup
                                            selectedBackgroundColor="rgba(27, 106, 158, 0.85)"
                                            onPress={sortByPostedDate}
                                            selectedIndex={sortByPostedDateIndex}
                                            buttons={sortByPostedDateArray}
                                            textStyle={{ textAlign: "center" }}
                                            selectedTextStyle={{ color: "#fff" }}
                                            containerStyle={{ borderRadius: 10, width: '100%' }}
                                            containerBorderRadius={10}
                                        />
                                    </div>
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

                </div>}
        </div>
    );
};

const styles = {
    container: {
        flex: 1,
        margin: 5,
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        height: '100%'
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
    },
    tabContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignContent: 'center',
        backgroundColor: "#FFFFFF",
        paddingBottom: 15,
        paddingTop: 10,
        display: 'flex'
    },
    tab: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 20,
        backgroundColor: '#f0f0f0',
        marginLeft: 20,
    },
    activeTab: {
        backgroundColor: " rgba(102, 204, 153, .9)",
    },
    tabText: {
        color: '#000',
    },
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
)(MatchedCustomers);
