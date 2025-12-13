import './setupTests';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import AddNewCustomerBuyResidentialFinalDetails from '../residential/buy/AddNewCustomerBuyResidentialFinalDetails';
import { mockUserDetails, mockCustomerDetails } from './mockData.util';

global.TextEncoder = require('util').TextEncoder;
global.TextDecoder = require('util').TextDecoder;

jest.mock('react-router-dom', () => ({
    useNavigate: () => jest.fn(),
    useLocation: () => ({ state: {} })
}));

const mockStore = configureStore([]);

describe('AddNewCustomerBuyResidentialFinalDetails', () => {
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
                <AddNewCustomerBuyResidentialFinalDetails />
            </Provider>
        );

        expect(screen.getByText(/Looking For/i)).toBeInTheDocument();
    });
});
