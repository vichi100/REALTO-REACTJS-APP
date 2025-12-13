import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import CommercialRentPropDetails from '../commercial/rent/CommercialRentPropDetails';
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

const initialState = {
    AppReducer: {
        userDetails: mockUserDetails,
        propertyDetails: mockCommercialProperty,
        anyItemDetails: null,
    },
};

const mockReducer = (state = initialState, action) => {
    return state;
};

const store = createStore(mockReducer);

describe('CommercialRentPropDetails Component', () => {
    const mockProps = {
        navigation: { navigate: mockNavigate },
        route: { params: { item: mockCommercialProperty } },
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders correctly with property details', async () => {
        axios.post.mockResolvedValue({ data: [] });

        render(
            <Provider store={store}>
                <CommercialRentPropDetails {...mockProps} />
            </Provider>
        );

        expect(screen.getByText(/Rent in City Mall/i)).toBeInTheDocument();
        expect(screen.getByText('500sqft')).toBeInTheDocument();
        expect(screen.getByText('50 K')).toBeInTheDocument(); // Rent

        await waitFor(() => {
            expect(axios.post).toHaveBeenCalledWith(expect.stringContaining('/getPropReminderList'), expect.any(Object));
        });
    });

    test('navigates to matched customers on match badge click', async () => {
        axios.post.mockResolvedValue({ data: [] });

        render(
            <Provider store={store}>
                <CommercialRentPropDetails {...mockProps} />
            </Provider>
        );

        const matchBadge = screen.getByText(mockCommercialProperty.match_count.toString());
        fireEvent.click(matchBadge);
        expect(mockNavigate).toHaveBeenCalledWith('MatchedCustomers', expect.any(Object));
    });
});
