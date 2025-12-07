import React, { useEffect, useState } from "react";
import { setUserDetails } from "./../../reducers/Action";
import axios from "axios";
import { connect } from "react-redux";
import { SERVER_URL } from "./../../utils/Constant";

const Home = props => {
    const { navigation } = props;
    const [modalVisible, setModalVisible] = useState(false);
    const [listingData, setListingData] = useState(null); // for chart
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        getTotalListingSummary();
    }, []);

    useEffect(() => {
        if (props.userDetails === null) {
            setModalVisible(false);
            setListingData([]);
            return;
        }
        console.log("home1: " + JSON.stringify(props.userDetails));
        if (
            props.userDetails.user_status === "suspend" &&
            props.userDetails.user_type === "agent"
        ) {
            setModalVisible(true);
        }
    }, [props.userDetails]);

    const getTotalListingSummary = () => {
        if (props.userDetails === null) {
            setIsLoading(false); // Set loading to false
            setListingData([]);
            return;
        }
        setIsLoading(true); // Set loading to true
        const agent = {
            req_user_id: props.userDetails.works_for,
            agent_id: props.userDetails.id
        };
        axios(SERVER_URL + "/getTotalListingSummary", {
            method: "post",
            headers: {
                "Content-type": "Application/json",
                Accept: "Application/json"
            },
            data: agent
        }).then(
            response => {
                if (response.data) {
                    console.log("getTotalListingSummary: " + JSON.stringify(response.data));
                    setListingData(response.data);
                    setIsLoading(false); // Set loading to false

                }
            },
            error => {
                console.error(error);
                setIsLoading(false); // Set loading to false
            }
        );
    };

    const reactivateAccount = () => {
        const agent = {
            req_user_id: props.userDetails.works_for,
            agent_id: props.userDetails.id
        };
        axios(SERVER_URL + "/reactivateAccount", {
            method: "post",
            headers: {
                "Content-type": "Application/json",
                Accept: "Application/json"
            },
            data: agent
        }).then(
            response => {
                if (response.data === "success") {
                    props.userDetails["user_status"] = "active";

                    setModalVisible(!modalVisible);
                    updateAsyncStorageData();
                }
            },
            error => {
            }
        );
    };

    const updateAsyncStorageData = async () => {
        const userDetailsDataX = localStorage.getItem("user_details");
        if (userDetailsDataX) {
            const userDetailsData = JSON.parse(userDetailsDataX);
            userDetailsData.user_details["user_status"] = "active";
            localStorage.setItem("user_details", JSON.stringify(userDetailsData));
        }
    };

    return (
        <div style={{ flex: 1, backgroundColor: "#ffffff", height: '100vh', overflowY: 'auto' }}>
            {isLoading ? <div
                style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: 'rgba(245,245,245, .4)',
                    display: 'flex',
                    height: '100%'
                }}
            >
                <div>Loading...</div>
            </div> :

                <div style={{ flex: 1, backgroundColor: "#ffffff" }}>
                    <div style={styles.container}>
                        <div
                            style={{
                                ...styles.componentContainer,
                                marginLeft: 10,
                                marginRight: 10
                            }}
                        >
                            <div style={styles.bar}>
                                <p style={styles.barHeader}>Residential Listing Summary</p>
                            </div>
                            <div
                                style={{
                                    ...styles.cardContainer,
                                    marginLeft: 10,
                                    marginRight: 10
                                }}
                            >
                                <div style={styles.card}>
                                    <div style={{ alignItems: "center", justifyContent: "center", display: 'flex' }}>
                                        <p style={{ ...styles.cardHeader1, textAlign: "center" }}>Properties</p>
                                    </div>
                                    <div style={styles.cardContent}>
                                        <div style={styles.innerCard}>
                                            <p>{listingData?.residentialPropertyRentCount || 0}</p>
                                            <p>Rent</p>
                                        </div>
                                        <div style={styles.space} />
                                        <div style={styles.innerCard}>
                                            <p>{listingData?.residentialPropertySellCount || 0}</p>
                                            <p>Sell</p>
                                        </div>
                                    </div>
                                </div>

                                <div style={styles.card}>
                                    <div style={{ alignItems: "center", justifyContent: "center", display: 'flex' }}>
                                        <p style={styles.cardHeader2}>Customers</p>
                                    </div>
                                    <div style={styles.cardContent}>
                                        <div style={styles.innerCard}>
                                            <p>{listingData?.residentialPropertyCustomerRentCount || 0}</p>
                                            <p>Rent</p>
                                        </div>
                                        <div style={styles.space} />
                                        <div style={styles.innerCard}>
                                            <p>{listingData?.residentialPropertyCustomerBuyCount || 0}</p>
                                            <p>Sell</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>


                        <div
                            style={{
                                ...styles.componentContainer,
                                marginLeft: 10,
                                marginRight: 10
                            }}
                        >
                            <div style={styles.bar}>
                                <p style={styles.barHeader}>Commercial Listing Summary</p>
                            </div>
                            <div
                                style={{
                                    ...styles.cardContainer,
                                    marginLeft: 10,
                                    marginRight: 10
                                }}
                            >
                                <div style={styles.card}>
                                    <div style={{ alignItems: "center", justifyContent: "center", display: 'flex' }}>
                                        <p style={styles.cardHeader1}>Properties</p>
                                    </div>
                                    <div style={styles.cardContent}>
                                        <div style={styles.innerCard}>
                                            <p>{listingData?.commercialPropertyRentCount || 0}</p>
                                            <p>Rent</p>
                                        </div>
                                        <div style={styles.space} />
                                        <div style={styles.innerCard}>
                                            <p>{listingData?.commercialPropertySellCount || 0}</p>
                                            <p>Sell</p>
                                        </div>
                                    </div>
                                </div>

                                <div style={styles.card}>
                                    <div style={{ alignItems: "center", justifyContent: "center", display: 'flex' }}>
                                        <p style={styles.cardHeader2}>Customers</p>
                                    </div>
                                    <div style={styles.cardContent}>
                                        <div style={styles.innerCard}>
                                            <p>{listingData?.commercialPropertyCustomerRentCount || 0}</p>
                                            <p>Rent</p>
                                        </div>
                                        <div style={styles.space} />
                                        <div style={styles.innerCard}>
                                            <p>{listingData?.commercialPropertyCustomerBuyCount || 0}</p>
                                            <p>Sell</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {modalVisible && (
                        <div style={styles.centeredView1}>
                            <div style={styles.modalView}>
                                <p style={{ color: "rgba(255,0,0, .9)", marginBottom: 10 }}>
                                    Your account is in suspend mode by you. Do you want to activate
                                    it ?
                                </p>

                                <div
                                    style={{
                                        position: "absolute",
                                        flexDirection: "row",
                                        right: 0,
                                        bottom: 0,
                                        marginBottom: 20,
                                        padding: 20,
                                        display: 'flex'
                                    }}
                                >
                                    <div
                                        style={{ ...styles.applyButton, cursor: 'pointer' }}
                                        onClick={() => {
                                            reactivateAccount();
                                        }}
                                    >
                                        <span style={styles.textStyle}>Yes</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>}
        </div>
    );
};

const mapStateToProps = state => ({
    userDetails: state.AppReducer.userDetails
});
const mapDispatchToProps = {
    setUserDetails
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Home);

const styles = {
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 20,
        display: 'flex',
        flexDirection: 'column'
    },
    dealChart: {
        marginTop: 10
    },
    componentContainer: {
        marginBottom: 20
    },
    cardContainer: {
        flexDirection: "row",
        margin: 10,
        display: 'flex'
    },
    bar: {
        boxShadow: '0px 0.6px 1.8px rgba(0, 0, 0, 0.18)',
        backgroundColor: "#ffffff"
    },
    barHeader: {
        fontSize: 16,
        fontWeight: "600",
        alignContent: "center",
        padding: 5,
        width: "100%",
        textAlign: "center",
        margin: 0
    },
    card: {
        padding: 15,
        boxShadow: '0px 3px 9px rgba(0, 0, 0, 0.18)',
        backgroundColor: "#ffffff",
        marginRight: 10
    },
    cardContent: {
        flexDirection: "row",
        margin: 10,
        display: 'flex'
    },
    innerCard: {
        boxShadow: '0px 3px 9px rgba(0, 0, 0, 0.18)',
        backgroundColor: "#ffffff",
        padding: 20
    },
    cardHeader1: {
        fontSize: 16,
        fontWeight: "600",
        alignContent: "center",
        textAlign: "left",
        margin: 0
    },
    cardHeader2: {
        fontSize: 16,
        fontWeight: "600",
        alignContent: "center",
        justifyContent: "center",
        textAlign: "right",
        margin: 0
    },
    text: {
        color: "#101010",
        fontSize: 24,
        fontWeight: "bold",
        margin: 5
    },
    space: {
        margin: 5
    },
    buttonContainer: {
        backgroundColor: "#222",
        borderRadius: 5,
        padding: 10,
        margin: 20
    },
    buttonText: {
        fontSize: 20,
        color: "#fff"
    },
    modalView: {
        margin: 20,
        height: 230,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        boxShadow: "0px 2px 4px rgba(0,0,0,0.25)",
        display: 'flex',
        flexDirection: 'column',
        position: 'relative'
    },
    applyButton: {
        marginLeft: 10,
        marginRight: 10,
        backgroundColor: '#f0f0f0',
        padding: 10,
        borderRadius: 5
    },

    cancelButton: {
        marginLeft: 10,
        marginRight: 30
    },
    modalText: {
        textAlign: "center"
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
    textStyle: {
        fontWeight: 'bold'
    }
};
