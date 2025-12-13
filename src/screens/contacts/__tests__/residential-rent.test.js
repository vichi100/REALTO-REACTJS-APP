import './setupTests';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import ContactResidentialRentCard from '../residential/rent/ContactResidentialRentCard';
import { mockUserDetails, mockCustomerDetails } from './mockData.util';

// Polyfill for TextEncoder
global.TextEncoder = require('util').TextEncoder;
global.TextDecoder = require('util').TextDecoder;

jest.mock('react-router-dom', () => ({
    useNavigate: () => jest.fn()
}));

const mockStore = configureStore([]);

describe('Residential Rent Contact Components', () => {
    let store;

    beforeEach(() => {
        store = mockStore({
            AppReducer: {
                userDetails: mockUserDetails,
                customerDetailsForMeeting: null
            }
        });
    });

    test('ContactResidentialRentCard renders correctly', () => {
        const mockItem = {
            ...mockCustomerDetails,
            customer_locality: {
                property_type: 'Residential',
                property_for: 'Rent',
                location_area: [{ main_text: 'Test Locality' }]
            }
        };

        render(
            <Provider store={store}>
                <ContactResidentialRentCard item={mockItem} />
            </Provider>
        );

        expect(screen.getByText(mockItem.name)).toBeInTheDocument();
    });
});

test('mockData', () => {
    expect(true).toBe(true);
});
