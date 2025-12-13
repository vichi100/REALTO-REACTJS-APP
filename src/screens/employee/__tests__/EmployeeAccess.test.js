import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import EmployeeAccess from '../EmployeeAccess';
import { mockUserDetails, mockEmployee, mockEmployeeList } from './mockData.util';
import axios from 'axios';
import { SERVER_URL } from '../../../utils/Constant';

// Mock dependencies
jest.mock('axios');
jest.mock('@rneui/themed', () => ({
    Avatar: () => <div data-testid="avatar">Avatar</div>
}), { virtual: true });
jest.mock('react-icons/io', () => ({
    IoMdRemoveCircleOutline: () => <div data-testid="remove-icon">Remove</div>,
    IoMdCall: () => <div data-testid="call-icon">Call</div>
}));

const mockStore = configureStore([]);

describe('EmployeeAccess Component', () => {
    let store;

    beforeEach(() => {
        store = mockStore({
            AppReducer: {
                userDetails: mockUserDetails,
                employeeList: mockEmployeeList
            }
        });
        axios.mockResolvedValue({ data: 'success' });
        window.open = jest.fn();
    });

    test('renders correctly', () => {
        render(
            <Provider store={store}>
                <EmployeeAccess item={mockEmployee} />
            </Provider>
        );

        expect(screen.getByText(mockEmployee.name)).toBeInTheDocument();
        expect(screen.getByText(`+91 ${mockEmployee.mobile}`)).toBeInTheDocument();
        expect(screen.getByTestId('avatar')).toBeInTheDocument();
    });

    test('handles remove employee', async () => {
        render(
            <Provider store={store}>
                <EmployeeAccess item={mockEmployee} />
            </Provider>
        );

        fireEvent.click(screen.getByTestId('remove-icon').parentElement);

        await waitFor(() => {
            expect(axios).toHaveBeenCalledWith(SERVER_URL + '/removeEmployee', expect.objectContaining({
                method: 'post',
                data: expect.objectContaining({
                    employee_id: mockEmployee.id
                })
            }));
        });
    });

    test('handles make call', () => {
        render(
            <Provider store={store}>
                <EmployeeAccess item={mockEmployee} />
            </Provider>
        );

        fireEvent.click(screen.getByTestId('call-icon').parentElement);
        expect(window.open).toHaveBeenCalledWith(`tel:${mockEmployee.mobile}`);
    });

    test('handles update employee edit rights', async () => {
        render(
            <Provider store={store}>
                <EmployeeAccess item={mockEmployee} />
            </Provider>
        );

        const editCheckbox = screen.getAllByRole('checkbox')[1]; // Second checkbox is for Edit
        fireEvent.click(editCheckbox);

        await waitFor(() => {
            expect(axios).toHaveBeenCalledWith(SERVER_URL + '/updateEmployeeEditRights', expect.objectContaining({
                method: 'post',
                data: expect.objectContaining({
                    employee_id: mockEmployee.id
                })
            }));
        });
    });
});
