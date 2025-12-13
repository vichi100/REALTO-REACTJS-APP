import './setupTests';
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import CustomerMeetingDetails from '../CustomerMeetingDetails';
import { mockUserDetails, mockReminderObj } from './mockData.util';
import axios from 'axios';

// Mock dependencies
jest.mock('axios');
jest.mock('../residential/rent/ContactResidentialRentCard', () => ({ item }) => (
    <div data-testid="residential-rent-card">{item.name}</div>
));
jest.mock('../residential/buy/ContactResidentialSellCard', () => ({ item }) => (
    <div data-testid="residential-sell-card">{item.name}</div>
));
jest.mock('../commercial/rent/CustomerCommercialRentCard', () => ({ item }) => (
    <div data-testid="commercial-rent-card">{item.name}</div>
));
jest.mock('../commercial/buy/CustomerCommercialBuyCard', () => ({ item }) => (
    <div data-testid="commercial-buy-card">{item.name}</div>
));

const mockStore = configureStore([]);

describe('CustomerMeetingDetails Component', () => {
    let store;
    const mockItem = {
        category_type: 'Residential',
        category_for: 'Rent',
        customer_id: 'cust123'
    };

    beforeEach(() => {
        store = mockStore({
            AppReducer: {
                userDetails: mockUserDetails
            }
        });
        axios.post.mockResolvedValue({
            data: {
                customer_details: { name: 'John Doe', mobile1: '9876543210' },
                property_details: []
            }
        });
    });

    test('renders null when no item', () => {
        const { container } = render(
            <Provider store={store}>
                <CustomerMeetingDetails route={{ params: {} }} />
            </Provider>
        );

        expect(container.firstChild).toBeNull();
    });

    test('fetches and displays customer meeting details', async () => {
        render(
            <Provider store={store}>
                <CustomerMeetingDetails
                    route={{ params: { item: mockItem, reminderObj: mockReminderObj } }}
                />
            </Provider>
        );

        await waitFor(() => {
            expect(axios.post).toHaveBeenCalled();
        });
    });

    test('renders residential rent card for residential rent category', async () => {
        render(
            <Provider store={store}>
                <CustomerMeetingDetails
                    route={{ params: { item: mockItem, reminderObj: mockReminderObj } }}
                />
            </Provider>
        );

        await waitFor(() => {
            expect(screen.getByTestId('residential-rent-card')).toBeInTheDocument();
        });
    });
});
