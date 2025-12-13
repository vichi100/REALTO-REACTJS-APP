export const mockUserDetails = {
    id: 'user123',
    works_for: 'agent123',
    user_type: 'agent',
    company_name: 'Realto'
};

export const mockCustomerDetails = {
    id: 'cust123',
    name: 'John Doe',
    mobile1: '9876543210',
    mobile2: '9876543210',
    address: '123 Main St',
    customer_details: {
        name: 'John Doe',
        mobile1: '9876543210',
        mobile2: '9876543210',
        address: '123 Main St'
    },
    customer_locality: {
        property_type: 'Residential',
        property_for: 'Rent',
        locality: ['Location 1', 'Location 2'],
        city: 'Test City',
        location_area: [{ main_text: 'Locality 1' }]
    },
    customer_property_details: {
        bhk_type: '2BHK',
        furnishing_status: 'Semi',
        lift: 'Yes',
        parking_type: 'Covered'
    },
    customer_buy_details: {
        expected_buy_price: 5000000,
        available_from: '2023-12-31',
        negotiable: 'Yes'
    },
    customer_rent_details: {
        expected_rent: 25000,
        expected_deposit: 100000,
        available_from: '2023-12-31',
        preferred_tenants: 'Family',
        non_veg_allowed: 'Yes'
    }
};

export const mockPropertyDetails = {
    id: 'prop123',
    property_id: 'prop123',
    agent_id: 'agent123',
    property_type: 'Residential',
    property_for: 'Rent',
    locality: 'Downtown',
    address: '456 Property St',
    rent: 25000,
    deposit: 50000,
    property_address: {
        building_name: 'Test Building',
        landmark_or_street: 'Main Street',
        formatted_address: '456 Property St, Downtown'
    },
    owner_details: {
        name: 'Property Owner',
        mobile: '1234567890'
    }
};

export const mockReminderObj = {
    id: 'reminder123',
    reminder_for: 'Call',
    category_type: 'Residential',
    category_for: 'Rent',
    customer_id: 'cust123',
    property_id: 'prop123'
};

export const mockMatchedCustomers = [
    {
        customer_id: 'cust1',
        name: 'Customer 1',
        mobile1: '1234567890',
        customer_details: {
            name: 'Customer 1',
            mobile1: '1234567890'
        },
        customer_locality: {
            property_type: 'Residential',
            property_for: 'Rent',
            location_area: [{ main_text: 'Test Locality' }]
        },
        customer_property_details: {
            bhk_type: '2BHK',
            furnishing_status: 'Semi',
            lift: 'Yes',
            parking_type: 'Covered'
        },
        customer_rent_details: {
            expected_rent: 25000,
            expected_deposit: 100000,
            available_from: '2023-12-31',
            preferred_tenants: 'Family',
            non_veg_allowed: 'Yes'
        },
    },
    {
        customer_id: 'cust2',
        name: 'Customer 2',
        mobile1: '0987654321',
        customer_details: {
            name: 'Customer 2',
            mobile1: '0987654321'
        },
        customer_locality: {
            property_type: 'Commercial',
            property_for: 'Buy',
            location_area: [{ main_text: 'Test Locality' }]
        },
        customer_property_details: {
            bhk_type: '2BHK',
            furnishing_status: 'Semi',
            lift: 'Yes',
            parking_type: 'Covered'
        },
        customer_buy_details: {
            expected_buy_price: 5000000,
            available_from: '2023-12-31',
            negotiable: 'Yes'
        },
    }
];

export const mockPropertyList = [
    mockPropertyDetails,
    {
        ...mockPropertyDetails,
        id: 'prop124',
        property_id: 'prop124',
        locality: 'Uptown',
        property_address: {
            building_name: 'Another Building',
            landmark_or_street: 'Second Street',
            formatted_address: '789 Property Ave, Uptown'
        }
    }
];

test('mockData', () => {
    expect(true).toBe(true);
});
