import React from 'react';
import {PrintResult} from 'components/PrintResult';
import {ConfigDialog} from 'components/ConfigDialog';
import {swaggerlint} from 'swaggerlint';
import {Editor} from 'components/Editor';
import jsonToAst from 'json-to-ast';
import {prettify, defaultConfig} from 'utils';
import {Result, Config, Mark, Format} from 'types';
import AceEditor from 'react-ace';
import yaml from 'js-yaml';
// @ts-expect-error
import yamlToAst, {loc as locSymbol} from 'pseudo-yaml-ast';

type State = {
    swaggerRaw: string;
    isValid: boolean;
    result: Result;
    config: Config;
    currentMark: Mark;
    format: Format;
};

export default class SwaggerlintPlayground extends React.Component<{}, State> {
    editor: React.RefObject<AceEditor>;
    constructor(props: {}) {
        super(props);

        this.state = {
            swaggerRaw: '',
            isValid: false,
            result: null,
            config: defaultConfig,
            currentMark: [],
            format: 'yaml',
        };

        this.editor = React.createRef();
    }

    onValidChange = (parsed: object, raw: string): void => {
        const errs = swaggerlint(parsed, this.state.config);
        if (this.state.format === 'json') {
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
        } else {
            const ast = yamlToAst(raw);
            const result: Result = errs.map((lintError) => {
                const {location} = lintError;

                const coords = location.reduce((acc, key) => {
                    return acc[key];
                }, ast)[locSymbol];
                return Object.assign(lintError, {
                    start: {
                        line: coords.start.line,
                        col: coords.start.column,
                    },
                    end: {
                        line: coords.end.line,
                        col: coords.end.column,
                    },
                });
            });

            requestAnimationFrame(() =>
                this.setState((state) => ({...state, result})),
            );
        }
    };

    onValidateAttempt = (raw: string, config: Config) => {
        const {format} = this.state;
        if (format === 'json') {
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
            return;
        }

        try {
            const parsed = yaml.safeLoad(raw);
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
        if (!this.editor.current) return;

        let targetLine = 0;
        const coords = {
            startRow: 0,
            startCol: 0,
            endRow: 0,
            endCol: 0,
        };

        if (this.state.format === 'json') {
            const ast = jsonToAst(this.state.swaggerRaw, {loc: true});
            const node = location.reduce((acc, key) => {
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

            const desiredLine = loc.start.line - 5;
            targetLine = desiredLine > 0 ? desiredLine : loc.start.line;

            Object.assign(coords, {
                startRow: loc.start.line - 1,
                startCol: loc.start.column - 1,
                endRow: loc.end.line - 1,
                endCol: loc.end.column - 1,
            });
        } else {
            const ast = yamlToAst(this.state.swaggerRaw);
            const node = location.reduce((acc, key) => acc[key], ast);

            const loc = node[locSymbol];

            const desiredLine = loc.start.line - 5;
            targetLine = desiredLine > 0 ? desiredLine : loc.start.line;
            Object.assign(coords, {
                startRow: loc.start.line - 1,
                startCol: loc.start.column,
                endRow: loc.end.line - 1,
                endCol: loc.end.column,
            });
        }

        this.editor.current.editor.scrollToLine(
            targetLine,
            false,
            false, // TODO: what's up with the animations??
            () => {},
        );

        this.setState((state) => ({
            ...state,
            currentMark: [
                {
                    ...coords,
                    className: 'highlighed-error-cause',
                    type: 'text',
                },
            ],
        }));
    };

    onConfigChange = (config: Config): void => {
        this.setState((oldState) => ({
            ...oldState,
            config,
            currentMark: [],
        }));
        this.onValidateAttempt(this.state.swaggerRaw, config);
    };

    onChange = (raw: string): void => {
        const format: Format = raw.trimStart().startsWith('{')
            ? 'json'
            : 'yaml';
        this.setState((oldState) => ({
            ...oldState,
            swaggerRaw: raw,
            currentMark: [],
            format,
        }));

        this.onValidateAttempt(raw, this.state.config);
    };
    onPrettify = () => {
        this.onChange(prettify(this.state.swaggerRaw, this.state.format));
    };

    render() {
        const {
            swaggerRaw,
            isValid,
            result,
            config,
            currentMark,
            format,
        } = this.state;

        return (
            <div>
                <ConfigDialog config={config} onChange={this.onConfigChange} />
                <Editor
                    value={swaggerRaw}
                    onChange={this.onChange}
                    errors={result === null ? [] : result}
                    $ref={this.editor}
                    mark={currentMark}
                    format={format}
                />
                <button onClick={this.onPrettify} disabled={!isValid}>
                    prettify
                </button>
                {isValid ? '✅' : '❌'}
                <p>format: "{this.state.format}"</p>
                <PrintResult result={result} onErrorClick={this.onErrorClick} />
            </div>
        );
    }
}
