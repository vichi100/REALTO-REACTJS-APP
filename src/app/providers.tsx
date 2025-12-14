'use client';

import { Provider } from 'react-redux';
import configureStore from '../store';
import { useRef, ReactNode, useEffect } from 'react';

export default function Providers({ children }: { children: ReactNode }) {
    const storeRef = useRef<any>(null);
    if (!storeRef.current) {
        storeRef.current = configureStore();
    }

    useEffect(() => {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js').then(
                (registration) => {
                    console.log('Service Worker registration successful with scope: ', registration.scope);
                },
                (err) => {
                    console.log('Service Worker registration failed: ', err);
                }
            );
        }
    }, []);

    return <Provider store={storeRef.current}>{children}</Provider>;
}
