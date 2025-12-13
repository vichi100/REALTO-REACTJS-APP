import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import SellDetailsForm from '../residential/sell/SellDetailsForm';
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
jest.mock('../../../utils/AppConstant', () => ({
    NEGOTIABLE_OPTION: [{ text: 'Yes' }, { text: 'No' }]
}));

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

describe('SellDetailsForm Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders correctly', () => {
        render(
            <Provider store={store}>
                <SellDetailsForm />
            </Provider>
        );

        expect(screen.getByPlaceholderText('Expected Sell Price*')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Maintenance Charge')).toBeInTheDocument();
        expect(screen.getByText('Negotiable*')).toBeInTheDocument();
    });

    test('validates input fields', () => {
        render(
            <Provider store={store}>
                <SellDetailsForm />
            </Provider>
        );

        const nextBtn = screen.getByText('NEXT');
        fireEvent.click(nextBtn);

        expect(screen.getByText('Expected sell price is missing')).toBeInTheDocument();
    });

    test('submits form with valid data', () => {
        render(
            <Provider store={store}>
                <SellDetailsForm />
            </Provider>
        );

        fireEvent.change(screen.getByPlaceholderText('Expected Sell Price*'), { target: { value: '10000000' } });
        fireEvent.change(screen.getByPlaceholderText('Maintenance Charge'), { target: { value: '5000' } });

        const dateInput = screen.getByPlaceholderText('Available From *');
        fireEvent.change(dateInput, { target: { value: '2023-12-25' } });

        const nextBtn = screen.getByText('NEXT');
        fireEvent.click(nextBtn);

        expect(mockNavigate).toHaveBeenCalledWith('/listing/Add/AddImages');
    });
});
