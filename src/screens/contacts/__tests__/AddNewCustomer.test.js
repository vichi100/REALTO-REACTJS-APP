import './setupTests';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import AddNewCustomer from '../AddNewCustomer';
import { mockUserDetails } from './mockData.util';

// Mock dependencies
jest.mock('react-router-dom', () => ({
    useNavigate: () => jest.fn()
}));
jest.mock('../../../components/Button', () => ({ title, onPress }) => (
    <button onClick={onPress}>{title}</button>
));
jest.mock('../../../components/SnackbarComponent', () => ({ visible, textMessage }) => (
    visible ? <div data-testid="snackbar">{textMessage}</div> : null
));

const mockStore = configureStore([]);

describe('AddNewCustomer Component', () => {
    let store;

    beforeEach(() => {
        store = mockStore({
            AppReducer: {
                userDetails: mockUserDetails,
                propertyDetails: null,
                customerDetails: null
            }
        });
    });

    test('renders correctly', () => {
        render(
            <Provider store={store}>
                <AddNewCustomer />
            </Provider>
        );

        expect(screen.getByText(/Add new customer details/i)).toBeInTheDocument();
        // Name and Address are textboxes, Mobile is spinbutton
        expect(screen.getAllByRole('textbox')).toHaveLength(2);
        expect(screen.getByRole('spinbutton')).toBeInTheDocument();
    });

    test('validates required fields', () => {
        render(
            <Provider store={store}>
                <AddNewCustomer />
            </Provider>
        );

        fireEvent.click(screen.getByText('NEXT'));
        expect(screen.getByTestId('snackbar')).toHaveTextContent('Owner name is missing');
    });

    test('handles form submission with valid data', () => {
        render(
            <Provider store={store}>
                <AddNewCustomer />
            </Provider>
        );

        const textInputs = screen.getAllByRole('textbox');
        const mobileInput = screen.getByRole('spinbutton');

        fireEvent.change(textInputs[0], { target: { value: 'John Doe' } }); // Name
        fireEvent.change(mobileInput, { target: { value: '9876543210' } }); // Mobile
        fireEvent.change(textInputs[1], { target: { value: '123 Main St' } }); // Address

        fireEvent.click(screen.getByText('NEXT'));

        const actions = store.getActions();
        expect(actions).toContainEqual(
            expect.objectContaining({
                type: 'APP.SET_CUSTOMER_DETAILS'
            })
        );
    });
});
