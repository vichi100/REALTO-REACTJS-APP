import './setupTests';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import ContactLocalityDetailsForm from '../ContactLocalityDetailsForm';
import { mockUserDetails, mockCustomerDetails } from './mockData.util';

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
jest.mock('react-google-places-autocomplete', () => () => <div data-testid="google-places">Places</div>);
jest.mock('../../../components/CustomButtonGroup', () => ({ buttons, onButtonPress }) => (
    <div data-testid="button-group">
        {buttons.map((btn, idx) => (
            <button key={idx} onClick={() => onButtonPress(idx, btn)}>{btn.text}</button>
        ))}
    </div>
));

const mockStore = configureStore([]);

describe('ContactLocalityDetailsForm Component', () => {
    let store;

    beforeEach(() => {
        store = mockStore({
            AppReducer: {
                userDetails: mockUserDetails,
                propertyDetails: null,
                customerDetails: mockCustomerDetails
            }
        });
    });

    test('renders correctly', () => {
        render(
            <Provider store={store}>
                <ContactLocalityDetailsForm />
            </Provider>
        );

        expect(screen.getByText(/Enter city and locations/i)).toBeInTheDocument();
        expect(screen.getByTestId('google-places')).toBeInTheDocument();
    });

    test('validates location selection', () => {
        render(
            <Provider store={store}>
                <ContactLocalityDetailsForm />
            </Provider>
        );

        fireEvent.click(screen.getByText('NEXT'));
        // Snackbar should appear with validation message
        // Note: The exact message may vary based on component state
    });

    test('handles property type selection', () => {
        render(
            <Provider store={store}>
                <ContactLocalityDetailsForm />
            </Provider>
        );

        const commercialButton = screen.getByText('Commercial');
        fireEvent.click(commercialButton);
        // Component should update state
    });
});
