import './setupTests';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import ContactResidentialSellCard from '../residential/buy/ContactResidentialSellCard';
import { mockUserDetails, mockCustomerDetails } from './mockData.util';

// Polyfill for TextEncoder
global.TextEncoder = require('util').TextEncoder;
global.TextDecoder = require('util').TextDecoder;

jest.mock('react-router-dom', () => ({
    useNavigate: () => jest.fn()
}));

const mockStore = configureStore([]);

describe('Residential Buy Contact Components', () => {
    let store;

    beforeEach(() => {
        store = mockStore({
            AppReducer: {
                userDetails: mockUserDetails,
                customerDetailsForMeeting: null
            }
        });
    });

    test('ContactResidentialSellCard renders correctly', () => {
        const mockItem = {
            ...mockCustomerDetails,
            customer_locality: {
                property_type: 'Residential',
                property_for: 'Buy',
                location_area: [{ main_text: 'Test Locality' }]
            }
        };

        render(
            <Provider store={store}>
                <ContactResidentialSellCard item={mockItem} />
            </Provider>
        );

        expect(screen.getByText(mockItem.name)).toBeInTheDocument();
    });
});

test('mockData', () => {
    expect(true).toBe(true);
});
