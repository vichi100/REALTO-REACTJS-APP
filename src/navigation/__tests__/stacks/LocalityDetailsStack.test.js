import '../setupTests';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import LocalityDetailsNav from '../../stacks/LocalityDetailsStack';

// Mock dependencies
jest.mock('../../../screens/property/LocalityDetailsForm', () => () => <div data-testid="locality-details">Locality Details</div>);

describe('LocalityDetailsNav', () => {
    test('renders LocalityDetails by default', () => {
        render(
            <MemoryRouter initialEntries={['/']}>
                <LocalityDetailsNav />
            </MemoryRouter>
        );
        expect(screen.getByTestId('locality-details')).toBeInTheDocument();
    });
});
