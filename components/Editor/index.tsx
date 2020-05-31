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
    $ref: React.Ref<AceEditor>;
    errors: LintErrorWithCoords[];
    format: Format;
    isValid: boolean;
    mark: Mark;
    onChange: (a: string) => void;
    onPrettify: () => void;
    value: string;
};

export function Editor({
    $ref,
    errors,
    format,
    isValid,
    mark,
    onChange,
    onPrettify,
    value,
}: Props) {
    return (
        <div className={css.editorWrapper}>
            <button
                onClick={onPrettify}
                disabled={!isValid}
                className={css.prettify}
            >
                prettify
            </button>
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
