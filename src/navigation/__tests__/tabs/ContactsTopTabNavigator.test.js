import '../setupTests';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ContactsTopTab from '../../tabs/ContactsTopTabNavigator';

// Mock dependencies
jest.mock('../../../screens/contacts/residential/ContactsResidential', () => () => <div data-testid="contacts-residential">Contacts Residential</div>);
jest.mock('../../../screens/contacts/commercial/CustomersCommercial', () => () => <div data-testid="customers-commercial">Customers Commercial</div>);

describe('ContactsTopTab', () => {
    test('renders residential tab by default', () => {
        render(
            <MemoryRouter initialEntries={['/']}>
                <ContactsTopTab />
            </MemoryRouter>
        );
        expect(screen.getByTestId('contacts-residential')).toBeInTheDocument();
    });

    test('renders commercial tab when navigated', () => {
        render(
            <MemoryRouter initialEntries={['/commercial']}>
                <ContactsTopTab />
            </MemoryRouter>
        );
        expect(screen.getByTestId('customers-commercial')).toBeInTheDocument();
    });
});
