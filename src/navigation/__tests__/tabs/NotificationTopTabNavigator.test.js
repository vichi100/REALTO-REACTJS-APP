import '../setupTests';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import NotificationTopTab from '../../tabs/NotificationTopTabNavigator';

// Mock dependencies
jest.mock('../../../screens/common/Reminder', () => () => <div data-testid="reminder-screen">Reminder Screen</div>);
jest.mock('../../../components/ScreenWrapper', () => ({ Component }) => <Component />);

describe('NotificationTopTab', () => {
    test('renders reminders tab by default', () => {
        render(
            <MemoryRouter initialEntries={['/notifications']}>
                <Routes>
                    <Route path="notifications/*" element={<NotificationTopTab />} />
                </Routes>
            </MemoryRouter>
        );
        expect(screen.getByTestId('reminder-screen')).toBeInTheDocument();
    });
});
