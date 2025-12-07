import * as React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Listing from "./../../screens/property/residential/ListingResidential";
import Meeting from "./../../screens/meeting/Meeting";
import CustomerMeeting from "./../../screens/contacts/CustomerMeeting";
import PropDetailsFromListing from "./../../screens/property/residential/rent/PropDetailsFromListing";
import PropDetailsFromListingForSell from "./../../screens/property/residential/sell/PropDetailsFromListingForSell";
import ContactsTopTab from "../tabs/ContactsTopTabNavigator";
import CommercialRentPropDetails from "./../../screens/property/commercial/rent/CommercialRentPropDetails";
import CommercialSellPropDetails from "./../../screens/property/commercial/sell/CommercialSellPropDetails";
import AddNewCustomer from "./../../screens/contacts/AddNewCustomer";
import ContactLocalityDetailsForm from "./../../screens/contacts/ContactLocalityDetailsForm";
import ContactResidentialPropertyDetailsForm from "./../../screens/contacts/residential/ContactResidentialPropertyDetailsForm";
import ContactRentDetailsForm from "./../../screens/contacts/residential/rent/ContactRentDetailsForm";
import AddNewCustomerRentResidentialFinalDetails from "./../../screens/contacts/residential/rent/AddNewCustomerRentResidentialFinalDetails";
import ContactBuyResidentialDetailsForm from "./../../screens/contacts/residential/buy/ContactBuyResidentialDetailsForm";
import AddNewCustomerBuyResidentialFinalDetails from "./../../screens/contacts/residential/buy/AddNewCustomerBuyResidentialFinalDetails";
import CustomerCommercialPropertyDetailsForm from "./../../screens/contacts/commercial/CustomerCommercialPropertyDetailsForm";
import AddNewCustomerCommercialRentFinalDetails from "./../../screens/contacts/commercial/rent/AddNewCustomerCommercialRentFinalDetails";
import CustomerCommercialRentDetailsForm from "./../../screens/contacts/commercial/rent/CustomerCommercialRentDetailsForm";
import CustomerCommercialBuyDetailsForm from "./../../screens/contacts/commercial/buy/CustomerCommercialBuyDetailsForm";
import AddNewCustomerCommercialBuyFinalDetails from "./../../screens/contacts/commercial/buy/AddNewCustomerCommercialBuyFinalDetails";
import CustomerDetailsResidentialRentFromList from "./../../screens/contacts/residential/rent/CustomerDetailsResidentialRentFromList";
import CustomerDetailsResidentialBuyFromList from "./../../screens/contacts/residential/buy/CustomerDetailsResidentialBuyFromList";

import CustomerDetailsCommercialRentFromList from "./../../screens/contacts/commercial/rent/CustomerDetailsCommercialRentFromList";
import CustomerDetailsCommercialBuyFromList from "./../../screens/contacts/commercial/buy/CustomerDetailsCommercialBuyFromList";
import PropertyListForMeeting from "./../../screens/contacts/PropertyListForMeeting";
import CustomerMeetingDetails from "./../../screens/contacts/CustomerMeetingDetails";
import AddNewPropertyStack from "./AddPropertyStack"

const Stack = createStackNavigator();
export const hideTabBarComponents = ["ProductDetails"];

const AddNewContactsStack = () => {
    return (
        <Stack.Navigator
            screenOptions={{
                // headerShown: false,
                headerTitleAlign: "center",
                // headerTintColor: "#fff",
                headerStyle: {
                    backgroundColor: "#ffffff"
                },
                headerBackTitleVisible: false,
                headerTintColor: "rgba(105,105,105, .9)"
            }}
        >

            {/* <Stack.Screen
        name="Card"
        component={Card}
        options={{ title: "Meeting Schedules" }}
      /> */}


            <Stack.Screen
                name="AddCustomer"
                component={AddNewCustomer}
                navigationOptions={{ tabBarVisible: false }}
                // options={{ headerShown: false, }}
                options={{
                    title: "Add New Customer",
                    headerBackTitle: "Back", // This will make the back button title on the *next* screen "Back"
                }}
            />
            <Stack.Screen
                name="ContactLocalityDetailsForm"
                component={ContactLocalityDetailsForm}
                options={{ 
                    title: "Locality Details",
                    headerBackTitle: "Back", // This will make the back button title on the *next* screen "Back"
                 }}
            />
            <Stack.Screen
                name="ContactResidentialPropertyDetailsForm"
                component={ContactResidentialPropertyDetailsForm}
                options={{ 
                    title: "Property Details",
                    headerBackTitle: "Back", // This will make the back button title on the *next* screen "Back"
                     }}
            />
            <Stack.Screen
                name="ContactRentDetailsForm"
                component={ContactRentDetailsForm}
                options={{ 
                    title: "Rent Details",
                    headerBackTitle: "Back", // This will make the back button title on the *next* screen "Back"
                 }}
            />
            <Stack.Screen
                name="AddNewCustomerRentResidentialFinalDetails"
                component={AddNewCustomerRentResidentialFinalDetails}
                options={{ 
                    title: "Customer Final Details",
                    headerBackTitle: "Back", // This will make the back button title on the *next* screen "Back"
                 }}
            />

            <Stack.Screen
                name="ContactBuyResidentialDetailsForm"
                component={ContactBuyResidentialDetailsForm}
                options={{ title: "Buy Details" ,
                    headerBackTitle: "Back", // This will make the back button title on the *next* screen "Back"
                }}
            />

            <Stack.Screen
                name="AddNewCustomerBuyResidentialFinalDetails"
                component={AddNewCustomerBuyResidentialFinalDetails}
                options={{ 
                    title: "Customer Final Details",
                    headerBackTitle: "Back", // This will make the back button title on the *next* screen "Back"
                 }}
            />

            <Stack.Screen
                name="CustomerCommercialPropertyDetailsForm"
                component={CustomerCommercialPropertyDetailsForm}
                options={{ 
                    title: "Customer Property Details",
                    headerBackTitle: "Back", // This will make the back button title on the *next* screen "Back"
                     }}
            />

            <Stack.Screen
                name="AddNewCustomerCommercialRentFinalDetails"
                component={AddNewCustomerCommercialRentFinalDetails}
                options={{ 
                    title: "Customer Final Details",
                    headerBackTitle: "Back", // This will make the back button title on the *next* screen "Back"
                 }}
            />

            <Stack.Screen
                name="CustomerCommercialRentDetailsForm"
                component={CustomerCommercialRentDetailsForm}
                options={{ title: "Rent Details",
                    headerBackTitle: "Back", // This will make the back button title on the *next* screen "Back"
                }}
            />

            <Stack.Screen
                name="CustomerCommercialBuyDetailsForm"
                component={CustomerCommercialBuyDetailsForm}
                options={{ title: "Buy Details",
                    headerBackTitle: "Back", // This will make the back button title on the *next* screen "Back"
                 }}
            />
            <Stack.Screen
                name="AddNewCustomerCommercialBuyFinalDetails"
                component={AddNewCustomerCommercialBuyFinalDetails}
                options={{
                    title: "Customer Final Details",
                    headerBackTitle: "Back", // This will make the back button title on the *next* screen "Back"
                }}
            />

        </Stack.Navigator>
    );
};

export default AddNewContactsStack;
