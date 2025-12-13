import './setupTests';
import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import Slider from '../Slider';

jest.useFakeTimers();

// Mock rc-slider
jest.mock('rc-slider', () => {
    return ({ onChange, defaultValue, min, max, step }) => (
        <div data-testid="mock-rc-slider">
            <button data-testid="trigger-change" onClick={() => onChange([0.5, 1])}>Change</button>
        </div>
    );
});

describe('Slider Component', () => {
    test('renders correctly', () => {
        render(<Slider min={0} max={100} onSlide={() => { }} />);
        expect(screen.getByTestId('mock-rc-slider')).toBeInTheDocument();
        expect(screen.getByText('0')).toBeInTheDocument();
        expect(screen.getByText('100+')).toBeInTheDocument();
    });

    test('calls onSlide when value changes', () => {
        const onSlideMock = jest.fn();
        // Use larger range to ensure scaling and rounding results in change
        render(<Slider min={10000} max={100000} onSlide={onSlideMock} />);

        fireEvent.click(screen.getByTestId('trigger-change'));

        act(() => {
            jest.advanceTimersByTime(300);
        });

        expect(onSlideMock).toHaveBeenCalled();
    });

    test('formats large numbers correctly', () => {
        // 100000 -> 1L (because 100000 % 100000 === 0)
        render(<Slider min={100000} max={200000} onSlide={() => { }} />);
        expect(screen.getByText('1L')).toBeInTheDocument();
        expect(screen.getByText('2L+')).toBeInTheDocument();
    });
});
