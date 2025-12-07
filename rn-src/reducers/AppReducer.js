import { ACTION_TYPES } from "./ActionType";

const initialState = {
  employeeList: [],
  userMobileNumber: null,
  userDetails: null,
  customerDetails: null,
  countryCode: "+91",
  employeeList:[],
  propReminderList: [],
  propListForMeeting: [],
  customerDetailsForMeeting: null,
  residentialPropertyList: [],
  commercialPropertyList: [],
  residentialCustomerList: [],
  commercialCustomerList: [],
  customerListForMeeting: [],
  propertyListingForMeeting: [],
  propertyType: "Residential",
  globalSearchResult: [],
  anyItemDetails: null,
  propertyDetails: null,
  startNavigationPoint: null,
};
const AppReducer = (state = initialState, action) => {
  switch (action.type) {
    case ACTION_TYPES.SET_EMPLOYEE_LIST:
      // // console.log("SET_EMPLOYEE_LIST");
      return {
        ...state,
        employeeList: action.payload
      };
    case ACTION_TYPES.SET_USER_MOBILE_NUMBER:
      // // console.log("SET_USER_MOBILE_NUMBER");
      return {
        ...state,
        userMobileNumber: action.payload
      };
    case ACTION_TYPES.SET_USER_DETAILS:
      // // console.log("SET_USER_DETAILS");
      return {
        ...state,
        userDetails: action.payload
      };
    case ACTION_TYPES.SET_PROP_REMINDER_LIST:
      // // console.log("SET_USER_DETAILS");
      return {
        ...state,
        propReminderList: action.payload
      };

      case ACTION_TYPES.SET_EMPLOYEE_LIST:
      // // console.log("SET_PROP_LIST_FOR_MEETING");
      return {
        ...state,
        employeeList: action.payload
      };

    case ACTION_TYPES.SET_PROP_LIST_FOR_MEETING:
      // // console.log("SET_PROP_LIST_FOR_MEETING");
      return {
        ...state,
        propListForMeeting: action.payload
      };

    case ACTION_TYPES.SET_CUSTOMER_DETAILS_FOR_MEETING:
      // // console.log("SET_CUSTOMER_DETAILS_FOR_MEETING");
      return {
        ...state,
        customerDetailsForMeeting: action.payload
      };

    case ACTION_TYPES.SET_RESIDENTIAL_PROPERTY_LIST:
      // console.log("SET_RESIDENTIAL_PROPERTY_LIST");
      return {
        ...state,
        residentialPropertyList: action.payload
      };

    case ACTION_TYPES.SET_COMMERCIAL_PROPERTY_LIST:
      // console.log("SET_COMMERCIAL_PROPERTY_LIST");
      return {
        ...state,
        commercialPropertyList: action.payload
      };

    case ACTION_TYPES.SET_RESIDENTIAL_CUSTOMER_LIST:
      // console.log("SET_RESIDENTIAL_CUSTOMER_LIST");
      return {
        ...state,
        residentialCustomerList: action.payload
      };

    case ACTION_TYPES.SET_COMMERCIAL_CUSTOMER_LIST:
      // console.log("SET_COMMERCIAL_CUSTOMER_LIST");
      return {
        ...state,
        commercialCustomerList: action.payload
      };

    case ACTION_TYPES.SET_CUSTOMER_LIST_FOR_MEETING:
      // console.log("SET_CUSTOMER_LIST_FOR_MEETING");
      return {
        ...state,
        customerListForMeeting: action.payload
      };
    case ACTION_TYPES.SET_PROPERTY_LIST_FOR_MEETING:
      // console.log("SET_PROPERTY_LIST_FOR_MEETING");
      return {
        ...state,
        propertyListingForMeeting: action.payload
      };

    case ACTION_TYPES.SET_PROPERTY_TYPE:
      // console.log("SET_PROPERTY_TYPE");
      return {
        ...state,
        propertyType: action.payload
      };

    case ACTION_TYPES.SET_GLOBAL_SEARCH_RESULT:
      // console.log("SET_PROPERTY_TYPE");
      return {
        ...state,
        globalSearchResult: action.payload
      };

    case ACTION_TYPES.SET_ANY_ITEM_DETAILS:
      // console.log("SET_PROPERTY_TYPE");
      return {
        ...state,
        anyItemDetails: action.payload
      };

    case ACTION_TYPES.SET_PROPERTY_DETAILS:
      // console.log("SET_PROPERTY_DETAILS");
      return {
        ...state,
        propertyDetails: action.payload
      };

    case ACTION_TYPES.SET_CUSTOMER_DETAILS:
      // console.log("SET_PROPERTY_DETAILS");
      return {
        ...state,
        customerDetails: action.payload
      };

    case ACTION_TYPES.SET_START_NAVIGATION_POINT:
      // console.log("SET_START_NAVIGATION_POINT");
      return {
        ...state,
        startNavigationPoint: action.payload
      };



    default:
      // console.log("Default");
      return state;
  }
};
export default AppReducer;
