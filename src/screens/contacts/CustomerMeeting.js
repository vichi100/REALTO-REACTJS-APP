import React, { useState, useRef, useEffect } from "react";
import { connect } from "react-redux";
import Button from "./../../components/Button";
import { MdClose, MdAddCircleOutline, MdArrowBack } from "react-icons/md";
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
        <div className="flex flex-col h-full bg-gray-100 overflow-y-auto">
            <div className="bg-white border-b border-gray-200 flex items-center p-4 shadow-sm sticky top-0 z-10">
                <div onClick={handleBack} className="cursor-pointer mr-4 flex items-center">
                    <MdArrowBack size={24} color="#333" />
                </div>
                <h1 className="text-lg font-semibold text-gray-800">Schedule Meeting</h1>
            </div>
            <div className="p-5 flex-1">
                <div>
                    <p className="mt-2 mb-2 text-sm font-medium text-black">
                        Create a call/visiting schedule to show property to client and get
                        reminder on time
                    </p>
                    <div className="border-b border-gray-300" />
                    <p className="mt-5 mb-4 text-sm font-medium text-black">
                        Reminder For ?
                    </p>
                    <div className="mb-2">
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

                    <div className="mb-4 mt-6">
                        <label className="block mb-1 text-black font-medium">Customer Name*</label>
                        <input
                            disabled={true}
                            value={clientName}
                            onChange={e => setClientName(e.target.value)}
                            onFocus={() => setIsVisible(false)}
                            className="w-full p-2.5 rounded border border-gray-400 bg-white text-black outline-none text-base"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block mb-1 text-gray-800 font-medium">Customer Mobile*</label>
                        <input
                            disabled={true}
                            value={clientMobile}
                            onChange={e => setClientMobile(e.target.value)}
                            onFocus={() => setIsVisible(false)}
                            type="text"
                            className="w-full p-2.5 rounded border border-gray-400 bg-white text-black outline-none text-base"
                        />
                    </div>

                    {props.propListForMeeting.length > 0 ? (
                        <div className="mb-2">
                            <p className="mb-1 mt-2 text-black font-medium">Property List</p>
                            {props.propListForMeeting.map((item, index) => (
                                <div
                                    key={index}
                                    className="bg-gray-200 mt-px flex flex-row justify-between items-center"
                                >
                                    <span className="p-2.5 text-black">{item.name}</span>
                                    <div onClick={() => remove(item)} className="cursor-pointer">
                                        <div className="bg-white mt-0">
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

                    <div className="flex flex-row mt-5">
                        <div className="flex-1 mr-2">
                            <label className="block mb-1 text-gray-800 font-medium">Date*</label>
                            <input
                                type={newDate ? "date" : "text"}
                                onFocus={(e) => e.target.type = 'date'}
                                onBlur={(e) => { if (!newDate) e.target.type = 'text' }}
                                value={newDate}
                                onChange={e => setNewDate(e.target.value)}
                                placeholder="DD/MM/YYYY"
                                className="w-full p-2.5 rounded border border-gray-400 text-black outline-none text-base"
                            />
                        </div>
                        <div className="flex-1">
                            <label className="block mb-1 text-gray-800 font-medium">Time*</label>
                            <input
                                readOnly
                                value={newTime}
                                onClick={() => setModalVisible(true)}
                                placeholder="Select Time"
                                className="w-full p-2.5 rounded border border-gray-400 text-black outline-none text-base"
                            />
                        </div>
                    </div>

                    <div className="mt-5 mb-5">
                        <Button title="Save" onPress={() => onSubmit()} />
                    </div>
                </div>
                {/* Property releted reminder list */}
                {loading ? <div className="flex-1 justify-center items-center bg-gray-100 bg-opacity-40 flex h-full">
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
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
                    <div className="bg-white rounded-2xl p-8 items-center shadow-lg flex flex-col m-5">
                        <div className="flex flex-row gap-4 items-center">
                            <input
                                type="number"
                                value={hour}
                                onChange={e => checkHourValidation(e.target.value)}
                                className="w-20 h-20 text-center text-base rounded border border-gray-500 bg-white outline-none text-black"
                                placeholder="Hour*"
                            />
                            <input
                                type="number"
                                value={minutes}
                                onChange={e => checkMinutesValidation(e.target.value)}
                                className="w-20 h-20 text-center text-base rounded border border-gray-500 bg-white outline-none text-black"
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

                        <div className="flex flex-row mt-6 mb-1 justify-end w-full">
                            <div
                                className="mx-2 p-2 bg-transparent cursor-pointer"
                                onClick={() => {
                                    setModalVisible(false);
                                }}
                            >
                                <span className="text-black font-medium text-center text-base">Cancel</span>
                            </div>
                            <div
                                className="mx-2 p-2 bg-transparent cursor-pointer"
                                onClick={() => {
                                    onApply();
                                }}
                            >
                                <span className="text-black font-medium text-center text-base">Apply</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
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
