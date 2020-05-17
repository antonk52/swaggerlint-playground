import React from 'react';

type Props = {
    value: string;
    onChange: (event: string) => void;
};

export const Textarea = ({value, onChange}: Props) => (
    <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        style={{minHeight: '400px', minWidth: '70vw'}}
    />
);
