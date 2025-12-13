import './setupTests';
import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import SnackbarComponent from '../SnackbarComponent';

jest.useFakeTimers();

describe('SnackbarComponent Component', () => {
    test('renders hidden by default', () => {
        render(<SnackbarComponent textMessage="Hello" />);
        const snackbar = screen.getByText('Hello').closest('.fixed');
        expect(snackbar).toHaveStyle('visibility: hidden');
    });

    test('renders visible when visible prop is true', () => {
        render(<SnackbarComponent visible={true} textMessage="Hello" />);
        const snackbar = screen.getByText('Hello').closest('.fixed');
        expect(snackbar).toHaveStyle('visibility: visible');
    });

    test('auto hides after timeout', () => {
        render(
            <SnackbarComponent
                visible={true}
                textMessage="Hello"
                autoHidingTime={1000}
            />
        );

        const snackbar = screen.getByText('Hello').closest('.fixed');
        expect(snackbar).toHaveStyle('visibility: visible');

        act(() => {
            jest.advanceTimersByTime(1000);
        });

        expect(snackbar).toHaveStyle('visibility: hidden');
    });

    test('renders action button and handles click', () => {
        const actionHandlerMock = jest.fn();
        render(
            <SnackbarComponent
                visible={true}
                textMessage="Hello"
                actionText="Undo"
                actionHandler={actionHandlerMock}
            />
        );

        const actionButton = screen.getByText('UNDO');
        fireEvent.click(actionButton);
        expect(actionHandlerMock).toHaveBeenCalledTimes(1);
    });
});
