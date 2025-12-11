import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { connect } from "react-redux";
import { SERVER_URL } from "./../../utils/Constant";
import {
    setCustomerDetailsForMeeting,
    setStartNavigationPoint,
    setCustomerDetails,
    setUserDetails
} from "./../../reducers/Action";
import axios from "axios";
import { camalize } from "../../utils/methods";
import { MdChevronLeft, MdManageAccounts, MdAddBusiness, MdPersonAdd } from "react-icons/md";
import { IoMdClose, IoMdCall, IoMdAlarm, IoMdPin } from "react-icons/io";
import CustomButtonGroup from "./../../components/CustomButtonGroup";

const EmployeeCard = props => {
    const navigate = useNavigate();
    const {
        // navigation,
        item,
        disableDrawer = false,
        displayCheckBox = false,
        deleteMe,
        displayMatchPercent = false,
        itemForAddEmplyee = null,
    } = props;

    const [modalVisible, setModalVisible] = useState(false);
    const [index, setIndex] = useState(-1);
    const [refresh, setRefresh] = useState(false);
    const [loading, setLoading] = useState(false);
    const [drawerOpen, setDrawerOpen] = useState(false);

    const {
        assigned_residential_rent_properties = [],
        assigned_residential_sell_properties = [],
        assigned_commercial_rent_properties = [],
        assigned_commercial_sell_properties = [],
        assigned_residential_rent_customers = [],
        assigned_residential_buy_customers = [],
        assigned_commercial_rent_customers = [],
        assigned_commercial_buy_customers = [],
    } = item || {};

    const totalAssignedProperties =
        (assigned_residential_rent_properties?.length || 0) +
        (assigned_residential_sell_properties?.length || 0) +
        (assigned_commercial_rent_properties?.length || 0) +
        (assigned_commercial_sell_properties?.length || 0);

    const totalAssignedCustomers =
        (assigned_residential_rent_customers?.length || 0) +
        (assigned_residential_buy_customers?.length || 0) +
        (assigned_commercial_rent_customers?.length || 0) +
        (assigned_commercial_buy_customers?.length || 0);

    const isChecked = (item) => {
        const {
            assigned_residential_rent_properties,
            assigned_residential_sell_properties,
            assigned_commercial_rent_properties,
            assigned_commercial_sell_properties,
            assigned_residential_rent_customers,
            assigned_residential_buy_customers,
            assigned_commercial_rent_customers,
            assigned_commercial_buy_customers
        } = item;

        let isProperty = false;
        let isCustomer = false;
        if (!itemForAddEmplyee || !itemForAddEmplyee.property_id) {
            isCustomer = true;
        }
        else if (!itemForAddEmplyee || !itemForAddEmplyee.customer_id) {
            isProperty = true;
        }

        let isForRent = false;
        let isForSell = false;
        let isCommercial = false;
        let isResidential = false;

        if (isProperty) {
            if (!itemForAddEmplyee || itemForAddEmplyee.property_for === undefined || itemForAddEmplyee.property_for === null) {
                isForRent = false;
            } else {
                isForRent = itemForAddEmplyee.property_for === "Rent";
            }
            if (!itemForAddEmplyee || itemForAddEmplyee.property_for === undefined || itemForAddEmplyee.property_for === null) {
                isForSell = false;
            } else {
                isForSell = itemForAddEmplyee.property_for === "Sell" || itemForAddEmplyee.property_for === "Buy";
            }

            if (!itemForAddEmplyee || itemForAddEmplyee.property_type === undefined || itemForAddEmplyee.property_type === null) {
                isCommercial = false;
            } else {
                isCommercial = itemForAddEmplyee.property_type === "Commercial";
            }
            if (!itemForAddEmplyee || itemForAddEmplyee.property_type === undefined || itemForAddEmplyee.property_type === null) {
                isResidential = false;
            } else {
                isResidential = itemForAddEmplyee.property_type === "Residential";
            }

            if (isResidential && isForRent) {
                return Array.isArray(assigned_residential_rent_properties) && assigned_residential_rent_properties.includes(itemForAddEmplyee.property_id);
            } else if (isResidential && isForSell) {
                return Array.isArray(assigned_residential_sell_properties) && assigned_residential_sell_properties.includes(itemForAddEmplyee.property_id);
            } else if (isCommercial && isForRent) {
                return Array.isArray(assigned_commercial_rent_properties) && assigned_commercial_rent_properties.includes(itemForAddEmplyee.property_id);
            } else if (isCommercial && isForSell) {
                return Array.isArray(assigned_commercial_sell_properties) && assigned_commercial_sell_properties.includes(itemForAddEmplyee.property_id);
            }
        } else if (isCustomer) {
            isForRent = itemForAddEmplyee.customer_locality.property_for === "Rent";
            isForSell = itemForAddEmplyee.customer_locality.property_for === "Sell" || itemForAddEmplyee.customer_locality.property_for === "Buy";

            isCommercial = itemForAddEmplyee.customer_locality.property_type === "Commercial";
            isResidential = itemForAddEmplyee.customer_locality.property_type === "Residential";
            if (isResidential && isForRent) {
                return Array.isArray(assigned_residential_rent_customers) && assigned_residential_rent_customers.includes(itemForAddEmplyee.customer_id);
            } else if (isResidential && isForSell) {
                return Array.isArray(assigned_residential_buy_customers) && assigned_residential_buy_customers.includes(itemForAddEmplyee.customer_id);
            } else if (isCommercial && isForRent) {
                return Array.isArray(assigned_commercial_rent_customers) && assigned_commercial_rent_customers.includes(itemForAddEmplyee.customer_id);
            } else if (isCommercial && isForSell) {
                return Array.isArray(assigned_commercial_buy_customers) && assigned_commercial_buy_customers.includes(itemForAddEmplyee.customer_id);
            }
        }

        return false;
    };

    const openPropertiesList = item => {
        navigate("/profile/PropertyListing", {
            state: {
                item: item,
                displayMatchCount: true,
                displayMatchPercent: false,
                displayCheckBoxForEmployee: true,
                disableDrawer: true,
                displayFilterButton: false
            }
        });
    };
    const openCustomerList = item => {
        navigate("/profile/ContactsListing", {
            state: {
                employeeObj: item,
                displayMatchCount: true,
                displayMatchPercent: false,
                displayCheckBoxForEmployee: true,
                disableDrawer: true,
                displayFilterButton: false
            }
        });
    };

    const updateIndex = (index, button) => {
        setIndex(index);
        if (index === 0) {
            deleteMe(item);
            setModalVisible(false);
            setDrawerOpen(false);
        }
        if (index === 1) {
            setModalVisible(false);
        }
    };

    const ShowSlidingDrawer = () => {
        setDrawerOpen(!drawerOpen);
    };

    const makeCall = mobile => {
        window.open(`tel:${mobile}`);
    };

    const editEmployee = async (empData) => {
        try {
            navigate("/profile/ManageEmployee", { state: { empData: empData, editEmp: true } });
        } catch (error) {
            alert(error.message);
        }
    };

    const onClickCheckBox = (item) => {
        const wasChecked = isChecked(item);
        let operation = "add";
        if (wasChecked) {
            operation = "remove";
        }

        const {
            assigned_residential_rent_properties,
            assigned_residential_sell_properties,
            assigned_commercial_rent_properties,
            assigned_commercial_sell_properties,
            assigned_residential_rent_customers,
            assigned_residential_buy_customers,
            assigned_commercial_rent_customers,
            assigned_commercial_buy_customers,
        } = item;

        let isProperty = false;
        let isCustomer = false;
        if (!itemForAddEmplyee || !itemForAddEmplyee.property_id) {
            isCustomer = true;
        } else if (!itemForAddEmplyee || !itemForAddEmplyee.customer_id) {
            isProperty = true;
        }

        let isForRent = false;
        let isForSell = false;
        let isCommercial = false;
        let isResidential = false;

        if (isProperty) {
            if (!itemForAddEmplyee || itemForAddEmplyee.property_for === undefined || itemForAddEmplyee.property_for === null) {
                isForRent = false;
            } else {
                isForRent = itemForAddEmplyee.property_for === "Rent";
            }
            if (!itemForAddEmplyee || itemForAddEmplyee.property_for === undefined || itemForAddEmplyee.property_for === null) {
                isForSell = false;
            } else {
                isForSell = itemForAddEmplyee.property_for === "Sell" || itemForAddEmplyee.property_for === "Buy";
            }

            if (!itemForAddEmplyee || itemForAddEmplyee.property_type === undefined || itemForAddEmplyee.property_type === null) {
                isCommercial = false;
            } else {
                isCommercial = itemForAddEmplyee.property_type === "Commercial";
            }
            if (!itemForAddEmplyee || itemForAddEmplyee.property_type === undefined || itemForAddEmplyee.property_type === null) {
                isResidential = false;
            } else {
                isResidential = itemForAddEmplyee.property_type === "Residential";
            }

            if (isResidential && isForRent) {
                toggleSelection(assigned_residential_rent_properties, itemForAddEmplyee.property_id);
            } else if (isResidential && isForSell) {
                toggleSelection(assigned_residential_sell_properties, itemForAddEmplyee.property_id);
            } else if (isCommercial && isForRent) {
                toggleSelection(assigned_commercial_rent_properties, itemForAddEmplyee.property_id);
            } else if (isCommercial && isForSell) {
                toggleSelection(assigned_commercial_sell_properties, itemForAddEmplyee.property_id);
            }
        } else if (isCustomer) {
            isForRent = itemForAddEmplyee.customer_locality.property_for === "Rent";
            isForSell = itemForAddEmplyee.customer_locality.property_for === "Sell" || itemForAddEmplyee.customer_locality.property_for === "Buy";

            isCommercial = itemForAddEmplyee.customer_locality.property_type === "Commercial";
            isResidential = itemForAddEmplyee.customer_locality.property_type === "Residential";

            if (isResidential && isForRent) {
                toggleSelection(assigned_residential_rent_customers, itemForAddEmplyee.customer_id);
            } else if (isResidential && isForSell) {
                toggleSelection(assigned_residential_buy_customers, itemForAddEmplyee.customer_id);
            } else if (isCommercial && isForRent) {
                toggleSelection(assigned_commercial_rent_customers, itemForAddEmplyee.customer_id);
            } else if (isCommercial && isForSell) {
                toggleSelection(assigned_commercial_buy_customers, itemForAddEmplyee.customer_id);
            }
        }
        const whatToUpdateData = {
            isProperty: isProperty,
            isCustomer: isCustomer,
            isForRent: isForRent,
            isForSell: isForSell,
            isCommercial: isCommercial,
            isResidential: isResidential,
            customer_id: itemForAddEmplyee.customer_id || null,
            property_id: itemForAddEmplyee.property_id || null,
        }
        const isUpdated = updatePropertiesForEmployee(item, whatToUpdateData, operation);
        if (!isUpdated) {
            toggleSelection(assigned_residential_rent_properties, itemForAddEmplyee.property_id);
            itemForAddEmplyee.assigned_to_employee.push(item.id);
            itemForAddEmplyee.assigned_to_employee_name.push(item.name);
        }

        setRefresh(!refresh);
    };

    const toggleSelection = (list, id) => {
        const index = list.indexOf(id);
        if (index > -1) {
            list.splice(index, 1);
        } else {
            list.push(id);
        }
    };

    const updatePropertiesForEmployee = async (item, whatToUpdateData, operation) => {
        const userObj = {
            req_user_id: props.userDetails.works_for,
            employee_id: item.id,
            employee_name: item.name,
            operation: operation,
            what_to_update_data: whatToUpdateData,
            user_data: item,
        }
        try {
            axios(SERVER_URL + "/updatePropertiesForEmployee", {
                method: "post",
                headers: {
                    "Content-type": "Application/json",
                    Accept: "Application/json"
                },
                data: userObj
            }).then(
                response => {
                    if (response.data === "success") {
                        return true;
                    } else {
                        return false;
                    }
                },
                error => {
                    console.log(error);
                }
            );
        } catch (error) {
            console.error('Failed to fetch user:', error);
        } finally {
            setLoading(false);
        }
    };

    const onClickMeeting = item => {
        props.setCustomerDetailsForMeeting(null);
        props.setStartNavigationPoint("PropertyListForMeeting");
        props.setCustomerDetails(item);
        navigate("CustomerMeeting", {
            item: item,
            category: "customer"
        });
    };

    return (
        <div style={styles.card}>
            <div style={styles.MainContainer}>
                <div
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "flex-start",
                        backgroundColor: "#ffffff",
                        justifyContent: 'center',
                        position: 'relative'
                    }}
                >
                    <div style={{ marginLeft: !displayMatchPercent ? 10 : 0, alignItems: 'center', marginBottom: 5, justifyContent: 'center', display: 'flex', flexDirection: 'column' }}>
                        <div style={{
                            width: 55,
                            height: 55,
                            backgroundColor: '#ccc',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: '1px solid rgba(127,255,212, .9)'
                        }}>
                            <span style={{ color: "rgba(105,105,105, .9)", fontSize: 20 }}>
                                {item.name && item.name.slice(0, 1)}
                            </span>
                        </div>
                        {item.employee_role == "admin" ?
                            <span style={{ fontSize: 15, fontWeight: 500, color: "rgba(255, 34, 0, 1)" }}>{camalize(item.employee_role)} </span> :
                            item.employee_role == "master" ?
                                <span style={{ fontSize: 15, fontWeight: 500, color: "rgba(249, 105, 14, .8)" }}>{camalize(item.employee_role)} </span> :
                                item.employee_role == "add" ?
                                    <span style={{ fontSize: 15, fontWeight: 500, color: "rgba(3, 147, 237, 1)" }}>{camalize(item.employee_role)} </span> :
                                    <span style={{ fontSize: 15, fontWeight: 500, color: "rgba(22, 160, 133, 1)" }}>{camalize(item.employee_role)} </span>}
                    </div>
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "space-between",
                            flex: 1
                        }}
                    >
                        <div style={{ paddingLeft: 20, paddingTop: 20, display: 'flex', flexDirection: 'column' }}>
                            <span style={styles.title}>{item.name} </span>
                            <span style={styles.subTitle}>
                                {item.mobile}
                            </span>
                        </div>
                    </div>
                </div>

                {displayCheckBox ? (
                    <div
                        style={{
                            position: "absolute",
                            top: 10,
                            right: 10,
                            zIndex: 1000,
                        }}
                    >
                        <input
                            type="checkbox"
                            onChange={() => {
                                onClickCheckBox(item);
                                setRefresh(!refresh);
                            }}
                            checked={isChecked(item)}
                            style={{ width: 20, height: 20 }}
                        />
                    </div>
                ) : null}

                {!disableDrawer && (
                    <div
                        style={{
                            ...styles.drawer,
                            ...styles.drawer,
                            position: 'absolute',
                            right: 0,
                            top: 0,
                            bottom: 0,
                            height: '50%',
                            display: 'flex',
                            flexDirection: 'row',
                            zIndex: 100
                        }}
                    >
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            backgroundColor: '#545454',
                            height: '67%',
                            width: 40
                        }} onClick={ShowSlidingDrawer}>
                            <MdChevronLeft color={"#ffffff"} size={30} style={{ transform: drawerOpen ? "rotate(180deg)" : "rotate(0deg)" }} />
                        </div>
                        {drawerOpen && (
                            <div style={styles.Main_Sliding_Drawer_Container}>
                                <div
                                    onClick={() => {
                                        setModalVisible(true);
                                    }}
                                    style={{ padding: 15, backgroundColor: "#e57373", cursor: 'pointer' }}
                                >
                                    <IoMdClose color={"#ffffff"} size={30} />
                                </div>

                                <div
                                    onClick={() => editEmployee(item)}
                                    style={{ padding: 15, backgroundColor: "#0091ea", cursor: 'pointer' }}
                                >
                                    <MdManageAccounts color={"#ffffff"} size={30} />
                                </div>
                                <div
                                    onClick={() => makeCall(item.mobile)}
                                    style={{ padding: 15, backgroundColor: "#00bfa5", cursor: 'pointer' }}
                                >
                                    <IoMdCall color={"#ffffff"} size={30} />
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <div
                style={{
                    display: "flex",
                    flexDirection: "row",
                    paddingLeft: 30, backgroundColor: "rgba(220,220,220, .2)",
                    alignItems: 'center'
                }}>
                <IoMdPin
                    color={"#000"}
                    size={16}
                    style={{ marginLeft: 10, marginTop: 10 }}
                />
                <span style={{ ...styles.subTitleA, marginLeft: 10, marginRight: 10, paddingTop: 5, paddingBottom: 5 }}>
                    {item.company_name}
                </span>
            </div>

            <div
                style={styles.detailsContainer}
            >
                <div style={{ ...styles.details, marginLeft: 10, marginRight: 10, marginBottom: 10 }}>
                    <div
                        style={{ display: "flex", flexDirection: "row", alignItems: "center", cursor: 'pointer' }}
                        onClick={() => {
                            openPropertiesList(item);
                        }}
                    >
                        <div style={styles.subDetails}>
                            <span style={{ ...styles.subDetailsValue, marginTop: 0 }}>
                                Properties
                            </span>
                            <span style={styles.subDetailsTitle}>{totalAssignedProperties}</span>
                        </div>
                        <div>
                            <MdAddBusiness
                                color={"rgba(108, 122, 137, 1)"}
                                size={25}
                                style={{ marginLeft: 30, marginTop: 0 }}
                            />
                        </div>
                    </div>

                    <div style={styles.verticalLine}></div>
                    <div
                        style={{ display: "flex", flexDirection: "row", alignItems: "center", cursor: 'pointer' }}
                        onClick={() => {
                            openCustomerList(item);
                        }}
                    >
                        <div>
                            <MdPersonAdd
                                color={"rgba(63, 195, 128, .6)"}
                                size={27}
                                style={{ marginRight: 30, marginTop: 0 }}
                            />
                        </div>
                        <div style={styles.subDetails}>
                            <span style={styles.subDetailsValue}>
                                Customers
                            </span>
                            <span style={styles.subDetailsTitle}>{totalAssignedCustomers}</span>
                        </div>
                    </div>
                </div>
            </div>

            {modalVisible && (
                <div style={styles.centeredView1}>
                    <div style={styles.modalView}>
                        <span style={styles.modalText}>
                            Sure want to delete this employee?
                        </span>
                        <span style={styles.modalTextSub}>
                            This action can not be undone and remove this employee reference from every where.
                        </span>
                        <CustomButtonGroup
                            buttons={[{ text: "Yes" }, { text: "No" }]}
                            onButtonPress={updateIndex}
                            selectedIndex={index}
                            width={100}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

const styles = {
    card: {
        backgroundColor: "#ffffff",
        borderRadius: 10,
        margin: 10,
        boxShadow: "0px 2px 4px rgba(0,0,0,0.2)",
        overflow: 'hidden',
        position: 'relative'
    },
    MainContainer: {
        display: 'flex',
        flexDirection: 'column'
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#000"
    },
    subTitle: {
        fontSize: 14,
        color: "#666"
    },
    subTitleA: {
        fontSize: 14,
        color: "#000"
    },
    detailsContainer: {
        padding: 10
    },
    details: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    subDetails: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
    },
    subDetailsValue: {
        fontSize: 12,
        color: "#666"
    },
    subDetailsTitle: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#000"
    },
    verticalLine: {
        width: 1,
        height: 40,
        backgroundColor: "#ccc"
    },
    drawer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center'
    },
    Main_Sliding_Drawer_Container: {
        display: 'flex',
        flexDirection: 'row',
        backgroundColor: '#fff',
        height: '100%',
        alignItems: 'center'
    },
    centeredView1: {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0,0,0,0.5)',
        zIndex: 1000,
        display: 'flex',
        justifyContent: "center",
        alignItems: "center",
    },
    modalView: {
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        boxShadow: "0px 2px 4px rgba(0,0,0,0.25)",
        display: 'flex',
        flexDirection: 'column',
        gap: 20
    },
    modalText: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#000'
    },
    modalTextSub: {
        fontSize: 14,
        textAlign: 'center',
        color: '#666'
    }
};

const mapStateToProps = state => ({
    userDetails: state.AppReducer.userDetails,
    customerDetailsForMeeting: state.AppReducer.customerDetailsForMeeting
});
const mapDispatchToProps = {
    setUserDetails,
    setCustomerDetailsForMeeting,
    setStartNavigationPoint,
    setCustomerDetails
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(EmployeeCard);
