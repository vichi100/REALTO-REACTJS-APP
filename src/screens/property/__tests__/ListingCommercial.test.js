import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import ListingCommercial from '../commercial/ListingCommercial';
import { mockUserDetails, mockCommercialProperty } from './mockData';
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

jest.mock('../commercial/rent/CommercialRentCard', () => ({ item, deleteMe, closeMe }) => (
    <div data-testid="rent-card">
        <span>{item.property_address.building_name}</span>
        <button onClick={() => deleteMe(item)}>Delete</button>
        <button onClick={() => closeMe(item)}>Close</button>
    </div>
));

jest.mock('../commercial/sell/CommercialSellCard', () => ({ item, deleteMe, closeMe }) => (
    <div data-testid="sell-card">
        <span>{item.property_address.building_name}</span>
        <button onClick={() => deleteMe(item)}>Delete</button>
        <button onClick={() => closeMe(item)}>Close</button>
    </div>
));

const initialState = {
    AppReducer: {
        userDetails: mockUserDetails,
        commercialPropertyList: [mockCommercialProperty],
    },
    dataRefresh: {
        shouldRefresh: false
    }
};

const mockReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_COMMERCIAL_PROPERTY_LIST':
            return { ...state, AppReducer: { ...state.AppReducer, commercialPropertyList: action.payload } };
        default:
            return state;
    }
};

const store = createStore(mockReducer);

describe('ListingCommercial Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        axios.mockResolvedValue({ data: [mockCommercialProperty] });
    });

    test('renders correctly with data', async () => {
        render(
            <Provider store={store}>
                <ListingCommercial />
            </Provider>
        );

        expect(screen.getByPlaceholderText('Search By Name, Address, Id, Mobile')).toBeInTheDocument();
        expect(await screen.findByText(/City Mall/i)).toBeInTheDocument();
    });

    test('filters list by search text', async () => {
        render(
            <Provider store={store}>
                <ListingCommercial />
            </Provider>
        );

        const searchInput = screen.getByPlaceholderText('Search By Name, Address, Id, Mobile');
        fireEvent.change(searchInput, { target: { value: 'NonExistent' } });

        expect(screen.queryByText(mockCommercialProperty.property_address.building_name)).not.toBeInTheDocument();

        fireEvent.change(searchInput, { target: { value: 'City' } });
        screen.debug();
        await waitFor(() => {
            expect(screen.getByText('City Mall')).toBeInTheDocument();
        });
    });

    test('handles delete action', async () => {
        axios.mockImplementation((url) => {
            if (url.includes('delete')) {
                return Promise.resolve({ data: 'success' });
            }
            return Promise.resolve({ data: [mockCommercialProperty] });
        });

        render(
            <Provider store={store}>
                <ListingCommercial />
            </Provider>
        );

        const deleteBtn = await screen.findByText('Delete');
        fireEvent.click(deleteBtn);

        await waitFor(() => {
            expect(axios).toHaveBeenCalledWith(expect.stringContaining('/deleteCommercialProperty'), expect.any(Object));
        });
    });
});
