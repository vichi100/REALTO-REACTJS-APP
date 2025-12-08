import { ACTION_TYPES } from "./ActionType";

export const setEmployeeList = payload => {
    return {
        type: ACTION_TYPES.SET_EMPLOYEE_LIST,
        payload
    };
};
export const setUserMobile = payload => {
    return {
        type: ACTION_TYPES.SET_USER_MOBILE_NUMBER,
        payload
    };
};

export const setUserDetails = payload => {
    return {
        type: ACTION_TYPES.SET_USER_DETAILS,
        payload
    };
};

export const setPropReminderList = payload => {
    return {
        type: ACTION_TYPES.SET_PROP_REMINDER_LIST,
        payload
    };
};

export const setPropListForMeeting = payload => {
    return {
        type: ACTION_TYPES.SET_PROP_LIST_FOR_MEETING,
        payload
    };
};

export const setCustomerDetailsForMeeting = payload => {
    return {
        type: ACTION_TYPES.SET_CUSTOMER_DETAILS_FOR_MEETING,
        payload
    };
};

export const setResidentialPropertyList = payload => {
    return {
        type: ACTION_TYPES.SET_RESIDENTIAL_PROPERTY_LIST,
        payload
    };
};

export const setCommercialPropertyList = payload => {
    return {
        type: ACTION_TYPES.SET_COMMERCIAL_PROPERTY_LIST,
        payload
    };
};

export const setResidentialCustomerList = payload => {
    return {
        type: ACTION_TYPES.SET_RESIDENTIAL_CUSTOMER_LIST,
        payload
    };
};

export const setCommercialCustomerList = payload => {
    return {
        type: ACTION_TYPES.SET_COMMERCIAL_CUSTOMER_LIST,
        payload
    };
};

export const setCustomerListForMeeting = payload => {
    return {
        type: ACTION_TYPES.SET_CUSTOMER_LIST_FOR_MEETING,
        payload
    };
};

export const setPropertyListingForMeeting = payload => {
    return {
        type: ACTION_TYPES.SET_PROPERTY_LIST_FOR_MEETING,
        payload
    };
};

export const setPropertyType = payload => {
    return {
        type: ACTION_TYPES.SET_PROPERTY_TYPE,
        payload
    };
};

export const setGlobalSearchResult = payload => {
    return {
        type: ACTION_TYPES.SET_GLOBAL_SEARCH_RESULT,
        payload
    };
};

export const setAnyItemDetails = payload => {
    return {
        type: ACTION_TYPES.SET_ANY_ITEM_DETAILS,
        payload
    };
};

export const setPropertyDetails = payload => {
    return {
        type: ACTION_TYPES.SET_PROPERTY_DETAILS,
        payload
    };
};

export const setCustomerDetails = payload => {
    return {
        type: ACTION_TYPES.SET_CUSTOMER_DETAILS,
        payload
    };
};

export const setStartNavigationPoint = payload => {
    return {
        type: ACTION_TYPES.SET_START_NAVIGATION_POINT,
        payload
    };
};

export const setMeetingFormState = payload => {
    return {
        type: ACTION_TYPES.SET_MEETING_FORM_STATE,
        payload
    };
};

export const setCustomerMeetingFormState = payload => {
    return {
        type: ACTION_TYPES.SET_CUSTOMER_MEETING_FORM_STATE,
        payload
    };
};
