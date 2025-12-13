import '../setupTests';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AddNewPropertyStack from '../../stacks/AddPropertyStack';

// Mock dependencies
jest.mock('../../../screens/property/AddNewProperty', () => () => <div data-testid="add-new-property">Add New Property</div>);
jest.mock('../../../components/ScreenWrapper', () => ({ Component }) => <Component />);

describe('AddNewPropertyStack', () => {
    test('renders AddNewProperty by default', () => {
        render(
            <MemoryRouter initialEntries={['/']}>
                <AddNewPropertyStack />
            </MemoryRouter>
        );
        expect(screen.getByTestId('add-new-property')).toBeInTheDocument();
    });
});
