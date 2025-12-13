import './setupTests';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import CustomerDetailsResidentialBuyFromList from '../residential/buy/CustomerDetailsResidentialBuyFromList';
import { mockUserDetails, mockCustomerDetails } from './mockData.util';

global.TextEncoder = require('util').TextEncoder;
global.TextDecoder = require('util').TextDecoder;

jest.mock('react-router-dom', () => ({
    useNavigate: () => jest.fn(),
    useLocation: () => ({ state: { item: { name: 'Test Customer' } } })
}));

const mockStore = configureStore([]);

describe('CustomerDetailsResidentialBuyFromList', () => {
    let store;

    beforeEach(() => {
        store = mockStore({
            AppReducer: {
                userDetails: mockUserDetails
            }
        });
    });

    test('renders correctly', () => {
        const mockItem = {
            ...mockCustomerDetails,
            customer_details: {
                name: 'Test Customer',
                mobile1: '9876543210',
                address: 'Test Address'
            },
            customer_property_details: {
                bhk_type: '2BHK',
                furnishing_status: 'Semi',
                lift: 'Yes',
                parking_type: 'Covered'
            },
            customer_buy_details: {
                expected_buy_price: 5000000,
                available_from: '2023-12-31',
                negotiable: 'Yes'
            },
            customer_locality: {
                city: 'Test City',
                location_area: [{ main_text: 'Test Locality' }]
            }
        };

        render(
            <Provider store={store}>
                <CustomerDetailsResidentialBuyFromList route={{ params: { item: mockItem } }} />
            </Provider>
        );

        expect(screen.getByText('Test Customer')).toBeInTheDocument();
    });
});
