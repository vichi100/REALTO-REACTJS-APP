export const mockUserDetails = {
    id: 'user123',
    name: 'John Doe',
    mobile: '9876543210',
    email: 'john.doe@example.com',
    city: 'New York',
    company_name: 'Realto Inc.',
    user_type: 'agent',
    works_for: 'user123',
    employee_role: 'admin'
};

export const mockEmployeeDetails = {
    id: 'emp123',
    name: 'Jane Smith',
    mobile: '1234567890',
    email: 'jane.smith@example.com',
    city: 'Los Angeles',
    company_name: 'Realto Inc.',
    user_type: 'employee',
    works_for: 'user123',
    employee_role: 'manager'
};

export const mockUserProfileResponse = {
    email: 'john.doe@example.com',
    last_backup_date: '01/Jan/2024'
};

test('mockData dummy test', () => {
    expect(true).toBe(true);
});
