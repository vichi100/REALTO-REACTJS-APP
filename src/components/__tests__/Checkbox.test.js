import './setupTests';
import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import Checkbox from '../Checkbox';

describe('Checkbox Component', () => {
    test('renders correctly unchecked', () => {
        const { container } = render(<Checkbox isChecked={false} onClick={() => { }} />);
        // MdCheckBoxOutlineBlank should be present
        expect(container.querySelector('svg')).toBeInTheDocument();
    });

    test('renders correctly checked', () => {
        const { container } = render(<Checkbox isChecked={true} onClick={() => { }} />);
        // MdCheckBox should be present
        expect(container.querySelector('svg')).toBeInTheDocument();
    });

    test('toggles state on click', () => {
        const onClickMock = jest.fn();
        const { container } = render(<Checkbox isChecked={false} onClick={onClickMock} />);

        // Click the container div (it has the onClick handler)
        fireEvent.click(container.firstChild);

        expect(onClickMock).toHaveBeenCalledWith(true);
    });

    test('does not toggle when disabled', () => {
        const onClickMock = jest.fn();
        const { container } = render(<Checkbox isChecked={false} onClick={onClickMock} disabled={true} />);

        fireEvent.click(container.firstChild);

        expect(onClickMock).not.toHaveBeenCalled();
    });
});
