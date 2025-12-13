import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import Counter from '../Counter';

describe('Counter Component', () => {
    beforeEach(() => {
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    test('renders countdown initially', () => {
        render(<Counter resendOTP={jest.fn()} />);
        expect(screen.getByText('Resend OTP in')).toBeInTheDocument();
        expect(screen.getByText('120')).toBeInTheDocument();
    });

    test('decrements count over time', () => {
        render(<Counter resendOTP={jest.fn()} />);

        act(() => {
            jest.advanceTimersByTime(1000);
        });

        expect(screen.getByText('119')).toBeInTheDocument();
    });

    test('shows resend button after countdown finishes', () => {
        render(<Counter resendOTP={jest.fn()} />);

        act(() => {
            jest.advanceTimersByTime(120000); // 120 seconds
        });

        expect(screen.getByText('Resend OTP')).toBeInTheDocument();
    });

    test('calls resendOTP when resend button is clicked', () => {
        const mockResend = jest.fn();
        render(<Counter resendOTP={mockResend} />);

        act(() => {
            jest.advanceTimersByTime(120000);
        });

        fireEvent.click(screen.getByText('Resend OTP'));
        expect(mockResend).toHaveBeenCalled();
    });
});
