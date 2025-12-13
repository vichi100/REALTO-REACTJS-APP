import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import ListingResidential from '../residential/ListingResidential';
import { mockUserDetails, mockResidentialProperty } from './mockData';
import axios from 'axios';

// Mock dependencies
jest.mock('axios');
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    useNavigate: () => mockNavigate,
    useLocation: () => ({ state: {} }),
}));

// Mock child components
jest.mock('../../../components/Button', () => ({ title, onPress }) => (
    <button onClick={onPress}>{title}</button>
));

jest.mock('../../../components/CustomButtonGroup', () => ({ buttons, onPress, selectedIndex }) => (
    <div data-testid="custom-button-group">
        {buttons.map((btn, idx) => (
            <button
                key={idx}
                onClick={() => onPress(idx)}
                data-selected={selectedIndex === idx}
            >
                {btn.text}
            </button>
        ))}
    </div>
));

jest.mock('../../../components/SnackbarComponent', () => ({ visible, textMessage, actionHandler }) => (
    visible ? (
        <div data-testid="snackbar">
            <span>{textMessage}</span>
            <button onClick={actionHandler}>OK</button>
        </div>
    ) : null
));

jest.mock('../residential/rent/ResidentialRentCard', () => ({ item, deleteMe, closeMe }) => (
    <div data-testid="rent-card">
        <span>{item.property_address.building_name}</span>
        <button onClick={() => deleteMe(item)}>Delete</button>
        <button onClick={() => closeMe(item)}>Close</button>
    </div>
));

jest.mock('../residential/sell/ResidentialSellCard', () => ({ item, deleteMe, closeMe }) => (
    <div data-testid="sell-card">
        <span>{item.property_address.building_name}</span>
        <button onClick={() => deleteMe(item)}>Delete</button>
        <button onClick={() => closeMe(item)}>Close</button>
    </div>
));

const initialState = {
    AppReducer: {
        userDetails: mockUserDetails,
        residentialPropertyList: [mockResidentialProperty],
    },
    dataRefresh: {
        shouldRefresh: false
    }
};

const mockReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_RESIDENTIAL_PROPERTY_LIST':
            return { ...state, AppReducer: { ...state.AppReducer, residentialPropertyList: action.payload } };
        default:
            return state;
    }
};

const store = createStore(mockReducer);

describe('ListingResidential Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        axios.mockResolvedValue({ data: [mockResidentialProperty] });
    });

    test('renders correctly with data', () => {
        render(
            <Provider store={store}>
                <ListingResidential />
            </Provider>
        );

        expect(screen.getByPlaceholderText('Search By Name, Address, Id, Mobile')).toBeInTheDocument();
        expect(screen.getByText(mockResidentialProperty.property_address.building_name)).toBeInTheDocument();
    });

    test('filters list by search text', () => {
        render(
            <Provider store={store}>
                <ListingResidential />
            </Provider>
        );

        const searchInput = screen.getByPlaceholderText('Search By Name, Address, Id, Mobile');
        fireEvent.change(searchInput, { target: { value: 'NonExistent' } });

        expect(screen.queryByText(mockResidentialProperty.property_address.building_name)).not.toBeInTheDocument();

        fireEvent.change(searchInput, { target: { value: 'Green' } });
        expect(screen.getByText(mockResidentialProperty.property_address.building_name)).toBeInTheDocument();
    });

    test('opens filter modal and applies filter', () => {
        render(
            <Provider store={store}>
                <ListingResidential />
            </Provider>
        );

        // Filter button is the 2nd one in the list of buttons in the header
        // The buttons are: Sort, Filter, Reset, Add
        // We can find by icon or just assume order.
        // Let's use the fact that it calls toggleBottomNavigationView

        // Let's try to find the button by icon if possible, but icons are rendered as SVGs.
        // Let's assume the buttons are in a specific div.

        // Or we can just click all buttons until we see "Filter" text.
        const buttons = screen.getAllByRole('button');
        // Filter is likely the 2nd button in the header group.
        // But there are buttons in the card too (Delete, Close).
        // The header buttons are at the top.

        // Let's look for the filter button specifically.
        // It has no text, just an icon.
        // Let's try to find the button that opens the modal.

        // We can use `container.querySelectorAll` to find buttons in the header.
        const { container } = render(
            <Provider store={store}>
                <ListingResidential />
            </Provider>
        );

        // The header buttons are in a div with `ml-2 flex flex-row`.
        // Let's try to click the 2nd button in that group.
        // Or just click the button that has the filter icon.

        // Let's just try to find the modal text "Filter" after clicking buttons.
        // Since we mocked CustomButtonGroup, we can see buttons there too.

        // Let's try to find the button by index.
        // 0: Sort, 1: Filter, 2: Reset, 3: Add
        const headerButtons = container.querySelectorAll('.ml-2.flex.flex-row button');
        if (headerButtons.length > 1) {
            fireEvent.click(headerButtons[1]); // Filter button
        }

        expect(screen.getByText('Filter')).toBeInTheDocument();

        // Select "Rent"
        fireEvent.click(screen.getByText('Rent'));

        // Select "3BHK" (mock data is 3BHK)
        fireEvent.click(screen.getByText('3BHK'));

        // Apply
        fireEvent.click(screen.getByText('Apply Filter'));

        const elements = screen.getAllByText(mockResidentialProperty.property_address.building_name);
        expect(elements.length).toBeGreaterThan(0);
    });

    test('handles delete action', async () => {
        axios.mockImplementation((url) => {
            if (url.includes('delete')) {
                return Promise.resolve({ data: 'success' });
            }
            return Promise.resolve({ data: [mockResidentialProperty] });
        });

        render(
            <Provider store={store}>
                <ListingResidential />
            </Provider>
        );

        const deleteBtn = screen.getByText('Delete');
        fireEvent.click(deleteBtn);

        await waitFor(() => {
            expect(axios).toHaveBeenCalledWith(expect.stringContaining('/deleteResidentialProperty'), expect.any(Object));
        });
    });
});
