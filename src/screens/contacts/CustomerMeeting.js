import React, { useState, useRef, useEffect } from "react";
import { connect } from "react-redux";
import Button from "./../../components/Button";
import { MdClose, MdAddCircleOutline } from "react-icons/md";
import { AiOutlinePlusCircle } from "react-icons/ai";
import Snackbar from "./../../components/SnackbarComponent";
import axios from "axios";
import { dateFormat } from "./../../utils/methods";
import { SERVER_URL } from "./../../utils/Constant";
import {
    setUserMobile,
    setUserDetails,
    setPropReminderList,
    setPropListForMeeting,
    setCustomerMeetingFormState
} from "./../../reducers/Action";
import PropertyReminder from "../property/PropertyReminder";
import * as  AppConstant from "./../../utils/AppConstant";
import CustomButtonGroup from "./../../components/CustomButtonGroup";

const ampmArray = [{ text: "AM" }, { text: "PM" }];

const CustomerMeeting = props => {
    const { navigation } = props;
    const item = props.route.params.item; // customer item
    const category = props.route.params.category;

    const [newDate, setNewDate] = React.useState("");
    const [newTime, setNewTime] = React.useState("");
    const [clientName, setClientName] = useState(item.customer_details.name);
    const [clientMobile, setClientMobile] = useState(
        item.customer_details.mobile1 || item.customer_details.mobile2 || item.customer_details.mobile || item.customer_details.phone || item.mobile || item.phone || ""
    );

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
        setHour("");
        setMinutes("");
        setAMPMIndex(-1);
        setReminderType("Call");
        props.setPropListForMeeting([])
        props.setCustomerMeetingFormState(null);
    }

    useEffect(() => {
        if (props.customerMeetingFormState && props.customerMeetingFormState.customerId === item.customer_id) {
            setReminderType(props.customerMeetingFormState.remiderType || "Call");
            setNewDate(props.customerMeetingFormState.newDate || "");
            setNewTime(props.customerMeetingFormState.newTime || "");
            setAMPMIndex(props.customerMeetingFormState.ampmIndex || -1);
            setHour(props.customerMeetingFormState.hour || "");
            setMinutes(props.customerMeetingFormState.minutes || "");
        } else {
            clearState();
        }
    }, []);

    useEffect(() => {
        const formState = {
            remiderType,
            newDate,
            newTime,
            ampmIndex,
            hour,
            minutes,
            customerId: item.customer_id
        };
        props.setCustomerMeetingFormState(formState);
    }, [remiderType, newDate, newTime, ampmIndex, hour, minutes]);

    const checkHourValidation = hour => {
        setIsVisible(false);
        if (parseInt(hour) > 24 || parseInt(hour) < 0) {
            setErrorMessage("Hours can between 0 to 24 only");
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
        setModalVisible(false);
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
        const categoryArray = [];
        props.propListForMeeting.map(x => {
            categoryArray.push(x.id);
        });

        const reminderDetails = {
            req_user_id: props.userDetails.works_for,
            meeting_creator_id: props.userDetails.works_for,
            agent_id_of_client: item.agent_id,
            category: category,
            category_ids: categoryArray,
            category_type: item.customer_locality.property_type,
            category_for: item.customer_locality.property_for,
            reminder_for: remiderType,
            client_name: clientName.trim(),
            client_mobile: clientMobile.trim(),
            client_id: item.customer_id,
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
                    clearState()
                },
                error => {
                    clearState()
                }
            );
    };

    const getCustomerReminderList = () => {
        const propertyId = {
            req_user_id: props.userDetails.works_for,
            customer_id: item.customer_id,
            agent_id_of_client: item.agent_id
        };
        setLoading(true);

        axios
            .post(
                SERVER_URL + "/getCustomerReminderList",
                propertyId
            )
            .then(
                response => {
                    if (response.data && response.data.length > 0) {
                        props.setPropReminderList(response.data);
                        setReminderListX(response.data);
                        setLoading(false);
                    } else {
                        props.setPropReminderList([]);
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
        getCustomerReminderList();
    }, [propertyIdX]);

    const remove = item => {
        const x = props.propListForMeeting.filter(z => z.id !== item.id);
        props.setPropListForMeeting(x);
    };

    return (
        <div style={{ flex: 1, backgroundColor: "#f5f5f5" }}>
            <div style={styles.container}>
                <div>
                    <p style={{ marginTop: 10, marginBottom: 10, fontSize: 14, color: '#000', fontWeight: '500' }}>
                        Create a call/visiting schedule to show property to client and get
                        reminder on time
                    </p>
                    <div style={{ borderBottom: '1px solid #ccc' }} />
                    <p style={{ marginTop: 20, marginBottom: 15, fontSize: 14, color: '#000', fontWeight: '500' }}>
                        Reminder For ?
                    </p>
                    <div style={styles.propSubSection}>
                        <CustomButtonGroup
                            buttons={AppConstant.REMINDER_FOR_OPTION}
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

                    <div style={{ marginBottom: 15, marginTop: 25 }}>
                        <label style={{ display: 'block', marginBottom: 5, color: '#000', fontWeight: '500' }}>Customer Name*</label>
                        <input
                            disabled={true}
                            value={clientName}
                            onChange={e => setClientName(e.target.value)}
                            onFocus={() => setIsVisible(false)}
                            style={{ ...styles.input, backgroundColor: "#ffffff", color: "#000", borderColor: '#999' }}
                        />
                    </div>

                    <div style={{ marginBottom: 15 }}>
                        <label style={{ display: 'block', marginBottom: 5, color: '#333', fontWeight: '500' }}>Customer Mobile*</label>
                        <input
                            disabled={true}
                            value={clientMobile}
                            onChange={e => setClientMobile(e.target.value)}
                            onFocus={() => setIsVisible(false)}
                            type="text"
                            style={{ ...styles.input, backgroundColor: "#ffffff", color: "#000", borderColor: '#999' }}
                        />
                    </div>

                    {props.propListForMeeting.length > 0 ? (
                        <div style={{ marginBottom: 10 }}>
                            <p style={{ marginBottom: 5, marginTop: 10, color: '#000', fontWeight: '500' }}>Property List</p>
                            {props.propListForMeeting.map((item, index) => (
                                <div
                                    key={index}
                                    style={{
                                        backgroundColor: "#eeeeee",
                                        marginTop: 1,
                                        flexDirection: "row",
                                        justifyContent: "space-between",
                                        display: 'flex'
                                    }}
                                >
                                    <span style={{ padding: 10, color: '#000' }}>{item.name}</span>
                                    <div onClick={() => remove(item)} style={{ cursor: 'pointer' }}>
                                        <div style={{ marginTop: 0, backgroundColor: "#ffffff" }}>
                                            <div style={{ margin: 9 }}>
                                                <MdClose color={"#757575"} size={20} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : null}
                    <div
                        onClick={() =>
                            navigation.navigate("PropertyListForMeeting", {
                                item: item,
                                property_type: item.customer_locality.property_type,
                                property_for: item.customer_locality.property_for,
                                displayMatchCount: false
                            })
                        }
                        style={{ cursor: 'pointer' }}
                    >
                        <div style={{ flexDirection: "row", marginTop: 10, display: 'flex', alignItems: 'center' }}>
                            <AiOutlinePlusCircle color={"#00BFFF"} size={26} />
                            <span
                                style={{ color: "#00BFFF", paddingLeft: 10, fontWeight: "500" }}
                            >
                                Add {item.customer_locality.property_type} Properties For{" "}
                                {item.customer_locality.property_for}
                            </span>
                        </div>
                    </div>

                    <div style={{ flexDirection: "row", marginTop: 20, display: 'flex' }}>
                        <div style={{ flex: 1, marginRight: 10 }}>
                            <label style={{ display: 'block', marginBottom: 5, color: '#333', fontWeight: '500' }}>Date*</label>
                            <input
                                type={newDate ? "date" : "text"}
                                onFocus={(e) => e.target.type = 'date'}
                                onBlur={(e) => { if (!newDate) e.target.type = 'text' }}
                                value={newDate}
                                onChange={e => setNewDate(e.target.value)}
                                placeholder="DD/MM/YYYY"
                                style={{ ...styles.input, color: '#000', borderColor: '#999' }}
                            />
                        </div>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: 'block', marginBottom: 5, color: '#333', fontWeight: '500' }}>Time*</label>
                            <input
                                readOnly
                                value={newTime}
                                onClick={() => setModalVisible(true)}
                                placeholder="Select Time"
                                style={{ ...styles.input, color: '#000', borderColor: '#999' }}
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
                        display: 'flex'
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
                    alignItems: 'center'
                }}>
                    <div style={styles.modalView}>
                        <div style={{ flexDirection: "row", display: 'flex', gap: 15, alignItems: 'center' }}>
                            <input
                                type="number"
                                value={hour}
                                onChange={e => checkHourValidation(e.target.value)}
                                style={styles.timeInput}
                                placeholder="Hour*"
                            />
                            <input
                                type="number"
                                value={minutes}
                                onChange={e => checkMinutesValidation(e.target.value)}
                                style={styles.timeInput}
                                placeholder="Minute*"
                            />

                            <CustomButtonGroup
                                selectedButtonStyle={{ backgroundColor: "#00BFFF" }}
                                onButtonPress={(index) => selectAMPMIndex(index)}
                                selectedIndices={[ampmIndex]}
                                buttons={ampmArray}
                                buttonTextStyle={{ textAlign: "center" }}
                                selectedButtonTextStyle={{ color: "#fff" }}
                                containerStyle={{ borderRadius: 5, width: 70, height: 82, borderColor: '#757575', borderWidth: 1 }}
                                vertical={true}
                            />
                        </div>

                        <div
                            style={{
                                flexDirection: "row",
                                marginTop: 25,
                                marginBottom: 5,
                                display: 'flex',
                                justifyContent: 'flex-end',
                                width: '100%'
                            }}
                        >
                            <div
                                style={styles.textButton}
                                onClick={() => {
                                    setModalVisible(false);
                                }}
                            >
                                <span style={styles.textButtonLabel}>Cancel</span>
                            </div>
                            <div
                                style={styles.textButton}
                                onClick={() => {
                                    onApply();
                                }}
                            >
                                <span style={styles.textButtonLabel}>Apply</span>
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
        marginLeft: 5,
        marginRight: 5
    },
    inputContainerStyle: {
        margin: 8
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        boxShadow: "0px 2px 4px rgba(0,0,0,0.25)",
        display: 'flex',
        flexDirection: 'column'
    },
    timeInput: {
        width: 80,
        height: 80,
        textAlign: 'center',
        fontSize: 16,
        borderRadius: 5,
        border: '1px solid #757575',
        backgroundColor: "#ffffff",
        outline: 'none',
        color: '#000'
    },
    textButton: {
        marginLeft: 10,
        marginRight: 10,
        padding: 10,
        backgroundColor: 'transparent',
        cursor: 'pointer'
    },
    textButtonLabel: {
        color: "#000",
        fontWeight: "500",
        textAlign: "center",
        fontSize: 16
    },
    input: {
        width: '100%',
        padding: 10,
        borderRadius: 5,
        border: '1px solid #ccc',
        backgroundColor: "#ffffff",
        outline: 'none',
        fontSize: 16
    },
    propSubSection: {
        marginBottom: 10
    }
};

const mapStateToProps = state => ({
    userDetails: state.AppReducer.userDetails,
    propReminderList: state.AppReducer.propReminderList,
    propListForMeeting: state.AppReducer.propListForMeeting,
    customerMeetingFormState: state.AppReducer.customerMeetingFormState
});

const mapDispatchToProps = {
    setUserMobile,
    setUserDetails,
    setPropReminderList,
    setPropListForMeeting,
    setCustomerMeetingFormState
};
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(CustomerMeeting);
