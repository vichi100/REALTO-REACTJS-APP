import './setupTests';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CustomButtonGroup from '../CustomButtonGroup';

describe('CustomButtonGroup Component', () => {
    const buttons = [{ text: 'Option 1' }, { text: 'Option 2' }, { text: 'Option 3' }];

    test('renders all buttons', () => {
        render(<CustomButtonGroup buttons={buttons} />);
        buttons.forEach(btn => {
            expect(screen.getByText(btn.text)).toBeInTheDocument();
        });
    });

    test('handles single selection', () => {
        const onButtonPressMock = jest.fn();
        render(
            <CustomButtonGroup
                buttons={buttons}
                onButtonPress={onButtonPressMock}
                selectedIndices={[0]}
            />
        );

        fireEvent.click(screen.getByText('Option 2'));
        // Should return index 1, button object, and new selected indices [1]
        expect(onButtonPressMock).toHaveBeenCalledWith(1, buttons[1], [1]);
    });

    test('handles multi selection', () => {
        const onButtonPressMock = jest.fn();
        render(
            <CustomButtonGroup
                buttons={buttons}
                onButtonPress={onButtonPressMock}
                selectedIndices={[0]}
                isMultiSelect={true}
            />
        );

        fireEvent.click(screen.getByText('Option 2'));
        // Should return index 1, button object, and new selected indices [0, 1]
        expect(onButtonPressMock).toHaveBeenCalledWith(1, buttons[1], [0, 1]);
    });

    test('handles deselection in multi select', () => {
        const onButtonPressMock = jest.fn();
        render(
            <CustomButtonGroup
                buttons={buttons}
                onButtonPress={onButtonPressMock}
                selectedIndices={[0, 1]}
                isMultiSelect={true}
            />
        );

        fireEvent.click(screen.getByText('Option 1'));
        // Should return index 0, button object, and new selected indices [1]
        expect(onButtonPressMock).toHaveBeenCalledWith(0, buttons[0], [1]);
    });
});
