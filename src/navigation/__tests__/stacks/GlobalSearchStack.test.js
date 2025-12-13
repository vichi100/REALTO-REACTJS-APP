import '../setupTests';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import GlobalSearchStackNav from '../../stacks/GlobalSearchStack';

// Mock dependencies
jest.mock('../../../screens/search/GlobalSearch', () => () => <div data-testid="global-search">Global Search</div>);
jest.mock('../../../components/ScreenWrapper', () => ({ Component }) => <Component />);

describe('GlobalSearchStackNav', () => {
    test('renders GlobalSearch by default', () => {
        render(
            <MemoryRouter initialEntries={['/']}>
                <GlobalSearchStackNav />
            </MemoryRouter>
        );
        expect(screen.getByTestId('global-search')).toBeInTheDocument();
    });
});
