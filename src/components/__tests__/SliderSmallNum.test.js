import './setupTests';
import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import SliderSmallNum from '../SliderSmallNum';

jest.useFakeTimers();

// Mock rc-slider
jest.mock('rc-slider', () => {
    return ({ onChange, defaultValue, min, max, step }) => (
        <div data-testid="mock-rc-slider">
            <button data-testid="trigger-change" onClick={() => onChange([0.5, 1])}>Change</button>
        </div>
    );
});

describe('SliderSmallNum Component', () => {
    test('renders correctly', () => {
        render(<SliderSmallNum min={1} max={50} onSlide={() => { }} />);
        expect(screen.getByTestId('mock-rc-slider')).toBeInTheDocument();
        expect(screen.getByText('1')).toBeInTheDocument();
        expect(screen.getByText('50+')).toBeInTheDocument();
    });

    test('calls onSlide when value changes', () => {
        const onSlideMock = jest.fn();
        render(<SliderSmallNum min={1} max={50} onSlide={onSlideMock} />);

        fireEvent.click(screen.getByTestId('trigger-change'));

        act(() => {
            jest.advanceTimersByTime(300);
        });

        expect(onSlideMock).toHaveBeenCalled();
    });
});
