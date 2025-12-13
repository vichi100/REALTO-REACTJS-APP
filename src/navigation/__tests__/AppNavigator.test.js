import './setupTests';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import AppNavigator from '../main/AppNavigator';
import { mockUserDetails } from './mockData.util';

// Mock dependencies
jest.mock('../../screens/login/Login', () => () => <div data-testid="login-screen">Login Screen</div>);
jest.mock('../../screens/login/OtpScreen', () => () => <div data-testid="otp-screen">Otp Screen</div>);
jest.mock('../../screens/profile/ProfileForm', () => () => <div data-testid="profile-form">Profile Form</div>);
jest.mock('../tabs/BottomTabNavigator', () => () => <div data-testid="bottom-tab-screen">Bottom Tab Screen</div>);

jest.mock('react-router-dom', () => {
    const originalModule = jest.requireActual('react-router-dom');
    return {
        ...originalModule,
        BrowserRouter: ({ children }) => <div>{children}</div>,
    };
});

const mockStore = configureStore([]);

describe('AppNavigator', () => {
    let store;

    beforeEach(() => {
        store = mockStore({
            AppReducer: {
                userDetails: null
            }
        });
    });

    test('renders Login screen when userDetails is null', () => {
        render(
            <Provider store={store}>
                <MemoryRouter initialEntries={['/']}>
                    <AppNavigator />
                </MemoryRouter>
            </Provider>
        );

        expect(screen.getByTestId('login-screen')).toBeInTheDocument();
    });

    test('renders BottomTabScreen when userDetails is present and route is not login', () => {
        store = mockStore({
            AppReducer: {
                userDetails: mockUserDetails
            }
        });

        render(
            <Provider store={store}>
                <MemoryRouter initialEntries={['/dashboard']}>
                    <AppNavigator />
                </MemoryRouter>
            </Provider>
        );

        expect(screen.getByTestId('bottom-tab-screen')).toBeInTheDocument();
    });
});
