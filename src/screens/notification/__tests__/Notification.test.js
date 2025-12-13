import React from 'react';
import { render, screen } from '@testing-library/react';
import Notification from '../Notification';

describe('Notification Component', () => {
    test('renders correctly', () => {
        render(<Notification />);
        expect(screen.getByText('Notification')).toBeInTheDocument();
    });
});
