import React, { useEffect, useState } from "react";
import { MdArrowBack } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import Button from "./../../../../components/Button";
import axios from "axios";
import { SERVER_URL } from "./../../../../utils/Constant";
import { numDifferentiation } from "./../../../../utils/methods";
import { connect } from "react-redux";
import {
    setPropertyType, setPropertyDetails, setCustomerDetails,
    setStartNavigationPoint, setResidentialCustomerList
} from "./../../../../reducers/Action";

// Mock Avatar component for web
const Avatar = ({ title, size, avatarStyle, titleStyle }) => (
    <div
        style={{
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: "#ffffff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            ...avatarStyle,
        }}
    >
        <span style={{ fontSize: size / 2, ...titleStyle }}>{title}</span>
    </div>
);

const AddNewCustomerRentResidentialFinalDetails = props => {
    const navigate = useNavigate();
    const [isVisible, setIsVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [customerFinalDetails, setCustomerFinalDetails] = useState(null);
    const [location, setLocation] = useState([])
    const [bhk, setBHK] = useState(null);
    const [possessionDate, setPossessionDate] = useState(null);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        if (customerFinalDetails === null) {
            getPropFinalDetails();
        }
    }, [customerFinalDetails]);

    useEffect(() => {
        if (customerFinalDetails !== null) {
            const availableDateStr =
                customerFinalDetails.customer_rent_details.available_from;
            const availableDate = new Date(availableDateStr);
            const t = convert(availableDate);
            var today = new Date();
            const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
            const diffDays = Math.round((today - new Date(t)) / oneDay);
            // // console.log(diffDays);
            if (diffDays >= 0) {
                setPossessionDate("Immediately");
            } else {
                setPossessionDate(availableDateStr);
            }
        }
    }, [customerFinalDetails]);

    const getPropFinalDetails = () => {
        const customer = props.customerDetails
        console.log(JSON.stringify(customer));
        setCustomerFinalDetails(customer);
        if (customer && customer.customer_locality && customer.customer_locality.location_area) {
            const locX = []
            customer.customer_locality.location_area.map(item => {
                console.log(item.main_text);
                locX.push(item.main_text)
            })
            setLocation(locX)
        }
    };

    const convert = str => {
        var date = new Date(str),
            mnth = ("0" + (date.getMonth() + 1)).slice(-2),
            day = ("0" + date.getDate()).slice(-2);
        return [date.getFullYear(), mnth, day].join("-");
    };

    const dismissSnackBar = () => {
        setIsVisible(false);
    };

    const login = async () => {
        navigate("/login");
        setModalVisible(false);
    }


    const send = async () => {
        if (props.userDetails === null) {
            console.log("You are not logged in, please login");
            setModalVisible(true);
            return;
        }
        setLoading(true);
        customerFinalDetails.agent_id = props.userDetails.works_for;
        console.log("Sending customer details:", JSON.stringify(customerFinalDetails));

        axios
            .post(
                SERVER_URL + "/addNewResidentialCustomer",
                customerFinalDetails
            )
            .then(
                async response => {
                    if (response.data !== null) {
                        props.setCustomerDetails(null);
                        props.setResidentialCustomerList([...props.residentialCustomerList, response.data])
                        if (props.startNavigationPoint === null) {
                            navigate("/contacts", { state: { didDbCall: true } });

                        } else {
                            navigate("/contacts/CustomerListForMeeting");
                        }
                        props.setStartNavigationPoint(null)
                        setLoading(false);

                    } else {
                        setErrorMessage(
                            "Error: Seems there is some network issue, please try later"
                        );
                        setLoading(false);
                    }
                },
                error => {
                    setLoading(false);
                }
            );
    };

    return customerFinalDetails ? (
        <div style={{ flex: 1, backgroundColor: "#ffffff" }}>
            {/* Header */}
            <div style={styles.headerContainer}>
                <div style={styles.backButtonContainer} onClick={() => navigate(-1)}>
                    <MdArrowBack size={24} color="#000000" />
                </div>
                <div style={styles.headerTitleContainer}>
                    <p style={styles.headerTitle}>Preview Customer</p>
                </div>
            </div>
            {/* Gray Header with Avatar */}
            <div className="bg-gray-300 p-4 flex items-start">
                <Avatar
                    square
                    size={80}
                    title={
                        customerFinalDetails.customer_details.name &&
                        customerFinalDetails.customer_details.name.slice(0, 1)
                    }
                    titleStyle={{ color: "#555", fontSize: 40 }}
                    avatarStyle={{
                        backgroundColor: "transparent",
                    }}
                />
                <div className="ml-4 pt-2">
                    <span className="block text-lg font-bold text-black">
                        {customerFinalDetails.customer_details.name}
                    </span>
                    <span className="block text-sm text-gray-800">
                        {customerFinalDetails.customer_details.mobile1}
                    </span>
                    <span className="block text-sm text-gray-800">
                        {customerFinalDetails.customer_details.address}
                    </span>
                </div>
            </div>

            {/* Stats Row with Vertical Dividers */}
            <div className="bg-gray-200 p-4 border-t border-gray-300">
                <div className="flex justify-between items-center">
                    <div className="text-center">
                        <p className="text-base font-bold text-black">
                            {customerFinalDetails.customer_property_details.bhk_type}
                        </p>
                        <p className="text-xs text-gray-600">Looking For</p>
                    </div>
                    <div className="w-px bg-gray-400 h-10 mx-2 self-center"></div>
                    <div className="text-center">
                        <p className="text-base font-bold text-black">
                            {numDifferentiation(
                                customerFinalDetails.customer_rent_details.expected_rent
                            )}
                        </p>
                        <p className="text-xs text-gray-600">
                            Max {customerFinalDetails.customer_locality.property_for}
                        </p>
                    </div>
                    <div className="w-px bg-gray-400 h-10 mx-2 self-center"></div>
                    <div className="text-center">
                        <p className="text-base font-bold text-black">
                            {numDifferentiation(
                                customerFinalDetails.customer_rent_details.expected_deposit
                            )}
                        </p>
                        <p className="text-xs text-gray-600">Max Deposit</p>
                    </div>
                    <div className="w-px bg-gray-400 h-10 mx-2 self-center"></div>
                    <div className="text-center">
                        <p className="text-base font-bold text-black">
                            {customerFinalDetails.customer_property_details.furnishing_status}
                        </p>
                        <p className="text-xs text-gray-600">Furnishing</p>
                    </div>
                </div>
            </div>

            {/* Details Section */}
            <div className="mt-2 bg-white px-4 pt-4">
                <div className="pb-2 border-b border-gray-100">
                    <h3 className="text-sm font-medium text-gray-900">Details</h3>
                </div>
                <div className="flex justify-between py-4">
                    <div className="flex flex-col space-y-4 w-1/2">
                        <div>
                            <p className="text-base font-bold text-black">
                                {customerFinalDetails.customer_locality.city}
                            </p>
                            <p className="text-xs text-gray-600">City</p>
                        </div>
                        <div>
                            <p className="text-base font-bold text-black">
                                {location.join(', ')}
                            </p>
                            <p className="text-xs text-gray-600">Locations</p>
                        </div>
                        <div>
                            <p className="text-base font-bold text-black">
                                {possessionDate}
                            </p>
                            <p className="text-xs text-gray-600">Possession</p>
                        </div>
                        <div>
                            <p className="text-base font-bold text-black">
                                {customerFinalDetails.customer_locality.preferred_tenants}
                            </p>
                            <p className="text-xs text-gray-600">Tenant Type</p>
                        </div>
                    </div>
                    <div className="flex flex-col space-y-4 w-1/2 items-end text-right">
                        <div>
                            <p className="text-base font-bold text-black">
                                {customerFinalDetails.customer_property_details.parking_type}
                            </p>
                            <p className="text-xs text-gray-600">Parking</p>
                        </div>
                        <div>
                            <p className="text-base font-bold text-black">
                                {customerFinalDetails.customer_property_details.lift}
                            </p>
                            <p className="text-xs text-gray-600">Lift Mandatory</p>
                        </div>
                    </div>
                </div>
            </div>

            <div style={{ margin: 20 }}>
                <Button title="ADD" onPress={() => send()} />
            </div>

            {modalVisible && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <div style={styles.modalView}>
                        <span style={styles.modalText}>
                            You are not logged in, please login.
                        </span>

                        <div
                            style={{
                                position: "absolute",
                                flexDirection: "row",
                                right: 0,
                                bottom: 0,
                                marginTop: 20,
                                marginBottom: 20,
                                padding: 20,
                                display: 'flex'
                            }}
                        >
                            <div
                                style={styles.cancelButton}
                                onClick={() => {
                                    setModalVisible(!modalVisible);
                                }}
                            >
                                <span style={styles.textStyle}>Cancel</span>
                            </div>
                            <div
                                style={styles.applyButton}
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

            {loading && <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 1000 }}>Loading...</div>}
        </div>
    ) : null;
};

const styles = {
    headerContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        padding: '10px 15px',
        borderBottom: '1px solid #e0e0e0',
        backgroundColor: '#fff',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
    },
    backButtonContainer: {
        cursor: 'pointer',
        marginRight: 15,
        display: 'flex',
        alignItems: 'center',
    },
    headerTitleContainer: {
        flex: 1,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1a1a1a',
        margin: 0,
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

    title: {
        fontSize: 16,
        fontWeight: "600",
        color: "#000000"
    },
    subTitle: {
        fontSize: 14,
        fontWeight: "400",
        color: "#000000"
    },
    detailsContainer: {
        height: 60,
        borderTopWidth: 1,
        borderTopColor: "#000000",
        backgroundColor: "#ffffff"
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
        fontWeight: "400",
        color: "#000000"
    },
    subDetailsValue: {
        fontSize: 14,
        fontWeight: "600",
        color: "#000000"
    },
    verticalLine: {
        height: "70%",
        width: 1,
        backgroundColor: "#000000"
    },
    horizontalLine: {
        borderBottomColor: "#000000",
        borderBottomWidth: 1,
        marginLeft: 5,
        marginRight: 5,
        paddingTop: 10
    },
    overviewContainer: {
        boxShadow: '0px 2px 4px rgba(0,0,0,0.25)',
        backgroundColor: "#ffffff"
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
    },
    centeredView1: {
        flex: 1,
        justifyContent: "center",
        alignContent: "center",
        marginTop: 22,
        marginBottom: 20
    },
    modalView: {
        margin: 20,
        height: 150,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        boxShadow: "0px 2px 4px rgba(0,0,0,0.25)",
        elevation: 5,
        display: 'flex',
        flexDirection: 'column',
        position: 'relative'
    },
    applyButton: {
        marginLeft: 10,
        marginRight: 10,
        cursor: 'pointer',
        padding: '10px 20px',
        backgroundColor: '#f0f0f0',
        borderRadius: 5
    },
    cancelButton: {
        marginLeft: 10,
        marginRight: 30,
        cursor: 'pointer',
        padding: '10px 20px',
        backgroundColor: '#f0f0f0',
        borderRadius: 5
    },
    modalText: {
        marginBottom: 16,
        fontWeight: "600",
        textAlign: "center",
        display: 'block'
    },
    textStyle: {
        fontWeight: 'bold',
        textAlign: 'center'
    }
};

const mapStateToProps = state => ({
    userDetails: state.AppReducer.userDetails,
    propertyDetails: state.AppReducer.propertyDetails,
    customerDetails: state.AppReducer.customerDetails,
    startNavigationPoint: state.AppReducer.startNavigationPoint,
    residentialCustomerList: state.AppReducer.residentialCustomerList
});
const mapDispatchToProps = {
    setPropertyType,
    setPropertyDetails,
    setCustomerDetails,
    setStartNavigationPoint,
    setResidentialCustomerList,
};
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AddNewCustomerRentResidentialFinalDetails);
