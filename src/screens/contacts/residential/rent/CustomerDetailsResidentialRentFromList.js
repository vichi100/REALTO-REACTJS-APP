import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { formatIsoDateToCustomString, camalize, numDifferentiation } from "../../../../utils/methods";
import Reminder from "../../../common/Reminder";

// Mock Avatar component for web
const Avatar = ({ title, size, avatarStyle, titleStyle }) => (
    <div
        style={{
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: "#ccc",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            ...avatarStyle,
        }}
    >
        <span style={{ fontSize: size / 2, ...titleStyle }}>{title}</span>
    </div>
);

const CustomerDetailsResidentialRentFromList = props => {
    const { navigation } = props;
    // Handle route params safely
    let item = props.route?.params?.item || props.anyItemDetails;
    let displayMatchCount = props.route?.params?.displayMatchCount ?? true;
    // let displayMatchPercent = props.route?.params?.displayMatchPercent ?? true;

    const [location, setLocation] = useState([])

    const getMatched = (matchedCustomerItem) => {
        navigation.navigate('MatchedProperties', { matchedCustomerItem: matchedCustomerItem },);
    }

    useEffect(() => {
        if (item && item.customer_locality && item.customer_locality.location_area) {
            const locX = []
            item.customer_locality.location_area.map(item => {
                console.log(item.main_text);
                locX.push(item.main_text)
            })
            setLocation(locX)
        }
    }, [item])

    if (!item) return null;

    return (
        <div style={styles.container}>
            <div
                style={{
                    flex: 1,
                    flexDirection: "row",
                    alignItems: "flex-start",
                    backgroundColor: "#ffffff",
                    display: 'flex',
                    padding: 10
                }}
            >
                <Avatar
                    square
                    size={60}
                    title={
                        item.customer_details.name && item.customer_details.name.slice(0, 1)
                    }
                    titleStyle={{ color: "rgba(105,105,105, .9)" }}
                    avatarStyle={{
                        borderWidth: 1,
                        borderColor: "rgba(127,255,212, .9)",
                        borderStyle: "solid"
                    }}
                />
                <div style={{ paddingLeft: 20, paddingTop: 10, flex: 1, minHeight: 95 }}>
                    <span style={styles.title}>{item.customer_details.name}</span>
                    <span style={{ ...styles.subTitle, display: 'block' }}>
                        {item.customer_details.mobile1?.startsWith("+91")
                            ? item.customer_details.mobile1
                            : `+91 ${item.customer_details.mobile1}`}
                    </span>
                    <span style={{ ...styles.subTitle, marginTop: 5, display: 'block' }}>
                        {camalize(item.customer_details.address)}
                    </span>
                </div>
                {displayMatchCount && <div
                    onClick={() => getMatched(item)}
                    style={{ flexDirection: 'row', marginTop: 0, cursor: 'pointer', position: 'relative', width: 40, height: 40 }}
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

            <div style={{ ...styles.detailsContainer, backgroundColor: "#ffffff" }}>
                <div style={styles.details}>
                    <div style={styles.subDetails}>
                        <span style={{ ...styles.subDetailsValue, paddingTop: 5, display: 'block' }}>
                            {item.customer_property_details.bhk_type}
                        </span>
                    </div>
                    <div style={styles.verticalLine}></div>
                    <div style={styles.subDetails}>
                        <span style={{ ...styles.subDetailsValue, display: 'block' }}>
                            {numDifferentiation(item.customer_rent_details.expected_rent)}
                        </span>
                        <span style={{ ...styles.subDetailsTitle, display: 'block' }}>Rent</span>
                    </div>
                    <div style={styles.verticalLine}></div>
                    <div style={styles.subDetails}>
                        <span style={{ ...styles.subDetailsValue, display: 'block' }}>
                            {numDifferentiation(item.customer_rent_details.expected_deposit)}
                        </span>
                        <span style={{ ...styles.subDetailsTitle, display: 'block' }}>Deposit</span>
                    </div>
                    <div style={styles.verticalLine}></div>
                    <div style={styles.subDetails}>
                        <span style={{ ...styles.subDetailsValue, display: 'block' }}>
                            {item.customer_property_details.furnishing_status}
                        </span>
                        <span style={{ ...styles.subDetailsTitle, display: 'block' }}>Furnishing</span>
                    </div>
                </div>
            </div>

            <div style={styles.margin1}></div>
            {/* property details */}
            <div style={styles.overviewContainer}>
                <div style={styles.overview}>
                    <div
                        style={{ justifyContent: "space-between", flexDirection: "row", display: 'flex' }}
                    >
                        <span>Details</span>
                    </div>
                    <div style={styles.horizontalLine}></div>
                </div>
                <div style={styles.overviewColumnWrapper}>
                    <div style={styles.overviewLeftColumn}>
                        <div style={styles.subDetails}>
                            <span style={{ ...styles.subDetailsValue, display: 'block' }}>
                                {item.customer_locality.city}
                            </span>
                            <span style={{ ...styles.subDetailsTitle, display: 'block' }}>City</span>
                        </div>

                        <div style={{ paddingBottom: 20, width: "70%" }}>
                            <span style={{ ...styles.subDetailsValue, display: 'block' }}>
                                {location.join(', ')}
                            </span>
                            <span style={{ ...styles.subDetailsTitle, display: 'block' }}>Locations</span>
                        </div>
                        <div style={styles.subDetails}>
                            <span style={{ ...styles.subDetailsValue, display: 'block' }}>
                                {formatIsoDateToCustomString(item.customer_rent_details.available_from)}
                            </span>
                            <span style={{ ...styles.subDetailsTitle, display: 'block' }}>Possession</span>
                        </div>
                        <div style={styles.subDetails}>
                            <span style={{ ...styles.subDetailsValue, display: 'block' }}>
                                {item.customer_rent_details.preferred_tenants}
                            </span>
                            <span style={{ ...styles.subDetailsTitle, display: 'block' }}>Preferred Tenant</span>
                        </div>
                    </div>
                    <div style={styles.overviewRightColumn}>
                        <div style={styles.subDetails}>
                            <span style={{ ...styles.subDetailsValue, display: 'block' }}>
                                {item.customer_property_details.lift}
                            </span>
                            <span style={{ ...styles.subDetailsTitle, display: 'block' }}>Lift</span>
                        </div>
                        <div style={styles.subDetails}>
                            <span style={{ ...styles.subDetailsValue, display: 'block' }}>
                                {item.customer_property_details.parking_type}
                            </span>
                            <span style={{ ...styles.subDetailsTitle, display: 'block' }}>Parking</span>
                        </div>

                        <div style={styles.subDetails}>
                            <span style={{ ...styles.subDetailsValue, display: 'block' }}>
                                {item.customer_rent_details.non_veg_allowed}
                            </span>
                            <span style={{ ...styles.subDetailsTitle, display: 'block' }}>NonVeg</span>
                        </div>
                    </div>
                </div>
            </div>
            {/* owner details */}
            <div style={styles.margin1}></div>
            <Reminder navigation={navigation} customerData={item} isSpecificRemider={true} />

        </div>
    );
};

const styles = {
    container: {
        flex: 1,
        height: '100vh',
        overflowY: 'auto'
    },
    card: {
        boxShadow: '0px 2px 4px rgba(0,0,0,0.25)',
        backgroundColor: "#ffffff"
    },
    cardImage: {
        alignSelf: "stretch",
        marginBottom: 16,
        justifyContent: "center",
        alignItems: "stretch"
    },
    headerContainer: {
        flexDirection: "column",
        alignItems: "flex-start",
        paddingRight: 16,
        paddingLeft: 16,
        paddingBottom: 16,
        paddingTop: 16
    },
    title: {
        fontSize: 16,
        fontWeight: "600",
        display: 'block'
    },
    subTitle: {
        fontSize: 14,
        fontWeight: "400",
        color: "rgba(0,0,0, 0.87)"
    },
    detailsContainer: {
        height: 60
    },
    details: {
        padding: 10,
        flexDirection: "row",
        justifyContent: "space-between",
        display: 'flex'
    },
    subDetails: {
        paddingBottom: 20
    },
    subDetailsTitle: {
        fontSize: 12,
        fontWeight: "400"
    },
    subDetailsValue: {
        fontSize: 14,
        fontWeight: "600"
    },
    verticalLine: {
        height: "70%",
        width: 1,
        backgroundColor: "#909090"
    },
    horizontalLine: {
        borderBottomColor: "#ffffff",
        borderBottomWidth: 1,
        marginLeft: 5,
        marginRight: 5,
        paddingTop: 10
    },
    overviewContainer: {
        boxShadow: '0px 2px 4px rgba(0,0,0,0.25)',
        backgroundColor: "#E0E0E0"
    },
    overview: {
        padding: 10
    },
    overviewSubDetailsRow: {
        flexDirection: "row",
        justifyContent: "center",
        padding: 15,
        display: 'flex'
    },
    overviewColumnWrapper: {
        flexDirection: "row",
        justifyContent: "space-between",
        padding: 10,
        display: 'flex'
    },
    overviewLeftColumn: {
        flexDirection: "column",
        justifyContent: "center",
        display: 'flex',
        flex: 1
    },
    overviewRightColumn: {
        flexDirection: "column",
        justifyContent: "center",
        display: 'flex',
        flex: 1
    },
    margin1: {
        marginTop: 2
    },
    ownerDetails: {
        paddingTop: 10,
        paddingBottom: 10
    }
};

const mapStateToProps = state => ({
    userDetails: state.AppReducer.userDetails,
    anyItemDetails: state.AppReducer.anyItemDetails
});

export default connect(
    mapStateToProps,
    null
)(CustomerDetailsResidentialRentFromList);
