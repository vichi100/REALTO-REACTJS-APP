import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import AddNewPropFinalDetails from '../residential/rent/AddNewPropFinalDetails';
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
jest.mock('../../../components/SnackbarComponent', () => ({ visible, textMessage, actionHandler }) => (
    visible ? (
        <div data-testid="snackbar">
            <span>{textMessage}</span>
            <button onClick={actionHandler}>OK</button>
        </div>
    ) : null
));

const initialState = {
    AppReducer: {
        userDetails: mockUserDetails,
        propertyDetails: mockResidentialProperty,
        residentialPropertyList: [],
        startNavigationPoint: null,
    },
};

const mockReducer = (state = initialState, action) => {
    return state;
};

const store = createStore(mockReducer);

describe('AddNewPropFinalDetails Component', () => {
    const mockProps = {
        navigation: { navigate: mockNavigate },
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders correctly with data', async () => {
        render(
            <Provider store={store}>
                <AddNewPropFinalDetails {...mockProps} />
            </Provider>
        );


        expect(screen.getByText(/Rent In 101,.*Green Valley/i)).toBeInTheDocument();
        expect(screen.getByText('3')).toBeInTheDocument();
        expect(screen.getByText('BHK')).toBeInTheDocument();
        expect(screen.getByText('25 K')).toBeInTheDocument(); // Rent
    });

    test('handles add property submission', async () => {
        axios.mockResolvedValue({ data: { ...mockResidentialProperty, property_id: 'new_id' } });

        render(
            <Provider store={store}>
                <AddNewPropFinalDetails {...mockProps} />
            </Provider>
        );

        const addBtn = screen.getByText('ADD');
        fireEvent.click(addBtn);

        await waitFor(() => {
            expect(axios).toHaveBeenCalledWith(expect.stringContaining('/addNewResidentialRentProperty'), expect.any(Object));
        });
    });

    test('shows error if not logged in', () => {
        const loggedOutStore = createStore(() => ({
            AppReducer: {
                userDetails: null,
                propertyDetails: mockResidentialProperty,
            }
        }));

        render(
            <Provider store={loggedOutStore}>
                <AddNewPropFinalDetails {...mockProps} />
            </Provider>
        );

        const addBtn = screen.getByText('ADD');
        fireEvent.click(addBtn);

        expect(screen.getByText('You are not logged in, please login.')).toBeInTheDocument();
    });
});
