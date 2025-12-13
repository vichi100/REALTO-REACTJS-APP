import './setupTests';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import PropertyListForMeeting from '../PropertyListForMeeting';
import { mockUserDetails, mockCustomerDetails, mockPropertyList } from './mockData.util';

// Mock dependencies
jest.mock('../../property/residential/rent/ResidentialRentCard', () => ({ item }) => (
    <div data-testid="residential-rent-card">{item.locality}</div>
));
jest.mock('../../property/residential/sell/ResidentialSellCard', () => ({ item }) => (
    <div data-testid="residential-sell-card">{item.locality}</div>
));
jest.mock('../../property/commercial/rent/CommercialRentCard', () => ({ item }) => (
    <div data-testid="commercial-rent-card">{item.locality}</div>
));
jest.mock('../../property/commercial/sell/CommercialSellCard', () => ({ item }) => (
    <div data-testid="commercial-sell-card">{item.locality}</div>
));

const mockStore = configureStore([]);

describe('PropertyListForMeeting Component', () => {
    let store;

    beforeEach(() => {
        store = mockStore({
            AppReducer: {
                userDetails: mockUserDetails,
                customerDetails: mockCustomerDetails,
                residentialPropertyList: mockPropertyList,
                commercialPropertyList: [],
                propertyListingForMeeting: mockPropertyList
            }
        });
    });

    test('renders correctly', () => {
        render(
            <Provider store={store}>
                <PropertyListForMeeting />
            </Provider>
        );

        expect(screen.getByPlaceholderText(/Search/i)).toBeInTheDocument();
    });
});
