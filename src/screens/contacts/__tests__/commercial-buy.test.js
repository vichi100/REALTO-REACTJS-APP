import './setupTests';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import CustomerCommercialBuyCard from '../commercial/buy/CustomerCommercialBuyCard';
import { mockUserDetails, mockCustomerDetails } from './mockData.util';

// Polyfill for TextEncoder
global.TextEncoder = require('util').TextEncoder;
global.TextDecoder = require('util').TextDecoder;

jest.mock('react-router-dom', () => ({
    useNavigate: () => jest.fn()
}));

const mockStore = configureStore([]);

describe('Commercial Buy Contact Components', () => {
    let store;

    beforeEach(() => {
        store = mockStore({
            AppReducer: {
                userDetails: mockUserDetails,
                customerDetailsForMeeting: null
            }
        });
    });

    test('CustomerCommercialBuyCard renders correctly', () => {
        const mockItem = {
            ...mockCustomerDetails,
            customer_locality: {
                property_type: 'Commercial',
                property_for: 'Buy',
                location_area: [{ main_text: 'Test Locality' }]
            }
        };

        render(
            <Provider store={store}>
                <CustomerCommercialBuyCard item={mockItem} />
            </Provider>
        );

        expect(screen.getByText(mockItem.name)).toBeInTheDocument();
    });
});

test('mockData', () => {
    expect(true).toBe(true);
});
