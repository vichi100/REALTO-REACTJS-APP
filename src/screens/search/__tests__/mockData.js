export const mockUserDetails = {
    id: "user123",
    works_for: "agent123",
    name: "Test User",
    mobile: "1234567890"
};

export const mockCommercialCustomer = {
    customer_id: "cust1",
    customer_details: {
        name: "John Doe",
        address: "123 Main St",
        mobile1: "9876543210"
    },
    customer_locality: {
        property_type: "Commercial",
        property_for: "Rent",
        location_area: "Downtown"
    },
    customer_property_details: {
        property_used_for: "Shop",
        building_type: "Mall"
    },
    customer_rent_details: {
        expected_rent: 20000,
        available_from: "2023-12-01"
    },
    customer_buy_details: {
        expected_buy_price: 5000000
    },
    rent_details: {
        available_from: "2023-12-01"
    },
    create_date_time: "2023-11-01T10:00:00Z",
    customer_status: 0
};

export const mockCommercialProperty = {
    property_id: "prop1",
    property_type: "Commercial",
    property_for: "Rent",
    property_address: {
        building_name: "Tech Park",
        landmark_or_street: "Main Road",
        location_area: "Business District"
    },
    owner_details: {
        name: "Jane Smith",
        mobile1: "1122334455"
    },
    property_details: {
        property_used_for: "Office",
        ideal_for: ["Office", "IT"],
        building_type: "Businesses park ",
        property_size: 1000
    },
    rent_details: {
        expected_rent: 50000,
        available_from: "2023-12-15"
    },
    sell_details: {
        expected_sell_price: 10000000
    },
    create_date_time: "2023-11-10T10:00:00Z",
    property_status: 0
};

export const mockResidentialCustomer = {
    customer_id: "cust2",
    customer_details: {
        name: "Alice Brown",
        address: "456 Lane",
        mobile1: "5556667777"
    },
    customer_locality: {
        property_type: "Residential",
        property_for: "Buy",
        location_area: "Suburb"
    },
    customer_property_details: {
        house_type: "Apartment",
        bhk_type: "2BHK",
        furnishing_status: "Semi"
    },
    customer_rent_details: {
        expected_rent: 15000,
        available_from: "2023-12-05"
    },
    customer_buy_details: {
        expected_buy_price: 6000000
    },
    create_date_time: "2023-11-05T10:00:00Z",
    customer_status: 0
};

export const mockResidentialProperty = {
    property_id: "prop2",
    property_type: "Residential",
    property_for: "Rent",
    property_address: {
        building_name: "Green Valley",
        landmark_or_street: "Park Ave",
        location_area: "Green Zone"
    },
    owner_details: {
        name: "Bob White",
        mobile1: "9988776655"
    },
    property_details: {
        house_type: "Apartment",
        bhk_type: "3BHK",
        furnishing_status: "Full",
        property_size: 1500
    },
    rent_details: {
        expected_rent: 25000,
        available_from: "2023-12-20"
    },
    sell_details: {
        expected_sell_price: 8000000
    },
    create_date_time: "2023-11-15T10:00:00Z",
    property_status: 0
};

test('mockData dummy test', () => {
    expect(true).toBe(true);
});
