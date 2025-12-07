import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import {
    setUserMobile,
    setUserDetails,
    setPropReminderList,
    setCustomerListForMeeting
} from "./../../reducers/Action";
import ContactResidentialRentCard from "../contacts/residential/rent/ContactResidentialRentCard";
import ContactResidentialSellCard from "../contacts/residential/buy/ContactResidentialSellCard";
import CustomerCommercialRentCard from "../contacts/commercial/rent/CustomerCommercialRentCard";
import CustomerCommercialBuyCard from "../contacts/commercial/buy/CustomerCommercialBuyCard";

import { MdSearch, MdSort, MdFilterList, MdRestartAlt } from "react-icons/md";
import { AiOutlinePlusCircle } from "react-icons/ai";

import axios from "axios";
import { SERVER_URL } from "./../../utils/Constant";
import { EMPLOYEE_ROLE } from "./../../utils/AppConstant";

const CustomerListForMeeting = props => {
    const { navigation } = props;
    const propertyType = props.propertyDetails?.property_type;
    const propertyFor = props.propertyDetails?.property_for;
    const propertyAgentId = props.propertyDetails?.agent_id;
    const [search, setSearch] = useState("");
    const [data, setData] = useState([]);
    const [visible, setVisible] = useState(false);
    const [visibleSorting, setVisibleSorting] = useState(false);
    const [index, setIndex] = useState(null);

    useEffect(() => {
        if (
            props.userDetails &&
            props.userDetails.works_for !== null
        ) {
            getCustomerList();
        }
    }, [props.userDetails]);

    const getCustomerList = () => {
        const queryObj = {
            req_user_id: props.userDetails.works_for,
            agent_id: props.userDetails.works_for,
            property_type: propertyType,
            property_for: propertyFor,
            property_id: props.propertyDetails?.property_id,
            property_agent_id: propertyAgentId
        };
        axios(SERVER_URL + "/getCustomerListForMeeting", {
            method: "post",
            headers: {
                "Content-type": "Application/json",
                Accept: "Application/json"
            },
            data: queryObj
        }).then(
            response => {
                setData(response.data);
                props.setCustomerListForMeeting(response.data);
            },
            error => {
            }
        );
    };

    const ItemView = ({ item }) => {
        if (item.customer_locality.property_type === "Residential") {
            if (item.customer_locality.property_for === "Rent") {
                return (
                    <div
                        onClick={() =>
                            navigation.navigate(
                                "CustomerDetailsResidentialRentFromList",
                                { item: item, displayMatchCount: false }
                            )
                        }
                        style={{ cursor: 'pointer' }}
                    >
                        <ContactResidentialRentCard
                            navigation={navigation}
                            item={item}
                            disableDrawer={true}
                            displayCheckBox={true}
                            navigatedFrom={"dont_show_matched_count"}
                            displayMatchCount={false}
                            displayMatchPercent={true}
                        />
                    </div>
                );
            } else if (item.customer_locality.property_for === "Buy") {
                return (
                    <div
                        onClick={() =>
                            navigation.navigate("CustomerDetailsResidentialBuyFromList", { item: item, displayMatchCount: false })
                        }
                        style={{ cursor: 'pointer' }}
                    >
                        <ContactResidentialSellCard
                            navigation={navigation}
                            item={item}
                            disableDrawer={true}
                            displayCheckBox={true}
                            navigatedFrom={"dont_show_matched_count"}
                            displayMatchCount={false}
                            displayMatchPercent={true}
                        />
                    </div>
                );
            }
        } else if (item.customer_locality.property_type === "Commercial") {
            if (item.customer_locality.property_for === "Rent") {
                return (
                    <div
                        onClick={() =>
                            navigation.navigate(
                                "CustomerDetailsCommercialRentFromList",
                                { item: item, displayMatchCount: false }
                            )
                        }
                        style={{ cursor: 'pointer' }}
                    >
                        <CustomerCommercialRentCard
                            navigation={navigation}
                            item={item}
                            disableDrawer={true}
                            displayCheckBox={true}
                            navigatedFrom={"dont_show_matched_count"}
                            displayMatchCount={false}
                            displayMatchPercent={true}
                        />
                    </div>
                );
            } else if (item.customer_locality.property_for === "Buy") {
                return (
                    <div
                        onClick={() =>
                            navigation.navigate("CustomerDetailsCommercialBuyFromList", { item: item, displayMatchCount: false })
                        }
                        style={{ cursor: 'pointer' }}
                    >
                        <CustomerCommercialBuyCard
                            navigation={navigation}
                            item={item}
                            disableDrawer={true}
                            displayCheckBox={true}
                            navigatedFrom={"dont_show_matched_count"}
                            displayMatchCount={false}
                            displayMatchPercent={true}
                        />
                    </div>
                );
            }
        }
        return null;
    };

    const navigateTo = () => {
        navigation.navigate("AddNewCustomerStack");
    };

    const searchFilterFunction = text => {
        if (text) {
            const newData = props.customerListForMeeting.filter(function (item) {
                const itemData =
                    item.customer_details.name +
                    item.customer_details.address +
                    item.customer_details.mobile1 +
                    item.customer_locality.location_area.map(item => item.main_text).join(', ') +
                    item.customer_id;

                const textData = text.toUpperCase();
                return itemData.toUpperCase().indexOf(textData) > -1;
            });
            setData(newData);
            setSearch(text);
        } else {
            setData(props.customerListForMeeting);
            setSearch(text);
        }
    };

    useEffect(() => {
        if (props.residentialCustomerList.length > 0 || props.commercialCustomerList.length) {
            getCustomerList();
        }
    }, [props.residentialCustomerList, props.commercialCustomerList])

    return (
        <div style={{ flex: 1, height: '100vh', display: 'flex', flexDirection: 'column' }}>
            <div style={styles.searchBarContainer}>
                <div style={styles.searchBar}>
                    <MdSearch size={20} color="#999" style={{ marginRight: 5, }} />
                    <input
                        style={styles.textInputStyle}
                        onChange={e => searchFilterFunction(e.target.value)}
                        value={search}
                        placeholder="Search By Name, Address, Id, Mobile"
                    />
                </div>
            </div>
            {data.length > 0 ? (
                <div style={styles.container}>
                    <div style={{ overflowY: 'auto', flex: 1 }}>
                        {data.map((item, index) => (
                            <div key={index}>
                                <ItemView item={item} />
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
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
                    <span style={{ textAlign: "center" }}>You have no customer</span>
                    {props.userDetails && ((props.userDetails.works_for === props.userDetails.id) ||
                        (props.userDetails.user_type === "employee" && EMPLOYEE_ROLE.includes(props.userDetails.employee_role)
                        )) ?
                        <div onClick={() => navigateTo()} style={{ cursor: 'pointer' }}>
                            <span
                                style={{ color: "#00BFFF", textAlign: "center", marginTop: 20 }}
                            >
                                Add New Customer
                            </span>
                        </div> : null}
                </div>
            )}
            {props.userDetails && ((props.userDetails.works_for === props.userDetails.id) ||
                (props.userDetails.user_type === "employee" && EMPLOYEE_ROLE.includes(props.userDetails.employee_role)
                ))
            }
        </div>
    );
};

const styles = {
    container: {
        flex: 1,
        margin: 5,
        display: 'flex',
        flexDirection: 'column',
        height: '100%'
    },
    searchBarContainer: {
        padding: 10
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 8,
        paddingHorizontal: 10,
        paddingVertical: 5,
        boxShadow: '0px 2px 4px rgba(0,0,0,0.2)',
        display: 'flex'
    },
    textInputStyle: {
        width: "100%",
        height: 30,
        paddingLeft: 10,
        border: 'none',
        outline: 'none',
        fontSize: 16
    },
};

const mapStateToProps = state => ({
    userDetails: state.AppReducer.userDetails,
    propReminderList: state.AppReducer.propReminderList,
    customerListForMeeting: state.AppReducer.customerListForMeeting,
    propertyDetails: state.AppReducer.propertyDetails,
    commercialCustomerList: state.AppReducer.commercialCustomerList,
    residentialCustomerList: state.AppReducer.residentialCustomerList
});

const mapDispatchToProps = {
    setUserMobile,
    setUserDetails,
    setPropReminderList,
    setCustomerListForMeeting
};
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(CustomerListForMeeting);
