import './setupTests';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import CustomerMeeting from '../CustomerMeeting';
import { mockUserDetails, mockCustomerDetails, mockPropertyDetails } from './mockData.util';
import axios from 'axios';

// Mock dependencies
jest.mock('axios');
jest.mock('../../../components/Button', () => ({ title, onPress }) => (
    <button onClick={onPress}>{title}</button>
));
jest.mock('../../../components/SnackbarComponent', () => ({ visible, textMessage }) => (
    visible ? <div data-testid="snackbar">{textMessage}</div> : null
));
jest.mock('../../../components/CustomButtonGroup', () => ({ buttons, onButtonPress }) => (
    <div data-testid="button-group">
        {buttons.map((btn, idx) => (
            <button key={idx} onClick={() => onButtonPress(idx, btn)}>{btn.text}</button>
        ))}
    </div>
));

const mockStore = configureStore([]);

describe('CustomerMeeting Component', () => {
    let store;
    const mockItem = {
        ...mockCustomerDetails,
        customer_locality: {
            property_type: 'Residential',
            property_for: 'Buy'
        }
    };

    beforeEach(() => {
        store = mockStore({
            AppReducer: {
                userDetails: mockUserDetails,
                customerMeetingFormState: null,
                propListForMeeting: []
            }
        });
        axios.mockResolvedValue({ data: [] });
        axios.post.mockResolvedValue({ data: [] });
    });

    test('renders correctly', () => {
        render(
            <Provider store={store}>
                <CustomerMeeting route={{ params: { item: mockItem, category: 'Residential' } }} />
            </Provider>
        );

        expect(screen.getByText(/Create a call\/visiting schedule/i)).toBeInTheDocument();
    });

    test('validates required fields on submit', () => {
        render(
            <Provider store={store}>
                <CustomerMeeting route={{ params: { item: mockItem, category: 'Residential' } }} />
            </Provider>
        );

        fireEvent.click(screen.getByText('Save'));
        expect(screen.getByTestId('snackbar')).toBeInTheDocument();
    });

    test('handles reminder type selection', () => {
        render(
            <Provider store={store}>
                <CustomerMeeting route={{ params: { item: mockItem, category: 'Residential' } }} />
            </Provider>
        );

        const visitButton = screen.getByText('Property Visit');
        fireEvent.click(visitButton);
        // Component should update state
    });
});
