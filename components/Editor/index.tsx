import React from 'react';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-json';
import 'ace-builds/src-noconflict/theme-tomorrow_night_eighties';

import {Ace} from 'ace-builds';

import {LintErrorWithCoords, Mark} from 'types';

function errToAnnotaion(lintError: LintErrorWithCoords): Ace.Annotation {
    const {start, msg} = lintError;
    return {
        row: start.line - 1,
        column: start.col,
        type: 'error',
        text: msg,
    };
}

type Props = {
    value: string;
    onChange: (a: string) => void;
    errors: LintErrorWithCoords[];
    $ref: React.Ref<AceEditor>;
    mark: Mark;
};

export function Editor({value, onChange, errors, mark, $ref}: Props) {
    return (
        <div style={{maxWidth: '100vw', display: 'flex'}}>
            <AceEditor
                mode="json"
                theme="tomorrow_night_eighties"
                value={value}
                onChange={onChange}
                annotations={
                    Array.isArray(errors) ? errors.map(errToAnnotaion) : []
                }
                ref={$ref}
                markers={mark}
            />
        </div>
    );
}
