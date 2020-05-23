import React from 'react';
import {PrintResult} from 'components/PrintResult';
import {ConfigDialog} from 'components/ConfigDialog';
import {swaggerlint} from 'swaggerlint';
import {Editor} from 'components/Editor';
import jsonToAst from 'json-to-ast';
import {prettify, defaultConfig} from 'utils';
import {Result, Config, Editor as EditorT} from 'types';

export default () => {
    const [swaggerRaw, setSwaggerRaw] = React.useState('');
    const [isValid, setIsValid] = React.useState(false);
    const [result, setResult] = React.useState<Result>(null);
    const [config, setConfig] = React.useState(defaultConfig);
    const [editorInstance, setEditorInstance] = React.useState<EditorT | null>(null);
    const onChange = (raw: string): void => {
        setSwaggerRaw(raw);

        try {
            const parsed = JSON.parse(raw);
            setIsValid(true);
            setResult(swaggerlint(parsed, config));
        } catch (e) {
            setIsValid(false);
            setResult(null);
        }
    };

    const onConfigChange = (config: Config): void => {
        setConfig(config);
        try {
            const parsed = JSON.parse(swaggerRaw);
            setIsValid(true);
            setResult(swaggerlint(parsed, config));
        } catch (e) {
            setIsValid(false);
            setResult(null);
        }
    };

    const onPrettify = () => {
        setSwaggerRaw(prettify(swaggerRaw));
    };

    const onErrorClick = (location: string[]) => {
        /**
         * + parse json to ast
         * + find location of the error cause
         * - highlight it in the editor
         */
        const ast = jsonToAst(swaggerRaw, {loc: true});
        const node = location.reduce((acc, key) => {
            if (acc.type === 'Object') {
                return acc.children.find((el) => el.key.value === key)?.value;
            }

            if (acc.type === 'Array') {
                // @ts-expect-error
                return acc.children[key];
            }

            throw new Error(
                `Cannot retrieve ast node from node type "${acc.type}" with key "${key}"`,
            );
        }, ast);
        if (editorInstance) {
            if (node.loc === undefined) return;
            const start = {
                line: node.loc.start.line -1,
                ch: node.loc.start.column -1,
            };
            editorInstance.markText(
                start,
                {
                    line: node.loc.end.line -1,
                    ch: node.loc.end.column,
                },
                {
                    className: 'sample-text-highlight',
                    css: 'color: black; background: yellow;',
                }
            )

            editorInstance.scrollIntoView(start);

        }
    };

    return (
        <div>
            <ConfigDialog config={config} onChange={onConfigChange} />
            <Editor value={swaggerRaw} onChange={onChange} setEditor={setEditorInstance} />
            <button onClick={onPrettify} disabled={!isValid}>
                🍬
            </button>
            {isValid ? '✅' : '❌'}
            <PrintResult result={result} onErrorClick={onErrorClick} />
        </div>
    );
};
