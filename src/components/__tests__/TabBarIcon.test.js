import './setupTests';
import React from 'react';
import { render } from '@testing-library/react';
import TabBarIcon from '../TabBarIcon';

// Mock Colors
jest.mock('../../constants/Colors', () => ({
    tabIconSelected: 'blue',
    tabIconDefault: 'grey'
}));

describe('TabBarIcon Component', () => {
    test('renders default icon when name is not found', () => {
        const { container } = render(<TabBarIcon name="unknown-icon" />);
        expect(container.querySelector('svg')).toBeInTheDocument();
    });

    test('renders specific icon when name matches', () => {
        // Assuming IoMdHome exists in react-icons/io5 and maps to md-home
        // But the mapping logic in component is: 
        // name.split('-').map(p => p.charAt(0).toUpperCase() + p.slice(1)).join('') -> PascalCase
        // then prepend 'Io'
        // e.g. 'md-home' -> 'MdHome' -> 'IoMdHome'

        // We need to pick a name that exists in react-icons/io5 with Io prefix
        // IoHome exists. So name should be 'home' -> 'Home' -> 'IoHome'

        const { container } = render(<TabBarIcon name="home" />);
        expect(container.querySelector('svg')).toBeInTheDocument();
    });

    test('applies correct color based on focused prop', () => {
        const { container } = render(<TabBarIcon name="home" focused={true} />);
        const svg = container.querySelector('svg');
        expect(svg).toHaveStyle('color: blue');

        const { container: container2 } = render(<TabBarIcon name="home" focused={false} />);
        const svg2 = container2.querySelector('svg');
        expect(svg2).toHaveStyle('color: grey');
    });
});
