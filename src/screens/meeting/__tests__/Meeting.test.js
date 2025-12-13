import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import Meeting from '../Meeting';
import { mockUserDetails, mockCustomerDetails, mockReminderList } from './mockData.util';
import axios from 'axios';
import { SERVER_URL } from '../../../utils/Constant';

// Mock dependencies
jest.mock('axios');
jest.mock('../../../components/Button', () => ({ title, onPress }) => (
    <button onClick={onPress}>{title}</button>
));
jest.mock('../../../components/SnackbarComponent', () => ({ visible, textMessage }) => (
    visible ? <div data-testid="snackbar">{textMessage}</div> : null
));
jest.mock('../../property/PropertyReminder', () => () => <div data-testid="property-reminder">Property Reminder</div>);
jest.mock('../../../components/CustomButtonGroup', () => ({ buttons, onButtonPress }) => (
    <div>
        {buttons.map((btn, index) => (
            <button key={index} onClick={() => onButtonPress(index, btn)}>{btn.text}</button>
        ))}
    </div>
));

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate
}));

const mockStore = (state) => ({
    getState: () => state,
    subscribe: () => { },
    dispatch: jest.fn(),
});

describe('Meeting Component', () => {
    let store;

    beforeEach(() => {
        store = mockStore({
            AppReducer: {
                userDetails: mockUserDetails,
                propReminderList: mockReminderList,
                customerDetailsForMeeting: mockCustomerDetails,
                meetingFormState: null
            }
        });
        axios.post = jest.fn().mockResolvedValue({ data: mockReminderList });
        jest.clearAllMocks();
    });

    test('renders correctly with initial values', async () => {
        render(
            <Provider store={store}>
                <Meeting navigation={{ navigate: mockNavigate }} route={{ params: { item: { property_id: 'prop1' } } }} />
            </Provider>
        );

        expect(screen.getByText('Create a call/visiting schedule to show property to client and get reminder on time')).toBeInTheDocument();
        await waitFor(() => {
            expect(screen.getByText('Property Reminder')).toBeInTheDocument();
        });
    });

    test('validates form inputs', () => {
        // Render with no customer details to trigger validation
        store = mockStore({
            AppReducer: {
                userDetails: mockUserDetails,
                propReminderList: mockReminderList,
                customerDetailsForMeeting: null, // No customer selected
                meetingFormState: null
            }
        });

        render(
            <Provider store={store}>
                <Meeting navigation={{ navigate: mockNavigate }} route={{ params: { item: { property_id: 'prop1' } } }} />
            </Provider>
        );

        fireEvent.click(screen.getByText('Save'));
        expect(screen.getByTestId('snackbar')).toHaveTextContent('Client name is missing');
    });

    test('submits form with valid data', async () => {
        axios.post.mockResolvedValue({ data: 'success' });

        render(
            <Provider store={store}>
                <Meeting navigation={{ navigate: mockNavigate }} route={{ params: { item: { property_id: 'prop1' } } }} />
            </Provider>
        );

        // Fill date
        const dateInput = screen.getByPlaceholderText('DD/MM/YYYY');
        fireEvent.change(dateInput, { target: { value: '2024-01-01' } });

        // Submit
        fireEvent.click(screen.getByText('Save'));

        await waitFor(() => {
            expect(axios.post).toHaveBeenCalledWith(SERVER_URL + "/addNewReminder", expect.any(Object));
        });
    });

    test('navigates to customer list', () => {
        render(
            <Provider store={store}>
                <Meeting navigation={{ navigate: mockNavigate }} route={{ params: { item: { property_id: 'prop1' } } }} />
            </Provider>
        );

        fireEvent.click(screen.getByText('Add Customer For Meeting.'));
        expect(mockNavigate).toHaveBeenCalledWith("CustomerListForMeeting", expect.any(Object));
    });
});
