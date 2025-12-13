import './setupTests';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Button from '../Button';

describe('Button Component', () => {
    test('renders correctly with title', () => {
        render(<Button title="Click Me" onPress={() => { }} />);
        expect(screen.getByText('Click Me')).toBeInTheDocument();
    });

    test('calls onPress when clicked', () => {
        const onPressMock = jest.fn();
        render(<Button title="Click Me" onPress={onPressMock} />);

        fireEvent.click(screen.getByRole('button'));
        expect(onPressMock).toHaveBeenCalledTimes(1);
    });

    test('renders with correct accessibility label', () => {
        render(<Button title="Click Me" onPress={() => { }} accessibilityLabel="Custom Label" />);
        expect(screen.getByLabelText('Custom Label')).toBeInTheDocument();
    });
});
