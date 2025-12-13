export const mockUserDetails = {
    id: 'user123',
    works_for: 'agent123',
    user_type: 'agent',
    user_status: 'active',
    company_name: 'Realto',
    address: '123 Main St',
    city: 'Metropolis'
};

export const mockSuspendedUserDetails = {
    ...mockUserDetails,
    user_status: 'suspend'
};

export const mockListingSummary = {
    residentialPropertyRentCount: 10,
    residentialPropertySellCount: 5,
    residentialPropertyCustomerRentCount: 8,
    residentialPropertyCustomerBuyCount: 6,
    commercialPropertyRentCount: 3,
    commercialPropertySellCount: 2,
    commercialPropertyCustomerRentCount: 4,
    commercialPropertyCustomerBuyCount: 1
};

test('mockData', () => {
    expect(true).toBe(true);
});
