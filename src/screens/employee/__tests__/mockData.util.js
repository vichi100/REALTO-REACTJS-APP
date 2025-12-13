export const mockUserDetails = {
    id: 'user123',
    works_for: 'agent123',
    user_type: 'agent',
    company_name: 'Realto',
    address: '123 Main St',
    city: 'Metropolis',
    employee_role: 'admin'
};

export const mockEmployee = {
    id: 'emp123',
    name: 'John Doe',
    mobile: '9876543210',
    photo: 'https://example.com/photo.jpg',
    access_rights: 'read',
    employee_role: 'view',
    company_name: 'Realto',
    assigned_residential_rent_properties: ['prop1'],
    assigned_residential_sell_properties: [],
    assigned_commercial_rent_properties: [],
    assigned_commercial_sell_properties: [],
    assigned_residential_rent_customers: ['cust1'],
    assigned_residential_buy_customers: [],
    assigned_commercial_rent_customers: [],
    assigned_commercial_buy_customers: []
};

export const mockEmployeeList = [
    mockEmployee,
    {
        ...mockEmployee,
        id: 'emp124',
        name: 'Jane Smith',
        mobile: '9876543211',
        employee_role: 'master'
    }
];

export const mockResidentialCustomerList = [
    {
        id: 'cust1',
        name: 'Customer 1',
        mobile: '1234567890'
    }
];

test('mockData', () => {
    expect(true).toBe(true);
});
