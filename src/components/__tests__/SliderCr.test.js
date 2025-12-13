import './setupTests';
import React from 'react';
import { render, screen } from '@testing-library/react';
import SliderCr from '../SliderCr';

// Mock rc-slider (since SliderCr uses Slider which uses rc-slider)
jest.mock('rc-slider', () => () => <div data-testid="mock-rc-slider" />);

describe('SliderCr Component', () => {
    test('renders Slider component', () => {
        render(<SliderCr min={0} max={100} onSlide={() => { }} />);
        expect(screen.getByTestId('mock-rc-slider')).toBeInTheDocument();
    });
});
