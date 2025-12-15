import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { MdCall } from "react-icons/md";
import { makeCall } from "././../../utils/methods";
import { formatIsoDateToCustomString, formatClientNameForDisplay, formatMobileNumber } from "../../utils/methods";

const PropertyReminder = props => {
    const {
        navigation,
        reminderListX,

    } = props;
    const [reminderList, setReminderList] = useState([]);
    const [futureReminderList, setFutureReminderList] = useState([]);
    const [pastReminderList, setPastReminderList] = useState([]);


    useEffect(() => {
        const dataArr = reminderListX || [];
        console.log("PropertyReminder: Processing dataArr", dataArr);

        const future = [];
        const past = [];
        for (const value of dataArr) {
            const todayDateTime = new Date();

            let meetingDateStr = value.meeting_date;
            let meetingDate;

            // Handle DD/MM/YYYY format if necessary
            if (typeof meetingDateStr === 'string') {
                if (meetingDateStr.includes('/')) {
                    const part = meetingDateStr.split('/');
                    if (part.length === 3) {
                        // Assume DD/MM/YYYY -> YYYY-MM-DD
                        meetingDateStr = `${part[2]}-${part[1]}-${part[0]}`;
                    }
                } else if (meetingDateStr.includes('-')) {
                    // Check if it is DD-MM-YYYY (first part is day, > 1000 means year)
                    const part = meetingDateStr.split('-');
                    if (part.length === 3 && part[0].length <= 2 && part[2].length === 4) {
                        meetingDateStr = `${part[2]}-${part[1]}-${part[0]}`;
                    }
                }
            }

            meetingDate = new Date(meetingDateStr);

            console.log(`Item: ${value.client_name}, Raw: ${value.meeting_date}, ParsedStr: ${meetingDateStr}, Obj: ${meetingDate}, Valid: ${!isNaN(meetingDate.getTime())}`);

            const meetingTime = value.meeting_time || "12:00 AM";

            // Parse "11:30 AM" → hours/minutes
            const [time, modifier] = meetingTime.split(" ");
            let [hours, minutes] = time.split(":").map(Number);
            if (modifier === "PM" && hours < 12) hours += 12;
            if (modifier === "AM" && hours === 12) hours = 0;

            // Combine local date + time
            const meetingDateTime = new Date(meetingDate);
            if (!isNaN(hours) && !isNaN(minutes)) {
                meetingDateTime.setHours(hours, minutes, 0, 0);
            }

            console.log(` > Time: ${meetingTime}, FinalDate: ${meetingDateTime}, IsFuture: ${meetingDateTime > todayDateTime}`);

            if (meetingDateTime > todayDateTime) {
                future.push(value);
            } else {
                past.push(value);
            }
        }
        console.log(`PropertyReminder: DONE. Future Count: ${future.length}, Past Count: ${past.length}`);
        setFutureReminderList(future);
        setPastReminderList(past);
        setReminderList(props.propReminderList);
    }, [props.propReminderList, reminderListX]);


    const ItemView = ({ item, index }) => {
        let bgColor = "rgba(255,182,193, 0.5)"; // Default pinkish
        if (item.reminder_for.toLowerCase() === "meeting") {
            bgColor = "rgba(135,206,250, 0.5)"; // Blueish
        } else if (item.reminder_for.toLowerCase() === "call") {
            bgColor = "rgba(64,224,208, 0.5)"; // Tealish
        }

        return (
            <div
                key={index}
                className="flex flex-row justify-between rounded mt-0.5 p-0"
                style={{ backgroundColor: bgColor }}
            >
                <div
                    onClick={() =>
                        navigation.navigate("CustomerMeetingDetails", {
                            item: item,
                            category: "property"
                        })
                    }
                    className="flex flex-row justify-between w-4/5 cursor-pointer"
                >
                    <div className="p-2.5 text-base pt-4">
                        <p
                            className="text-base font-semibold text-black"
                            style={{
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden'
                            }}
                        >
                            {formatClientNameForDisplay(item.client_name)}
                        </p>
                        <p className="text-black">{formatMobileNumber(item.client_mobile)}</p>
                        {item.property_reference_id && (
                            <p className="text-black">{"Reference id: " + item.property_reference_id}</p>
                        )}
                    </div>
                    <div>
                        <div className="p-2.5">
                            <p className="text-black">{item.reminder_for}</p>
                            <p className="text-black">{item.meeting_time}</p>
                            <p className="text-black">{formatIsoDateToCustomString(item.meeting_date)}</p>
                        </div>
                    </div>
                </div>
                <div className="w-0.5 bg-white h-auto"></div>
                <div
                    onClick={() => makeCall(item.client_mobile)}
                    className="p-4 mt-2 pr-5 cursor-pointer"
                >
                    <MdCall color={"#ffffff"} size={26} />
                </div>
            </div>
        );
    };

    return (
        <div className="flex flex-col bg-white">
            <p className="text-center text-base font-semibold mt-2.5 mb-2.5 text-black">
                Upcoming Meetings
            </p>
            {futureReminderList.length > 0 ? (
                futureReminderList.map((item, index) => (
                    <React.Fragment key={index}>
                        <ItemView item={item} index={index} />
                        <div className="h-px w-full bg-gray-300"></div>
                    </React.Fragment>
                ))
            ) : (
                <div className="flex flex-col items-center justify-center bg-gray-100 bg-opacity-90 py-5 mt-5 mb-5">
                    <p className="text-center text-base font-light text-black">
                        No Meetings
                    </p>
                </div>
            )}

            <p className="text-center text-base font-semibold mt-4 mb-2.5 text-black">
                Past Meetings
            </p>
            {pastReminderList.length > 0 ? (
                pastReminderList.map((item, index) => (
                    <React.Fragment key={index}>
                        <ItemView item={item} index={index} />
                        <div className="h-px w-full bg-gray-300"></div>
                    </React.Fragment>
                ))
            ) : (
                <div className="flex flex-col items-center justify-center bg-gray-100 bg-opacity-90 py-5 mt-5 mb-5">
                    <p className="text-center text-base font-light text-black">
                        No Meetings
                    </p>
                </div>
            )}

            {pastReminderList.length > 0 && (
                <div className="p-2.5 items-center text-center">
                    <span className="text-white">End</span>
                </div>
            )}
        </div>
    );
};

const mapStateToProps = state => ({
    userDetails: state.AppReducer.userDetails,
    propReminderList: state.AppReducer.propReminderList
});
export default connect(
    mapStateToProps,
    null
)(PropertyReminder);
