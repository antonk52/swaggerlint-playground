import React from 'react';
import css from './style.module.css';

export function Header({children}: {children: React.ReactNode}) {
    return (
        <header className={css.header}>
            <h1>Swaggerlint Playground</h1>
            {children}
        </header>
    );
}
