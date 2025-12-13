export const mockUserDetails = {
    id: "user123",
    works_for: "agent123",
    name: "Test User",
    mobile: "1234567890"
};

export const mockPropertyDetails = {
    property_type: "Residential",
    property_for: "Rent",
    property_status: "open",
    owner_details: {
        name: "John Doe",
        mobile1: "9876543210",
        address: "123 Main St"
    }
};

export const mockResidentialProperty = {
    property_id: "prop1",
    property_type: "Residential",
    property_for: "Rent",
    property_address: {
        flat_number: "101",
        building_name: "Green Valley",
        landmark_or_street: "Park Ave",
        location_area: "Green Zone",
        formatted_address: "Green Valley, Park Ave, Green Zone"
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
        expected_sell_price: 8000000,
        available_from: "2023-12-20"
    },
    create_date_time: "2023-11-15T10:00:00Z",
    property_status: 0,
    image_urls: [],
    match_count: 5
};

export const mockCommercialProperty = {
    property_id: "comm1",
    property_type: "Commercial",
    property_for: "Rent",
    property_address: {
        building_name: "City Mall",
        landmark_or_street: "Main St",
        location_area: "Downtown",
        formatted_address: "City Mall, Main St, Downtown"
    },
    owner_details: {
        name: "Alice Green",
        mobile1: "1122334455"
    },
    property_details: {
        property_used_for: "Shop",
        building_type: "Mall",
        property_size: 500,
        ideal_for: ["Shop", "Office"]
    },
    rent_details: {
        expected_rent: 50000,
        available_from: "2023-12-25"
    },
    sell_details: {
        expected_sell_price: 10000000,
        available_from: "2023-12-25"
    },
    create_date_time: "2023-11-20T10:00:00Z",
    property_status: 0,
    image_urls: [],
    match_count: 5
};

test('mockData dummy test', () => {
    expect(true).toBe(true);
});
