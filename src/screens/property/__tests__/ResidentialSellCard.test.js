import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import ResidentialSellCard from '../residential/sell/ResidentialSellCard';
import { mockUserDetails, mockResidentialProperty } from './mockData';

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

describe('ResidentialSellCard Component', () => {
    const mockProps = {
        navigation: { navigate: mockNavigate },
        item: { ...mockResidentialProperty, property_for: 'Sell' },
        deleteMe: jest.fn(),
        closeMe: jest.fn(),
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders correctly with property details', () => {
        render(
            <Provider store={store}>
                <ResidentialSellCard {...mockProps} />
            </Provider>
        );

        expect(screen.getByText(/Sell Off In.*Green Valley/i)).toBeInTheDocument();
        expect(screen.getByText('3BHK')).toBeInTheDocument();
        expect(screen.getByText('Full')).toBeInTheDocument();
    });

    test('navigates to matched customers on match badge click', () => {
        render(
            <Provider store={store}>
                <ResidentialSellCard {...mockProps} />
            </Provider>
        );

        const matchBadge = screen.getByText(mockResidentialProperty.match_count.toString());
        fireEvent.click(matchBadge);
        expect(mockNavigate).toHaveBeenCalledWith('MatchedCustomers', expect.any(Object));
    });
});
