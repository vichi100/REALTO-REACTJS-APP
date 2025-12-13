import './setupTests';
import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import Drawer from '../Drawer';

jest.useFakeTimers();

describe('Drawer Component', () => {
    test('renders correctly', () => {
        render(<Drawer />);
        expect(screen.getByText('Animated Sliding Drawer Tutorial.')).toBeInTheDocument();
        expect(screen.getByText('Buy Now')).toBeInTheDocument();
    });

    test('toggles drawer on button click', () => {
        render(<Drawer />);

        const button = screen.getByText('Menu').closest('button');

        // Initial state: isOpen false. 
        // The drawer container has transform style.
        // We can't easily check state directly, but we can check styles or class if applicable.
        // The code uses inline style transform.

        // Let's check the transform style of the drawer container (parent of button)
        const drawerContainer = button.parentElement;
        expect(drawerContainer).toHaveStyle('transform: translateX(254px)'); // 300 - 46

        fireEvent.click(button);

        expect(drawerContainer).toHaveStyle('transform: translateX(0px)');

        // Click again
        // Wait for timeout (250ms) because of disabled state
        act(() => {
            jest.advanceTimersByTime(250);
        });

        fireEvent.click(button);
        expect(drawerContainer).toHaveStyle('transform: translateX(254px)');
    });

    test('prevents rapid clicks', () => {
        render(<Drawer />);
        const button = screen.getByText('Menu').closest('button');
        const drawerContainer = button.parentElement;

        fireEvent.click(button);
        expect(drawerContainer).toHaveStyle('transform: translateX(0px)');

        // Click again immediately (should be ignored)
        fireEvent.click(button);
        expect(drawerContainer).toHaveStyle('transform: translateX(0px)'); // Still open

        // Wait
        act(() => {
            jest.advanceTimersByTime(250);
        });

        // Now click works
        fireEvent.click(button);
        expect(drawerContainer).toHaveStyle('transform: translateX(254px)');
    });
});
