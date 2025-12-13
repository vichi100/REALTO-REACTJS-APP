import './setupTests';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SwitchButton from '../SwitchButton';

describe('SwitchButton Component', () => {
    test('renders correctly', () => {
        render(<SwitchButton />);
        expect(screen.getByText('ON')).toBeInTheDocument();
        expect(screen.getByText('OFF')).toBeInTheDocument();
    });

    test('renders with custom text', () => {
        render(<SwitchButton text1="Yes" text2="No" />);
        expect(screen.getByText('Yes')).toBeInTheDocument();
        expect(screen.getByText('No')).toBeInTheDocument();
    });

    test('toggles value on click', () => {
        const onValueChangeMock = jest.fn();
        const { container } = render(<SwitchButton onValueChange={onValueChangeMock} />);

        // Click the switch container
        const switchContainer = container.firstChild.firstChild;
        fireEvent.click(switchContainer);

        // Initial state is 1 (ON). Click should switch to 2 (OFF).
        expect(onValueChangeMock).toHaveBeenCalledWith(2);

        // Click again
        fireEvent.click(switchContainer);
        expect(onValueChangeMock).toHaveBeenCalledWith(1);
    });
});
