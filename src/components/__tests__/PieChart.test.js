import './setupTests';
import React from 'react';
import { render, screen } from '@testing-library/react';
import PieChart from '../PieChart';

describe('PieChart Component', () => {
    const data = [10, 20, 30];

    test('renders correctly', () => {
        const { container } = render(<PieChart data={data} />);
        // 3 segments
        const svgs = container.querySelectorAll('svg');
        expect(svgs.length).toBe(3);
    });

    test('renders legend', () => {
        render(<PieChart data={data} />);
        // Total = 60. 
        // 10 -> 16.7%
        // 20 -> 33.3%
        // 30 -> 50.0%

        expect(screen.getByText(/10 \(16.7%\)/)).toBeInTheDocument();
        expect(screen.getByText(/20 \(33.3%\)/)).toBeInTheDocument();
        expect(screen.getByText(/30 \(50.0%\)/)).toBeInTheDocument();
    });
});
