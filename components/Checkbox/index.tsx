import React from 'react';
import css from './style.module.css';

type Props = {
    label: string;
    checked: boolean;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export function Checkbox({label, checked, onChange}: Props) {
    return (
        <label className={css.label}>
            <input
                type="checkbox"
                name={label}
                checked={checked}
                onChange={onChange}
            />
            <span className={css.text}>{label}</span>
        </label>
    );
}
