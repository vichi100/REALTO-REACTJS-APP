import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import PropDetailsFromListingForSell from '../residential/sell/PropDetailsFromListingForSell';
import { mockUserDetails, mockResidentialProperty } from './mockData';
import axios from 'axios';

// Mock dependencies
jest.mock('axios');
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    useNavigate: () => mockNavigate,
}));

// Mock child components
jest.mock('../../../components/Slideshow', () => () => <div data-testid="slideshow" />);
jest.mock('../../../components/AccordionListItem', () => ({ title, children }) => (
    <div data-testid="accordion">
        <span>{title}</span>
        {children}
    </div>
));
jest.mock('../PropertyReminder', () => () => <div data-testid="property-reminder" />);

const mockProperty = {
    ...mockResidentialProperty,
    property_for: 'Sell',
    sell_details: {
        ...mockResidentialProperty.sell_details,
        maintenance_charge: 5000,
        available_from: '2023-12-25'
    }
};

const initialState = {
    AppReducer: {
        userDetails: mockUserDetails,
        propertyDetails: mockProperty,
        anyItemDetails: null,
    },
};

const mockReducer = (state = initialState, action) => {
    return state;
};

const store = createStore(mockReducer);

describe('PropDetailsFromListingForSell Component', () => {
    const mockProps = {
        navigation: { navigate: mockNavigate },
        route: { params: { item: mockProperty } },
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders correctly with property details', async () => {
        axios.post.mockResolvedValue({ data: [] });

        render(
            <Provider store={store}>
                <PropDetailsFromListingForSell {...mockProps} />
            </Provider>
        );

        expect(screen.getByText(/Sell Off In 101, Green Valley/i)).toBeInTheDocument();
        expect(screen.getByText('3BHK')).toBeInTheDocument();
        expect(screen.getByText(/80 L/)).toBeInTheDocument(); // Sell Price

        await waitFor(() => {
            expect(axios.post).toHaveBeenCalledWith(expect.stringContaining('/getPropReminderList'), expect.any(Object));
        });
    });

    test('navigates to matched customers on match badge click', async () => {
        axios.post.mockResolvedValue({ data: [] });

        render(
            <Provider store={store}>
                <PropDetailsFromListingForSell {...mockProps} />
            </Provider>
        );

        const matchBadge = screen.getByText(mockProperty.match_count.toString());
        fireEvent.click(matchBadge);
        expect(mockNavigate).toHaveBeenCalledWith('MatchedCustomers', expect.any(Object));
    });
});
