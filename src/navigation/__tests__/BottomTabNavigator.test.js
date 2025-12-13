import './setupTests';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import BottomTabNavigator from '../tabs/BottomTabNavigator';

// Mock dependencies
jest.mock('../stacks/ListingStack', () => () => <div data-testid="listing-stack">Listing Stack</div>);
jest.mock('../stacks/ContactsStack', () => () => <div data-testid="contacts-stack">Contacts Stack</div>);
jest.mock('../stacks/NotificationStack', () => () => <div data-testid="notification-stack">Notification Stack</div>);
jest.mock('../stacks/ProfileStack', () => () => <div data-testid="profile-stack">Profile Stack</div>);
jest.mock('../stacks/GlobalSearchStack', () => () => <div data-testid="global-search-stack">Global Search Stack</div>);

describe('BottomTabNavigator', () => {
    test('renders bottom tab links', () => {
        render(
            <MemoryRouter>
                <BottomTabNavigator />
            </MemoryRouter>
        );

        // Check for icons/links. Since we can't easily check for icons by text, we can check for links.
        // But the component uses Link from react-router-dom which renders as <a>.
        const links = screen.getAllByRole('link');
        expect(links).toHaveLength(5);
    });

    test('renders GlobalSearchStack by default', () => {
        render(
            <MemoryRouter initialEntries={['/']}>
                <BottomTabNavigator />
            </MemoryRouter>
        );
        expect(screen.getByTestId('global-search-stack')).toBeInTheDocument();
    });
});
