import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import Home from '../Home';
import { mockUserDetails, mockSuspendedUserDetails, mockListingSummary } from './mockData.util';
import axios from 'axios';
import { SERVER_URL } from '../../../utils/Constant';

// Mock dependencies
jest.mock('axios');

const mockStore = configureStore([]);

describe('Home Component', () => {
    let store;

    beforeEach(() => {
        store = mockStore({
            AppReducer: {
                userDetails: mockUserDetails
            }
        });
        axios.mockResolvedValue({ data: mockListingSummary });
        Storage.prototype.getItem = jest.fn();
        Storage.prototype.setItem = jest.fn();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('renders loading state initially', () => {
        render(
            <Provider store={store}>
                <Home />
            </Provider>
        );

        expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    test('fetches and displays listing summary', async () => {
        render(
            <Provider store={store}>
                <Home />
            </Provider>
        );

        await waitFor(() => {
            expect(axios).toHaveBeenCalledWith(SERVER_URL + '/getTotalListingSummary', expect.objectContaining({
                method: 'post',
                data: expect.objectContaining({
                    req_user_id: mockUserDetails.works_for,
                    agent_id: mockUserDetails.id
                })
            }));
        });

        await waitFor(() => {
            expect(screen.getByText('Residential Listing Summary')).toBeInTheDocument();
            expect(screen.getByText('Commercial Listing Summary')).toBeInTheDocument();
        });
    });

    test('displays correct counts for residential properties', async () => {
        render(
            <Provider store={store}>
                <Home />
            </Provider>
        );

        await waitFor(() => {
            expect(screen.getByText(mockListingSummary.residentialPropertyRentCount.toString())).toBeInTheDocument();
            expect(screen.getByText(mockListingSummary.residentialPropertySellCount.toString())).toBeInTheDocument();
        });
    });

    test('displays correct counts for commercial properties', async () => {
        render(
            <Provider store={store}>
                <Home />
            </Provider>
        );

        await waitFor(() => {
            expect(screen.getByText(mockListingSummary.commercialPropertyRentCount.toString())).toBeInTheDocument();
            expect(screen.getByText(mockListingSummary.commercialPropertySellCount.toString())).toBeInTheDocument();
        });
    });

    test('shows reactivation modal for suspended account', async () => {
        store = mockStore({
            AppReducer: {
                userDetails: mockSuspendedUserDetails
            }
        });

        render(
            <Provider store={store}>
                <Home />
            </Provider>
        );

        await waitFor(() => {
            expect(screen.getByText(/Your account is in suspend mode/i)).toBeInTheDocument();
        });
    });

    test('handles account reactivation', async () => {
        store = mockStore({
            AppReducer: {
                userDetails: mockSuspendedUserDetails
            }
        });

        axios.mockResolvedValueOnce({ data: mockListingSummary })
            .mockResolvedValueOnce({ data: 'success' });

        render(
            <Provider store={store}>
                <Home />
            </Provider>
        );

        await waitFor(() => {
            expect(screen.getByText(/Your account is in suspend mode/i)).toBeInTheDocument();
        });

        const yesButton = screen.getByText('Yes');
        fireEvent.click(yesButton);

        await waitFor(() => {
            expect(axios).toHaveBeenCalledWith(SERVER_URL + '/reactivateAccount', expect.objectContaining({
                method: 'post',
                data: expect.objectContaining({
                    req_user_id: mockSuspendedUserDetails.works_for,
                    agent_id: mockSuspendedUserDetails.id
                })
            }));
        });
    });

    test('handles null userDetails gracefully', () => {
        store = mockStore({
            AppReducer: {
                userDetails: null
            }
        });

        render(
            <Provider store={store}>
                <Home />
            </Provider>
        );

        // Should not crash and should not show loading
        expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });

    test('handles API error gracefully', async () => {
        axios.mockRejectedValueOnce(new Error('API Error'));

        render(
            <Provider store={store}>
                <Home />
            </Provider>
        );

        await waitFor(() => {
            expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
        });
    });
});
