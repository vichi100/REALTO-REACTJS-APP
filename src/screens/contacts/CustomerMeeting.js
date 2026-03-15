import React, { useState, useRef, useEffect } from "react";
import { connect } from "react-redux";
import Button from "./../../components/Button";
import { MdClose, MdAddCircleOutline, MdArrowBack, MdDateRange } from "react-icons/md";
import { AiOutlinePlusCircle } from "react-icons/ai";
import Snackbar from "./../../components/SnackbarComponent";
import axios from "axios";
import { dateFormat } from "./../../utils/methods";
import { SERVER_URL } from "./../../utils/Constant";
import { useNavigate } from "react-router-dom";
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
    const navigate = useNavigate();

    const handleBack = () => {
        if (window.history.length > 1 && window.history.state && window.history.state.idx > 0) {
            navigate(-1);
        } else {
            navigate('/contacts');
        }
    };
    const item = props.route.params.item; // customer item
    const category = props.route.params.category;

    const getTodayString = () => {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const [newDate, setNewDate] = React.useState(getTodayString());
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
        setNewDate(getTodayString());
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
            // Always set date to today on mount
            setNewDate(getTodayString());
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
        <div className="flex flex-col h-full bg-neutral-800 overflow-y-auto">
            <div className="bg-neutral-900 border-b border-neutral-700 flex items-center p-4 shadow-sm sticky top-0 z-10">
                <div onClick={handleBack} className="cursor-pointer mr-4 flex items-center">
                    <MdArrowBack size={24} color="#333" />
                </div>
                <h1 className="text-lg font-semibold text-gray-200">Schedule Meeting</h1>
            </div>
            <div className="p-5 flex-1">
                <div>
                    <p className="mt-2 mb-2 text-sm font-medium text-white">
                        Create a call/visiting schedule to show property to client and get
                        reminder on time
                    </p>
                    <div className="border-b border-neutral-600" />
                    <p className="mt-5 mb-4 text-sm font-medium text-white">
                        Reminder For ?
                    </p>
                    <div className="mb-2">
                        <CustomButtonGroup
                            buttons={AppConstant.REMINDER_FOR_OPTION}
                            selectedIndices={[AppConstant.REMINDER_FOR_OPTION.findIndex(option => option.text === remiderType)]}
                            isMultiSelect={false}
                            buttonStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.08)', borderRadius: '6px', border: '1px solid #E5E7EB', padding: '8px 20px', fontSize: '14px', fontWeight: '500', color: 'var(--foreground)', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)', width: '140px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                            selectedButtonStyle={{ backgroundColor: 'rgba(0, 163, 108, .2)' }}
                            buttonTextStyle={{ color: 'var(--foreground)' }}
                            selectedButtonTextStyle={{ color: 'var(--foreground)' }}
                            onButtonPress={(index, button) => {
                                setReminderType(button.text);
                            }}
                        />
                    </div>

                    <div className="mb-4 mt-6">
                        <label className="block text-xs font-medium text-gray-500 mb-1">Customer Name*</label>
                        <input
                            disabled={true}
                            value={clientName}
                            onChange={e => setClientName(e.target.value)}
                            onFocus={() => setIsVisible(false)}
                            className="w-full bg-transparent text-base text-gray-100 border-b-2 border-neutral-700 focus:outline-none py-1"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-xs font-medium text-gray-500 mb-1">Customer Mobile*</label>
                        <input
                            disabled={true}
                            value={clientMobile}
                            onChange={e => setClientMobile(e.target.value)}
                            onFocus={() => setIsVisible(false)}
                            type="text"
                            className="w-full bg-transparent text-base text-gray-100 border-b-2 border-neutral-700 focus:outline-none py-1"
                        />
                    </div>

                    {props.propListForMeeting.length > 0 ? (
                        <div className="mb-2">
                            <p className="mb-1 mt-2 text-white font-medium">Property List</p>
                            {props.propListForMeeting.map((item, index) => (
                                <div
                                    key={index}
                                    className="bg-neutral-700 mt-px flex flex-row justify-between items-center"
                                >
                                    <span className="p-2.5 text-white">{item.name}</span>
                                    <div onClick={() => remove(item)} className="cursor-pointer">
                                        <div className="bg-neutral-900 mt-0">
                                            <div className="m-2">
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
                        className="cursor-pointer"
                    >
                        <div className="flex flex-row mt-2 items-center">
                            <AiOutlinePlusCircle color={"#00BFFF"} size={26} />
                            <span className="text-[#00BFFF] pl-2.5 font-medium">
                                Add {item.customer_locality.property_type} Properties For{" "}
                                {item.customer_locality.property_for}
                            </span>
                        </div>
                    </div>

                    <div className="flex flex-row mt-5 gap-2">
                        <div className="flex-1 w-full min-w-0">
                            <label className="block mb-1 text-gray-200 font-medium">Date*</label>
                            <div className="relative w-full bg-neutral-900 rounded border border-gray-400 h-12 flex items-center">
                                <style>
                                    {`
                                        input[type="date"]::-webkit-calendar-picker-indicator {
                                            display: none;
                                            -webkit-appearance: none;
                                        }
                                        input[type="date"] {
                                            color-scheme: dark;
                                        }
                                    `}
                                </style>
                                {!newDate && (
                                    <span className="absolute left-0 top-0 p-2.5 text-gray-400 pointer-events-none text-base">
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
                                    className={`p-2.5 rounded bg-transparent outline-none text-base w-full h-full ${!newDate ? 'text-transparent' : 'text-white'}`}
                                />
                                <div className="absolute right-3 top-3 pointer-events-none">
                                    <MdDateRange color="#757575" size={20} />
                                </div>
                            </div>
                        </div>
                        <div className="flex-1 w-full min-w-0">
                            <label className="block mb-1 text-gray-200 font-medium">Time*</label>
                            <input
                                readOnly
                                value={newTime}
                                onClick={() => setModalVisible(true)}
                                placeholder="Select Time"
                                className="w-full h-12 p-2.5 rounded border border-gray-400 bg-neutral-900 text-white outline-none text-base"
                            />
                        </div>
                    </div>

                    <div className="mt-5 mb-5">
                        <Button title="Save" onPress={() => onSubmit()} />
                    </div>
                </div>
            </div>
            {/* Property releted reminder list */}
            {loading ? <div className="flex-1 justify-center items-center bg-neutral-800 bg-opacity-40 flex h-full">
                <div>Loading...</div>
            </div> : <PropertyReminder navigation={navigation} reminderListX={reminderListX} />}
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
                                buttonStyle={{ backgroundColor: 'var(--background)', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '5px', padding: '10px 0', width: '100%', marginBottom: '4px' }}
                                buttonTextStyle={{ textAlign: "center", color: "#333", fontSize: "16px", fontWeight: "500" }}
                                selectedButtonTextStyle={{ color: "var(--foreground)", fontSize: "16px", fontWeight: "500" }}
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
        border: '1px solid rgba(255, 255, 255, 0.15)',
        fontSize: 16,
        backgroundColor: 'var(--background)',
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
        backgroundColor: "var(--card)",
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
        backgroundColor: "var(--background)",
        outline: 'none',
        color: 'var(--foreground)'
    },
    textButton: {
        marginLeft: 10,
        marginRight: 10,
        padding: 10,
        backgroundColor: 'transparent',
        cursor: 'pointer'
    },
    textButtonLabel: {
        color: "var(--foreground)",
        fontWeight: "500",
        textAlign: "center",
        fontSize: 16
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
