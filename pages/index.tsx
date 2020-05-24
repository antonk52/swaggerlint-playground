import React from 'react';
import {PrintResult} from 'components/PrintResult';
import {ConfigDialog} from 'components/ConfigDialog';
import {swaggerlint} from 'swaggerlint';
import {Editor} from 'components/Editor';
import jsonToAst from 'json-to-ast';
import {prettify, defaultConfig} from 'utils';
import {Result, Config} from 'types';

type State = {
    swaggerRaw: string;
    isValid: boolean;
    result: Result;
    config: Config;
};

export default class SwaggerlintPlayground extends React.Component<{}, State> {
    constructor(props: {}) {
        super(props);

        this.state = {
            swaggerRaw: '',
            isValid: false,
            result: null,
            config: defaultConfig,
        };
    }

    onValidChange = (parsed: object, raw: string): void => {
        const errs = swaggerlint(parsed, this.state.config);
        const ast = jsonToAst(raw, {loc: true});
        const result: Result = errs.map((lintError) => {
            const node = lintError.location.reduce((acc, key) => {
                if (acc.type === 'Object') {
                    return acc.children.find((el) => el.key.value === key)
                        ?.value;
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
            };

            return Object.assign(lintError, coords);
        });

        requestAnimationFrame(() =>
            this.setState((state) => ({...state, result})),
        );
    };

    onValidateAttempt = (raw: string, config: Config) => {
        try {
            const parsed = JSON.parse(raw);
            this.setState((oldState) => ({
                ...oldState,
                isValid: true,
                swaggerRaw: raw,
                config: config,
            }));

            this.onValidChange(parsed, raw);
        } catch (e) {
            this.setState((oldState) => ({
                ...oldState,
                isValid: false,
                result: null,
                swaggerRaw: raw,
                config: config,
            }));
        }
    };

    onErrorClick = (location: string[]) => {
        /**
         * + parse json to ast
         * + find location of the error cause
         * - highlight it in the editor
         */
        const ast = jsonToAst(this.state.swaggerRaw, {loc: true});
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

    onConfigChange = (config: Config): void => {
        this.setState((oldState) => ({
            ...oldState,
            config,
        }));
        this.onValidateAttempt(this.state.swaggerRaw, config);
    };

    onChange = (raw: string): void => {
        this.setState((oldState) => ({...oldState, swaggerRaw: raw}));

        this.onValidateAttempt(raw, this.state.config);
    };
    onPrettify = () => {
        this.onChange(prettify(this.state.swaggerRaw));
    };

    render() {
        const {swaggerRaw, isValid, result, config} = this.state;

        return (
            <div>
                <ConfigDialog config={config} onChange={this.onConfigChange} />
                <Editor
                    value={swaggerRaw}
                    onChange={this.onChange}
                    errors={result === null ? [] : result}
                />
                <button onClick={this.onPrettify} disabled={!isValid}>
                    prettify
                </button>
                {isValid ? '✅' : '❌'}
                <PrintResult result={result} onErrorClick={this.onErrorClick} />
            </div>
        );
    }
}
