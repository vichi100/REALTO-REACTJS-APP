'use client';

import { Provider } from 'react-redux';
import configureStore from '../store';
import { useRef, ReactNode } from 'react';

export default function Providers({ children }: { children: ReactNode }) {
    const storeRef = useRef<any>(null);
    if (!storeRef.current) {
        storeRef.current = configureStore();
    }

    return <Provider store={storeRef.current}>{children}</Provider>;
}
