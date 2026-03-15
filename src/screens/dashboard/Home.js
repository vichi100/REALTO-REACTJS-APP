import React, { useEffect, useState, useRef } from "react";
import { setUserDetails } from "./../../reducers/Action";
import axios from "axios";
import { connect } from "react-redux";
import { SERVER_URL } from "./../../utils/Constant";
import { FaHome, FaBuilding, FaUsers, FaArrowUp, FaArrowDown, FaTag, FaKey } from "react-icons/fa";
import { MdTrendingUp, MdTrendingDown } from "react-icons/md";

const Home = props => {
    const { navigation } = props;
    const [modalVisible, setModalVisible] = useState(false);
    const [listingData, setListingData] = useState(null); // for chart
    const [isLoading, setIsLoading] = useState(true);
    const isFetching = useRef(false);

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

        if (isFetching.current) return;
        isFetching.current = true;

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
                    isFetching.current = false;

                }
            },
            error => {
                console.error(error);
                setIsLoading(false); // Set loading to false
                isFetching.current = false;
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
        <div style={{ flex: 1, backgroundColor: "var(--background)", height: props.disableScroll ? 'auto' : '100vh', overflowY: props.disableScroll ? 'visible' : 'auto' }}>
            {isLoading ? (
                <div className="flex-1 flex justify-center items-center h-full">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
                </div>
            ) : (
                <div className="flex-1">
                    <div className="w-full px-4 py-8">
                        {/* Listing Summary Section */}
                        <div className="mb-8">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 rounded-xl bg-teal-500/10 dark:bg-teal-500/20">
                                    <FaHome className="text-2xl text-teal-500" />
                                </div>
                                <h2 className="text-xl font-bold text-foreground">Residential Listings</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Properties Card */}
                                <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                                    <div className="flex items-center justify-between mb-6">
                                        <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Properties</span>
                                        <div className="p-2 rounded-lg bg-blue-500/10 dark:bg-blue-500/20 text-blue-500">
                                            <FaTag className="text-lg" />
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-8">
                                        <div className="flex-1">
                                            <div className="text-3xl font-bold text-foreground mb-1">{listingData?.residentialPropertyRentCount || 0}</div>
                                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                                <FaKey className="text-xs text-orange-400" /> For Rent
                                            </div>
                                        </div>
                                        <div className="w-px h-12 bg-border/50" />
                                        <div className="flex-1">
                                            <div className="text-3xl font-bold text-foreground mb-1">{listingData?.residentialPropertySellCount || 0}</div>
                                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                                <FaTag className="text-xs text-teal-500" /> For Sell
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Customers Card */}
                                <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                                    <div className="flex items-center justify-between mb-6">
                                        <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Customers</span>
                                        <div className="p-2 rounded-lg bg-purple-500/10 dark:bg-purple-500/20 text-purple-500">
                                            <FaUsers className="text-lg" />
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-8">
                                        <div className="flex-1">
                                            <div className="text-3xl font-bold text-foreground mb-1">{listingData?.residentialPropertyCustomerRentCount || 0}</div>
                                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                                <FaKey className="text-xs text-orange-400" /> For Rent
                                            </div>
                                        </div>
                                        <div className="w-px h-12 bg-border/50" />
                                        <div className="flex-1">
                                            <div className="text-3xl font-bold text-foreground mb-1">{listingData?.residentialPropertyCustomerBuyCount || 0}</div>
                                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                                <FaTag className="text-xs text-teal-500" /> For Sell
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Commercial Section */}
                        <div>
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 rounded-xl bg-orange-500/10 dark:bg-orange-500/20">
                                    <FaBuilding className="text-2xl text-orange-500" />
                                </div>
                                <h2 className="text-xl font-bold text-foreground">Commercial Listings</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Properties Card */}
                                <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                                    <div className="flex items-center justify-between mb-6">
                                        <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Properties</span>
                                        <div className="p-2 rounded-lg bg-blue-500/10 dark:bg-blue-500/20 text-blue-500">
                                            <FaTag className="text-lg" />
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-8">
                                        <div className="flex-1">
                                            <div className="text-3xl font-bold text-foreground mb-1">{listingData?.commercialPropertyRentCount || 0}</div>
                                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                                <FaKey className="text-xs text-orange-400" /> For Rent
                                            </div>
                                        </div>
                                        <div className="w-px h-12 bg-border/50" />
                                        <div className="flex-1">
                                            <div className="text-3xl font-bold text-foreground mb-1">{listingData?.commercialPropertySellCount || 0}</div>
                                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                                <FaTag className="text-xs text-teal-500" /> For Sell
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Customers Card */}
                                <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                                    <div className="flex items-center justify-between mb-6">
                                        <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Customers</span>
                                        <div className="p-2 rounded-lg bg-purple-500/10 dark:bg-purple-500/20 text-purple-500">
                                            <FaUsers className="text-lg" />
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-8">
                                        <div className="flex-1">
                                            <div className="text-3xl font-bold text-foreground mb-1">{listingData?.commercialPropertyCustomerRentCount || 0}</div>
                                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                                <FaKey className="text-xs text-orange-400" /> For Rent
                                            </div>
                                        </div>
                                        <div className="w-px h-12 bg-border/50" />
                                        <div className="flex-1">
                                            <div className="text-3xl font-bold text-foreground mb-1">{listingData?.commercialPropertyCustomerBuyCount || 0}</div>
                                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                                <FaTag className="text-xs text-teal-500" /> For Sell
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {modalVisible && (
                            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex justify-center items-center p-4">
                                <div className="bg-background border border-border rounded-3xl p-8 max-w-sm w-full shadow-2xl relative">
                                    <p className="text-destructive font-semibold text-lg mb-8 text-center px-4">
                                        Your account is suspended. Would you like to reactivate it?
                                    </p>

                                    <div className="flex justify-end gap-3 mt-4">
                                        <button
                                            onClick={() => reactivateAccount()}
                                            className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-lg active:scale-95"
                                        >
                                            Reactivate
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
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
        marginTop: 10,
        display: 'flex',
        flexDirection: 'column'
    },
    dealChart: {
        marginTop: 10
    },
    componentContainer: {
        marginBottom: 10
    },
    cardContainer: {
        flexDirection: "row",
        marginTop: 2,
        marginBottom: 2,
        marginLeft: 2,
        marginRight: 2,
        display: 'flex'
    },
    bar: {
        boxShadow: '0px 0.6px 1.8px rgba(0, 0, 0, 0.18)',
        backgroundColor: "var(--card)"
    },
    barHeader: {
        fontSize: 16,
        fontWeight: "600",
        alignContent: "center",
        padding: 3,
        width: "100%",
        textAlign: "center",
        margin: 0,
        color: "var(--foreground)"
    },
    card: {
        padding: 10,
        boxShadow: '0px 3px 9px rgba(0, 0, 0, 0.18)',
        backgroundColor: "var(--card)",
        marginRight: 10
    },
    cardContent: {
        flexDirection: "row",
        margin: 5,
        display: 'flex'
    },
    innerCard: {
        boxShadow: '0px 3px 9px rgba(0, 0, 0, 0.18)',
        backgroundColor: "var(--card)",
        padding: 12
    },
    cardHeader1: {
        fontSize: 16,
        fontWeight: "600",
        alignContent: "center",
        textAlign: "left",
        margin: 0,
        color: "var(--foreground)"
    },
    cardHeader2: {
        fontSize: 16,
        fontWeight: "600",
        alignContent: "center",
        justifyContent: "center",
        textAlign: "right",
        margin: 0,
        color: "var(--foreground)"
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
        backgroundColor: "var(--background)",
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
