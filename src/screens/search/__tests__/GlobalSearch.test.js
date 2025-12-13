import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import GlobalSearch from '../GlobalSearch';
import { mockUserDetails } from './mockData';
import axios from 'axios';
import { geocodeByAddress, getLatLng } from 'react-google-places-autocomplete';

// Mock dependencies
jest.mock('axios');
jest.mock('react-google-places-autocomplete', () => ({
    __esModule: true,
    default: ({ selectProps }) => (
        <input
            data-testid="google-places-input"
            placeholder={selectProps.placeholder}
            onChange={(e) => selectProps.onChange({ label: e.target.value })}
        />
    ),
    geocodeByAddress: jest.fn(),
    getLatLng: jest.fn(),
}));

// Mock child components to simplify testing
jest.mock('../../../components/CustomButtonGroup', () => ({ buttons, onButtonPress, selectedIndices }) => (
    <div data-testid="custom-button-group">
        {buttons.map((btn, idx) => (
            <button
                key={idx}
                onClick={() => onButtonPress(idx, btn)}
                data-selected={selectedIndices.includes(idx)}
            >
                {btn.text}
            </button>
        ))}
    </div>
));

jest.mock('../../../components/Slider', () => ({ onSlide }) => (
    <div data-testid="slider">
        <button onClick={() => onSlide([20000, 50000])}>Change Price</button>
    </div>
));

jest.mock('../../../components/SliderCr', () => ({ onSlide }) => (
    <div data-testid="slider-cr">
        <button onClick={() => onSlide([2000000, 5000000])}>Change Price Cr</button>
    </div>
));

const mockNavigation = {
    navigate: jest.fn(),
};

const initialState = {
    AppReducer: {
        userDetails: mockUserDetails,
        globalSearchResult: [],
    },
};

const mockReducer = (state = initialState, action) => state;
const store = createStore(mockReducer);

describe('GlobalSearch Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        geocodeByAddress.mockResolvedValue([{ geometry: { location: { lat: 10, lng: 20 } } }]);
        getLatLng.mockResolvedValue({ lat: 10, lng: 20 });
    });

    test('renders correctly', () => {
        render(
            <Provider store={store}>
                <GlobalSearch navigation={mockNavigation} />
            </Provider>
        );

        expect(screen.getByText('GLocal Search')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Enter city where customer wants property')).toBeInTheDocument();
    });

    test('updates city input', () => {
        render(
            <Provider store={store}>
                <GlobalSearch navigation={mockNavigation} />
            </Provider>
        );

        const cityInput = screen.getByPlaceholderText('Enter city where customer wants property');
        fireEvent.change(cityInput, { target: { value: 'Mumbai' } });
        expect(cityInput.value).toBe('Mumbai');
    });

    test('adds a location via Google Places', async () => {
        render(
            <Provider store={store}>
                <GlobalSearch navigation={mockNavigation} />
            </Provider>
        );

        const placesInput = screen.getByTestId('google-places-input');
        fireEvent.change(placesInput, { target: { value: 'Andheri' } });

        await waitFor(() => {
            expect(geocodeByAddress).toHaveBeenCalledWith('Andheri');
            expect(getLatLng).toHaveBeenCalled();
        });

        // Check if location tag is added
        expect(screen.getByText('Andheri')).toBeInTheDocument();
    });

    test('removes a location', async () => {
        render(
            <Provider store={store}>
                <GlobalSearch navigation={mockNavigation} />
            </Provider>
        );

        // Add location first
        const placesInput = screen.getByTestId('google-places-input');
        fireEvent.change(placesInput, { target: { value: 'Andheri' } });
        await waitFor(() => expect(screen.getByText('Andheri')).toBeInTheDocument());

        // Remove it
        const removeBtn = screen.getByText('x');
        fireEvent.click(removeBtn);

        expect(screen.queryByText('Andheri')).not.toBeInTheDocument();
    });

    test('selects "Looking For" option', () => {
        render(
            <Provider store={store}>
                <GlobalSearch navigation={mockNavigation} />
            </Provider>
        );

        const customerBtn = screen.getByText('Customer');
        fireEvent.click(customerBtn);
    });

    test('shows error if city is missing on submit', () => {
        render(
            <Provider store={store}>
                <GlobalSearch navigation={mockNavigation} />
            </Provider>
        );

        const searchBtn = screen.getByText('Search');
        fireEvent.click(searchBtn);

        expect(screen.getByText('City is missing')).toBeInTheDocument();
    });

    test('shows error if location is missing on submit', () => {
        render(
            <Provider store={store}>
                <GlobalSearch navigation={mockNavigation} />
            </Provider>
        );

        const cityInput = screen.getByPlaceholderText('Enter city where customer wants property');
        fireEvent.change(cityInput, { target: { value: 'Mumbai' } });

        const searchBtn = screen.getByText('Search');
        fireEvent.click(searchBtn);

        expect(screen.getByText('Please add a location of your city')).toBeInTheDocument();
    });

    test('submits form successfully and navigates', async () => {
        axios.mockResolvedValue({ data: [] });

        render(
            <Provider store={store}>
                <GlobalSearch navigation={mockNavigation} />
            </Provider>
        );

        // Fill form
        const cityInput = screen.getByPlaceholderText('Enter city where customer wants property');
        fireEvent.change(cityInput, { target: { value: 'Mumbai' } });

        const placesInput = screen.getByTestId('google-places-input');
        fireEvent.change(placesInput, { target: { value: 'Andheri' } });
        await waitFor(() => expect(screen.getByText('Andheri')).toBeInTheDocument());

        const searchBtn = screen.getByText('Search');
        fireEvent.click(searchBtn);

        await waitFor(() => {
            expect(axios).toHaveBeenCalled();
            expect(mockNavigation.navigate).toHaveBeenCalledWith('GlobalResidentialPropertySearchResult', {});
        });
    });

    test('navigates to Commercial Property Search', async () => {
        axios.mockResolvedValue({ data: [] });

        render(
            <Provider store={store}>
                <GlobalSearch navigation={mockNavigation} />
            </Provider>
        );

        // Fill form
        fireEvent.change(screen.getByPlaceholderText('Enter city where customer wants property'), { target: { value: 'Mumbai' } });
        fireEvent.change(screen.getByTestId('google-places-input'), { target: { value: 'Andheri' } });
        await waitFor(() => expect(screen.getByText('Andheri')).toBeInTheDocument());

        // Select Commercial
        fireEvent.click(screen.getByText('Commercial'));

        const searchBtn = screen.getByText('Search');
        fireEvent.click(searchBtn);

        await waitFor(() => {
            expect(mockNavigation.navigate).toHaveBeenCalledWith('GlobalCommercialPropertySearchResult', {});
        });
    });
});
