import React from 'react';

import css from './style.module.css';

type Props = {
    value: string;
    onChange: (value: string) => void;
};

export const Input = ({value, onChange}: Props) => (
    <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={css.input}
    />
);
