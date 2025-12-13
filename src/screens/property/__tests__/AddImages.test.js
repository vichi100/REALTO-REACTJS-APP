import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import AddImages from '../AddImages';
import { mockUserDetails, mockPropertyDetails } from './mockData';

// Mock dependencies
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    useNavigate: () => mockNavigate,
}));

jest.mock('../../../components/Button', () => ({ title, onPress }) => (
    <button onClick={onPress}>{title}</button>
));

// Mock URL.createObjectURL
global.URL.createObjectURL = jest.fn(() => 'mock-url');

const initialState = {
    AppReducer: {
        userDetails: mockUserDetails,
        propertyType: 'Residential',
        propertyDetails: mockPropertyDetails,
    },
};

const mockReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_PROPERTY_DETAILS':
            return { ...state, AppReducer: { ...state.AppReducer, propertyDetails: action.payload } };
        default:
            return state;
    }
};

const store = createStore(mockReducer);

describe('AddImages Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders correctly', () => {
        render(
            <Provider store={store}>
                <AddImages />
            </Provider>
        );

        expect(screen.getByText('ADD PHOTOS')).toBeInTheDocument();
    });

    test('adds images', async () => {
        const { container } = render(
            <Provider store={store}>
                <AddImages />
            </Provider>
        );

        const fileInput = container.querySelector('input[type="file"]');
        const file = new File(['(⌐□_□)'], 'chucknorris.png', { type: 'image/png' });

        fireEvent.change(fileInput, { target: { files: [file] } });

        await waitFor(() => {
            expect(screen.getByAltText('Selected 0')).toBeInTheDocument();
        });
    });

    test('submits images and navigates', async () => {
        render(
            <Provider store={store}>
                <AddImages />
            </Provider>
        );

        const nextBtn = screen.getByText('NEXT');
        fireEvent.click(nextBtn);

        // Based on mockPropertyDetails (Residential, Rent)
        expect(mockNavigate).toHaveBeenCalledWith('/listing/Add/AddNewPropFinalDetails');
    });
});
