import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import PropDetailsFromListing from '../residential/rent/PropDetailsFromListing';
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

const initialState = {
    AppReducer: {
        userDetails: mockUserDetails,
        propertyDetails: mockResidentialProperty,
        anyItemDetails: null,
    },
};

const mockReducer = (state = initialState, action) => {
    return state;
};

const store = createStore(mockReducer);

describe('PropDetailsFromListing Component', () => {
    const mockProps = {
        navigation: { navigate: mockNavigate },
        route: { params: { item: mockResidentialProperty } },
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders correctly with property details', async () => {
        axios.post.mockResolvedValue({ data: [] });

        render(
            <Provider store={store}>
                <PropDetailsFromListing {...mockProps} />
            </Provider>
        );

        expect(screen.getByText(/Rent In Green Valley/i)).toBeInTheDocument();
        expect(screen.getByText('3BHK')).toBeInTheDocument();
        expect(screen.getByText('25 K')).toBeInTheDocument(); // Rent

        await waitFor(() => {
            expect(axios.post).toHaveBeenCalledWith(expect.stringContaining('/getPropReminderList'), expect.any(Object));
        });
    });

    test('navigates to matched customers on match badge click', async () => {
        axios.post.mockResolvedValue({ data: [] });

        render(
            <Provider store={store}>
                <PropDetailsFromListing {...mockProps} />
            </Provider>
        );

        const matchBadge = screen.getByText(mockResidentialProperty.match_count.toString());
        fireEvent.click(matchBadge);
        expect(mockNavigate).toHaveBeenCalledWith('MatchedCustomers', expect.any(Object));
    });
});
