import './setupTests';
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import ContactsResidential from '../residential/ContactsResidential';
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

describe('Residential Root Contact Components', () => {
    let store;

    beforeEach(() => {
        store = mockStore({
            AppReducer: {
                userDetails: mockUserDetails,
                residentialCustomerList: mockMatchedCustomers
            },
            dataRefresh: {
                shouldRefresh: false
            }
        });
        axios.mockResolvedValue({ data: mockMatchedCustomers });
    });

    test('ContactsResidential renders correctly', async () => {
        render(
            <Provider store={store}>
                <ContactsResidential route={{ params: {} }} />
            </Provider>
        );

        await waitFor(() => {
            // expect(screen.getByText('Loading...')).not.toBeInTheDocument();
            expect(screen.getByPlaceholderText(/Search/i)).toBeInTheDocument();
        });
    });
});

test('mockData', () => {
    expect(true).toBe(true);
});
