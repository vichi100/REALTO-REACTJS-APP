import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import AddNewProperty from '../AddNewProperty';
import { mockUserDetails } from './mockData';

// Mock dependencies
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    useNavigate: () => mockNavigate,
}));

// Mock child components
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
        propertyDetails: null,
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

describe('AddNewProperty Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders correctly', () => {
        render(
            <Provider store={store}>
                <AddNewProperty />
            </Provider>
        );

        expect(screen.getByText('Select Property Type')).toBeInTheDocument();
        expect(screen.getByText('Owner Details')).toBeInTheDocument();
    });

    test('updates owner details', () => {
        const { container } = render(
            <Provider store={store}>
                <AddNewProperty />
            </Provider>
        );

        const inputs = container.querySelectorAll('input');
        const nameInp = inputs[0]; // Name

        fireEvent.change(nameInp, { target: { value: 'John Doe' } });
        expect(nameInp.value).toBe('John Doe');
    });

    test('shows error if fields are missing', () => {
        render(
            <Provider store={store}>
                <AddNewProperty />
            </Provider>
        );

        const nextBtn = screen.getByText('NEXT');
        fireEvent.click(nextBtn);

        expect(screen.getByText('Owner name is missing')).toBeInTheDocument();
    });

    test('submits form successfully', () => {




        // Mobile is type="tel", might need specific query
        // Let's try to find it by display value or just use querySelector
        // const mobileInp = document.querySelector('input[type="tel"]'); // We don't have document in test context easily like this without screen

        // Let's use placeholder or class? No placeholders.
        // Let's use the fact that it's the second input in the form?
        // The inputs are: Name (text), Mobile (tel), Address (text).

        // Let's try to find by label text proximity?
        // Or just use `screen.getByDisplayValue` after setting it? No.

        // Let's use `container` from render.
        const { container } = render(
            <Provider store={store}>
                <AddNewProperty />
            </Provider>
        );

        const nameInput = container.querySelector('input[type="text"]'); // First text input
        const mobileInput = container.querySelector('input[type="tel"]');
        const addressInput = container.querySelectorAll('input[type="text"]')[1]; // Second text input

        fireEvent.change(nameInput, { target: { value: 'John Doe' } });
        fireEvent.change(mobileInput, { target: { value: '9876543210' } });
        fireEvent.change(addressInput, { target: { value: '123 Main St' } });

        const nextBtn = screen.getByText('NEXT');
        fireEvent.click(nextBtn);

        expect(mockNavigate).toHaveBeenCalledWith('/listing/Add/LocalityDetailsForm');
    });
});
