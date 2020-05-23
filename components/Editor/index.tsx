import React from 'react';
import {Editor as EditorT} from 'types';

import {Controlled} from 'react-codemirror2';

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
                    mode: 'json',
                    theme: 'base16-dark',
                    lineNumbers: true,
                    enableCodeFolding: true,
                }}
                onBeforeChange={(editor, __, value) => {
                    onChange(value);
                    setEditor(editor)
                }}
            />
        </div>
    )
}
