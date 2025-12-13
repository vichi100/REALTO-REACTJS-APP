import './setupTests';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ScreenWrapper from '../ScreenWrapper';
import { useNavigate, useLocation, useParams } from 'react-router-dom';

// Mock react-router-dom
jest.mock('react-router-dom', () => ({
    useNavigate: jest.fn(),
    useLocation: jest.fn(),
    useParams: jest.fn()
}));

// Mock routesMap
jest.mock('../../utils/routesMap', () => ({
    routesMap: {
        'Home': '/home',
        'Profile': '/profile'
    }
}));

describe('ScreenWrapper Component', () => {
    const MockComponent = ({ navigation, route }) => (
        <div>
            <span>Mock Component</span>
            <button onClick={() => navigation.navigate('Home')}>Go Home</button>
            <button onClick={() => navigation.goBack()}>Go Back</button>
            <span data-testid="route-name">{route.name}</span>
            <span data-testid="route-param">{route.params.id}</span>
        </div>
    );

    beforeEach(() => {
        useNavigate.mockReturnValue(jest.fn());
        useLocation.mockReturnValue({ pathname: '/test', state: {}, key: 'key1' });
        useParams.mockReturnValue({ id: '123' });
    });

    test('renders wrapped component', () => {
        render(<ScreenWrapper Component={MockComponent} />);
        expect(screen.getByText('Mock Component')).toBeInTheDocument();
    });

    test('passes navigation and route props', () => {
        render(<ScreenWrapper Component={MockComponent} />);
        expect(screen.getByTestId('route-name')).toHaveTextContent('/test');
        expect(screen.getByTestId('route-param')).toHaveTextContent('123');
    });

    test('handles navigation', () => {
        const navigateMock = jest.fn();
        useNavigate.mockReturnValue(navigateMock);

        render(<ScreenWrapper Component={MockComponent} />);

        fireEvent.click(screen.getByText('Go Home'));
        // routesMap maps 'Home' to '/home'
        expect(navigateMock).toHaveBeenCalledWith('/home', { state: undefined });
    });

    test('handles goBack', () => {
        const navigateMock = jest.fn();
        useNavigate.mockReturnValue(navigateMock);

        render(<ScreenWrapper Component={MockComponent} />);

        fireEvent.click(screen.getByText('Go Back'));
        expect(navigateMock).toHaveBeenCalledWith(-1);
    });
});
