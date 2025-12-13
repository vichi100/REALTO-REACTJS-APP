import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import OtpScreen from '../OtpScreen';
import { mockUserDetails, mockOtpResponse, mockUserResponse } from './mockData.util';
import axios from 'axios';
import { SERVER_URL } from '../../../utils/Constant';
import { useNavigate } from 'react-router-dom';

// Mock dependencies
jest.mock('axios');
jest.mock('../Counter', () => ({ resendOTP }) => (
    <button onClick={resendOTP}>Resend OTP</button>
));
jest.mock('react-otp-input', () => (props) => (
    <input
        data-testid="otp-input"
        onChange={(e) => props.onChange(e.target.value)}
        value={props.value}
    />
));

jest.mock('react-router-dom', () => {
    const { TextEncoder, TextDecoder } = require('util');
    Object.assign(global, { TextEncoder, TextDecoder });
    return {
        ...jest.requireActual('react-router-dom'),
        useNavigate: jest.fn(),
        useLocation: () => ({ state: { needToEnterOTP: true } })
    };
});

const mockStore = (state) => ({
    getState: () => state,
    subscribe: () => { },
    dispatch: jest.fn(),
});

describe('OtpScreen Component', () => {
    let store;
    const mockNavigate = jest.fn();

    beforeEach(() => {
        useNavigate.mockReturnValue(mockNavigate);
        store = mockStore({
            AppReducer: {
                userDetails: null,
                country: 'India',
                countryCode: '+91',
                userMobileNumber: '9876543210'
            }
        });
        axios.post = jest.fn().mockResolvedValue({ data: mockOtpResponse });
        jest.clearAllMocks();
    });

    test('renders correctly and generates OTP on mount', async () => {
        render(
            <Provider store={store}>
                <OtpScreen />
            </Provider>
        );

        expect(await screen.findByText('OTP Sent To Mobile')).toBeInTheDocument();
        expect(screen.getByText('+91 9876543210')).toBeInTheDocument();

        await waitFor(() => {
            expect(axios.post).toHaveBeenCalledWith(SERVER_URL + '/generateOTP', expect.any(Object));
        });
    });

    test('submits OTP when filled', async () => {
        render(
            <Provider store={store}>
                <OtpScreen />
            </Provider>
        );

        // Wait for initial OTP generation
        await waitFor(() => {
            expect(axios.post).toHaveBeenCalledTimes(1);
        });

        // Mock getUserDetails response
        axios.post.mockResolvedValueOnce({ data: mockUserResponse });

        const otpInput = screen.getByTestId('otp-input');
        // The component hardcodes OTP to "999999" in generateOTP
        fireEvent.change(otpInput, { target: { value: '999999' } });

        await waitFor(() => {
            expect(axios.post).toHaveBeenCalledWith(SERVER_URL + '/getUserDetails', expect.any(Object));
        });
    });

    test('resends OTP', async () => {
        render(
            <Provider store={store}>
                <OtpScreen />
            </Provider>
        );

        await waitFor(() => {
            expect(axios.post).toHaveBeenCalledTimes(1);
        });

        fireEvent.click(screen.getByText('Resend OTP'));

        await waitFor(() => {
            expect(axios.post).toHaveBeenCalledTimes(2);
        });
    });

    test('navigates to home on skip', async () => {
        render(
            <Provider store={store}>
                <OtpScreen />
            </Provider>
        );

        const skipButton = await screen.findByText('Skip >>');
        fireEvent.click(skipButton);
        expect(mockNavigate).toHaveBeenCalledWith('/');
    });
});
