import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import GlobalCommercialCustomersSearchResult from '../GlobalCommercialCustomersSearchResult';
import { mockUserDetails, mockCommercialCustomer } from './mockData';
import axios from 'axios';

// Mock dependencies
jest.mock('axios');

// Mock child components
jest.mock('./../../../components/CustomButtonGroup', () => ({ buttons, onButtonPress, selectedIndices }) => (
    <div data-testid="custom-button-group">
        {buttons.map((btn, idx) => (
            <button
                key={idx}
                onClick={() => onButtonPress(idx, btn)}
                data-selected={selectedIndices.includes(idx)}
            >
                {btn.text}
            </button>
        ))}
    </div>
));

jest.mock('./../../../components/SnackbarComponent', () => ({ visible, textMessage, actionHandler }) => (
    visible ? (
        <div data-testid="snackbar">
            <span>{textMessage}</span>
            <button onClick={actionHandler}>OK</button>
        </div>
    ) : null
));

jest.mock('../../contacts/commercial/rent/CustomerCommercialRentCard', () => ({ item, deleteMe, closeMe }) => (
    <div data-testid="rent-card">
        <span>{item.customer_details.name}</span>
        <button onClick={() => deleteMe(item)}>Delete</button>
        <button onClick={() => closeMe(item)}>Close</button>
    </div>
));

jest.mock('../../contacts/commercial/buy/CustomerCommercialBuyCard', () => ({ item, deleteMe, closeMe }) => (
    <div data-testid="buy-card">
        <span>{item.customer_details.name}</span>
        <button onClick={() => deleteMe(item)}>Delete</button>
        <button onClick={() => closeMe(item)}>Close</button>
    </div>
));

const mockNavigation = {
    navigate: jest.fn(),
};

const mockRoute = {
    params: {
        searchGlobalResult: jest.fn(),
    },
};

const renderWithRedux = (component) => {
    const initialState = {
        AppReducer: {
            userDetails: mockUserDetails,
            commercialCustomerList: [JSON.parse(JSON.stringify(mockCommercialCustomer))],
            globalSearchResult: [JSON.parse(JSON.stringify(mockCommercialCustomer))],
        },
        dataRefresh: {
            shouldRefresh: false
        }
    };
    const mockReducer = (state = initialState, action) => state;
    const store = createStore(mockReducer);
    return render(
        <Provider store={store}>
            {component}
        </Provider>
    );
};

describe('GlobalCommercialCustomersSearchResult Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders correctly with data', () => {
        renderWithRedux(
            <GlobalCommercialCustomersSearchResult navigation={mockNavigation} route={mockRoute} />
        );

        expect(screen.getByPlaceholderText('GLocal Search...')).toBeInTheDocument();
        expect(screen.getByText(mockCommercialCustomer.customer_details.name)).toBeInTheDocument();
    });

    test('filters list by search text', () => {
        renderWithRedux(
            <GlobalCommercialCustomersSearchResult navigation={mockNavigation} route={mockRoute} />
        );

        const searchInput = screen.getByPlaceholderText('GLocal Search...');
        fireEvent.change(searchInput, { target: { value: 'NonExistentName' } });

        expect(screen.queryByText(mockCommercialCustomer.customer_details.name)).not.toBeInTheDocument();

        fireEvent.change(searchInput, { target: { value: 'John' } });
        expect(screen.getByText(mockCommercialCustomer.customer_details.name)).toBeInTheDocument();
    });

    test('opens filter modal and applies filter', () => {
        renderWithRedux(
            <GlobalCommercialCustomersSearchResult navigation={mockNavigation} route={mockRoute} />
        );

        // Open filter modal (assuming the second button in the bottom right is filter)
        // Since we don't have aria-labels, we might need to rely on the icon or order.
        // The code has 2 buttons. Filter is the second one.
        const filterButton = screen.getByTestId('filter-button');
        fireEvent.click(filterButton);

        expect(screen.getByText('Filter')).toBeInTheDocument();

        // Select "Rent"
        fireEvent.click(screen.getByText('Rent'));

        // Apply
        fireEvent.click(screen.getByTestId('apply-filter-button'));

        // Verify filter logic (mock data is Rent, so it should stay)
        expect(screen.getByText(mockCommercialCustomer.customer_details.name)).toBeInTheDocument();
    });

    test('opens sort modal and applies sort', () => {
        renderWithRedux(
            <GlobalCommercialCustomersSearchResult navigation={mockNavigation} route={mockRoute} />
        );

        // Sort button is the second to last button
        const sortButton = screen.getByTestId('sort-button');
        fireEvent.click(sortButton);

        expect(screen.getByText('Sort By')).toBeInTheDocument();

        // Select "Rent" (Looking For)
        const rentBtns = screen.getAllByText('Rent');
        fireEvent.click(rentBtns[rentBtns.length - 1]); // The one in the modal

        // Select "A First"
        fireEvent.click(screen.getByText('A First'));

        // Verify sort logic (mock data should be present)
        expect(screen.getByText(mockCommercialCustomer.customer_details.name)).toBeInTheDocument();
    });

    test('handles delete action', async () => {
        axios.mockResolvedValue({ data: 'success' });

        renderWithRedux(
            <GlobalCommercialCustomersSearchResult navigation={mockNavigation} route={mockRoute} />
        );

        const deleteBtn = screen.getByText('Delete');
        fireEvent.click(deleteBtn);

        await waitFor(() => {
            expect(axios).toHaveBeenCalledWith(expect.stringContaining('/deleteResidintialCustomer'), expect.any(Object));
        });
    });

    test('handles close action', async () => {
        axios.mockResolvedValue({ data: 'success' });

        renderWithRedux(
            <GlobalCommercialCustomersSearchResult navigation={mockNavigation} route={mockRoute} />
        );

        const closeBtn = screen.getByText('Close');
        fireEvent.click(closeBtn);

        await waitFor(() => {
            expect(axios).toHaveBeenCalledWith(expect.stringContaining('/closeResidintialCustomer'), expect.any(Object));
        });
    });
});
