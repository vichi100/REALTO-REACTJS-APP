export const mockUserDetails = {
    id: 'user123',
    name: 'John Doe',
    mobile: '9876543210',
    email: 'john.doe@example.com',
    user_type: 'agent'
};

export const mockOtpResponse = {
    status: 'success',
    message: 'OTP sent successfully'
};

export const mockUserResponse = {
    id: 'user123',
    name: 'John Doe',
    mobile: '9876543210',
    token: 'token123'
};

test('mockData dummy test', () => {
    expect(true).toBe(true);
});
