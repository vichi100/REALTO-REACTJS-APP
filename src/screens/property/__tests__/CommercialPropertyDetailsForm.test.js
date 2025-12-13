import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import CommercialPropertyDetailsForm from '../commercial/CommercialPropertyDetailsForm';
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
    COMMERCIAL_PROPERTY_TYPE_OPTION: [{ text: 'Shop' }, { text: 'Office' }],
    COMMERCIAL_PROPERTY_BUILDING_TYPE_OPTION: [{ text: 'Mall' }, { text: 'Standalone' }],
    COMMERCIAL_PROPERTY_IDEAL_FOR_OPTION: [{ text: 'Shop' }, { text: 'Office' }],
    COMMERCIAL_PARKING_OPTION: [{ text: 'Public' }, { text: 'Private' }],
    PROPERTY_AGE_OPTION: [{ text: '0-5' }, { text: '6-10' }],
    POWER_BACKUP_OPTION: [{ text: 'Yes' }, { text: 'No' }],
}));

const initialState = {
    AppReducer: {
        userDetails: mockUserDetails,
        propertyDetails: { ...mockPropertyDetails, property_type: 'Commercial' },
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

describe('CommercialPropertyDetailsForm Component', () => {
    test('renders correctly', () => {
        render(
            <Provider store={store}>
                <CommercialPropertyDetailsForm />
            </Provider>
        );

        expect(screen.getByText('Property Type*')).toBeInTheDocument();
        expect(screen.getByText('Property Size*')).toBeInTheDocument();
    });

    test('updates property size', () => {
        render(
            <Provider store={store}>
                <CommercialPropertyDetailsForm />
            </Provider>
        );

        const sizeInput = screen.getByPlaceholderText('Property Size');
        fireEvent.change(sizeInput, { target: { value: '1000' } });
        expect(sizeInput.value).toBe('1000');
    });

    test('submits form successfully', () => {
        render(
            <Provider store={store}>
                <CommercialPropertyDetailsForm />
            </Provider>
        );

        const sizeInput = screen.getByPlaceholderText('Property Size');
        fireEvent.change(sizeInput, { target: { value: '1000' } });

        const nextBtn = screen.getByText('NEXT');
        fireEvent.click(nextBtn);

        expect(mockNavigate).toHaveBeenCalledWith('/listing/Add/RentDetailsForm');
    });
});
