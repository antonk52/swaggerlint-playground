import React from 'react';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-json';
import 'ace-builds/src-noconflict/mode-yaml';
import 'ace-builds/src-noconflict/theme-tomorrow_night_eighties';

import css from './style.module.css';

import {Ace} from 'ace-builds';

import {LintErrorWithCoords, Mark, Format} from 'types';

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
    format: Format;
};

export function Editor({value, onChange, errors, mark, $ref, format}: Props) {
    return (
        <div className={css.editorWrapper}>
            <AceEditor
                width="100%"
                height="100%"
                mode={format}
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
