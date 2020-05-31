import React from 'react';
import css from './style.module.css';

import {version} from 'swaggerlint/package.json';

export function Header({children}: {children: React.ReactNode}) {
    return (
        <header className={css.header}>
            <div className={css.star}>
                <h1 className={css.name}>Swaggerlint</h1>
                <span className={css.version}>v{version}</span>
            </div>
            {children}
        </header>
    );
}
