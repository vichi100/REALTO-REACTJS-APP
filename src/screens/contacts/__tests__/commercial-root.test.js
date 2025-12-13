import './setupTests';
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import CustomersCommercial from '../commercial/CustomersCommercial';
import { mockUserDetails, mockMatchedCustomers } from './mockData.util';
import axios from 'axios';

// Polyfill for TextEncoder
global.TextEncoder = require('util').TextEncoder;
global.TextDecoder = require('util').TextDecoder;

jest.mock('axios');
jest.mock('react-router-dom', () => ({
    useNavigate: () => jest.fn(),
    useLocation: () => ({ state: {} })
}));

const mockStore = configureStore([]);

describe('Commercial Root Contact Components', () => {
    let store;

    beforeEach(() => {
        store = mockStore({
            AppReducer: {
                userDetails: mockUserDetails,
                commercialCustomerList: mockMatchedCustomers
            },
            dataRefresh: { shouldRefresh: false }
        });
        axios.mockResolvedValue({ data: mockMatchedCustomers });
        axios.mockResolvedValue({ data: mockMatchedCustomers });
    });

    test('CustomersCommercial renders correctly', async () => {
        render(
            <Provider store={store}>
                <CustomersCommercial />
            </Provider>
        );

        await waitFor(() => {
            expect(screen.getByPlaceholderText(/Search/i)).toBeInTheDocument();
        });
    });
});

test('mockData', () => {
    expect(true).toBe(true);
});
