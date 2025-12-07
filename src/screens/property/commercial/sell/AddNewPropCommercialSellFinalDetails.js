import React, { useState, useEffect } from "react";
import Slideshow from "./../../../../components/Slideshow";
import Button from "./../../../../components/Button";
import axios from "axios";
import { SERVER_URL } from "./../../../../utils/Constant";
import { numDifferentiation, dateFormat } from "./../../../../utils/methods";
import { connect } from "react-redux";
import { setPropertyDetails, setCommercialPropertyList, setStartNavigationPoint } from "./../../../../reducers/Action";
import Snackbar from "./../../../../components/SnackbarComponent";

const AddNewPropCommercialSellFinalDetails = props => {
    const { navigation } = props;
    const [propertyFinalDetails, setPropertyFinalDetails] = useState(null);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        getPropFinalDetails();
    }, []);

    const getPropFinalDetails = async () => {
        const property = props.propertyDetails;
        setPropertyFinalDetails(property);
    };

    const dismissSnackBar = () => {
        setIsVisible(false);
    };

    const login = async () => {
        navigation.navigate("Login");
        setModalVisible(false);
    }

    const send = async () => {
        if (props.userDetails === null) {
            setModalVisible(true);
            return;
        }
        setLoading(true)
        propertyFinalDetails.agent_id = props.userDetails.works_for;
        const data = new FormData();
        propertyFinalDetails.image_urls.forEach((element, i) => {
            const newFile = {
                uri: element.url,
                name: `vichi`,
                type: `image/jpeg`,
            }
            data.append('prop_image_' + i, newFile)
        });

        data.append('propertyFinalDetails', JSON.stringify(propertyFinalDetails));

        axios(SERVER_URL + "/addNewCommercialProperty", {
            method: "post",
            headers: {
                Accept: 'application/json',
            },
            data: data
        })
            .then(
                response => {
                    if (response.data.property_id !== null) {
                        let responseData = response.data;
                        if (typeof responseData === 'string') {
                            try {
                                responseData = JSON.parse(responseData);
                            } catch (e) {
                                console.error("Error parsing response data:", e);
                            }
                        }

                        if (responseData.image_urls && Array.isArray(responseData.image_urls)) {
                            responseData.image_urls.map(item => {
                                item.url = SERVER_URL + item.url
                            });
                        }

                        props.setPropertyDetails(null);
                        props.setCommercialPropertyList([...props.commercialPropertyList, responseData])
                        if (props.startNavigationPoint === null) {
                            navigation.navigate("Listing", { didDbCall: true });

                        } else {
                            navigation.navigate("PropertyListForMeeting");
                        }
                        props.setStartNavigationPoint(null);
                        setLoading(false)
                    } else {
                        setLoading(false)
                        setErrorMessage(
                            "Error: Seems there is some network issue, please try later"
                        );
                    }
                },
                error => {
                    setLoading(false)
                    console.log(error);
                }
            );
    };
    return propertyFinalDetails ? (
        <div style={{ flex: 1, backgroundColor: "#ffffff", height: '100vh', overflowY: 'auto' }}>
            <div style={styles.headerContainer}>
                <h3 style={styles.title}>
                    {propertyFinalDetails.property_details.property_used_for} {"For Sell In "}
                    {propertyFinalDetails.property_address.building_name},
                </h3>
                <span style={styles.subTitle}>
                    {propertyFinalDetails.property_address.landmark_or_street},
                    {propertyFinalDetails.property_address.location_area.formatted_address}
                </span>
            </div>
            <Slideshow
                dataSource={propertyFinalDetails.image_urls}
            />
            <div style={styles.detailsContainer}>
                <div style={styles.details}>
                    <div style={styles.subDetails}>
                        <span style={styles.subDetailsValue}>
                            {propertyFinalDetails.property_details.property_used_for}
                        </span>
                        <span style={styles.subDetailsTitle}>Prop Type</span>
                    </div>
                    <div style={styles.verticalLine}></div>
                    <div style={styles.subDetails}>
                        <span style={styles.subDetailsValue}>
                            {numDifferentiation(
                                propertyFinalDetails.sell_details.expected_sell_price
                            )}
                        </span>
                        <span style={styles.subDetailsTitle}>
                            {propertyFinalDetails.property_for}
                        </span>
                    </div>
                    <div style={styles.verticalLine}></div>
                    <div style={styles.subDetails}>
                        <span style={styles.subDetailsValue}>
                            {numDifferentiation(
                                propertyFinalDetails.sell_details.maintenance_charge
                            )}
                        </span>
                        <span style={styles.subDetailsTitle}>Maintenance</span>
                    </div>
                    <div style={styles.verticalLine}></div>
                    <div style={styles.subDetails}>
                        <span style={styles.subDetailsValue}>
                            {propertyFinalDetails.property_details.property_size}sqft
                        </span>
                        <span style={styles.subDetailsTitle}>Builtup</span>
                    </div>
                </div>
            </div>

            <div style={styles.margin1}></div>
            <div style={styles.overviewContainer}>
                <div style={styles.overview}>
                    <span>Details</span>
                    <div style={styles.horizontalLine}></div>
                </div>
                <div style={styles.overviewColumnWrapper}>
                    <div style={styles.overviewLeftColumn}>
                        <div style={styles.subDetails}>
                            <span style={styles.subDetailsValue}>
                                {propertyFinalDetails.property_details.building_type}
                            </span>
                            <span style={styles.subDetailsTitle}>Building Type</span>
                        </div>
                        <div style={styles.subDetails}>
                            <span style={styles.subDetailsValue}>
                                {dateFormat(propertyFinalDetails.sell_details.available_from)}
                            </span>
                            <span style={styles.subDetailsTitle}>Possession</span>
                        </div>
                        <div style={{ ...styles.subDetails, width: "75%" }}>
                            <span style={styles.subDetailsValue}>
                                {propertyFinalDetails.property_details.ideal_for.join(", ")}
                            </span>
                            <span style={styles.subDetailsTitle}>Ideal For</span>
                        </div>
                        <div style={styles.subDetails}>
                            <span style={styles.subDetailsValue}>
                                {propertyFinalDetails.property_details.power_backup}
                            </span>
                            <span style={styles.subDetailsTitle}>Power Backup</span>
                        </div>
                    </div>
                    <div style={styles.overviewRightColumn}>
                        <div style={styles.subDetails}>
                            <span style={styles.subDetailsValue}>
                                {propertyFinalDetails.property_details.parking_type}
                            </span>
                            <span style={styles.subDetailsTitle}>Parking</span>
                        </div>
                        <div style={styles.subDetails}>
                            <span style={styles.subDetailsValue}>
                                {propertyFinalDetails.property_details.property_age}
                            </span>
                            <span style={styles.subDetailsTitle}>Age Of Building</span>
                        </div>
                    </div>
                </div>
            </div>
            <div style={styles.margin1}></div>
            <div style={styles.overviewContainer}>
                <div style={styles.overview}>
                    <span>Owner</span>
                    <div style={styles.horizontalLine}></div>
                    <div style={styles.ownerDetails}>
                        <span>{propertyFinalDetails.owner_details.name}</span>
                        <span>{propertyFinalDetails.owner_details.address}</span>
                        <span>+91 {propertyFinalDetails.owner_details.mobile1}</span>
                    </div>
                </div>
            </div>
            <div style={{ marginTop: 60 }}>
                <div style={{ margin: 20 }}>
                    <Button title="ADD" onPress={() => send()} />
                </div>
            </div>

            <Snackbar
                visible={isVisible}
                textMessage={errorMessage}
                position={"top"}
                actionHandler={() => dismissSnackBar()}
                actionText="OK"
            />

            {loading && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 1000
                }}>
                    <div style={{ color: 'white' }}>Loading...</div>
                </div>
            )}

            {modalVisible && (
                <div style={styles.centeredView1}>
                    <div style={styles.modalView}>
                        <span style={styles.modalText}>
                            You are not logged in, please login.
                        </span>
                        <div
                            style={{
                                flexDirection: "row",
                                marginTop: 20,
                                marginBottom: 20,
                                padding: 20,
                                display: 'flex',
                                justifyContent: 'flex-end',
                                width: '100%'
                            }}
                        >
                            <div
                                style={{ ...styles.cancelButton, cursor: 'pointer' }}
                                onClick={() => {
                                    setModalVisible(!modalVisible);
                                }}
                            >
                                <span style={styles.textStyle}>Cancel</span>
                            </div>
                            <div
                                style={{ ...styles.applyButton, cursor: 'pointer' }}
                                onClick={() => {
                                    login();
                                    setModalVisible(!modalVisible);
                                }}
                            >
                                <span style={styles.textStyle}>Login</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </div>
    ) : null;
};

const styles = {
    headerContainer: {
        flexDirection: "column",
        alignItems: "flex-start",
        paddingRight: 16,
        paddingLeft: 16,
        paddingBottom: 16,
        paddingTop: 16,
        backgroundColor: "#d1d1d1",
        display: 'flex'
    },
    title: {
        fontSize: 16,
        fontWeight: "600",
        margin: 0
    },
    subTitle: {
        fontSize: 14,
        fontWeight: "400",
        color: "rgba(255 ,255 ,255 , 0.87)"
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
        borderBottomColor: "#E0E0E0",
        borderBottomWidth: 1,
        marginLeft: 5,
        marginRight: 5,
        paddingTop: 10
    },
    overviewContainer: {
        boxShadow: "0px 2px 4px rgba(0,0,0,0.2)",
        backgroundColor: "white"
    },
    overview: {
        padding: 10
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
        display: 'flex'
    },
    overviewRightColumn: {
        flexDirection: "column",
        justifyContent: "center",
        display: 'flex'
    },
    margin1: {
        marginTop: 2
    },
    ownerDetails: {
        paddingTop: 10,
        paddingBottom: 10,
        display: 'flex',
        flexDirection: 'column'
    },
    centeredView1: {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex',
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000
    },
    modalView: {
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        boxShadow: "0px 2px 4px rgba(0,0,0,0.25)",
        display: 'flex',
        flexDirection: 'column'
    },
    applyButton: {
        marginLeft: 10,
        marginRight: 10,
        padding: 10,
        backgroundColor: '#2196F3',
        borderRadius: 5,
        color: 'white'
    },
    cancelButton: {
        marginLeft: 10,
        marginRight: 30,
        padding: 10,
        backgroundColor: '#f44336',
        borderRadius: 5,
        color: 'white'
    },
    modalText: {
        marginBottom: 16,
        fontWeight: "600",
        textAlign: "center"
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
    }
};

const mapStateToProps = state => ({
    userDetails: state.AppReducer.userDetails,
    propertyType: state.AppReducer.propertyType,
    propertyDetails: state.AppReducer.propertyDetails,
    commercialPropertyList: state.AppReducer.commercialPropertyList,
    startNavigationPoint: state.AppReducer.startNavigationPoint
});
const mapDispatchToProps = {
    setPropertyDetails,
    setCommercialPropertyList,
    setStartNavigationPoint
};
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AddNewPropCommercialSellFinalDetails);
