import React from 'react';
import { Outlet } from 'react-router-dom';
import { RouteTracker } from '@/components/RouteTracker';

export function RootLayout() {
    return (
        <>
            <RouteTracker />
            <Outlet />
        </>
    );
}
