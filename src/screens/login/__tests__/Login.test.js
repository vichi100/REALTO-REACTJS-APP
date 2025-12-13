import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import Login from '../Login';

// Mock dependencies
jest.mock('react-icons/fa', () => ({
    FaPlay: () => <div data-testid="play-icon">Play Icon</div>
}));
jest.mock('../../../components/SnackbarComponent', () => ({ visible, textMessage }) => (
    visible ? <div data-testid="snackbar">{textMessage}</div> : null
));

import { useNavigate } from 'react-router-dom';

jest.mock('react-router-dom', () => {
    const { TextEncoder, TextDecoder } = require('util');
    Object.assign(global, { TextEncoder, TextDecoder });
    return {
        ...jest.requireActual('react-router-dom'),
        useNavigate: jest.fn()
    };
});

const mockStore = (state) => ({
    getState: () => state,
    subscribe: () => { },
    dispatch: jest.fn(),
});

describe('Login Component', () => {
    let store;
    const mockNavigate = jest.fn();

    beforeEach(() => {
        useNavigate.mockReturnValue(mockNavigate);
        store = mockStore({
            AppReducer: {
                userMobileNumber: '',
                userDetails: null
            }
        });
        jest.clearAllMocks();
    });

    test('renders correctly', () => {
        render(
            <Provider store={store}>
                <Login />
            </Provider>
        );

        expect(screen.getByText('Supercharge Your Property Broking')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Enter Mobile Number')).toBeInTheDocument();
    });

    test('validates mobile number length', () => {
        render(
            <Provider store={store}>
                <Login />
            </Provider>
        );

        const input = screen.getByPlaceholderText('Enter Mobile Number');
        fireEvent.change(input, { target: { value: '123' } });

        const nextButton = screen.getByTestId('play-icon').parentElement;
        fireEvent.click(nextButton);

        expect(screen.getByTestId('snackbar')).toHaveTextContent('Please enter a valid 10-digit mobile number');
    });

    test('navigates to OTP screen on valid input', () => {
        render(
            <Provider store={store}>
                <Login />
            </Provider>
        );

        const input = screen.getByPlaceholderText('Enter Mobile Number');
        fireEvent.change(input, { target: { value: '9876543210' } });

        const nextButton = screen.getByTestId('play-icon').parentElement;
        fireEvent.click(nextButton);

        expect(mockNavigate).toHaveBeenCalledWith("/otp", expect.objectContaining({
            state: { needToEnterOTP: true }
        }));
    });

    test('navigates to home on skip', () => {
        render(
            <Provider store={store}>
                <Login />
            </Provider>
        );

        fireEvent.click(screen.getByText('Skip'));
        expect(mockNavigate).toHaveBeenCalledWith("/");
    });
});
