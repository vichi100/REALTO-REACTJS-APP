import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import {
    MdSort,
    MdFilterList,
    MdRestartAlt,
    MdSearch,
    MdAddCircleOutline
} from "react-icons/md";
import { AiOutlinePlusCircle } from "react-icons/ai";
// import { ButtonGroup } from "@rneui/themed";
import CustomButtonGroup from "./../../components/CustomButtonGroup";
import Button from "./../../components/Button";
import Slider from "./../../components/Slider";
import CardResidentialRent from "../property/residential/rent/ResidentialRentCard";
import CardResidentialSell from "../property/residential/sell/ResidentialSellCard";
import axios from "axios";
import { SERVER_URL } from "./../../utils/Constant";
import { EMPLOYEE_ROLE } from "./../../utils/AppConstant";
import CardRent from "../property/commercial/rent/CommercialRentCard";
import CardSell from "../property/commercial/sell/CommercialSellCard";
import { setPropertyListingForMeeting } from "./../../reducers/Action";

const PropertyListForMeeting = props => {
    const { navigation } = props;
    const customerDetails = props.customerDetails || {};
    const propertyType = customerDetails.customer_locality?.property_type;
    const propertyFor = customerDetails.customer_locality?.property_for;
    const [search, setSearch] = useState("");
    const [data, setData] = useState([]);
    const [index, setIndex] = useState(null);

    const [visible, setVisible] = useState(false);
    const [visibleSorting, setVisibleSorting] = useState(false);

    useEffect(() => {
        if (
            props.userDetails &&
            props.userDetails.works_for !== null
        ) {
            getListing();
        }
    }, [props.userDetails]);


    useEffect(() => {
        if (props.commercialPropertyList.length > 0 || props.residentialPropertyList.length > 0) {
            getListing()
        }
    }, [props.commercialPropertyList, props.residentialPropertyList])

    const getListing = () => {
        if (!customerDetails.customer_id) return;
        const user = {
            req_user_id: props.userDetails.works_for,
            agent_id: props.userDetails.works_for,
            property_type: propertyType,
            property_for: propertyFor,
            customer_id: customerDetails.customer_id,
            agent_id_of_client: customerDetails.agent_id,
        };
        axios(SERVER_URL + "/getPropertyListingForMeeting", {
            method: "post",
            headers: {
                "Content-type": "Application/json",
                Accept: "Application/json"
            },
            data: user
        }).then(
            response => {
                setData(response.data);
                props.setPropertyListingForMeeting(response.data);
            },
            error => {
            }
        );
    };

    const updateIndex = index => {
        setIndex(index);
    };

    const searchFilterFunction = text => {
        if (text) {
            const newData = props.propertyListingForMeeting.filter(function (item) {
                const itemData =
                    item.property_address.building_name +
                    item.property_address.landmark_or_street +
                    item.property_address.formatted_address +
                    item.owner_details.name +
                    item.owner_details.mobile1;

                const textData = text.toUpperCase();
                return itemData.toUpperCase().indexOf(textData) > -1;
            });
            setData(newData);
            setSearch(text);
        } else {
            setData(props.propertyListingForMeeting);
            setSearch(text);
        }
    };

    const toggleBottomNavigationView = () => {
        setVisible(!visible);
    };

    const toggleSortingBottomNavigationView = () => {
        setVisibleSorting(!visibleSorting);
    };

    const navigateTo = () => {
        navigation.navigate("Add");
    };

    return (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <div style={styles.searchBarContainer}>
                <input
                    style={styles.textInputStyle}
                    onChange={e => searchFilterFunction(e.target.value)}
                    value={search}
                    placeholder="Search by property address, owner"
                />
            </div>
            {data.length > 0 ? (
                <div style={styles.container}>
                    <div style={{ flex: 1 }}>
                        {data.map((item, index) => {
                            if (item.property_type === "Residential") {
                                if (item.property_for === "Rent") {
                                    return (
                                        <div
                                            key={index}
                                            onClick={() => navigation.navigate("PropDetailsFromListing", {
                                                item: item,
                                                displayMatchCount: false,
                                                displayMatchPercent: true
                                            })}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            <CardResidentialRent
                                                navigation={navigation}
                                                item={item}
                                                disableDrawer={true}
                                                displayCheckBox={true}
                                                displayMatchCount={false}
                                                displayMatchPercent={true}
                                            />
                                            <div style={{ height: 0.5, width: "100%", backgroundColor: "#C8C8C8" }} />
                                        </div>
                                    );
                                } else if (item.property_for === "Sell") {
                                    return (
                                        <div
                                            key={index}
                                            onClick={() =>
                                                navigation.navigate("PropDetailsFromListingForSell", {
                                                    item: item,
                                                    displayMatchCount: false,
                                                    displayMatchPercent: true
                                                })
                                            }
                                            style={{ cursor: 'pointer' }}
                                        >
                                            <CardResidentialSell
                                                navigation={navigation}
                                                item={item}
                                                disableDrawer={true}
                                                displayCheckBox={true}
                                                displayMatchCount={false}
                                                displayMatchPercent={true}
                                            />
                                            <div style={{ height: 0.5, width: "100%", backgroundColor: "#C8C8C8" }} />
                                        </div>
                                    );
                                }
                            } else if (item.property_type === "Commercial") {
                                if (item.property_for === "Rent") {
                                    return (
                                        <div
                                            key={index}
                                            onClick={() =>
                                                navigation.navigate("CommercialRentPropDetails", {
                                                    item: item,
                                                    displayMatchCount: false,
                                                    displayMatchPercent: true
                                                })
                                            }
                                            style={{ cursor: 'pointer' }}
                                        >
                                            <CardRent
                                                navigation={navigation}
                                                item={item}
                                                disableDrawer={true}
                                                displayCheckBox={true}
                                                displayMatchCount={false}
                                                displayMatchPercent={true}
                                            />
                                            <div style={{ height: 0.5, width: "100%", backgroundColor: "#C8C8C8" }} />
                                        </div>
                                    );
                                } else if (item.property_for === "Sell") {
                                    return (
                                        <div
                                            key={index}
                                            onClick={() =>
                                                navigation.navigate("CommercialSellPropDetails", {
                                                    item: item,
                                                    displayMatchCount: false,
                                                    displayMatchPercent: true
                                                })
                                            }
                                            style={{ cursor: 'pointer' }}
                                        >
                                            <CardSell
                                                navigation={navigation}
                                                item={item}
                                                disableDrawer={true}
                                                displayCheckBox={true}
                                                displayMatchCount={false}
                                                displayMatchPercent={true}
                                            />
                                            <div style={{ height: 0.5, width: "100%", backgroundColor: "#C8C8C8" }} />
                                        </div>
                                    );
                                }
                            }
                            return null;
                        })}
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
                    <p style={{ textAlign: "center", color: '#000', fontWeight: '500' }}>
                        You have no property listing
                    </p>
                    {props.userDetails && ((props.userDetails.works_for === props.userDetails.id) ||
                        (props.userDetails.user_type === "employee" && EMPLOYEE_ROLE.includes(props.userDetails.employee_role)
                        )) ?
                        <div onClick={() => navigateTo()} style={{ cursor: 'pointer' }}>
                            <span
                                style={{ color: "#00BFFF", textAlign: "center", marginTop: 20 }}
                            >
                                Add New Property
                            </span>
                        </div> : null}
                </div>
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
                                onClick={() => toggleBottomNavigationView()}
                                style={{ position: "absolute", top: 10, right: 10, cursor: 'pointer' }}
                            >
                                <MdRestartAlt
                                    color={"#000000"}
                                    size={30}
                                />
                            </div>
                        </div>

                        <div style={{ marginTop: 10, marginBottom: 20 }}>
                            <p style={styles.marginBottom10}>Looking For</p>
                            <div style={styles.propSubSection}>
                                <CustomButtonGroup
                                    selectedButtonStyle={{ backgroundColor: "rgba(27, 106, 158, 0.85)" }}
                                    onButtonPress={(index) => updateIndex(index)}
                                    selectedIndices={[index]}
                                    buttons={["RENT", "Sell"].map(item => ({ text: item }))}
                                    buttonTextStyle={{ textAlign: "center" }}
                                    selectedButtonTextStyle={{ color: "#fff" }}
                                    containerStyle={{ borderRadius: 10, width: '100%' }}
                                />
                            </div>
                            <p style={styles.marginBottom10}>Home type</p>
                            <div style={styles.propSubSection}>
                                <CustomButtonGroup
                                    selectedButtonStyle={{ backgroundColor: "rgba(27, 106, 158, 0.85)" }}
                                    onButtonPress={(index) => updateIndex(index)}
                                    selectedIndices={[index]}
                                    buttons={["Apartment", "Villa", "Independent House", "Any"].map(item => ({ text: item }))}
                                    buttonTextStyle={{ textAlign: "center" }}
                                    selectedButtonTextStyle={{ color: "#fff" }}
                                    containerStyle={{ borderRadius: 10, width: '100%' }}
                                />
                            </div>
                            <p style={styles.marginBottom10}>BHK type</p>
                            <div style={styles.propSubSection}>
                                <CustomButtonGroup
                                    selectedButtonStyle={{ backgroundColor: "rgba(27, 106, 158, 0.85)" }}
                                    onButtonPress={(index) => updateIndex(index)}
                                    selectedIndices={[index]}
                                    buttons={["1RK", "1BHK", "2BHK", "3BHK", "4BHK", "4+BHK"].map(item => ({ text: item }))}
                                    buttonTextStyle={{ textAlign: "center" }}
                                    selectedButtonTextStyle={{ color: "#fff" }}
                                    containerStyle={{ borderRadius: 10, width: '100%' }}
                                />
                            </div>
                            <p>Rent Range</p>
                            <Slider />
                            <p style={styles.marginBottom10}>Availability</p>
                            <div style={styles.propSubSection}>
                                <CustomButtonGroup
                                    selectedButtonStyle={{ backgroundColor: "rgba(27, 106, 158, 0.85)" }}
                                    onButtonPress={(index) => updateIndex(index)}
                                    selectedIndices={[index]}
                                    buttons={["Immediate", "15 Days", "30 Days", "30+ Days"].map(item => ({ text: item }))}
                                    buttonTextStyle={{ textAlign: "center" }}
                                    selectedButtonTextStyle={{ color: "#fff" }}
                                    containerStyle={{ borderRadius: 10, width: '100%' }}
                                />
                            </div>
                            <p style={styles.marginBottom10}>Furnishing</p>
                            <div style={styles.propSubSection}>
                                <CustomButtonGroup
                                    selectedButtonStyle={{ backgroundColor: "rgba(27, 106, 158, 0.85)" }}
                                    onButtonPress={(index) => updateIndex(index)}
                                    selectedIndices={[index]}
                                    buttons={["Full", "Semi", "Empty", "Any"].map(item => ({ text: item }))}
                                    buttonTextStyle={{ textAlign: "center" }}
                                    selectedButtonTextStyle={{ color: "#fff" }}
                                    containerStyle={{ borderRadius: 10, width: '100%' }}
                                />
                            </div>
                            <Button
                                title="Apply"
                                onPress={() => navigation.navigate("AddImages")}
                            />
                        </div>
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
                        height: "45%",
                        borderTopLeftRadius: 20,
                        borderTopRightRadius: 20,
                        padding: 20,
                        overflowY: 'auto'
                    }} onClick={e => e.stopPropagation()}>
                        <div style={{ display: 'flex', justifyContent: 'center', position: 'relative' }}>
                            <span style={{ marginTop: 15, fontSize: 16, fontWeight: "600" }}>
                                Sort By
                            </span>
                        </div>

                        <div style={{ marginTop: 10, marginBottom: 20 }}>
                            <p style={styles.marginBottom10}>Rent</p>
                            <div style={styles.propSubSection}>
                                <CustomButtonGroup
                                    selectedButtonStyle={{ backgroundColor: "rgba(27, 106, 158, 0.85)" }}
                                    onButtonPress={(index) => updateIndex(index)}
                                    selectedIndices={[index]}
                                    buttons={["Lowest First", "Highest First"].map(item => ({ text: item }))}
                                    buttonTextStyle={{ textAlign: "center" }}
                                    selectedButtonTextStyle={{ color: "#fff" }}
                                    containerStyle={{ borderRadius: 10, width: '100%' }}
                                />
                            </div>
                            <p style={styles.marginBottom10}>Availability</p>
                            <div style={styles.propSubSection}>
                                <CustomButtonGroup
                                    selectedButtonStyle={{ backgroundColor: "rgba(27, 106, 158, 0.85)" }}
                                    onButtonPress={(index) => updateIndex(index)}
                                    selectedIndices={[index]}
                                    buttons={["Earliest First", "Oldest First"].map(item => ({ text: item }))}
                                    buttonTextStyle={{ textAlign: "center" }}
                                    selectedButtonTextStyle={{ color: "#fff" }}
                                    containerStyle={{ borderRadius: 10, width: '100%' }}
                                />
                            </div>

                            <p style={styles.marginBottom10}>Posted date</p>
                            <div style={styles.propSubSection}>
                                <CustomButtonGroup
                                    selectedButtonStyle={{ backgroundColor: "rgba(27, 106, 158, 0.85)" }}
                                    onButtonPress={(index) => updateIndex(index)}
                                    selectedIndices={[index]}
                                    buttons={["Recent First", "Oldest Fist"].map(item => ({ text: item }))}
                                    buttonTextStyle={{ textAlign: "center" }}
                                    selectedButtonTextStyle={{ color: "#fff" }}
                                    containerStyle={{ borderRadius: 10, width: '100%' }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {props.userDetails && ((props.userDetails.works_for === props.userDetails.id) ||
                (props.userDetails.user_type === "employee" && EMPLOYEE_ROLE.includes(props.userDetails.employee_role)
                )) ?
                <div
                    style={{
                        alignItems: "center",
                        justifyContent: "center",
                        position: "absolute",
                        bottom: 15,
                        right: 10,
                        backgroundColor: "rgba(50, 195, 77, 0.59)",
                        borderRadius: 100,
                        cursor: 'pointer'
                    }}
                    onClick={() => navigation.navigate("Add")}
                >
                    <AiOutlinePlusCircle size={40} color="#ffffff" />
                </div> : null}
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
    textInputStyle: {
        width: "98%",
        height: 40,
        paddingLeft: 20,
        margin: 5,
        borderRadius: 10,
        backgroundColor: "#FFFFFF",
        border: '1px solid #ccc',
        color: '#000'
    },
    searchBarContainer: {
        marginBottom: 10
    }
};

const mapStateToProps = state => ({
    userDetails: state.AppReducer.userDetails,
    propertyListingForMeeting: state.AppReducer.propertyListingForMeeting,
    residentialCustomerList: state.AppReducer.residentialCustomerList,
    commercialPropertyList: state.AppReducer.commercialPropertyList,
    residentialPropertyList: state.AppReducer.residentialPropertyList,
    customerDetails: state.AppReducer.customerDetails
});
const mapDispatchToProps = {
    setPropertyListingForMeeting
};
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(PropertyListForMeeting);
