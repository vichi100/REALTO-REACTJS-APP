import './setupTests';
import React from 'react';
import { render } from '@testing-library/react';
import DoughnutChart from '../DoughnutChart';

describe('DoughnutChart Component', () => {
    test('renders correctly with default data', () => {
        const { container } = render(<DoughnutChart />);
        expect(container.querySelector('svg')).toBeInTheDocument();
        // Default data is [2, 98], so 2 segments (one might be small)
        // Actually code says: if data[0] === 0 || data[1] === 0, data = [1, 98]
        // Default prop data = [2, 98]

        // We expect paths to be rendered
        const paths = container.querySelectorAll('path');
        expect(paths.length).toBeGreaterThan(0);
    });

    test('renders with custom data', () => {
        const { container } = render(<DoughnutChart data={[50, 50]} />);
        const paths = container.querySelectorAll('path');
        expect(paths.length).toBe(2);
    });

    test('shows percentage text', () => {
        const { getByText } = render(<DoughnutChart data={[50, 50]} showPercentage={true} />);
        // 50 / 100 = 50%
        expect(getByText('50%')).toBeInTheDocument();
        expect(getByText('Match')).toBeInTheDocument();
    });

    test('hides percentage text', () => {
        const { queryByText } = render(<DoughnutChart data={[50, 50]} showPercentage={false} />);
        expect(queryByText('Match')).not.toBeInTheDocument();
    });
});
