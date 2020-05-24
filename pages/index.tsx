import React from 'react';
import {PrintResult} from 'components/PrintResult';
import {ConfigDialog} from 'components/ConfigDialog';
import {swaggerlint} from 'swaggerlint';
import {Editor} from 'components/Editor';
import jsonToAst from 'json-to-ast';
import {prettify, defaultConfig} from 'utils';
import {Result, Config} from 'types';

export default () => {
    const [swaggerRaw, setSwaggerRaw] = React.useState('');
    const [isValid, setIsValid] = React.useState(false);
    const [result, setResult] = React.useState<Result>(null);
    const [config, setConfig] = React.useState(defaultConfig);
    const onValidChange = (parsed: object, raw: string): void => {
        const errs = swaggerlint(parsed, config);
        const ast = jsonToAst(raw, {loc: true});
        const result: Result = errs.map(lintError => {
            const node = lintError.location.reduce((acc, key) => {
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

            const loc = node.loc as jsonToAst.Location;
            const coords = {
                start: {
                    line: loc.start.line,
                    col: loc.start.column,
                },
                end: {
                    line: loc.end.line,
                    col: loc.end.column,
                },
            }

            return Object.assign(lintError, coords);
        })

        requestAnimationFrame(() => setResult(result));
    };

    const onChange = (raw: string): void => {
        setSwaggerRaw(raw);

        try {
            const parsed = JSON.parse(raw);
            setIsValid(true);
            onValidChange(parsed, raw);
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
            onValidChange(parsed, swaggerRaw);
        } catch (e) {
            setIsValid(false);
            setResult(null);
        }
    };

    const onPrettify = () => {
        onChange(prettify(swaggerRaw));
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

        /**
         * TODO: scroll to the node position
         */
        node;
    };

    return (
        <div>
            <ConfigDialog config={config} onChange={onConfigChange} />
            <Editor
                value={swaggerRaw}
                onChange={onChange}
                errors={result === null ? [] : result}
            />
            <button onClick={onPrettify} disabled={!isValid}>
                🍬
            </button>
            {isValid ? '✅' : '❌'}
            <PrintResult result={result} onErrorClick={onErrorClick} />
        </div>
    );
};
