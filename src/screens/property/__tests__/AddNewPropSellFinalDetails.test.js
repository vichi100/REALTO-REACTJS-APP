import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import AddNewPropSellFinalDetails from '../residential/sell/AddNewPropSellFinalDetails';
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
jest.mock('../../../components/Button', () => ({ title, onPress }) => (
    <button onClick={onPress}>{title}</button>
));

const initialState = {
    AppReducer: {
        userDetails: mockUserDetails,
        propertyDetails: { ...mockResidentialProperty, property_for: 'Sell' },
        residentialPropertyList: [],
        startNavigationPoint: null,
    },
};

const mockReducer = (state = initialState, action) => {
    return state;
};

const store = createStore(mockReducer);

describe('AddNewPropSellFinalDetails Component', () => {
    const mockProps = {
        navigation: { navigate: mockNavigate },
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders correctly with property details', () => {
        render(
            <Provider store={store}>
                <AddNewPropSellFinalDetails {...mockProps} />
            </Provider>
        );

        expect(screen.getByText(/Sell Off 101,.*Green Valley/i)).toBeInTheDocument();
        expect(screen.getByText('3BHK')).toBeInTheDocument();
        expect(screen.getByText('80 Lac')).toBeInTheDocument(); // Sell Price
    });

    test('handles add property submission', async () => {
        axios.mockResolvedValue({ data: { ...mockResidentialProperty, property_id: 'new_id' } });

        render(
            <Provider store={store}>
                <AddNewPropSellFinalDetails {...mockProps} />
            </Provider>
        );

        const addBtn = screen.getByText('ADD');
        fireEvent.click(addBtn);

        await waitFor(() => {
            expect(axios).toHaveBeenCalledWith(expect.stringContaining('/addNewResidentialRentProperty'), expect.any(Object));
        });
    });
});
