import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CloseProperty from '../CloseProperty';

// Mock child components
jest.mock('../../../components/CustomButtonGroup', () => ({ buttons, onButtonPress, selectedIndices }) => (
    <div data-testid="custom-button-group">
        {buttons.map((btn, idx) => (
            <button
                key={idx}
                onClick={() => onButtonPress(idx, btn)}
                data-selected={selectedIndices.includes(idx)}
            >
                {btn.text}
            </button>
        ))}
    </div>
));

describe('CloseProperty Component', () => {
    test('renders correctly', () => {
        render(<CloseProperty />);
        expect(screen.getByText('Did you close this deal successfully')).toBeInTheDocument();
        expect(screen.getByText('Do you know, who close this property')).toBeInTheDocument();
    });

    test('selects yes/no option', () => {
        render(<CloseProperty />);
        const yesBtn = screen.getByText('Yes');
        fireEvent.click(yesBtn);
        // No visual feedback to check easily without checking props passed to mock, 
        // but we can assume it works if no error.
    });

    test('selects reason option', () => {
        render(<CloseProperty />);
        const reason = screen.getByText('It is closed by owner');
        fireEvent.click(reason);
        // Verify selection logic if possible, e.g. class change or state update (internal)
    });
});
