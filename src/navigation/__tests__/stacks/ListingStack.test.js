import '../setupTests';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ListingStack from '../../stacks/ListingStack';

// Mock dependencies
jest.mock('../../tabs/ListingTopTabNavigator', () => () => <div data-testid="listing-top-tab">Listing Top Tab</div>);
jest.mock('../../../components/ScreenWrapper', () => ({ Component }) => <Component />);

describe('ListingStack', () => {
    test('renders ListingTopTab by default', () => {
        render(
            <MemoryRouter initialEntries={['/']}>
                <ListingStack />
            </MemoryRouter>
        );
        expect(screen.getByTestId('listing-top-tab')).toBeInTheDocument();
    });
});
