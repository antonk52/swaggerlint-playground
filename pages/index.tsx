import React from 'react';
import {PrintResult} from 'components/PrintResult';
import {ConfigDialog} from 'components/ConfigDialog';
import {swaggerlint} from 'swaggerlint';
import {Editor} from 'components/Editor';
import jsonToAst from 'json-to-ast';
import {prettify, defaultConfig} from 'utils';
import {Result, Config, Mark} from 'types';
import AceEditor from 'react-ace';

type State = {
    swaggerRaw: string;
    isValid: boolean;
    result: Result;
    config: Config;
    currentMark: Mark;
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
        };

        this.editor = React.createRef();
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
        if (!this.editor.current) return;

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

        const loc = node.loc as jsonToAst.Location;

        const desiredLine = loc.start.line - 5;
        const targetLine = desiredLine > 0 ? desiredLine : loc.start.line;

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
                    startRow: loc.start.line - 1,
                    startCol: loc.start.column - 1,
                    endRow: loc.end.line - 1,
                    endCol: loc.end.column - 1,
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
        this.setState((oldState) => ({
            ...oldState,
            swaggerRaw: raw,
            currentMark: [],
        }));

        this.onValidateAttempt(raw, this.state.config);
    };
    onPrettify = () => {
        this.onChange(prettify(this.state.swaggerRaw));
    };

    render() {
        const {swaggerRaw, isValid, result, config, currentMark} = this.state;

        return (
            <div>
                <ConfigDialog config={config} onChange={this.onConfigChange} />
                <Editor
                    value={swaggerRaw}
                    onChange={this.onChange}
                    errors={result === null ? [] : result}
                    $ref={this.editor}
                    mark={currentMark}
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
