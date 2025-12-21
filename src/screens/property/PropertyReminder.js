import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { IoCall } from "react-icons/io5";
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
                style={{
                    display: 'flex',
                    flexDirection: "row",
                    justifyContent: "space-between",
                    backgroundColor: bgColor,
                    borderRadius: 5,
                    marginTop: 2,
                    marginBottom: 2
                }}
            >
                <div
                    onClick={() =>
                        navigation.navigate("CustomerMeetingDetails", {
                            item: item,
                            category: "property"
                        })
                    }
                    style={{
                        display: 'flex',
                        flexDirection: "row",
                        justifyContent: "space-between",
                        width: "80%",
                        cursor: 'pointer'
                    }}
                >
                    <div style={{ padding: 10, fontSize: 16, paddingTop: 15 }}>
                        <p
                            style={{
                                fontSize: 16,
                                fontWeight: "600",
                                color: "#000",
                                margin: 0,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical'
                            }}
                        >
                            {formatClientNameForDisplay(item.client_name)}
                        </p>
                        <p style={{ margin: 0, color: '#000' }}>{formatMobileNumber(item.client_mobile)}</p>
                        {item.property_reference_id && (
                            <p style={{ margin: 0, color: '#000' }}>
                                {"Reference id: " + item.property_reference_id}
                            </p>
                        )}
                    </div>
                    <div>
                        <div style={{ padding: 10 }}>
                            <p style={{ margin: 0, color: '#000' }}>{item.reminder_for}</p>
                            <p style={{ margin: 0, color: '#000' }}>{item.meeting_time}</p>
                            <p style={{ margin: 0, color: '#000' }}>{formatIsoDateToCustomString(item.meeting_date)}</p>
                        </div>
                    </div>
                </div>
                <div style={{ height: "auto", width: 2, backgroundColor: "#ffffff" }} />
                <div
                    onClick={() => makeCall(item.client_mobile)}
                    style={{
                        padding: 15,
                        marginTop: 7,
                        paddingRight: 20,
                        cursor: 'pointer'
                    }}
                >
                    <IoCall color={"#ffffff"} size={26} />
                </div>
            </div>
        );
    };

    return (
        <div style={{ flex: 1, backgroundColor: "#ffffff" }}>
            <p
                style={{
                    textAlign: "center",
                    fontSize: 16,
                    fontWeight: "500",
                    marginTop: 15,
                    marginBottom: 10,
                    color: '#000'
                }}
            >
                Upcoming Meetings
            </p>
            {futureReminderList.length > 0 ? (
                futureReminderList.map((item, index) => (
                    <React.Fragment key={index}>
                        <ItemView item={item} index={index} />
                        <div style={{ height: 0.5, width: "100%", backgroundColor: "#C8C8C8" }} />
                    </React.Fragment>
                ))
            ) : (
                <div
                    style={{
                        display: 'flex',
                        alignContent: "center",
                        justifyContent: "center",
                        backgroundColor: "rgba(239, 239, 240, .9)",
                        padding: 20
                    }}
                >
                    <p
                        style={{
                            textAlign: "center",
                            fontSize: 15,
                            fontWeight: "300",
                            margin: 0,
                            color: '#000'
                        }}
                    >
                        No Meetings
                    </p>
                </div>
            )}

            <p
                style={{
                    textAlign: "center",
                    fontSize: 16,
                    fontWeight: "500",
                    marginTop: 15,
                    marginBottom: 10,
                    color: '#000'
                }}
            >
                Past Meetings
            </p>
            {pastReminderList.length > 0 ? (
                pastReminderList.map((item, index) => (
                    <React.Fragment key={index}>
                        <ItemView item={item} index={index} />
                        <div style={{ height: 0.5, width: "100%", backgroundColor: "#C8C8C8" }} />
                    </React.Fragment>
                ))
            ) : (
                <div
                    style={{
                        display: 'flex',
                        alignContent: "center",
                        justifyContent: "center",
                        backgroundColor: "rgba(239, 239, 240, .9)",
                        padding: 20
                    }}
                >
                    <p
                        style={{
                            textAlign: "center",
                            fontSize: 15,
                            fontWeight: "300",
                            margin: 0,
                            color: '#000'
                        }}
                    >
                        No Meetings
                    </p>
                </div>
            )}

            {pastReminderList.length > 0 && (
                <div style={{ padding: 10, alignItems: 'center', textAlign: 'center' }}>
                    <span style={{ color: '#ffffffff' }}>End</span>
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
