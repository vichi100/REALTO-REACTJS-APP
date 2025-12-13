import '../setupTests';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import NotificationStack from '../../stacks/NotificationStack';

// Mock dependencies
jest.mock('../../tabs/NotificationTopTabNavigator', () => () => <div data-testid="notification-top-tab">Notification Top Tab</div>);
jest.mock('../../../components/ScreenWrapper', () => ({ Component }) => <Component />);

describe('NotificationStack', () => {
    test('renders NotificationTopTab by default', () => {
        render(
            <MemoryRouter initialEntries={['/']}>
                <NotificationStack />
            </MemoryRouter>
        );
        expect(screen.getByTestId('notification-top-tab')).toBeInTheDocument();
    });
});
