import React, { useState, useRef, useEffect } from "react";
import { MdArrowBack, MdDateRange } from "react-icons/md";
import { useNavigate } from "react-router-dom";
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

    setCustomerDetailsForMeeting,
    setMeetingFormState
} from "./../../reducers/Action";
import PropertyReminder from '../property/PropertyReminder';
import { SERVER_URL } from "./../../utils/Constant";
import * as AppConstant from "./../../utils/AppConstant";
import CustomButtonGroup from "./../../components/CustomButtonGroup";

const reminderForArray = ["Call", "Meeting", "Property Visit"];
const ampmArray = [{ text: "AM" }, { text: "PM" }];

const Meeting = props => {
    const navigate = useNavigate();
    const handleBack = () => {
        if (window.history.length > 1 && window.history.state && window.history.state.idx > 0) {
            navigate(-1);
        } else {
            navigate('/listing');
        }
    };

    const { navigation } = props;
    const item = props.route?.params?.item || {};
    const category = props.route?.params?.category;

    const getTodayString = () => {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const [newDate, setNewDate] = React.useState(getTodayString());
    const [newTime, setNewTime] = React.useState("");
    const dateInputRef = useRef(null);
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
        setNewDate(getTodayString());
        setNewTime("");
        setClientName("");
        setClientMobile("");
        setHour("");
        setMinutes("");
        setAMPMIndex(-1);
        props.setCustomerDetailsForMeeting(null);
        props.setMeetingFormState(null);
    };

    useEffect(() => {
        if (props.meetingFormState) {
            setReminderType(props.meetingFormState.remiderType || "Call");
            // Always set date to today on mount, ignoring stored state as per user request
            setNewDate(getTodayString());
            setNewTime(props.meetingFormState.newTime || "");
            setAMPMIndex(props.meetingFormState.ampmIndex || -1);
            setHour(props.meetingFormState.hour || "");
            setMinutes(props.meetingFormState.minutes || "");
        } else {
            setClientName("");
            setClientMobile("");
            setClientId("");
            setNewDate(getTodayString());
        }
    }, []);

    useEffect(() => {
        const formState = {
            remiderType,
            newDate,
            newTime,
            ampmIndex,
            hour,
            minutes
        };
        props.setMeetingFormState(formState);
    }, [remiderType, newDate, newTime, ampmIndex, hour, minutes]);

    useEffect(() => {
        console.log("Meeting: customerDetailsForMeeting prop changed:", props.customerDetailsForMeeting);
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
        <div style={{ flex: 1, backgroundColor: "#E6E6E6" }}>
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
                }}>Schedule Meeting</h1>
            </div>
            <div style={styles.container}>
                <div>
                    <p style={{ marginTop: 10, marginBottom: 10, fontSize: 16, color: '#000', fontWeight: '500' }}>
                        Create a call/visiting schedule to show property to client and get
                        reminder on time
                    </p>
                    <div style={{ height: 1, backgroundColor: '#ccc', width: '100%' }} />
                    <p style={{ marginTop: 20, marginBottom: 15, fontSize: 16, color: '#000', fontWeight: '500' }}>
                        Reminder For ?
                    </p>

                    <div style={styles.propSubSection}>
                        <CustomButtonGroup
                            buttons={AppConstant.REMINDER_FOR_OPTION}
                            accessibilityLabelId="reminder_type"
                            selectedIndices={[AppConstant.REMINDER_FOR_OPTION.findIndex(option => option.text === remiderType)]}
                            isMultiSelect={false}
                            buttonStyle={{ backgroundColor: '#FFFFFF', borderRadius: '6px', border: '1px solid #E5E7EB', padding: '8px 20px', fontSize: '14px', fontWeight: '500', color: '#374151', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)', width: '140px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                            selectedButtonStyle={{ backgroundColor: 'rgba(0, 163, 108, .2)' }}
                            buttonTextStyle={{ color: '#000' }}
                            selectedButtonTextStyle={{ color: '#000' }}
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
                                <label className="block text-xs font-medium text-gray-500 mb-1">Customer Name*</label>
                                <input
                                    disabled={true}
                                    value={clientName}
                                    onChange={e => setClientName(e.target.value)}
                                    onFocus={() => setIsVisible(false)}
                                    className="w-full bg-gray-50 text-base text-gray-900 border-b-2 border-gray-200 focus:outline-none py-1 px-2"
                                />
                            </div>

                            <div style={{ marginTop: 8 }}>
                                <label className="block text-xs font-medium text-gray-500 mb-1">Customer Mobile*</label>
                                <input
                                    disabled={true}
                                    value={clientMobile}
                                    onChange={e => setClientMobile(e.target.value)}
                                    onFocus={() => setIsVisible(false)}
                                    type="text"
                                    className="w-full bg-gray-50 text-base text-gray-900 border-b-2 border-gray-200 focus:outline-none py-1 px-2"
                                />
                            </div>
                        </div>
                    ) : null}
                    <div className="flex flex-row mt-5 gap-2">
                        <div className="flex-1 w-full min-w-0">
                            <label className="block mb-1 text-gray-800 font-medium">Date*</label>
                            <div className="relative w-full bg-white rounded border border-gray-400 h-12 flex items-center">
                                <style>
                                    {`
                                        input[type="date"]::-webkit-calendar-picker-indicator {
                                            display: none;
                                            -webkit-appearance: none;
                                        }
                                        input[type="date"] {
                                            color-scheme: light;
                                        }
                                    `}
                                </style>
                                {!newDate && (
                                    <span className="absolute left-0 top-0 p-2.5 text-gray-500 pointer-events-none text-base">
                                        DD/MM/YYYY
                                    </span>
                                )}
                                <input
                                    type="date"
                                    min={(() => {
                                        const now = new Date();
                                        const year = now.getFullYear();
                                        const month = String(now.getMonth() + 1).padStart(2, '0');
                                        const day = String(now.getDate()).padStart(2, '0');
                                        return `${year}-${month}-${day}`;
                                    })()}
                                    value={newDate}
                                    onChange={e => {
                                        const selectedDate = e.target.value;
                                        const now = new Date();
                                        const year = now.getFullYear();
                                        const month = String(now.getMonth() + 1).padStart(2, '0');
                                        const day = String(now.getDate()).padStart(2, '0');
                                        const today = `${year}-${month}-${day}`;

                                        if (selectedDate && selectedDate < today) {
                                            // Prevent selecting past date
                                            return;
                                        }
                                        setNewDate(selectedDate);
                                    }}
                                    onClick={(e) => {
                                        try {
                                            if (e.target.showPicker) e.target.showPicker();
                                        } catch (err) {
                                            console.log(err);
                                        }
                                    }}
                                    onKeyDown={(e) => e.preventDefault()}
                                    className={`w-full h-full p-2.5 rounded bg-transparent outline-none text-base ${!newDate ? 'text-transparent' : 'text-black'}`}
                                />
                                <div className="absolute right-3 top-3 pointer-events-none">
                                    <MdDateRange color="#757575" size={20} />
                                </div>
                            </div>
                        </div>
                        <div className="flex-1 w-full min-w-0">
                            <label className="block mb-1 text-gray-800 font-medium">Time*</label>
                            <input
                                readOnly
                                value={newTime}
                                onClick={() => setModalVisibleTemp(true)}
                                placeholder="Select Time"
                                className="w-full h-12 p-2.5 rounded border border-gray-400 bg-white text-black outline-none text-base"
                            />
                        </div>
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
            {
                loading ? <div
                    style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: 'rgba(245,245,245, .4)',
                        padding: 20
                    }}
                >
                    <div>Loading...</div>
                </div> : <PropertyReminder navigation={navigation} reminderListX={reminderListX} />
            }


            <Snackbar
                visible={isVisible}
                textMessage={errorMessage}
                position={"top"}
                actionHandler={() => dismissSnackBar()}
                actionText="OK"
            />

            {
                modalVisible && (
                    <div style={styles.centeredView1}>
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
                                    selectedButtonStyle={{ backgroundColor: 'rgba(0, 163, 108, .2)', borderColor: 'rgba(0, 163, 108, .2)' }}
                                    onButtonPress={(index) => selectAMPMIndex(index)}
                                    selectedIndices={[ampmIndex]}
                                    buttons={ampmArray}
                                    buttonStyle={{ backgroundColor: '#fff', border: '1px solid #ccc', borderRadius: '5px', padding: '10px 0', width: '100%', marginBottom: '4px' }}
                                    buttonTextStyle={{ textAlign: "center", color: "#333", fontSize: "16px", fontWeight: "500" }}
                                    selectedButtonTextStyle={{ color: "#000", fontSize: "16px", fontWeight: "500" }}
                                    containerStyle={{ width: 80 }}
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
                                        setModalVisibleTemp(!modalVisible);
                                    }}
                                >
                                    <span style={styles.textButtonLabel}>Cancel</span>
                                </div>
                                <div
                                    style={styles.textButton}
                                    onClick={() => {
                                        onApply(!modalVisible);
                                    }}
                                >
                                    <span style={styles.textButtonLabel}>Apply</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }
        </div >
    );
};

const styles = {
    container: {
        flex: 1,
        marginTop: 10,
        marginLeft: 10,
        marginRight: 10,
        display: 'flex',
        flexDirection: 'column'
    },
    propSubSection: {
        marginBottom: 20
    },
    input: {
        width: '100%',
        height: '45px',
        padding: 10,
        borderRadius: 5,
        border: '1px solid #ccc',
        fontSize: 16,
        backgroundColor: '#fff',
        boxSizing: 'border-box'
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
    }
};

const mapStateToProps = state => ({
    userDetails: state.AppReducer.userDetails,
    propReminderList: state.AppReducer.propReminderList,
    customerDetailsForMeeting: state.AppReducer.customerDetailsForMeeting,
    meetingFormState: state.AppReducer.meetingFormState
});

const mapDispatchToProps = {
    setUserMobile,
    setUserDetails,
    setPropReminderList,
    setPropListForMeeting,
    setCustomerDetailsForMeeting,
    setMeetingFormState
};
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Meeting);
