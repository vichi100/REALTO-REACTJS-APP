import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import LocalityDetailsForm from '../LocalityDetailsForm';
import { mockUserDetails, mockPropertyDetails } from './mockData';

// Mock dependencies
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    useNavigate: () => mockNavigate,
}));

jest.mock('react-google-places-autocomplete', () => ({
    __esModule: true,
    default: (props) => {
        const { selectProps, placeholder } = props;
        const onChange = selectProps && selectProps.onChange;
        return (
            <input
                data-testid="google-places-input"
                placeholder={placeholder}
                onChange={(e) => onChange && onChange({ label: e.target.value, value: { place_id: '123', structured_formatting: { main_text: e.target.value } } })}
            />
        )
    },
}), { virtual: true });

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
        propertyDetails: mockPropertyDetails,
    },
};

const mockReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_PROPERTY_DETAILS':
            return { ...state, AppReducer: { ...state.AppReducer, propertyDetails: action.payload } };
        default:
            return state;
    }
};

const store = createStore(mockReducer);

describe('LocalityDetailsForm Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders correctly', () => {
        render(
            <Provider store={store}>
                <LocalityDetailsForm />
            </Provider>
        );

        expect(screen.getByText('Enter property address details')).toBeInTheDocument();
    });

    test('updates city input', () => {
        render(
            <Provider store={store}>
                <LocalityDetailsForm />
            </Provider>
        );

        const inputs = screen.getAllByRole('textbox');
        const cityInput = inputs[0]; // First input is City

        fireEvent.change(cityInput, { target: { value: 'Mumbai' } });
        expect(cityInput.value).toBe('Mumbai');
    });

    test('selects location', () => {
        render(
            <Provider store={store}>
                <LocalityDetailsForm />
            </Provider>
        );

        const placesInput = screen.getByTestId('google-places-input');
        fireEvent.change(placesInput, { target: { value: 'Andheri' } });

        // No direct assertion on state, but we can check if error doesn't appear for missing area
    });

    test('shows error if city is missing', () => {
        render(
            <Provider store={store}>
                <LocalityDetailsForm />
            </Provider>
        );

        const nextBtn = screen.getByText('NEXT');
        fireEvent.click(nextBtn);

        expect(screen.getByText('City is missing')).toBeInTheDocument();
    });

    test('submits form successfully', () => {


        const { container } = render(
            <Provider store={store}>
                <LocalityDetailsForm />
            </Provider>
        );

        // Fill form
        const inputs = screen.getAllByRole('textbox');
        const cityInput = inputs[0];
        const placesInput = screen.getByTestId('google-places-input');
        // inputs[0] is City
        // inputs[1] is GooglePlaces (since it renders an input)
        // inputs[2] is Flat No (if residential)
        // inputs[3] is Building Name
        // inputs[4] is Landmark

        const flatInput = inputs[2];
        const buildingInput = inputs[3];
        const landmarkInput = inputs[4];

        fireEvent.change(cityInput, { target: { value: 'Mumbai' } });
        fireEvent.change(placesInput, { target: { value: 'Andheri' } });
        fireEvent.change(flatInput, { target: { value: '101' } });
        fireEvent.change(buildingInput, { target: { value: 'My Building' } });
        fireEvent.change(landmarkInput, { target: { value: 'Near Park' } });

        const nextBtn = screen.getByText('NEXT');
        fireEvent.click(nextBtn);

        expect(mockNavigate).toHaveBeenCalledWith('/listing/Add/ResidentialPropertyDetailsForm');
    });
});
