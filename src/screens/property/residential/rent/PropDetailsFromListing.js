import React, { useRef, useState, useEffect } from "react";
import Slideshow from "./../../../../components/Slideshow";
import { numDifferentiation, formatIsoDateToCustomString, camalize, makeCall } from "./././../../../../utils/methods";
import { connect } from "react-redux";
import AccordionListItem from './../../../../components/AccordionListItem';
import PropertyReminder from "../../PropertyReminder";
import { SERVER_URL } from "./../../../../utils/Constant";
import axios from "axios";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { MdPersonAdd, MdPhone, MdArrowBack } from "react-icons/md";

const PropDetailsFromListing = props => {
    const navigate = useNavigate();
    const { navigation } = props;

    const location = useLocation();

    const handleBack = () => {
        if (window.history.length > 1 && window.history.state && window.history.state.idx > 0) {
            navigate(-1);
        } else {
            navigate('/listing');
        }
    };

    const { agentId, propertyId, propertyType } = useParams();
    const [fetchedItem, setFetchedItem] = useState(null);

    let item = props.item || location.state?.item || props.route?.params?.item || props.propertyDetails || fetchedItem;
    let showHeader = props.showHeader ?? location.state?.showHeader ?? props.route?.params?.showHeader ?? true;
    let displayMatchCount = props.displayMatchCount ?? location.state?.displayMatchCount ?? props.route?.params?.displayMatchCount ?? true;

    const scrollViewRef = useRef();
    const [reminderListX, setReminderListX] = useState([]);
    const [loading, setLoading] = useState(false);
    const [reqUserId, setReqUserId] = useState(props.userDetails?.works_for);

    const [propertyAgentId, setPropertyAgentId] = useState(item?.property_agent_id);

    // We expect item to be passed from parent or PublicPropertyDetails wrapper.
    // However, if we still want to support direct usage without item? 
    // The previous implementation added fetching, but now PublicPropertyDetails handles it.
    // So we can remove the fetch logic here to avoid duplication and potential bugs.

    const scrollToAccordion = () => {
        if (scrollViewRef.current) {
            scrollViewRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const gotoEmployeeList = itemForAddEmplyee => {
        navigation.navigate("EmployeeListOfListing", {
            itemForAddEmplyee: itemForAddEmplyee,
            disableDrawer: true,
            displayCheckBox: true,
        });
    }

    const getMatched = (matchedProprtyItem) => {
        navigation.navigate('MatchedCustomers', { matchedProprtyItem: matchedProprtyItem },);
    }

    const getPropReminders = () => {
        if (!item || !props.userDetails) return; // Skip if no item or no user
        const propertyId = {
            req_user_id: props.userDetails.id,
            agent_id: props.userDetails.works_for,
            property_id: item.property_id
        };
        // setLoading(true); // Don't block main UI for reminders

        axios
            .post(
                SERVER_URL + "/getPropReminderList",
                propertyId
            )
            .then(
                response => {
                    if (response.data && response.data.length > 0) {
                        setReminderListX(response.data);
                        // setLoading(false);
                    } else {
                        setReminderListX([]);
                        // setLoading(false);
                    }
                },
                error => {
                    // setLoading(false);
                    console.log(error);
                }
            );
    };
    useEffect(() => {
        if (item) {
            getPropReminders();
        }
    }, [item]);

    if (loading && !item) {
        return (
            <div className="flex flex-1 justify-center items-center h-screen bg-white">
                Loading Property Details...
            </div>
        )
    }

    if (!item) {
        return (
            <div className="flex flex-1 justify-center items-center h-screen bg-white">
                Property not found or link expired.
            </div>
        )
    }

    return (
        <div className="flex flex-col h-full bg-white overflow-y-auto" ref={scrollViewRef}>
            {showHeader && (
                <div className="sticky top-0 z-50 bg-white border-b border-gray-200 flex items-center p-4 shadow-sm">
                    <div onClick={handleBack} className="cursor-pointer mr-4 flex items-center">
                        <MdArrowBack size={24} color="#333" />
                    </div>
                    <h1 className="text-lg font-semibold text-gray-800">Property Details</h1>
                </div>
            )}
            <div className="flex flex-row flex-1">
                <div className="flex-1 min-h-[100px]">
                    <div className="flex flex-col items-start px-4 pt-4">
                        <h2 className="text-lg font-semibold flex-shrink flex-wrap text-black">
                            {`Rent In ${item.property_address.building_name?.trim()
                                ? item.property_address.building_name.trim() + ", "
                                : ""
                                }${item.property_address.landmark_or_street?.trim()}`}
                        </h2>

                        <p className="pr-2 flex-shrink flex-wrap text-sm text-black">
                            {item.property_address.formatted_address}
                        </p>
                    </div>
                    {props.userDetails && props.userDetails.works_for === props.userDetails.id && item.agent_id === props.userDetails.id && (
                        <div onClick={() => gotoEmployeeList(item)} className="cursor-pointer">
                            <div className="flex flex-row items-center justify-center my-2">
                                <MdPersonAdd size={20} color="black" />
                                <span className="text-sm font-light text-black mx-5">
                                    {Array.isArray(item.assigned_to_employee_name) && item.assigned_to_employee_name.length > 0
                                        ? item.assigned_to_employee_name.join(", ")
                                        : "No Employees Assigned"}
                                </span>
                            </div>
                        </div>
                    )}

                </div>

                {displayMatchCount && (
                    <div
                        onClick={() => getMatched(item)}
                        className="flex flex-row mt-2 cursor-pointer relative"
                    >
                        <div
                            className="absolute right-0 top-0 flex items-center justify-center w-10 h-5 mr-0"
                            style={{ backgroundColor: 'rgba(246, 158, 6, 0.9)' }}
                        >
                            <span className="text-sm font-medium text-black pl-0">{item.match_count ? item.match_count : 0}</span>
                        </div>
                        <div
                            className="absolute right-0 top-5 transform rotate-270 flex items-center justify-center w-20 h-10 p-0 -mr-5 mt-5 mb-4"
                            style={{ backgroundColor: 'rgba(80, 200, 120, 0.7)' }}
                        >
                            <span className="text-sm font-light text-black">Match</span>
                        </div>
                    </div>
                )}
            </div>
            <Slideshow
                dataSource={item.image_urls}
            />
            <div className="border-t border-gray-300 bg-gray-100 p-4 h-16">
                <div className="flex justify-between items-center h-full">
                    <div className="pb-5">
                        <span className="text-sm font-semibold pt-1 block text-black">
                            {item.property_details.bhk_type}
                        </span>
                    </div>
                    <div className="h-3/4 w-px bg-gray-400"></div>
                    <div className="pb-5">
                        <span className="text-sm font-semibold block text-black">
                            {numDifferentiation(item.rent_details.expected_rent)}
                        </span>
                        <span className="text-xs font-normal block text-black">Rent</span>
                    </div>
                    <div className="h-3/4 w-px bg-gray-400"></div>
                    <div className="pb-5">
                        <span className="text-sm font-semibold block text-black">
                            {numDifferentiation(item.rent_details.expected_deposit)}
                        </span>
                        <span className="text-xs font-normal block text-black">Deposit</span>
                    </div>
                    <div className="h-3/4 w-px bg-gray-400"></div>
                    <div className="pb-5">
                        <span className="text-sm font-semibold block text-black">
                            {item.property_details.furnishing_status}
                        </span>
                        <span className="text-xs font-normal block text-black">Furnishing</span>
                    </div>
                    <div className="h-3/4 w-px bg-gray-400"></div>
                    <div className="pb-5">
                        <span className="text-sm font-semibold block text-black">
                            {item.property_details.property_size}sqft
                        </span>
                        <span className="text-xs font-normal block text-black">Builtup</span>
                    </div>
                </div>
            </div>

            <div className="mt-0.5"></div>
            <AccordionListItem title="Details" onClick={scrollToAccordion} open={true}>
                <div className="bg-white w-full shadow-md">
                    <div className="flex justify-between p-2">
                        <div className="flex flex-col justify-center">
                            <div className="pb-5">
                                <span className="text-sm font-semibold block text-black">
                                    {item.property_details.washroom_numbers}
                                </span>
                                <span className="text-xs font-normal block text-black">Bathroom</span>
                            </div>
                            <div className="pb-5">
                                <span className="text-sm font-semibold block text-black">
                                    {formatIsoDateToCustomString(item.rent_details.available_from)}
                                </span>
                                <span className="text-xs font-normal block text-black">Possession</span>
                            </div>
                            <div className="pb-5">
                                <span className="text-sm font-semibold block text-black">
                                    {item.rent_details.preferred_tenants}
                                </span>
                                <span className="text-xs font-normal block text-black">Preferred Tenant</span>
                            </div>
                            <div className="pb-5">
                                <span className="text-sm font-semibold block text-black">
                                    {item.property_details.lift}
                                </span>
                                <span className="text-xs font-normal block text-black">Lift</span>
                            </div>
                        </div>
                        <div className="flex flex-col justify-center">
                            <div className="pb-5">
                                <span className="text-sm font-semibold block text-black">
                                    {item.property_details.parking_number}{" "}
                                    {item.property_details.parking_type}
                                </span>
                                <span className="text-xs font-normal block text-black">Parking</span>
                            </div>
                            <div className="pb-5">
                                <span className="text-sm font-semibold block text-black">
                                    {item.property_details.floor_number}/
                                    {item.property_details.total_floor}
                                </span>
                                <span className="text-xs font-normal block text-black">Floor</span>
                            </div>
                            <div className="pb-5">
                                <span className="text-sm font-semibold block text-black">
                                    {item.rent_details.non_veg_allowed}
                                </span>
                                <span className="text-xs font-normal block text-black">NonVeg</span>
                            </div>
                            <div className="pb-5">
                                <span className="text-sm font-semibold block text-black">
                                    {item.property_details.property_age} years
                                </span>
                                <span className="text-xs font-normal block text-black">Age Of Building</span>
                            </div>
                        </div>
                    </div>
                </div>
            </AccordionListItem>
            <div className="mt-0.5"></div>
            <AccordionListItem title="Owner" open={false} onClick={scrollToAccordion}>
                <div className="bg-white w-full shadow-md">
                    <div className="flex-1 py-2 pb-2 px-4 w-full">
                        <div className="flex flex-row mb-0 items-center justify-between">
                            <div className="flex flex-col">
                                <span className="text-black font-medium">{item.owner_details.name}</span>
                                <span className="text-black">
                                    {item.owner_details.mobile1?.startsWith("+91")
                                        ? item.owner_details.mobile1
                                        : `+91 ${item.owner_details.mobile1}`}
                                </span>
                            </div>
                            <div
                                onClick={() => makeCall(item.owner_details.mobile1)}
                                className="p-0 mr-9 cursor-pointer"
                            >
                                <MdPhone color={"#00bfa5"} size={25} />
                            </div>
                        </div>
                        <span className="mt-1 block text-black">{camalize(item.owner_details.address)}</span>
                    </div>
                </div>
            </AccordionListItem>

            {loading ? (
                <div className="flex flex-1 justify-center items-center bg-gray-100 bg-opacity-40">
                    Loading...
                </div>
            ) : (
                props.userDetails && <PropertyReminder navigation={navigation} reminderListX={reminderListX} />
            )}
        </div>
    );
};

const mapStateToProps = state => ({
    userDetails: state.AppReducer.userDetails,
    anyItemDetails: state.AppReducer.anyItemDetails,
    propertyDetails: state.AppReducer.propertyDetails
});
export default connect(
    mapStateToProps,
    null
)(PropDetailsFromListing);
