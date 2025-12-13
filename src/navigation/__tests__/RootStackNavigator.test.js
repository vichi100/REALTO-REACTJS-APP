import './setupTests';
import React from 'react';
import { render, screen } from '@testing-library/react';
import RootStackNavigator from '../main/RootStackNavigator';

// Mock dependencies
jest.mock('../../screens/dashboard/Home', () => () => <div data-testid="home-screen">Home Screen</div>);

describe('RootStackNavigator', () => {
    test('renders Home screen', () => {
        render(<RootStackNavigator />);
        expect(screen.getByTestId('home-screen')).toBeInTheDocument();
    });
});
