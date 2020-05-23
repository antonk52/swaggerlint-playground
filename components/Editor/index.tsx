import React from 'react';

import {Controlled as CodeMirror} from 'react-codemirror2';

type Props = {
    value: string,
    onChange: (a: string) => void,
};

export function Editor({value, onChange}: Props) {
    return (
        <div style={{maxWidth: '100vw'}}>
            <CodeMirror
                value={value}
                options={{
                    mode: 'json',
                    theme: 'base16-dark',
                    lineNumbers: true,
                }}
                onBeforeChange={(_, __, value) => {
                    onChange(value);
                }}
            />
        </div>
    )
}
