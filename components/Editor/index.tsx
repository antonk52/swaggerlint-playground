import React from 'react';
import {Editor as EditorT} from 'types';

import {Controlled} from 'react-codemirror2';
if (typeof window !== 'undefined') {
    require('codemirror/mode/javascript/javascript');
    require('codemirror/mode/yaml/yaml');
}

type Props = {
    value: string,
    onChange: (a: string) => void,
    setEditor: (a: EditorT) => void,
};

export function Editor({value, onChange, setEditor}: Props) {
    return (
        <div style={{maxWidth: '100vw'}}>
            <Controlled
                value={value}
                options={{
                    mode: {name: "javascript", json: true},
                    theme: 'tomorrow-night-eighties',
                    lineNumbers: true,
                }}
                onBeforeChange={(editor, __, value) => {
                    onChange(value);
                    setEditor(editor)
                }}
            />
        </div>
    )
}
