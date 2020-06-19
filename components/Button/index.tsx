import React from 'react';

import css from './style.module.css';

type Props = {
    children: React.ReactNode;
    className?: string;
    disabled?: boolean;
    onClick: () => void;
    type?: 'button' | 'submit';
    size?: 'sm' | 'md' | 'lg';
};

export const Button = ({
    children,
    className = '',
    disabled = false,
    onClick,
    type = 'button',
    size = 'md',
}: Props) => (
    <button
        className={[css.btn, css[`size_${size}`], className]
            .filter(Boolean)
            .join(' ')}
        disabled={disabled}
        onClick={onClick}
        type={type}
    >
        {children}
    </button>
);
