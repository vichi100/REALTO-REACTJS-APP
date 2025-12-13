import './setupTests';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import HomeStack from '../stacks/HomeStack';

// Mock dependencies
jest.mock('../../screens/dashboard/Home', () => () => <div data-testid="home-screen">Home Screen</div>);

describe('HomeStack', () => {
    test('renders Home screen', () => {
        render(
            <MemoryRouter>
                <HomeStack />
            </MemoryRouter>
        );
        expect(screen.getByTestId('home-screen')).toBeInTheDocument();
    });
});
