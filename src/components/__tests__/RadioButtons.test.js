import './setupTests';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import RadioButtons from '../RadioButtons';

describe('RadioButtons Component', () => {
    const options = [
        { key: 'opt1', text: 'Option 1' },
        { key: 'opt2', text: 'Option 2' }
    ];

    test('renders all options', () => {
        render(<RadioButtons options={options} onSelect={() => { }} />);
        options.forEach(opt => {
            expect(screen.getByText(opt.text)).toBeInTheDocument();
        });
    });

    test('calls onSelect when clicked', () => {
        const onSelectMock = jest.fn();
        render(<RadioButtons options={options} onSelect={onSelectMock} />);

        // The onClick is on the circle div, which is the previous sibling of the text span
        const textSpan = screen.getByText('Option 1');
        const row = textSpan.parentElement;
        const circleDiv = row.firstChild;
        fireEvent.click(circleDiv);
        expect(onSelectMock).toHaveBeenCalledWith(options[0]);
    });

    test('shows selected state', () => {
        const { container } = render(
            <RadioButtons
                options={options}
                selectedOption={options[0]}
                onSelect={() => { }}
            />
        );

        // The selected circle has a specific class or style. 
        // In the code: bg-[rgba(102,205,170,0.8)]
        // We can check if the inner div exists for the first option but not the second
        // The structure is: div(row) -> div(circle) -> div(inner circle if selected)

        // Let's find the circle container for Option 1
        const option1Text = screen.getByText('Option 1');
        const option1Row = option1Text.parentElement;
        const option1Circle = option1Row.firstChild;

        expect(option1Circle.firstChild).toHaveClass('bg-[rgba(102,205,170,0.8)]');

        // Option 2 should not have it
        const option2Text = screen.getByText('Option 2');
        const option2Row = option2Text.parentElement;
        const option2Circle = option2Row.firstChild;

        expect(option2Circle.firstChild).toBeNull();
    });
});
