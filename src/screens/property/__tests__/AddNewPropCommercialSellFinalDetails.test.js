import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import AddNewPropCommercialSellFinalDetails from '../commercial/sell/AddNewPropCommercialSellFinalDetails';
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
jest.mock('../../../components/Button', () => ({ title, onPress }) => (
    <button onClick={onPress}>{title}</button>
));
jest.mock('../../../components/SnackbarComponent', () => ({ visible, textMessage, actionHandler }) => (
    visible ? (
        <div data-testid="snackbar">
            <span>{textMessage}</span>
            <button onClick={actionHandler}>OK</button>
        </div>
    ) : null
));

const mockProperty = {
    ...mockCommercialProperty,
    property_for: 'Sell',
    sell_details: {
        ...mockCommercialProperty.sell_details,
        maintenance_charge: 2000
    }
};

const initialState = {
    AppReducer: {
        userDetails: mockUserDetails,
        propertyDetails: mockProperty,
        commercialPropertyList: [],
        startNavigationPoint: null,
    },
};

const mockReducer = (state = initialState, action) => {
    return state;
};

const store = createStore(mockReducer);

describe('AddNewPropCommercialSellFinalDetails Component', () => {
    const mockProps = {
        navigation: { navigate: mockNavigate },
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders correctly with property details', () => {
        render(
            <Provider store={store}>
                <AddNewPropCommercialSellFinalDetails {...mockProps} />
            </Provider>
        );

        expect(screen.getByText(/Shop For Sell In City Mall/i)).toBeInTheDocument();
        expect(screen.getByText('500sqft')).toBeInTheDocument();
        expect(screen.getByText('1 Cr')).toBeInTheDocument(); // Sell Price
    });

    test('handles add property submission', async () => {
        axios.mockResolvedValue({ data: { ...mockProperty, property_id: 'new_id' } });

        render(
            <Provider store={store}>
                <AddNewPropCommercialSellFinalDetails {...mockProps} />
            </Provider>
        );

        const addBtn = screen.getByText('ADD');
        fireEvent.click(addBtn);

        await waitFor(() => {
            expect(axios).toHaveBeenCalledWith(expect.stringContaining('/addNewCommercialProperty'), expect.any(Object));
        });
    });
});
