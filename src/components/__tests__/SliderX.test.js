import './setupTests';
import React from 'react';
import { render, screen } from '@testing-library/react';
import SliderX from '../SliderX';

// Mock rc-slider
jest.mock('rc-slider', () => () => <div data-testid="mock-rc-slider" />);

describe('SliderX Component', () => {
    test('renders Slider component', () => {
        render(<SliderX min={0} max={100} onSlide={() => { }} />);
        expect(screen.getByTestId('mock-rc-slider')).toBeInTheDocument();
    });
});
