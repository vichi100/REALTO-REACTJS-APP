import '../setupTests';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ProfileStack from '../../stacks/ProfileStack';

// Mock dependencies
jest.mock('../../../screens/profile/Profile', () => () => <div data-testid="profile-screen">Profile Screen</div>);
jest.mock('../../../components/ScreenWrapper', () => ({ Component }) => <Component />);

describe('ProfileStack', () => {
    test('renders Profile screen by default', () => {
        render(
            <MemoryRouter initialEntries={['/']}>
                <ProfileStack />
            </MemoryRouter>
        );
        expect(screen.getByTestId('profile-screen')).toBeInTheDocument();
    });
});
