import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import ResidentialPropertyDetailsForm from '../residential/ResidentialPropertyDetailsForm';
import { mockUserDetails, mockPropertyDetails } from './mockData';

// Mock dependencies
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    useNavigate: () => mockNavigate,
}));

jest.mock('../../../components/Button', () => ({ title, onPress }) => (
    <button onClick={onPress}>{title}</button>
));

jest.mock('../../../components/CustomButtonGroup', () => ({ buttons, onButtonPress, selectedIndices }) => (
    <div data-testid="custom-button-group">
        {buttons.map((btn, idx) => (
            <button
                key={idx}
                onClick={() => onButtonPress(idx, btn)}
                data-selected={selectedIndices && selectedIndices.includes(idx)}
            >
                {btn.text}
            </button>
        ))}
    </div>
));

jest.mock('../../../components/SnackbarComponent', () => ({ visible, textMessage, actionHandler }) => (
    visible ? (
        <div data-testid="snackbar">
            <span>{textMessage}</span>
            <button onClick={actionHandler}>OK</button>
        </div>
    ) : null
));

// Mock AppConstant
jest.mock('../../../utils/AppConstant', () => ({
    HOUSE_TYPE_OPTION: [{ text: 'Apartment' }, { text: 'Villa' }],
    BHK_OPTION: [{ text: '1BHK' }, { text: '2BHK' }],
    FURNISHING_STATUS_OPTION: [{ text: 'Full' }, { text: 'Semi' }],
    PARKING_OPTION: [{ text: 'Car' }, { text: 'Bike' }],
    LIFT_AVAILBLE_OPTION: [{ text: 'Yes' }, { text: 'No' }],
}));

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

describe('ResidentialPropertyDetailsForm Component', () => {
    test('renders correctly', () => {
        render(
            <Provider store={store}>
                <ResidentialPropertyDetailsForm />
            </Provider>
        );

        expect(screen.getByText('House Type*')).toBeInTheDocument();
        expect(screen.getByText('Size of BHK*')).toBeInTheDocument();
    });

    test('updates form fields', () => {
        render(
            <Provider store={store}>
                <ResidentialPropertyDetailsForm />
            </Provider>
        );

        const floorInput = screen.getByPlaceholderText('Floor');
        fireEvent.change(floorInput, { target: { value: '5' } });
        expect(floorInput.value).toBe('5');

        const totalFloorInput = screen.getByPlaceholderText('Total Floor');
        fireEvent.change(totalFloorInput, { target: { value: '10' } });
        expect(totalFloorInput.value).toBe('10');

        const sizeInput = screen.getByPlaceholderText('Property Size');
        fireEvent.change(sizeInput, { target: { value: '1200' } });
        expect(sizeInput.value).toBe('1200');
    });

    test('submits form successfully', () => {
        render(
            <Provider store={store}>
                <ResidentialPropertyDetailsForm />
            </Provider>
        );

        fireEvent.change(screen.getByPlaceholderText('Floor'), { target: { value: '5' } });
        fireEvent.change(screen.getByPlaceholderText('Total Floor'), { target: { value: '10' } });
        fireEvent.change(screen.getByPlaceholderText('Property Size'), { target: { value: '1200' } });

        const nextBtn = screen.getByText('NEXT');
        fireEvent.click(nextBtn);

        expect(mockNavigate).toHaveBeenCalledWith('/listing/Add/RentDetailsForm');
    });
});
