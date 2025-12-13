import './setupTests';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import ContactRentDetailsForm from '../residential/rent/ContactRentDetailsForm';
import { mockUserDetails, mockCustomerDetails } from './mockData.util';

global.TextEncoder = require('util').TextEncoder;
global.TextDecoder = require('util').TextDecoder;

jest.mock('react-router-dom', () => ({
    useNavigate: () => jest.fn()
}));

const mockStore = configureStore([]);

describe('ContactRentDetailsForm', () => {
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
                <ContactRentDetailsForm />
            </Provider>
        );

        expect(screen.getByText(/Provide rent details/i)).toBeInTheDocument();
    });
});
