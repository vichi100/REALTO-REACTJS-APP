import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
const mockStore = (state) => ({
    getState: () => state,
    subscribe: () => { },
    dispatch: jest.fn(),
});
import ProfileForm from '../ProfileForm';
import { mockUserDetails } from './mockData.util';
import axios from 'axios';
import { SERVER_URL } from '../../../utils/Constant';

// Mock dependencies
jest.mock('axios');
jest.mock('../../../components/Button', () => ({ title, onPress }) => (
    <button onClick={onPress}>{title}</button>
));
jest.mock('../../../components/SnackbarComponent', () => ({ visible, textMessage }) => (
    visible ? <div data-testid="snackbar">{textMessage}</div> : null
));

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => {
    const { TextEncoder, TextDecoder } = require('util');
    Object.assign(global, { TextEncoder, TextDecoder });
    return {
        ...jest.requireActual('react-router-dom'),
        useNavigate: () => mockNavigate,
        useLocation: () => ({ state: {} })
    };
});



describe('ProfileForm Component', () => {
    let store;

    beforeEach(() => {
        store = mockStore({
            AppReducer: {
                userDetails: { ...mockUserDetails } // Create a copy to avoid mutation issues
            }
        });
        jest.clearAllMocks();
    });

    test('renders correctly with initial values', () => {
        render(
            <Provider store={store}>
                <ProfileForm />
            </Provider>
        );

        expect(screen.getByDisplayValue('John Doe')).toBeInTheDocument();
        expect(screen.getByDisplayValue('New York')).toBeInTheDocument();
        expect(screen.getByDisplayValue('Realto Inc.')).toBeInTheDocument();
        expect(screen.getByDisplayValue('john.doe@example.com')).toBeInTheDocument();
    });

    test('updates input fields', () => {
        render(
            <Provider store={store}>
                <ProfileForm />
            </Provider>
        );

        const nameInput = screen.getByDisplayValue('John Doe');
        fireEvent.change(nameInput, { target: { value: 'Jane Doe' } });
        expect(nameInput.value).toBe('Jane Doe');
    });

    test('shows validation error if name is missing', () => {
        render(
            <Provider store={store}>
                <ProfileForm />
            </Provider>
        );

        const nameInput = screen.getByDisplayValue('John Doe');
        fireEvent.change(nameInput, { target: { value: '' } });

        fireEvent.click(screen.getByText('DONE'));

        expect(screen.getByTestId('snackbar')).toHaveTextContent('Name is missing');
    });

    test('submits form with valid data', async () => {
        axios.mockResolvedValue({ data: 'success' });

        render(
            <Provider store={store}>
                <ProfileForm />
            </Provider>
        );

        const nameInput = screen.getByDisplayValue('John Doe');
        fireEvent.change(nameInput, { target: { value: 'Jane Doe' } });

        fireEvent.click(screen.getByText('DONE'));

        await waitFor(() => {
            expect(axios).toHaveBeenCalledWith(SERVER_URL + "/updateUserProfile", expect.objectContaining({
                data: expect.objectContaining({
                    name: 'Jane Doe'
                })
            }));
        });

        expect(mockNavigate).toHaveBeenCalledWith('/profile');
    });
});
