import React, { useState, useEffect, useRef } from "react";
import { connect } from "react-redux";

import { MdArrowBack } from "react-icons/md";
import { useNavigate } from "react-router-dom";

import Button from "./../../components/Button";
import CardResidentialRent from '../property/residential/rent/ResidentialRentCard';
import CardResidentialSell from '../property/residential/sell/ResidentialSellCard';
import CardCommercialRent from "./commercial/rent/CommercialRentCard";
import CardCommercialSell from "./commercial/sell/CommercialSellCard";
import axios from "axios";
import { SERVER_URL } from "./../../utils/Constant";
import {
    setResidentialPropertyList,
    setAnyItemDetails,
    setPropertyDetails
} from "./../../reducers/Action";

import Snackbar from "./../../components/SnackbarComponent";

import { resetRefresh } from "./../../reducers/dataRefreshReducer";
import { useDispatch } from 'react-redux';



const MatchedProperties = props => {
    const navigate = useNavigate();
    const handleBack = () => {
        if (window.history.length > 1 && window.history.state && window.history.state.idx > 0) {
            navigate(-1);
        } else {
            navigate('/contacts');
        }
    };

    const { navigation, route } = props;
    // route.params might be undefined if not passed correctly, handling gracefully
    const matchedCustomerItem = route?.params?.matchedCustomerItem || {};
    const dispatch = useDispatch();

    const [isVisible, setIsVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [search, setSearch] = useState("");

    const [loading, setLoading] = useState(false);

    const [matchedPropertiesDetailsMine, setMatchedPropertiesDetailsMine] = useState([]);
    const [matchedPropertiesDetailsOther, setMatchedPropertiesDetailsOther] = useState([]);

    const [reqUserId, setReqUserId] = useState(props.userDetails?.works_for);
    const [customerAgentId, setCustomerAgentId] = useState(matchedCustomerItem.agent_id);

    const [selectedTab, setSelectedTab] = useState(reqUserId === customerAgentId ? 0 : 1);



    const dismissSnackBar = () => {
        setIsVisible(false);
    };

    useEffect(() => {
        if (props.userDetails && props.userDetails.works_for !== null) {
            getListing();
        }
    }, [props.userDetails]);

    const getListing = () => {
        const customer = {
            req_user_id: props.userDetails.works_for,
            customer_id: matchedCustomerItem.customer_id,
        };
        let finalURL;

        if (matchedCustomerItem.customer_locality?.property_type == "Commercial") {
            if (matchedCustomerItem.customer_locality?.property_for == "Rent") {
                finalURL = SERVER_URL + "/matchedCommercialProptiesRentList";
            } else if (matchedCustomerItem.customer_locality?.property_for == "Buy") {
                finalURL = SERVER_URL + "/matchedCommercialProptiesBuyList";
            }
        } else if (matchedCustomerItem.customer_locality?.property_type == "Residential") {
            if (matchedCustomerItem.customer_locality?.property_for == "Rent") {
                finalURL = SERVER_URL + "/matchedResidentialProptiesRentList";
            } else if (matchedCustomerItem.customer_locality?.property_for == "Buy") {
                finalURL = SERVER_URL + "/matchedResidentialProptiesBuyList";
            }
        }

        if (!finalURL) return;

        setLoading(true);
        axios(finalURL, {
            method: "post",
            headers: {
                "Content-type": "Application/json",
                Accept: "Application/json"
            },
            data: customer
        }).then(
            response => {
                response.data.matchedPropertyDetailsMine.map(item => {
                    item.image_urls.map(image => {
                        image.url = SERVER_URL + image.url
                    })
                })
                response.data.matchedPropertyDetailsOther.map(item => {
                    item.image_urls.map(image => {
                        image.url = SERVER_URL + image.url
                    })
                })
                setMatchedPropertiesDetailsMine(response.data.matchedPropertyDetailsMine);
                setMatchedPropertiesDetailsOther(response.data.matchedPropertyDetailsOther);
                props.setResidentialPropertyList(response.data);
                setLoading(false);
            },
            error => {
                setLoading(false);
                console.log(error);
            }
        );
    };

    const navigateToDetails = (item, propertyFor) => {
        props.setPropertyDetails(item);

        if (propertyFor === "Rent") {
            navigation.navigate("PropDetailsFromListing", {
                item: item,
                displayMatchCount: false,
                displayMatchPercent: true
            });
        } else if (propertyFor === "Sell") {
            navigation.navigate("PropDetailsFromListingForSell", {
                item: item,
                displayMatchCount: false,
                displayMatchPercent: true
            });
        }
    };

    const deleteMe = (itemToDelete) => {
        setData((data) => data.filter((item) => item.property_id !== itemToDelete.property_id));
    }

    const closeMe = (itemToClose) => {
        setLoading(true);
        const reqData = {
            req_user_id: props.userDetails.id,
            agent_id: props.userDetails.works_for,
            dataToClose: itemToClose
        };
        axios(SERVER_URL + "/closeCommercialProperty", {
            method: "post",
            headers: {
                "Content-type": "Application/json",
                Accept: "Application/json"
            },
            data: reqData
        }).then(
            response => {
                if (response.data === "success") {
                    if (itemToClose.property_status == 0) {
                        itemToClose.property_status = 1
                    } else if (itemToClose.property_status == 1) {
                        itemToClose.property_status = 0
                    }
                    setData(data => data.map(item =>
                        item.property_id === itemToClose.property_id ? itemToClose : item
                    ));
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

    const ItemView = ({ item, index }) => {
        if (item.property_type.toLowerCase() === "Residential".toLowerCase()) {
            if (item.property_for.toLowerCase() === "Rent".toLowerCase()) {
                return (
                    <div onClick={() => navigateToDetails(item, "Rent")} key={index}>
                        <CardResidentialRent navigation={navigation} item={item} deleteMe={deleteMe} closeMe={closeMe} displayMatchCount={false} displayMatchPercent={true} />
                    </div>
                );
            } else if (item.property_for.toLowerCase() === "Sell".toLowerCase()) {
                return (
                    <div onClick={() => navigateToDetails(item, "Sell")} key={index}>
                        <CardResidentialSell navigation={navigation} item={item} deleteMe={deleteMe} closeMe={closeMe} displayMatchCount={false} displayMatchPercent={true} />
                    </div>
                );
            }
        } else if (item.property_type.toLowerCase() === "Commercial".toLowerCase()) {
            if (item.property_for.toLowerCase() === "Rent".toLowerCase()) {
                return (
                    <div onClick={() => navigateToDetails(item, "Rent")} key={index}>
                        <CardCommercialRent navigation={navigation} item={item} deleteMe={deleteMe} closeMe={closeMe} displayMatchCount={false} displayMatchPercent={true} />
                    </div>
                );
            } else if (item.property_for.toLowerCase() === "Sell".toLowerCase()) {
                return (
                    <div onClick={() => navigateToDetails(item, "Sell")} key={index}>
                        <CardCommercialSell navigation={navigation} item={item} deleteMe={deleteMe} closeMe={closeMe} displayMatchCount={false} displayMatchPercent={true} />
                    </div>
                );
            }
        }
    };

    useEffect(() => {
        if (props.residentialPropertyList.length > 0) {
            setData(props.residentialPropertyList)
        }
    }, [props.residentialPropertyList])

    return (
        <div className="flex flex-col h-full bg-gray-100">
            <div style={{
                display: 'flex',
                alignItems: 'center',
                padding: '15px 20px',
                borderBottom: '1px solid #d0d0d0',
                backgroundColor: '#fff',
                position: 'sticky',
                top: 0,
                zIndex: 10,
            }}>
                <div onClick={handleBack} style={{
                    cursor: 'pointer',
                    marginRight: '15px',
                    display: 'flex',
                    alignItems: 'center',
                }}>
                    <MdArrowBack size={24} color="#333" />
                </div>
                <h1 style={{
                    fontSize: '20px',
                    fontWeight: '600',
                    color: '#333',
                    margin: 0,
                }}>Matched Properties</h1>
            </div>
            {loading ? (
                <div className="flex flex-1 justify-center items-center bg-gray-100 bg-opacity-40">
                    <div className="loader">Loading...</div>
                </div>
            ) : (
                <div className="flex flex-col flex-1">
                    <div style={styles.tabContainer}>
                        {reqUserId === customerAgentId && (
                            <div
                                style={{ ...styles.tab, ...(selectedTab === 0 ? styles.activeTab : {}), cursor: 'pointer' }}
                                onClick={() => setSelectedTab(0)}
                            >
                                <span style={styles.tabText}>My Properties</span>
                            </div>
                        )}
                        <div
                            style={{ ...styles.tab, ...(selectedTab === 1 ? styles.activeTab : {}), cursor: 'pointer' }}
                            onClick={() => setSelectedTab(1)}
                        >
                            <span style={styles.tabText}>{reqUserId === customerAgentId ? "Other's Properties" : "My Properties"}</span>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-2">
                        {selectedTab === 0 && (
                            matchedPropertiesDetailsMine.length > 0 ? (
                                matchedPropertiesDetailsMine.map((item, index) => (
                                    <ItemView item={item} index={index} key={index} />
                                ))
                            ) : (
                                <div className="flex flex-1 justify-center items-center h-full">
                                    <span className="text-gray-500">No Matched Customer Found</span>
                                </div>
                            )
                        )}
                        {selectedTab === 1 && (
                            matchedPropertiesDetailsOther.length > 0 ? (
                                matchedPropertiesDetailsOther.map((item, index) => (
                                    <ItemView item={item} index={index} key={index} />
                                ))
                            ) : (
                                <div className="flex flex-1 justify-center items-center h-full">
                                    <span className="text-gray-500">No Matched Customer Found</span>
                                </div>
                            )
                        )}
                    </div>


                </div>
            )}



            <Snackbar
                visible={isVisible}
                textMessage={errorMessage}
                actionHandler={dismissSnackBar}
                actionText="OK"
            />
        </div>
    );
};

const styles = {
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
        padding: '10px 20px',
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
    residentialPropertyList: state.AppReducer.residentialPropertyList,
});
const mapDispatchToProps = {
    setResidentialPropertyList,
    setAnyItemDetails,
    setPropertyDetails
};
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(MatchedProperties);
