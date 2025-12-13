import './setupTests';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import AddNewCustomerCommercialBuyFinalDetails from '../commercial/buy/AddNewCustomerCommercialBuyFinalDetails';
import { mockUserDetails, mockCustomerDetails } from './mockData.util';

global.TextEncoder = require('util').TextEncoder;
global.TextDecoder = require('util').TextDecoder;

jest.mock('react-router-dom', () => ({
    useNavigate: () => jest.fn(),
    useLocation: () => ({ state: {} })
}));

const mockStore = configureStore([]);

describe('AddNewCustomerCommercialBuyFinalDetails', () => {
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
                <AddNewCustomerCommercialBuyFinalDetails />
            </Provider>
        );

        expect(screen.getByText(/Looking For/i)).toBeInTheDocument();
    });
});
