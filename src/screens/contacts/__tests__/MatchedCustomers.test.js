import './setupTests';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import MatchedCustomers from '../MatchedCustomers';
import { mockUserDetails, mockMatchedCustomers, mockPropertyDetails } from './mockData.util';
import axios from 'axios';

// Polyfill for TextEncoder
global.TextEncoder = require('util').TextEncoder;
global.TextDecoder = require('util').TextDecoder;

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

describe('MatchedCustomers Component', () => {
    let store;

    beforeEach(() => {
        store = mockStore({
            AppReducer: {
                userDetails: mockUserDetails,
                residentialCustomerList: mockMatchedCustomers,
                commercialCustomerList: []
            }
        });
        axios.mockResolvedValue({ data: mockMatchedCustomers });
    });

    test('renders loading state initially', () => {
        render(
            <Provider store={store}>
                <MatchedCustomers route={{ params: { matchedProprtyItem: mockPropertyDetails } }} />
            </Provider>
        );

        expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    test('fetches and displays matched customers', async () => {
        render(
            <Provider store={store}>
                <MatchedCustomers route={{ params: { matchedProprtyItem: mockPropertyDetails } }} />
            </Provider>
        );

        await waitFor(() => {
            expect(axios).toHaveBeenCalled();
        });
    });


});
