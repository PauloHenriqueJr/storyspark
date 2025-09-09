import React from 'react';

export function RouteErrorBoundary() {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                <h2 className="text-2xl font-bold text-destructive mb-2">Oops!</h2>
                <p className="text-muted-foreground">
                    Algo deu errado ao carregar esta página.
                </p>
            </div>
        </div>
    );
}
