import React from 'react';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-json';
import 'ace-builds/src-noconflict/mode-yaml';
import 'ace-builds/src-noconflict/theme-tomorrow_night_eighties';

import Dropzone from 'react-dropzone';

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
    const onDrop = ([file]: File[]): void => {
        if (!file)
            return alert(
                'Please add a single file with your Swagger schema. Only JSON and YAML formats are supported',
            );
        const reader = new FileReader();

        reader.onloadend = () => {
            const spec = reader.result;

            onChange(String(spec));
        };

        reader.readAsText(file, 'utf-8');
    };

    return (
        <Dropzone
            onDrop={onDrop}
            multiple={false}
            noClick
            accept={['application/json', '.yaml', '.yml']}
        >
            {({getRootProps, getInputProps, isDragActive}) => (
                <div
                    {...getRootProps()}
                    className={[
                        css.editorWrapper,
                        css.dropzone,
                        isDragActive ? css.dropzoneOverlayed : '',
                    ].join(' ')}
                >
                    <button
                        onClick={onPrettify}
                        disabled={!isValid}
                        className={css.prettify}
                    >
                        prettify
                    </button>
                    <input {...getInputProps()} />

                    <AceEditor
                        placeholder="Paste or drop a file with your schema here"
                        width="100%"
                        height="100%"
                        mode={format}
                        theme="tomorrow_night_eighties"
                        value={value}
                        onChange={onChange}
                        annotations={
                            Array.isArray(errors)
                                ? errors.map(errToAnnotaion)
                                : []
                        }
                        ref={$ref}
                        markers={mark}
                    />
                </div>
            )}
        </Dropzone>
    );
}
