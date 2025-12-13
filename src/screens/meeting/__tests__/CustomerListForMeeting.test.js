import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import CustomerListForMeeting from '../CustomerListForMeeting';
import { mockUserDetails, mockPropertyDetails, mockCustomerList } from './mockData.util';
import axios from 'axios';
import { SERVER_URL } from '../../../utils/Constant';

// Mock dependencies
jest.mock('axios');
jest.mock('../../contacts/residential/rent/ContactResidentialRentCard', () => () => <div data-testid="rent-card">Rent Card</div>);
jest.mock('../../contacts/residential/buy/ContactResidentialSellCard', () => () => <div data-testid="sell-card">Sell Card</div>);
jest.mock('../../contacts/commercial/rent/CustomerCommercialRentCard', () => () => <div data-testid="comm-rent-card">Comm Rent Card</div>);
jest.mock('../../contacts/commercial/buy/CustomerCommercialBuyCard', () => () => <div data-testid="comm-buy-card">Comm Buy Card</div>);

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate
}));

const mockStore = (state) => ({
    getState: () => state,
    subscribe: () => { },
    dispatch: jest.fn(),
});

describe('CustomerListForMeeting Component', () => {
    let store;

    beforeEach(() => {
        store = mockStore({
            AppReducer: {
                userDetails: mockUserDetails,
                propertyDetails: mockPropertyDetails,
                customerListForMeeting: mockCustomerList,
                residentialCustomerList: [],
                commercialCustomerList: []
            }
        });
        axios.mockResolvedValue({ data: mockCustomerList });
        jest.clearAllMocks();
    });

    test('renders correctly and fetches customer list', async () => {
        render(
            <Provider store={store}>
                <CustomerListForMeeting navigation={{ navigate: mockNavigate }} />
            </Provider>
        );

        await waitFor(() => {
            expect(axios).toHaveBeenCalledWith(SERVER_URL + "/getCustomerListForMeeting", expect.any(Object));
        });

        await screen.findByTestId('rent-card');
        expect(screen.getByTestId('rent-card')).toBeInTheDocument();
        expect(screen.getByTestId('comm-buy-card')).toBeInTheDocument();
    });

    test('filters customer list by search text', async () => {
        render(
            <Provider store={store}>
                <CustomerListForMeeting navigation={{ navigate: mockNavigate }} />
            </Provider>
        );

        await waitFor(() => {
            expect(screen.getByTestId('rent-card')).toBeInTheDocument();
        });

        const searchInput = screen.getByPlaceholderText('Search By Name, Address, Id, Mobile');
        fireEvent.change(searchInput, { target: { value: 'Customer 1' } });

        expect(screen.getByTestId('rent-card')).toBeInTheDocument();
        expect(screen.queryByTestId('comm-buy-card')).not.toBeInTheDocument();
    });

    test('navigates to add new customer', () => {
        // Mock empty list to show "Add New Customer" button
        store = mockStore({
            AppReducer: {
                userDetails: mockUserDetails,
                propertyDetails: mockPropertyDetails,
                customerListForMeeting: [],
                residentialCustomerList: [],
                commercialCustomerList: []
            }
        });
        axios.mockResolvedValue({ data: [] });

        render(
            <Provider store={store}>
                <CustomerListForMeeting navigation={{ navigate: mockNavigate }} />
            </Provider>
        );

        expect(screen.getByText('You have no customer')).toBeInTheDocument();

        fireEvent.click(screen.getByText('Add New Customer'));
        expect(mockNavigate).toHaveBeenCalledWith("AddNewCustomerStack");
    });
});
