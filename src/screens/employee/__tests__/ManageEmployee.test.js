import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import ManageEmployee from '../ManageEmployee';
import { mockUserDetails, mockEmployee } from './mockData.util';
import axios from 'axios';
import { SERVER_URL } from '../../../utils/Constant';

// Mock dependencies
jest.mock('axios');
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

describe('ManageEmployee Component', () => {
    let store;
    const mockNavigate = jest.fn();

    beforeEach(() => {
        store = mockStore({
            AppReducer: {
                userDetails: mockUserDetails,
                employeeList: []
            }
        });
        axios.mockResolvedValue({ data: mockEmployee });
    });

    test('renders correctly for adding new employee', () => {
        render(
            <Provider store={store}>
                <ManageEmployee route={{ params: { editEmp: false } }} navigation={{ goBack: mockNavigate }} />
            </Provider>
        );

        expect(screen.getByText('Employee Name*')).toBeInTheDocument();
        expect(screen.getByText('Employee Mobile*')).toBeInTheDocument();
        expect(screen.getByText('ADD')).toBeInTheDocument();
    });

    test('validates input fields', () => {
        render(
            <Provider store={store}>
                <ManageEmployee route={{ params: { editEmp: false } }} navigation={{ goBack: mockNavigate }} />
            </Provider>
        );

        fireEvent.click(screen.getByText('ADD'));
        expect(screen.getByTestId('snackbar')).toHaveTextContent('Employee name is missing');
    });

    test('submits form with valid data', async () => {
        render(
            <Provider store={store}>
                <ManageEmployee route={{ params: { editEmp: false } }} navigation={{ goBack: mockNavigate }} />
            </Provider>
        );

        const inputs = screen.getAllByRole('textbox');
        fireEvent.change(inputs[0], { target: { value: 'New Employee' } });
        fireEvent.change(inputs[1], { target: { value: '9876543210' } });

        fireEvent.click(screen.getByText('ADD'));

        await waitFor(() => {
            expect(axios).toHaveBeenCalledWith(SERVER_URL + '/addEmployee', expect.any(Object));
        });
    });

    test('renders correctly for editing employee', () => {
        render(
            <Provider store={store}>
                <ManageEmployee route={{ params: { editEmp: true, empData: mockEmployee } }} navigation={{ goBack: mockNavigate }} />
            </Provider>
        );

        expect(screen.getByDisplayValue(mockEmployee.name)).toBeInTheDocument();
        expect(screen.getByDisplayValue(mockEmployee.mobile)).toBeInTheDocument();
        expect(screen.getByText('UPDATE')).toBeInTheDocument();
    });
});
