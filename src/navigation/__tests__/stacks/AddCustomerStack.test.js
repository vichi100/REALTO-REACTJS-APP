import '../setupTests';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AddNewContactsStack from '../../stacks/AddCustomerStack';

// Mock dependencies
jest.mock('../../../screens/contacts/AddNewCustomer', () => () => <div data-testid="add-new-customer">Add New Customer</div>);
jest.mock('../../../components/ScreenWrapper', () => ({ Component }) => <Component />);

describe('AddNewContactsStack', () => {
    test('renders AddNewCustomer by default', () => {
        render(
            <MemoryRouter initialEntries={['/']}>
                <AddNewContactsStack />
            </MemoryRouter>
        );
        expect(screen.getByTestId('add-new-customer')).toBeInTheDocument();
    });
});
