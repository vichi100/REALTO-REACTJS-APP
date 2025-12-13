import './setupTests';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Touchable from '../Touchable';

describe('Touchable Component', () => {
    test('renders children', () => {
        render(
            <Touchable>
                <span>Child Content</span>
            </Touchable>
        );
        expect(screen.getByText('Child Content')).toBeInTheDocument();
    });

    test('calls onPress when clicked', () => {
        const onPressMock = jest.fn();
        render(
            <Touchable onPress={onPressMock}>
                <span>Click Me</span>
            </Touchable>
        );

        fireEvent.click(screen.getByText('Click Me'));
        expect(onPressMock).toHaveBeenCalledTimes(1);
    });

    test('applies custom styles', () => {
        const { container } = render(
            <Touchable style={{ backgroundColor: 'red' }}>
                <span>Styled</span>
            </Touchable>
        );
        expect(container.firstChild).toHaveStyle('background-color: red');
    });
});
