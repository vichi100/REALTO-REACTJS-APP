import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import RentDetailsForm from '../residential/rent/RentDetailsForm';
import { mockUserDetails, mockResidentialProperty } from './mockData';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    useNavigate: () => mockNavigate,
}));

// Mock child components
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
jest.mock('../../../components/CustomButtonGroup', () => ({ buttons, onButtonPress }) => (
    <div>
        {buttons.map((btn, index) => (
            <button key={index} onClick={() => onButtonPress(index, btn)}>{btn.text}</button>
        ))}
    </div>
));

const initialState = {
    AppReducer: {
        userDetails: mockUserDetails,
        propertyDetails: { ...mockResidentialProperty, propertyType: 'Residential' },
    },
};

const mockReducer = (state = initialState, action) => {
    return state;
};

const store = createStore(mockReducer);

describe('RentDetailsForm Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders correctly', () => {
        render(
            <Provider store={store}>
                <RentDetailsForm />
            </Provider>
        );

        expect(screen.getByPlaceholderText('Expected Rent')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Expected Deposit')).toBeInTheDocument();
        expect(screen.getByText('Preferred Tenants*')).toBeInTheDocument();
    });

    test('validates input fields', () => {
        render(
            <Provider store={store}>
                <RentDetailsForm />
            </Provider>
        );

        const nextBtn = screen.getByText('NEXT');
        fireEvent.click(nextBtn);

        expect(screen.getByText('Expected rent is missing')).toBeInTheDocument();
    });

    test('submits form with valid data', () => {
        const { container } = render(
            <Provider store={store}>
                <RentDetailsForm />
            </Provider>
        );

        fireEvent.change(screen.getByPlaceholderText('Expected Rent'), { target: { value: '20000' } });
        fireEvent.change(screen.getByPlaceholderText('Expected Deposit'), { target: { value: '100000' } });

        // Date input might need specific handling or just string
        const dateInput = container.querySelector('input[type="date"]');
        // Or find by type="date" if label association is tricky
        // The label is "Available From *"
        // Let's try finding by label text.
        // If not found, use container selector.

        fireEvent.change(dateInput, { target: { value: '2023-12-25' } });

        const nextBtn = screen.getByText('NEXT');
        fireEvent.click(nextBtn);

        expect(mockNavigate).toHaveBeenCalledWith('/listing/Add/AddImages');
    });
});
