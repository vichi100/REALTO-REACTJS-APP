import React, { useRef, useState, useEffect } from "react";
import Slideshow from "./../../../../components/Slideshow";
import { numDifferentiation, dateFormat, formatIsoDateToCustomString, camalize, makeCall } from "./././../../../../utils/methods";
import { connect } from "react-redux";
import AccordionListItem from "./../../../../components/AccordionListItem";
import PropertyReminder from "../../PropertyReminder";
import { SERVER_URL } from "./../../../../utils/Constant";
import axios from "axios";
import { MdPersonAdd, MdPhone } from "react-icons/md";

const CommercialRentPropDetails = props => {
    const { navigation } = props;
    let { item,
        displayMatchCount = true,
        displayMatchPercent = true
    } = props.route?.params || {};
    if (!item) {
        item = props.propertyDetails;
    }
    const scrollViewRef = useRef();
    const [reminderListX, setReminderListX] = useState([]);
    const [loading, setLoading] = useState(false);

    const gotoEmployeeList = itemForAddEmplyee => {
        navigation.navigate("EmployeeListOfListing", {
            itemForAddEmplyee: itemForAddEmplyee,
            disableDrawer: true,
            displayCheckBox: true,
        });
    }

    const scrollToAccordion = () => {
        if (scrollViewRef.current) {
            scrollViewRef.current.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const getMatched = (matchedProprtyItem) => {
        navigation.navigate('MatchedCustomers', { matchedProprtyItem: matchedProprtyItem },);
    }

    const getPropReminders = () => {
        const propertyId = {
            req_user_id: props.userDetails.id,
            agent_id: props.userDetails.works_for,
            property_id: item.property_id
        };
        setLoading(true);

        axios
            .post(
                SERVER_URL + "/getPropReminderList",
                propertyId
            )
            .then(
                response => {
                    if (response.data && response.data.length > 0) {
                        setReminderListX(response.data);
                        setLoading(false);
                    } else {
                        setReminderListX([]);
                        setLoading(false);
                    }
                },
                error => {
                    setLoading(false);
                    console.log(error);
                }
            );
    };
    useEffect(() => {
        getPropReminders();
    }, []);


    return (
        <div style={styles.container} ref={scrollViewRef}>
            <div style={{ flexDirection: 'row', flex: 1, display: 'flex' }}>
                <div style={{ flex: 1, minHeight: 100 }}>
                    <div style={{
                        flex: 1,
                        flexDirection: "column",
                        alignItems: "flex-start",
                        paddingRight: 16,
                        paddingLeft: 16,
                        paddingTop: 16,
                        display: 'flex'
                    }}>
                        <h3 style={styles.title}>
                            Rent in {item.property_address.flat_number}{item.property_address.building_name},{" "}
                            {item.property_address.landmark_or_street}
                        </h3>
                        <span style={styles.subTitle}>
                            {item.property_address.formatted_address}
                        </span>
                    </div>
                    {props.userDetails.works_for === props.userDetails.id && item.agent_id === props.userDetails.id &&
                        <div onClick={() => gotoEmployeeList(item)} style={{ cursor: 'pointer' }}>
                            <div style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 10, marginTop: 10, display: 'flex' }}>
                                <MdPersonAdd size={20} color="black" />
                                <span style={{ fontSize: 14, fontWeight: '300', color: '#000', marginLeft: 20, marginRight: 20 }}>
                                    {Array.isArray(item.assigned_to_employee_name) && item.assigned_to_employee_name.length > 0
                                        ? item.assigned_to_employee_name.join(", ")
                                        : "No Employees Assigned"}
                                </span>
                            </div>
                        </div>}

                </div>

                {displayMatchCount && <div
                    onClick={() => getMatched(item)}
                    style={{ flexDirection: 'row', marginTop: 8, cursor: 'pointer', position: 'relative', width: 50 }}
                >
                    <div style={{
                        backgroundColor: 'rgba(234, 155, 20, 0.7)', position: 'absolute', right: 0, top: 0, alignItems: 'center', justifyContent: 'center',
                        width: 38, height: 20, marginRight: 0, display: 'flex'
                    }}>
                        <span style={{ fontSize: 15, fontWeight: '500', color: '#000', paddingLeft: 0 }}>{item.match_count ? item.match_count : 0}</span>
                    </div>
                    <div style={{
                        position: 'absolute', right: 0, top: 20, transform: 'rotate(270deg)',
                        backgroundColor: 'rgba(80, 200, 120, 0.7)', alignItems: 'center', justifyContent: 'center',
                        width: 70, height: 35, padding: 0, marginRight: -15, marginTop: 20, marginBottom: 15, display: 'flex'
                    }}>
                        <span style={{ fontSize: 14, fontWeight: '300', color: '#000' }}>Match</span>
                    </div>
                </div>}
            </div>

            <Slideshow
                dataSource={item.image_urls}
            />
            <div style={styles.detailsContainer}>
                <div style={styles.details}>
                    <div style={styles.subDetails}>
                        <span style={styles.subDetailsValue}>
                            {item.property_details.property_used_for}
                        </span>
                        <span style={styles.subDetailsTitle}>Prop Type</span>
                    </div>
                    <div style={styles.verticalLine}></div>
                    <div style={styles.subDetails}>
                        <span style={styles.subDetailsValue}>
                            {numDifferentiation(item.rent_details.expected_rent)}
                        </span>
                        <span style={styles.subDetailsTitle}>Rent</span>
                    </div>
                    <div style={styles.verticalLine}></div>
                    <div style={styles.subDetails}>
                        <span style={styles.subDetailsValue}>
                            {numDifferentiation(item.rent_details.expected_deposit)}
                        </span>
                        <span style={styles.subDetailsTitle}>Deposit</span>
                    </div>
                    <div style={styles.verticalLine}></div>
                    <div style={styles.subDetails}>
                        <span style={styles.subDetailsValue}>
                            {item.property_details.property_size}sqft
                        </span>
                        <span style={styles.subDetailsTitle}>Builtup</span>
                    </div>
                </div>
            </div>

            <div style={styles.margin1}></div>
            <div className="mt-0.5"></div>
            <AccordionListItem title="Details" onPress={scrollToAccordion} open={true}>
                <div className="bg-white w-full shadow-md">
                    <div className="flex justify-between p-2">
                        <div className="flex flex-col justify-center">
                            <div className="pb-5">
                                <span className="text-sm font-semibold block text-black">
                                    {item.property_details.building_type}
                                </span>
                                <span className="text-xs font-normal block text-black">Building Type</span>
                            </div>
                            <div className="pb-5">
                                <span className="text-sm font-semibold block text-black">
                                    {formatIsoDateToCustomString(item.rent_details.available_from)}
                                </span>
                                <span className="text-xs font-normal block text-black">Possession</span>
                            </div>
                            <div className="pb-5">
                                <span className="text-sm font-semibold block text-black break-words w-48">
                                    {item.property_details && item.property_details.ideal_for.join(", ")}
                                </span>
                                <span className="text-xs font-normal block text-black">Ideal For</span>
                            </div>
                        </div>
                        <div className="flex flex-col justify-center">
                            <div className="pb-5">
                                <span className="text-sm font-semibold block text-black">
                                    {item.property_details.parking_type}
                                </span>
                                <span className="text-xs font-normal block text-black">Parking</span>
                            </div>
                            <div className="pb-5">
                                <span className="text-sm font-semibold block text-black">
                                    {item.property_details.property_age} years
                                </span>
                                <span className="text-xs font-normal block text-black">Age Of Building</span>
                            </div>
                            <div className="pb-5">
                                <span className="text-sm font-semibold block text-black">
                                    {item.property_details.power_backup}
                                </span>
                                <span className="text-xs font-normal block text-black">Power Backup</span>
                            </div>
                        </div>
                    </div>
                </div>
            </AccordionListItem>
            <div className="mt-0.5"></div>
            <AccordionListItem title="Owner" open={false} onPress={scrollToAccordion}>
                <div className="bg-white w-full shadow-md">
                    <div className="flex-1 py-2 pb-2 px-4 w-full">
                        <div className="flex flex-row mb-0 items-center justify-between">
                            <div className="flex flex-col">
                                <span className="text-black font-medium">{item.owner_details.name}</span>
                                <span className="text-black">
                                    {item.owner_details.mobile1?.startsWith("+91")
                                        ? item.owner_details.mobile1
                                        : `+91 ${item.owner_details.mobile1}`}
                                </span>
                            </div>
                            <div
                                onClick={(e) => { e.stopPropagation(); makeCall(item.owner_details.mobile1); }}
                                className="p-0 mr-9 cursor-pointer"
                            >
                                <MdPhone color={"#00bfa5"} size={25} />
                            </div>
                        </div>
                        <span className="mt-1 block text-black">{camalize(item.owner_details.address)}</span>
                    </div>
                </div>
            </AccordionListItem>

            {loading ? <div
                style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: 'rgba(245,245,245, .4)',
                    display: 'flex',
                    padding: 20
                }}
            >
                <span>Loading...</span>
            </div> : <PropertyReminder navigation={navigation} reminderListX={reminderListX} />}


        </div>
    );
};

const styles = {
    container: {
        backgroundColor: "white",
        display: 'flex',
        flexDirection: 'column',
        flex: 1
    },
    title: {
        fontSize: 16,
        fontWeight: "600",
        margin: 0,
        color: "#000"
    },
    subTitle: {
        fontSize: 14,
        fontWeight: "400",
        color: "#000"
    },
    detailsContainer: {
        height: 60,
        borderTopWidth: 1,
        borderTopColor: "#C0C0C0",
        backgroundColor: "rgba(220,220,220, 0.80)"
    },
    details: {
        padding: 10,
        flexDirection: "row",
        justifyContent: "space-between",
        display: 'flex'
    },
    subDetails: {
        paddingBottom: 20,
        display: 'flex',
        flexDirection: 'column'
    },
    subDetailsTitle: {
        fontSize: 12,
        fontWeight: "400",
        color: "#000"
    },
    subDetailsValue: {
        fontSize: 14,
        fontWeight: "600",
        color: "#000"
    },
    verticalLine: {
        height: "70%",
        width: 1,
        backgroundColor: "#909090"
    },
    horizontalLine: {
        borderBottomColor: "#E0E0E0",
        borderBottomWidth: 1,
        marginLeft: 5,
        marginRight: 5,
        paddingTop: 10
    },
    margin1: {
        marginTop: 2
    }
};

const mapStateToProps = state => ({
    userDetails: state.AppReducer.userDetails,
    anyItemDetails: state.AppReducer.anyItemDetails,
    propertyDetails: state.AppReducer.propertyDetails
});

export default connect(
    mapStateToProps,
    null
)(CommercialRentPropDetails);
