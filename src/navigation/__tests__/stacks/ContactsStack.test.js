import '../setupTests';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ContactsStack from '../../stacks/ContactsStack';

// Mock dependencies
jest.mock('../../tabs/ContactsTopTabNavigator', () => () => <div data-testid="contacts-top-tab">Contacts Top Tab</div>);
jest.mock('../../../screens/meeting/Meeting', () => () => <div data-testid="meeting-screen">Meeting Screen</div>);
jest.mock('../../../screens/contacts/CustomerMeeting', () => () => <div data-testid="customer-meeting-screen">Customer Meeting Screen</div>);
// ... mock other dependencies as needed, or just mock ScreenWrapper if possible
jest.mock('../../../components/ScreenWrapper', () => ({ Component }) => <Component />);

describe('ContactsStack', () => {
    test('renders ContactsTopTab by default', () => {
        render(
            <MemoryRouter initialEntries={['/']}>
                <ContactsStack />
            </MemoryRouter>
        );
        expect(screen.getByTestId('contacts-top-tab')).toBeInTheDocument();
    });

    test('renders Meeting screen on /Meeting route', () => {
        render(
            <MemoryRouter initialEntries={['/Meeting']}>
                <ContactsStack />
            </MemoryRouter>
        );
        expect(screen.getByTestId('meeting-screen')).toBeInTheDocument();
    });
});
