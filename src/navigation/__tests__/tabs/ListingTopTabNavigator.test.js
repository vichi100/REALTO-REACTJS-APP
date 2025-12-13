import '../setupTests';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ListingTopTab from '../../tabs/ListingTopTabNavigator';

// Mock dependencies
jest.mock('../../../screens/property/residential/ListingResidential', () => () => <div data-testid="listing-residential">Listing Residential</div>);
jest.mock('../../../screens/property/commercial/ListingCommercial', () => () => <div data-testid="listing-commercial">Listing Commercial</div>);

describe('ListingTopTab', () => {
    test('renders residential tab by default', () => {
        render(
            <MemoryRouter initialEntries={['/']}>
                <ListingTopTab />
            </MemoryRouter>
        );
        expect(screen.getByTestId('listing-residential')).toBeInTheDocument();
    });

    test('renders commercial tab when navigated', () => {
        render(
            <MemoryRouter initialEntries={['/commercial']}>
                <ListingTopTab />
            </MemoryRouter>
        );
        expect(screen.getByTestId('listing-commercial')).toBeInTheDocument();
    });
});
