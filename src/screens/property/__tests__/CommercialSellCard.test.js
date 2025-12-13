import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import CommercialSellCard from '../commercial/sell/CommercialSellCard';
import { mockUserDetails, mockCommercialProperty } from './mockData';

// Mock dependencies
jest.mock('axios');
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    useNavigate: () => mockNavigate,
}));

// Mock child components
jest.mock('../../../components/DoughnutChart', () => () => <div data-testid="doughnut-chart" />);
jest.mock('../../../components/Slideshow', () => () => <div data-testid="slideshow" />);

const initialState = {
    AppReducer: {
        userDetails: mockUserDetails,
        propListForMeeting: [],
    },
};

const mockReducer = (state = initialState, action) => {
    return state;
};

const store = createStore(mockReducer);

describe('CommercialSellCard Component', () => {
    const mockProps = {
        navigation: { navigate: mockNavigate },
        item: { ...mockCommercialProperty, property_for: 'Sell' },
        deleteMe: jest.fn(),
        closeMe: jest.fn(),
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders correctly with property details', () => {
        render(
            <Provider store={store}>
                <CommercialSellCard {...mockProps} />
            </Provider>
        );

        expect(screen.getByText(/Sell Off In City Mall/i)).toBeInTheDocument();
        expect(screen.getByText('500')).toBeInTheDocument(); // Size
        expect(screen.getByText('Mall')).toBeInTheDocument(); // Building Type
    });

    test('navigates to matched customers on match badge click', () => {
        render(
            <Provider store={store}>
                <CommercialSellCard {...mockProps} />
            </Provider>
        );

        const matchBadge = screen.getByText(mockCommercialProperty.match_count.toString());
        fireEvent.click(matchBadge);
        expect(mockNavigate).toHaveBeenCalledWith('MatchedCustomers', expect.any(Object));
    });
});
