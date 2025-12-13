import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import EmployeeCard from '../EmployeeCard';
import { mockUserDetails, mockEmployee } from './mockData.util';
import axios from 'axios';
import { SERVER_URL } from '../../../utils/Constant';

// Mock dependencies
jest.mock('axios');
jest.mock('react-router-dom', () => ({
    useNavigate: () => jest.fn()
}));
jest.mock('../../../components/CustomButtonGroup', () => () => <div data-testid="custom-button-group">Group</div>);
jest.mock('react-icons/md', () => ({
    MdChevronLeft: () => <div data-testid="chevron-left">Chevron</div>,
    MdManageAccounts: () => <div data-testid="manage-accounts">Manage</div>,
    MdAddBusiness: () => <div data-testid="add-business">Add Business</div>,
    MdPersonAdd: () => <div data-testid="person-add">Person Add</div>
}));
jest.mock('react-icons/io', () => ({
    IoMdClose: () => <div data-testid="close-icon">Close</div>,
    IoMdCall: () => <div data-testid="call-icon">Call</div>,
    IoMdPin: () => <div data-testid="pin-icon">Pin</div>
}));

const mockStore = configureStore([]);

describe('EmployeeCard Component', () => {
    let store;

    beforeEach(() => {
        store = mockStore({
            AppReducer: {
                userDetails: mockUserDetails,
                customerDetailsForMeeting: null
            }
        });
        axios.mockResolvedValue({ data: 'success' });
        window.open = jest.fn();
    });

    test('renders correctly', () => {
        render(
            <Provider store={store}>
                <EmployeeCard item={mockEmployee} />
            </Provider>
        );

        expect(screen.getByText(mockEmployee.name)).toBeInTheDocument();
        expect(screen.getByText(mockEmployee.mobile)).toBeInTheDocument();
        expect(screen.getByText(mockEmployee.company_name)).toBeInTheDocument();
    });

    test('opens drawer on click', () => {
        render(
            <Provider store={store}>
                <EmployeeCard item={mockEmployee} />
            </Provider>
        );

        fireEvent.click(screen.getByTestId('chevron-left').parentElement);
        expect(screen.getByTestId('close-icon')).toBeInTheDocument();
        expect(screen.getByTestId('manage-accounts')).toBeInTheDocument();
        expect(screen.getByTestId('call-icon')).toBeInTheDocument();
    });

    test('handles make call from drawer', () => {
        render(
            <Provider store={store}>
                <EmployeeCard item={mockEmployee} />
            </Provider>
        );

        fireEvent.click(screen.getByTestId('chevron-left').parentElement);
        fireEvent.click(screen.getByTestId('call-icon').parentElement);
        expect(window.open).toHaveBeenCalledWith(`tel:${mockEmployee.mobile}`);
    });

    test('displays checkbox when displayCheckBox is true', () => {
        render(
            <Provider store={store}>
                <EmployeeCard
                    item={mockEmployee}
                    displayCheckBox={true}
                    itemForAddEmplyee={{
                        customer_id: 'cust1',
                        customer_locality: { property_for: 'Rent', property_type: 'Residential' }
                    }}
                />
            </Provider>
        );

        expect(screen.getByRole('checkbox')).toBeInTheDocument();
    });

    test('handles checkbox click', async () => {
        render(
            <Provider store={store}>
                <EmployeeCard
                    item={mockEmployee}
                    displayCheckBox={true}
                    itemForAddEmplyee={{ property_id: 'prop1', property_type: 'Residential', property_for: 'Rent' }}
                />
            </Provider>
        );

        const checkbox = screen.getByRole('checkbox');
        fireEvent.click(checkbox);

        await waitFor(() => {
            expect(axios).toHaveBeenCalledWith(SERVER_URL + '/updatePropertiesForEmployee', expect.any(Object));
        });
    });
});
