import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import GlobalResidentialPropertySearchResult from '../GlobalResidentialPropertySearchResult';
import { mockUserDetails, mockResidentialProperty } from './mockData';
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

jest.mock('./../../../components/SliderX', () => ({ onSlide }) => (
    <div data-testid="slider-x">
        <button onClick={() => onSlide([10000, 50000])}>Change Price</button>
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

jest.mock('../../property/residential/rent/ResidentialRentCard', () => ({ item, deleteMe, closeMe }) => (
    <div data-testid="rent-card">
        <span>{item.property_address.building_name}</span>
        <button onClick={() => deleteMe(item)}>Delete</button>
        <button onClick={() => closeMe(item)}>Close</button>
    </div>
));

jest.mock('../../property/residential/sell/ResidentialSellCard', () => ({ item, deleteMe, closeMe }) => (
    <div data-testid="sell-card">
        <span>{item.property_address.building_name}</span>
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
            residentialPropertyList: [JSON.parse(JSON.stringify(mockResidentialProperty))],
            globalSearchResult: [JSON.parse(JSON.stringify(mockResidentialProperty))],
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

describe('GlobalResidentialPropertySearchResult Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders correctly with data', () => {
        renderWithRedux(
            <GlobalResidentialPropertySearchResult navigation={mockNavigation} route={mockRoute} />
        );

        expect(screen.getByPlaceholderText('GLocal Search...')).toBeInTheDocument();
        expect(screen.getByText(mockResidentialProperty.property_address.building_name)).toBeInTheDocument();
    });

    test('filters list by search text', () => {
        renderWithRedux(
            <GlobalResidentialPropertySearchResult navigation={mockNavigation} route={mockRoute} />
        );

        const searchInput = screen.getByPlaceholderText('GLocal Search...');
        fireEvent.change(searchInput, { target: { value: 'NonExistent' } });

        expect(screen.queryByText(mockResidentialProperty.property_address.building_name)).not.toBeInTheDocument();

        fireEvent.change(searchInput, { target: { value: 'Green' } });
        expect(screen.getByText(mockResidentialProperty.property_address.building_name)).toBeInTheDocument();
    });

    test('opens filter modal and applies filter', () => {
        renderWithRedux(
            <GlobalResidentialPropertySearchResult navigation={mockNavigation} route={mockRoute} />
        );

        const filterButton = screen.getByTestId('filter-button');
        fireEvent.click(filterButton);

        expect(screen.getByText('Filter')).toBeInTheDocument();

        // Select "Rent"
        fireEvent.click(screen.getByText('Rent'));

        // Select "Apartment"
        fireEvent.click(screen.getByText('Apartment'));

        // Apply
        fireEvent.click(screen.getByTestId('apply-filter-button'));

        expect(screen.getByText(mockResidentialProperty.property_address.building_name)).toBeInTheDocument();
    });

    test('opens sort modal and applies sort', () => {
        renderWithRedux(
            <GlobalResidentialPropertySearchResult navigation={mockNavigation} route={mockRoute} />
        );

        const sortButton = screen.getByTestId('sort-button');
        fireEvent.click(sortButton);

        expect(screen.getByText('Sort By')).toBeInTheDocument();

        // Select "Rent"
        const rentBtns = screen.getAllByText('Rent');
        fireEvent.click(rentBtns[rentBtns.length - 1]);

        // Select "Lowest First"
        fireEvent.click(screen.getByText('Lowest First'));

        expect(screen.getByText(mockResidentialProperty.property_address.building_name)).toBeInTheDocument();
    });

    test('handles delete action', async () => {
        axios.mockResolvedValue({ data: 'success' });

        renderWithRedux(
            <GlobalResidentialPropertySearchResult navigation={mockNavigation} route={mockRoute} />
        );

        const deleteBtn = screen.getByText('Delete');
        fireEvent.click(deleteBtn);

        await waitFor(() => {
            expect(axios).toHaveBeenCalledWith(expect.stringContaining('/deleteResidentialProperty'), expect.any(Object));
        });
    });

    test('handles close action', async () => {
        axios.mockResolvedValue({ data: 'success' });

        renderWithRedux(
            <GlobalResidentialPropertySearchResult navigation={mockNavigation} route={mockRoute} />
        );

        const closeBtn = screen.getByText('Close');
        fireEvent.click(closeBtn);

        await waitFor(() => {
            expect(axios).toHaveBeenCalledWith(expect.stringContaining('/closeResidentialProperty'), expect.any(Object));
        });
    });
});
