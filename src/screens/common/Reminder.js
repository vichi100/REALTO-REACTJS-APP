import React, { useState, useEffect, useCallback, useRef } from "react";
import { connect } from "react-redux";
import { IoCall } from "react-icons/io5";
import { AiOutlineSearch } from "react-icons/ai";
import axios from "axios";
import { SERVER_URL } from "./../../utils/Constant";
import { formatIsoDateToCustomString, formatClientNameForDisplay, formatMobileNumber, makeCall } from "../../utils/methods";
// import { useNavigate } from "react-router-dom";

const Reminder = props => {
    const {
        customerData,
        isSpecificRemider = false,
    } = props;
    // const navigate = useNavigate();
    const { didDbCall = true } = props.route?.params || {};
    const [reminderList, setReminderList] = useState([]);
    const [futureReminderList, setFutureReminderList] = useState([]);
    const [pastReminderList, setPastReminderList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [dbCall, setDbCall] = useState(didDbCall);
    const [search, setSearch] = useState("");
    const isFetching = useRef(false);
    const scrollRef = useRef(null);
    const lastScrollY = useRef(0);

    const updateDbCall = useCallback((value) => {
        setDbCall(value);
    }, []);

    // Save scroll position on unmount (navigating away)
    useEffect(() => {
        return () => {
            if (!isSpecificRemider) { // Only save global scroll if not a specific specific component
                console.log("Reminder: Unmounting - Saving scroll pos:", lastScrollY.current);
                sessionStorage.setItem('reminder_scroll_pos', lastScrollY.current);
            }
        };
    }, [isSpecificRemider]);

    useEffect(() => {
        console.log("Reminder Debug: Effect triggered.", {
            userDetails: props.userDetails,
            customerData,
            isSpecificRemider,
            dbCall
        });

        if (!props.userDetails) {
            console.log("Reminder Debug: No userDetails, skipping.");
            return;
        }

        if (customerData != null) {
            getReminderListById(customerData);
        } else if (!isSpecificRemider) {
            getReminderList();
        }
    }, [props.userDetails, customerData, isSpecificRemider, dbCall]);

    // Restore scroll position with polling (only for main list)
    useEffect(() => {
        if (!isSpecificRemider && !loading && reminderList.length > 0) {
            const scrollPos = sessionStorage.getItem('reminder_scroll_pos');
            if (scrollPos && parseInt(scrollPos) > 0) {
                const pos = parseInt(scrollPos, 10);
                console.log("Reminder: Attempting to restore scroll to:", pos);

                const attemptRestore = () => {
                    if (scrollRef.current) {
                        // Only set if not already close
                        if (Math.abs(scrollRef.current.scrollTop - pos) > 10) {
                            scrollRef.current.scrollTop = pos;
                            console.log("Reminder: Restore attempt applied:", scrollRef.current.scrollTop);
                        }
                    }
                };

                // Try a few times to ensure it catches the rendered height
                requestAnimationFrame(() => {
                    attemptRestore();
                    setTimeout(attemptRestore, 50);
                    setTimeout(attemptRestore, 150);
                    setTimeout(attemptRestore, 300);
                });
            }
        }
    }, [loading, reminderList, isSpecificRemider]);

    const getReminderListById = (customerData) => {
        if (props.userDetails === null) {
            setFutureReminderList([]);
            setPastReminderList([]);
            setReminderList([]);
            return;
        }

        const customerDatax = {
            req_user_id: props.userDetails.works_for,
            customer_id: customerData.customer_id,
            property_type: customerData.customer_locality.property_type,
            property_for: customerData.customer_locality.property_for,
        };

        setLoading(true);

        if (isFetching.current) return;
        isFetching.current = true;

        axios
            .post(
                SERVER_URL + "/getReminderListByCustomerId",
                customerDatax
            )
            .then(
                response => {
                    const dataArr = response.data;
                    const future = [];
                    const past = [];
                    for (const value of dataArr) {
                        const todayDate = new Date();
                        const meetingDate = new Date(value.meeting_date.toString());
                        if (todayDate < meetingDate) {
                            future.push(value);
                        } else if (todayDate > meetingDate) {
                            past.push(value);
                        } else {
                            future.push(value);
                        }
                    }
                    setFutureReminderList(future);
                    setPastReminderList(past);
                    setReminderList(response.data);
                    setLoading(false);
                    isFetching.current = false;
                },
                error => {
                    setLoading(false);
                    isFetching.current = false;
                    console.log(error);
                }
            );
    }

    const getReminderList = () => {
        console.log("Reminder Debug: getReminderList called");
        if (props.userDetails === null) {
            console.log("Reminder Debug: userDetails is null, returning");
            setFutureReminderList([]);
            setPastReminderList([]);
            setReminderList([]);
            return;
        }

        const userData = {
            req_user_id: props.userDetails.id,
            agent_id: props.userDetails.works_for
        };
        console.log("Reminder Debug: Sending request to:", SERVER_URL + "/getReminderList", "with data:", userData);
        setLoading(true);

        if (isFetching.current) return;
        isFetching.current = true;

        axios
            .post(
                SERVER_URL + "/getReminderList",
                userData
            )
            .then(
                response => {
                    console.log("Reminder Debug: API Response received:", response.data);
                    const dataArr = response.data;
                    if (!Array.isArray(dataArr)) {
                        console.error("Reminder Debug: response.data is not an array:", dataArr);
                        setLoading(false);
                        return;
                    }
                    const future = [];
                    const past = [];
                    try {
                        for (const value of dataArr) {
                            try {
                                const todayDateTime = new Date();
                                let meetingDate = new Date(value.meeting_date);

                                // Fallback for invalid date
                                if (isNaN(meetingDate.getTime())) {
                                    console.warn("Reminder Debug: Invalid meeting_date:", value.meeting_date, "for item:", value);
                                    // Option: Skip or default to today? Let's skip for now to avoid bad data display, or push to future?
                                    // Let's try to parse if it's DD-MM-YYYY or similar if needed, but for now just log and maybe skip or default.
                                    // Defaulting to future to ensure visibility
                                    meetingDate = new Date();
                                    meetingDate.setFullYear(meetingDate.getFullYear() + 1); // Set to next year so it shows in future
                                }

                                const meetingTime = value.meeting_time || "12:00 AM";

                                console.log("Reminder Debug: Processing item:", value);
                                console.log("Reminder Debug: meetingDate raw:", value.meeting_date, "parsed:", meetingDate);

                                const [time, modifier] = meetingTime.split(" ");
                                let [hours, minutes] = time.split(":").map(Number);
                                if (modifier === "PM" && hours < 12) hours += 12;
                                if (modifier === "AM" && hours === 12) hours = 0;

                                // Handle invalid time parsing
                                if (isNaN(hours) || isNaN(minutes)) {
                                    console.warn("Reminder Debug: Invalid meeting_time:", value.meeting_time);
                                    hours = 0; minutes = 0;
                                }

                                const meetingDateTime = new Date(meetingDate);
                                meetingDateTime.setHours(hours, minutes, 0, 0);
                                console.log("Reminder Debug: meetingDateTime:", meetingDateTime);

                                if (meetingDateTime > todayDateTime) {
                                    future.push(value);
                                } else {
                                    past.push(value);
                                }
                            } catch (itemError) {
                                console.error("Reminder Debug: Error processing individual item:", value, itemError);
                            }
                        }
                        console.log("Reminder Debug: Future list:", future);
                        console.log("Reminder Debug: Past list:", past);
                        setFutureReminderList(future);
                        setPastReminderList(past);
                        setReminderList(response.data);
                    } catch (error) {
                        console.error("Reminder Debug: Error processing data:", error);
                    }
                    setLoading(false);
                    isFetching.current = false;
                },
                error => {
                    setLoading(false);
                    isFetching.current = false;
                    console.log(error);
                }
            );
    }

    const searchFilterFunction = (text) => {
        if (text) {
            const newData = reminderList.filter((item) => {
                if (!item || !item.client_name || !item.client_mobile) {
                    return false;
                }
                const itemData = `${item.client_name} ${item.client_mobile}`.toUpperCase();
                const textData = text.toUpperCase();
                return itemData.indexOf(textData) > -1;
            });

            setFutureReminderList(newData.filter((item) => new Date(item.meeting_date) > new Date()));
            setPastReminderList(newData.filter((item) => new Date(item.meeting_date) <= new Date()));
            setSearch(text);
        } else {
            setFutureReminderList(reminderList.filter((item) => new Date(item.meeting_date) > new Date()));
            setPastReminderList(reminderList.filter((item) => new Date(item.meeting_date) <= new Date()));
            setSearch(text);
        }
    };

    const ItemView = ({ item }) => {
        let bgClass = "bg-[rgba(255,182,193,0.3)] ";
        if (item.reminder_for.toLowerCase() === "meeting") {
            bgClass = "bg-[rgba(135,206,250,0.3)] ";
        } else if (item.reminder_for.toLowerCase() === "call") {
            bgClass = "bg-[rgba(64,224,208,0.3)] ";
        }

        return (
            <div
                className={`flex flex-row justify-between rounded-[5px] my-[2px] ${bgClass}`}
            >
                <div
                    onClick={() => {
                        // Explicitly save scroll before navigation
                        if (!isSpecificRemider) {
                            console.log("Reminder: Saving scroll pos (navigating):", lastScrollY.current);
                            sessionStorage.setItem('reminder_scroll_pos', lastScrollY.current);
                        }

                        props.navigation.navigate("CustomerMeetingDetails", {
                            item: item,
                            category: "property"
                        });
                    }}
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
                                color: "var(--foreground)",
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
                        <p style={{ margin: 0, color: 'var(--foreground)' }}>{formatMobileNumber(item.client_mobile)}</p>
                        {item.property_reference_id && (
                            <p style={{ margin: 0, color: 'var(--foreground)' }}>
                                {"Reference id: " + item.property_reference_id}
                            </p>
                        )}
                    </div>
                    <div>
                        <div style={{ padding: 10 }}>
                            <p style={{ margin: 0, color: 'var(--foreground)' }}>{item.reminder_for}</p>
                            <p style={{ margin: 0, color: 'var(--foreground)' }}>{item.meeting_time}</p>
                            <p style={{ margin: 0, color: 'var(--foreground)' }}>{formatIsoDateToCustomString(item.meeting_date)}</p>
                        </div>
                    </div>
                </div>
                <div className="w-[1px] bg-black/20 dark:bg-white/20 h-auto" />
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
        loading ? (
            <div
                className="flex-1 flex justify-center items-center bg-white/40 dark:bg-black/40 h-full"
            >
                <div className="loader">Loading...</div>
            </div>
        ) : (
            <div
                className="flex-1 overflow-y-auto bg-background h-full w-full"
                ref={scrollRef}
                id="reminder-scroll-container"
                onScroll={(e) => {
                    lastScrollY.current = e.currentTarget.scrollTop;
                }}
            >
                {reminderList.length > 0 ? (
                    <div className="flex-1 bg-background mt-0 p-[10px]">
                        {!isSpecificRemider && (
                            <div className="flex flex-row items-center bg-card rounded-lg px-[10px] py-[5px] shadow-sm mt-[10px] border border-border">
                                <AiOutlineSearch size={20} className="mr-[5px] text-muted-foreground" />
                                <input
                                    className="w-[98%] h-[30px] pl-[5px] m-[5px] rounded-[10px] bg-transparent outline-none text-[14px] text-foreground"
                                    onChange={(e) => searchFilterFunction(e.target.value)}
                                    value={search}
                                    placeholder="Search By Name, Mobile"
                                />
                            </div>
                        )}
                        <p
                            className="text-center text-[16px] font-medium mt-[15px] mb-[10px] text-foreground"
                        >
                            Upcoming Meetings
                        </p>
                        {futureReminderList.length > 0 ? (
                            futureReminderList.map((item, index) => (
                                <React.Fragment key={index}>
                                    <ItemView item={item} />
                                    <div className="h-[0.5px] w-full bg-border" />
                                </React.Fragment>
                            ))
                        ) : (
                            <div
                                className="flex content-center justify-center bg-muted/90 p-[20px] rounded-lg"
                            >
                                <p
                                    className="text-center text-[15px] font-light m-0 text-foreground"
                                >
                                    No Meetings
                                </p>
                            </div>
                        )}
                        <p
                            className="text-center text-[16px] font-medium mt-[15px] mb-[10px] text-foreground"
                        >
                            Past Meetings
                        </p>
                        {pastReminderList.length > 0 ? (
                            <>
                                {pastReminderList.map((item, index) => (
                                    <React.Fragment key={index}>
                                        <ItemView item={item} />
                                        <div className="h-[0.5px] w-full bg-border" />
                                    </React.Fragment>
                                ))}
                                <div className="p-[10px] items-center text-center">
                                    <span style={{ color: "transparent" }}>End</span>
                                </div>
                            </>
                        ) : (
                            <div
                                className="flex content-center justify-center bg-muted/90 p-[20px] rounded-lg"
                            >
                                <p
                                    className="text-center text-[15px] font-light m-0 text-foreground"
                                >
                                    No Meetings
                                </p>
                            </div>
                        )}
                    </div>
                ) : (
                    <div style={{ flex: 1, display: 'flex', justifyContent: "center", alignItems: "center", height: '100%' }}>
                        <p style={{ textAlign: "center", fontSize: 16, color: "#777777" }}>
                            You have no reminder
                        </p>
                    </div>
                )}
            </div>
        )
    );
};

const styles = {
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        margin: 5,
    },
    searchBar: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 8,
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 5,
        paddingBottom: 5,
        boxShadow: '0 2px 5px rgba(0,0,0,0.15)',
        marginTop: 10,
        border: '1px solid #ccc'
    },
    textInputStyle: {
        width: "98%",
        height: 30,
        paddingLeft: 5,
        margin: 5,
        borderRadius: 10,
        backgroundColor: "#FFFFFF",
        border: 'none',
        outline: 'none',
        fontSize: 14
    },
};

const mapStateToProps = state => ({
    userDetails: state.AppReducer.userDetails
});
export default connect(
    mapStateToProps,
    null
)(Reminder);
