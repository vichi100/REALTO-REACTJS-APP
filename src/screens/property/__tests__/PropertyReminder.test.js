import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import PropertyReminder from '../PropertyReminder';
import { mockUserDetails } from './mockData';

// Mock dependencies
const mockNavigate = jest.fn();
const mockNavigation = {
    navigate: mockNavigate,
};

jest.mock('../../../utils/methods', () => ({
    makeCall: jest.fn(),
    formatIsoDateToCustomString: (date) => date,
    formatClientNameForDisplay: (name) => name,
    formatMobileNumber: (num) => num,
}));

const mockReminders = [
    {
        id: 1,
        client_name: 'Future Client',
        meeting_date: '2099-12-31',
        meeting_time: '10:00 AM',
        reminder_for: 'Meeting',
        client_mobile: '1234567890',
        property_reference_id: "REF123"
    },
    {
        id: 2,
        client_name: 'Past Client',
        meeting_date: '2000-01-01',
        meeting_time: '10:00 AM',
        reminder_for: 'Call',
        client_mobile: '0987654321'
    }
];

const initialState = {
    AppReducer: {
        userDetails: mockUserDetails,
        propReminderList: mockReminders,
    },
};

const mockReducer = (state = initialState, action) => state;
const store = createStore(mockReducer);

describe('PropertyReminder Component', () => {
    test('renders correctly with reminders', () => {
        render(
            <Provider store={store}>
                <PropertyReminder navigation={mockNavigation} reminderListX={mockReminders} />
            </Provider>
        );

        expect(screen.getByText('Upcoming Meetings')).toBeInTheDocument();
        expect(screen.getByText('Past Meetings')).toBeInTheDocument();
        expect(screen.getByText('Future Client')).toBeInTheDocument();
        expect(screen.getByText('Past Client')).toBeInTheDocument();
    });

    test('navigates to details on click', () => {
        render(
            <Provider store={store}>
                <PropertyReminder navigation={mockNavigation} reminderListX={mockReminders} />
            </Provider>
        );

        fireEvent.click(screen.getByText('Future Client'));
        expect(mockNavigate).toHaveBeenCalledWith("CustomerMeetingDetails", expect.anything());
    });
});
