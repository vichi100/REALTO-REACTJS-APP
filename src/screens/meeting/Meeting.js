import React, { useState, useRef, useEffect } from "react";
import { connect } from "react-redux";
import Button from "./../../components/Button";
// import { ButtonGroup } from "@rneui/themed";
import { AiOutlinePlusCircle } from "react-icons/ai";
import Snackbar from "./../../components/SnackbarComponent";
import axios from "axios";
import { dateFormat } from "./../../utils/methods";
import {
    setUserMobile,
    setUserDetails,
    setPropReminderList,
    setPropListForMeeting,
    setCustomerDetailsForMeeting
} from "./../../reducers/Action";
import PropertyReminder from '../property/PropertyReminder';
import { SERVER_URL } from "./../../utils/Constant";
import * as AppConstant from "./../../utils/AppConstant";
import CustomButtonGroup from "./../../components/CustomButtonGroup";

const reminderForArray = ["Call", "Meeting", "Property Visit"];
const ampmArray = [{ text: "AM" }, { text: "PM" }];

const Meeting = props => {
    const { navigation } = props;
    const item = props.route?.params?.item || {};
    const category = props.route?.params?.category;

    const [newDate, setNewDate] = React.useState("");
    const [newTime, setNewTime] = React.useState("");
    const [clientName, setClientName] = useState("");
    const [clientMobile, setClientMobile] = useState("");
    const [clientId, setClientId] = useState("");
    const [isVisible, setIsVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [modalVisible, setModalVisible] = useState(false);
    const [hour, setHour] = useState("");
    const [minutes, setMinutes] = useState("");
    const [ampmIndex, setAMPMIndex] = useState(-1);
    const [propertyIdX, setPropertyIdX] = useState(item.property_id);
    const [loading, setLoading] = useState(false);
    const [reminderListX, setReminderListX] = useState([]);
    const [remiderType, setReminderType] = useState("Call");

    const clearState = () => {
        setNewDate("");
        setNewTime("");
        setClientName("");
        setClientMobile("");
        setHour("");
        setMinutes("");
        setAMPMIndex(-1);
        props.setCustomerDetailsForMeeting(null);
    };

    useEffect(() => {
        setClientName("");
        setClientMobile("");
        setClientId("");
    }, []);

    useEffect(() => {
        if (props.customerDetailsForMeeting) {
            setClientName(props.customerDetailsForMeeting.name);
            setClientMobile(props.customerDetailsForMeeting.mobile);
            setClientId(props.customerDetailsForMeeting.customer_id);
        }
    }, [props.customerDetailsForMeeting]);

    const setModalVisibleTemp = flag => {
        setModalVisible(flag);
    };

    const checkHourValidation = hour => {
        setIsVisible(false);
        if (parseInt(hour) > 12 || parseInt(hour) < 0) {
            setErrorMessage("Hours can between 0 to 12 only");
            setHour(hour);
            setIsVisible(true);
            return;
        }
        setHour(hour);
    };

    const checkMinutesValidation = minutes => {
        setIsVisible(false);
        if (parseInt(minutes) > 59 || parseInt(minutes) < 0) {
            setErrorMessage("Minutes can between 0 to 59 only");
            setMinutes(minutes);
            setIsVisible(true);
            return;
        }
        setMinutes(minutes);
    };

    const dismissSnackBar = () => {
        setIsVisible(false);
    };

    const selectAMPMIndex = index => {
        setAMPMIndex(index);
    };

    const onApply = () => {
        if (ampmIndex === -1) {
            setErrorMessage("AM / PM is missing");
            setIsVisible(true);
            return;
        }
        const timeX = hour + ":" + minutes + " " + ampmArray[ampmIndex].text;
        setNewTime(timeX);
        setModalVisibleTemp(false);
    };

    const onSubmit = () => {
        if (clientName.trim() === "") {
            setErrorMessage("Client name is missing");
            setIsVisible(true);
            return;
        } else if (clientMobile.trim() === "") {
            setErrorMessage("Client mobile is missing");
            setIsVisible(true);
            return;
        } else if (newDate.trim() === "") {
            setErrorMessage("Date is missing");
            setIsVisible(true);
            return;
        }
        send();
    };

    const send = () => {
        try {
            const reminderDetails = {
                req_user_id: props.userDetails.works_for,
                meeting_creator_id: props.userDetails.id,
                agent_id_of_client: props.customerDetailsForMeeting?.agent_id,
                category: category,
                category_ids: [item.property_id],
                category_type: item.property_type,
                category_for: item.property_for,
                reminder_for: remiderType,
                client_name: clientName.trim(),
                client_mobile: clientMobile.trim(),
                client_id: clientId,
                meeting_date: newDate.trim(),
                meeting_time: newTime.trim()
            };
            axios
                .post(
                    SERVER_URL + "/addNewReminder",
                    reminderDetails
                )
                .then(
                    response => {
                        if (response.data !== "fail") {
                            const x = [reminderDetails, ...props.propReminderList];
                            reminderListX.push(reminderDetails);
                            const m = [...reminderListX];
                            props.setPropReminderList(x);
                            setReminderListX(m);
                        }
                        clearState();
                    },
                    error => {
                        clearState();
                    }
                );
        } catch (error) {
            console.log("error: " + JSON.stringify(error));
        }
    };

    const getPropReminders = () => {
        const propertyId = {
            req_user_id: props.userDetails.id,
            agent_id: props.userDetails.works_for,
            property_id: propertyIdX
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
                        props.setPropReminderList(response.data);
                        setReminderListX(response.data);
                        setLoading(false);
                    } else {
                        props.setPropReminderList(response.data);
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
    }, [propertyIdX]);

    return (
        <div style={{ flex: 1, backgroundColor: "rgba(245,245,245, 0.2)", height: '100vh', overflowY: 'auto' }}>
            <div style={styles.container}>
                <div>
                    <p style={{ marginTop: 10, marginBottom: 10, fontSize: 14 }}>
                        Create a call/visiting schedule to show property to client and get
                        reminder on time
                    </p>
                    <div style={{ height: 1, backgroundColor: '#ccc', width: '100%' }} />
                    <p style={{ marginTop: 20, marginBottom: 15, fontSize: 14 }}>
                        Reminder For ?
                    </p>

                    <div style={styles.propSubSection}>
                        <CustomButtonGroup
                            buttons={AppConstant.REMINDER_FOR_OPTION}
                            accessibilityLabelId="reminder_type"
                            selectedIndices={[AppConstant.REMINDER_FOR_OPTION.findIndex(option => option.text === remiderType)]}
                            isMultiSelect={false}
                            buttonStyle={{ backgroundColor: '#fff' }}
                            selectedButtonStyle={{ backgroundColor: 'rgba(0, 163, 108, .2)' }}
                            buttonTextStyle={{ color: '#000' }}
                            selectedButtonTextStyle={{ color: '#000' }}
                            width={100}
                            onButtonPress={(index, button) => {
                                setReminderType(button.text);
                            }}
                        />
                    </div>
                    <div
                        onClick={() =>
                            navigation.navigate("CustomerListForMeeting", {
                                displayMatchCount: false,
                                displayMatchPercent: true
                            })
                        }
                        style={{ cursor: 'pointer' }}
                    >
                        <div style={{ flexDirection: "row", marginTop: 20, display: 'flex', alignItems: 'center' }}>
                            <AiOutlinePlusCircle color={"#00BFFF"} size={26} />
                            <span
                                style={{ color: "#00BFFF", paddingLeft: 10, fontWeight: "500" }}
                            >
                                Add Customer For Meeting.
                            </span>
                        </div>
                    </div>

                    {clientName ? (
                        <div>
                            <div style={{ marginTop: 25 }}>
                                <label style={{ display: 'block', marginBottom: 5 }}>Customer Name*</label>
                                <input
                                    disabled={true}
                                    value={clientName}
                                    onChange={e => setClientName(e.target.value)}
                                    onFocus={() => setIsVisible(false)}
                                    style={styles.input}
                                />
                            </div>

                            <div style={{ marginTop: 8 }}>
                                <label style={{ display: 'block', marginBottom: 5 }}>Customer Mobile*</label>
                                <input
                                    disabled={true}
                                    value={clientMobile}
                                    onChange={e => setClientMobile(e.target.value)}
                                    onFocus={() => setIsVisible(false)}
                                    type="number"
                                    style={styles.input}
                                />
                            </div>
                        </div>
                    ) : null}
                    <div style={{ flexDirection: "row", marginTop: 25, display: 'flex', gap: 10 }}>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: 'block', marginBottom: 5 }}>Date*</label>
                            <input
                                type="date"
                                value={newDate}
                                onChange={e => setNewDate(e.target.value)}
                                style={styles.input}
                            />
                        </div>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: 'block', marginBottom: 5 }}>Time*</label>
                            <input
                                type="time"
                                value={newTime}
                                onChange={e => setNewTime(e.target.value)}
                                style={styles.input}
                            />
                        </div>
                    </div>
                    <div
                        style={{
                            marginTop: 20,
                            marginBottom: 20
                        }}
                    >
                        <Button title="Save" onPress={() => onSubmit()} />
                    </div>
                </div>
                {/* Property releted reminder list */}
                {loading ? <div
                    style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: 'rgba(245,245,245, .4)',
                        padding: 20
                    }}
                >
                    <div>Loading...</div>
                </div> : <PropertyReminder navigation={navigation} reminderListX={reminderListX} />}
            </div>

            <Snackbar
                visible={isVisible}
                textMessage={errorMessage}
                position={"top"}
                actionHandler={() => dismissSnackBar()}
                actionText="OK"
            />

            {modalVisible && (
                <div style={styles.centeredView1}>
                    <div style={styles.modalView}>
                        <div style={{ flexDirection: "row", display: 'flex', gap: 10 }}>
                            <div style={{ width: 80 }}>
                                <label style={{ display: 'block', marginBottom: 5 }}>Hour*</label>
                                <input
                                    type="number"
                                    value={hour}
                                    onChange={e => checkHourValidation(e.target.value)}
                                    style={{ ...styles.input, textAlign: 'center' }}
                                    placeholder="Hour"
                                />
                            </div>
                            <div style={{ width: 90 }}>
                                <label style={{ display: 'block', marginBottom: 5 }}>Minute*</label>
                                <input
                                    type="number"
                                    value={minutes}
                                    onChange={e => checkMinutesValidation(e.target.value)}
                                    style={{ ...styles.input, textAlign: 'center' }}
                                    placeholder="Minute"
                                />
                            </div>

                            <CustomButtonGroup
                                selectedButtonStyle={{ backgroundColor: "rgba(27, 106, 158, 0.85)" }}
                                onButtonPress={(index) => selectAMPMIndex(index)}
                                selectedIndices={[ampmIndex]}
                                buttons={ampmArray}
                                buttonTextStyle={{ textAlign: "center" }}
                                selectedButtonTextStyle={{ color: "#fff" }}
                                containerStyle={{ borderRadius: 5, width: 70, height: 80 }}
                                vertical={true}
                            />
                        </div>

                        <div
                            style={{
                                flexDirection: "row",
                                marginTop: 20,
                                marginBottom: 15,
                                display: 'flex',
                                justifyContent: 'flex-end',
                                width: '100%'
                            }}
                        >
                            <div
                                style={{ ...styles.cancelButton, cursor: 'pointer' }}
                                onClick={() => {
                                    setModalVisibleTemp(!modalVisible);
                                }}
                            >
                                <span style={styles.textStyle}>Cancel</span>
                            </div>
                            <div
                                style={{ ...styles.applyButton, cursor: 'pointer' }}
                                onClick={() => {
                                    onApply(!modalVisible);
                                }}
                            >
                                <span style={styles.textStyle}>Apply</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const styles = {
    container: {
        flex: 1,
        marginTop: 20,
        marginLeft: 20,
        marginRight: 20,
        display: 'flex',
        flexDirection: 'column'
    },
    propSubSection: {
        marginBottom: 20
    },
    input: {
        width: '100%',
        padding: 10,
        borderRadius: 5,
        border: '1px solid #ccc',
        fontSize: 16,
        backgroundColor: '#fff'
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
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
    }
};

const mapStateToProps = state => ({
    userDetails: state.AppReducer.userDetails,
    propReminderList: state.AppReducer.propReminderList,
    customerDetailsForMeeting: state.AppReducer.customerDetailsForMeeting
});

const mapDispatchToProps = {
    setUserMobile,
    setUserDetails,
    setPropReminderList,
    setPropListForMeeting,
    setCustomerDetailsForMeeting
};
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Meeting);
