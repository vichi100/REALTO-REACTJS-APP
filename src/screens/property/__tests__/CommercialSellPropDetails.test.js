import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import CommercialSellPropDetails from '../commercial/sell/CommercialSellPropDetails';
import { mockUserDetails, mockCommercialProperty } from './mockData';
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
    ...mockCommercialProperty,
    property_for: 'Sell',
    sell_details: {
        ...mockCommercialProperty.sell_details,
        negotiable: 'Yes',
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

describe('CommercialSellPropDetails Component', () => {
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
                <CommercialSellPropDetails {...mockProps} />
            </Provider>
        );

        expect(screen.getByText(/Sell Off In City Mall/i)).toBeInTheDocument();
        expect(screen.getByText('500sqft')).toBeInTheDocument();
        expect(screen.getByText('1 Cr')).toBeInTheDocument(); // Sell Price

        await waitFor(() => {
            expect(axios.post).toHaveBeenCalledWith(expect.stringContaining('/getPropReminderList'), expect.any(Object));
        });
    });

    test('navigates to matched customers on match badge click', async () => {
        axios.post.mockResolvedValue({ data: [] });

        render(
            <Provider store={store}>
                <CommercialSellPropDetails {...mockProps} />
            </Provider>
        );

        const matchBadge = screen.getByText(mockProperty.match_count.toString());
        fireEvent.click(matchBadge);
        expect(mockNavigate).toHaveBeenCalledWith('MatchedCustomers', expect.any(Object));
    });
});
