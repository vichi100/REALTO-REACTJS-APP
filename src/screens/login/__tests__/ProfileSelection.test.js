import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import ProfileSelection from '../ProfileSelection';

jest.mock('../../../components/RadioButtons', () => ({ options, onSelect, selectedOption }) => (
    <div>
        {options.map(opt => (
            <div
                key={opt.key}
                onClick={() => onSelect(opt)}
                data-testid={`radio-${opt.key}`}
                style={{ color: selectedOption?.key === opt.key ? 'blue' : 'black' }}
            >
                {opt.text}
            </div>
        ))}
    </div>
));

jest.mock('@rneui/themed', () => ({
    ButtonGroup: () => <div data-testid="button-group">Button Group</div>
}), { virtual: true });

const mockStore = (state) => ({
    getState: () => state,
    subscribe: () => { },
    dispatch: jest.fn(),
});

describe('ProfileSelection Component', () => {
    let store;

    beforeEach(() => {
        store = mockStore({
            AppReducer: {
                userMobileNumber: '9876543210',
                country: 'India',
                countryCode: '+91'
            }
        });
    });

    test('renders correctly', () => {
        render(
            <Provider store={store}>
                <ProfileSelection />
            </Provider>
        );

        expect(screen.getByText('Select Property Type')).toBeInTheDocument();
        expect(screen.getByText('Residential')).toBeInTheDocument();
        expect(screen.getByText('Commercial')).toBeInTheDocument();
    });

    test('selects property type', () => {
        render(
            <Provider store={store}>
                <ProfileSelection />
            </Provider>
        );

        const residentialOption = screen.getByTestId('radio-Residential');
        fireEvent.click(residentialOption);
        expect(residentialOption).toHaveStyle({ color: 'blue' });

        // Toggle off
        fireEvent.click(residentialOption);
        expect(residentialOption).toHaveStyle({ color: 'black' });
    });

    test('selects profile type', () => {
        render(
            <Provider store={store}>
                <ProfileSelection />
            </Provider>
        );

        const profileOption = screen.getByText('I am real estate agent and own real estate company');
        fireEvent.click(profileOption);

        // Check if style changes (background color becomes blue-ish)
        expect(profileOption).toHaveStyle({ backgroundColor: 'rgba(27, 106, 158, 0.85)' });
    });
});
