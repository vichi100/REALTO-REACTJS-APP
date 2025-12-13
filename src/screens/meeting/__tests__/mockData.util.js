export const mockUserDetails = {
    id: 'user123',
    works_for: 'user123',
    user_type: 'agent',
    employee_role: 'admin'
};

export const mockPropertyDetails = {
    property_id: 'prop123',
    property_type: 'Residential',
    property_for: 'Rent',
    agent_id: 'user123'
};

export const mockCustomerList = [
    {
        customer_id: 'cust1',
        customer_details: {
            name: 'Customer 1',
            mobile1: '1234567890',
            address: 'Address 1'
        },
        customer_locality: {
            property_type: 'Residential',
            property_for: 'Rent',
            location_area: [{ main_text: 'Area 1' }]
        }
    },
    {
        customer_id: 'cust2',
        customer_details: {
            name: 'Customer 2',
            mobile1: '0987654321',
            address: 'Address 2'
        },
        customer_locality: {
            property_type: 'Commercial',
            property_for: 'Buy',
            location_area: [{ main_text: 'Area 2' }]
        }
    }
];

export const mockCustomerDetails = {
    customer_id: 'cust1',
    name: 'Customer 1',
    mobile: '1234567890',
    agent_id: 'user123'
};

export const mockReminderList = [
    {
        id: 'rem1',
        client_name: 'Client 1',
        meeting_date: '2024-01-01',
        meeting_time: '10:00 AM'
    }
];

test('mockData dummy test', () => {
    expect(true).toBe(true);
});
