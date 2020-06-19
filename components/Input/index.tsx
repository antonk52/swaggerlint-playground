import React from 'react';

import css from './style.module.css';

type Props = {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
};

export const Input = ({value, onChange, placeholder}: Props) => (
    <input
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className={css.input}
    />
);
