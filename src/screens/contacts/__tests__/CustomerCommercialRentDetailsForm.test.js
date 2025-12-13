import './setupTests';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import CustomerCommercialRentDetailsForm from '../commercial/rent/CustomerCommercialRentDetailsForm';
import { mockUserDetails, mockCustomerDetails } from './mockData.util';

global.TextEncoder = require('util').TextEncoder;
global.TextDecoder = require('util').TextDecoder;

jest.mock('react-router-dom', () => ({
    useNavigate: () => jest.fn()
}));

const mockStore = configureStore([]);

describe('CustomerCommercialRentDetailsForm', () => {
    let store;

    beforeEach(() => {
        store = mockStore({
            AppReducer: {
                userDetails: mockUserDetails,
                customerDetails: mockCustomerDetails
            }
        });
    });

    test('renders correctly', () => {
        render(
            <Provider store={store}>
                <CustomerCommercialRentDetailsForm />
            </Provider>
        );

        expect(screen.getByText(/Max Rent/i)).toBeInTheDocument();
    });
});
