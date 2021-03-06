import React from 'react';
import {PrintResult} from 'components/PrintResult';
import {ConfigDialog} from 'components/ConfigDialog';
import {Header} from 'components/Header';
import {swaggerlint} from 'swaggerlint';
import {Editor} from 'components/Editor';
import jsonToAst from 'json-to-ast';
import {prettify, defaultConfig, KEY_POINTING_ERRORS} from 'utils';
import {Result, Config, Mark, Format, Coord} from 'types';
import AceEditor from 'react-ace';
import {safeLoad as yamlParser} from 'js-yaml';
import {
    safeLoad as yamlAstParser,
    YAMLNode,
    YAMLSequence,
} from 'yaml-ast-parser';

type State = {
    swaggerRaw: string;
    isValid: boolean;
    isPrettierable: boolean;
    result: Result;
    config: Config;
    currentMark: Mark;
    format: Format;
};

function isYamlSequence(node: YAMLNode): node is YAMLSequence {
    return 'items' in node;
}

export default class SwaggerlintPlayground extends React.Component<{}, State> {
    editor: React.RefObject<AceEditor>;
    constructor(props: {}) {
        super(props);

        this.state = {
            swaggerRaw: '',
            isValid: false,
            isPrettierable: false,
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
                const node = lintError.location.reduce((acc, key, index) => {
                    if (acc.type === 'Object') {
                        const isLast = index === lintError.location.length - 1;
                        const propName =
                            isLast && KEY_POINTING_ERRORS.has(lintError.name)
                                ? 'key'
                                : 'value';
                        return acc.children.find(
                            (el) => el.key.value === key,
                        )?.[propName];
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

                return {
                    ...lintError,
                    start: {
                        line: loc.start.line,
                        col: loc.start.column,
                    },
                    end: {
                        line: loc.end.line,
                        col: loc.end.column,
                    },
                };
            });

            requestAnimationFrame(() =>
                this.setState((state) => ({...state, result})),
            );
        } else {
            const parsed = yamlAstParser(raw, {});

            const result = errs.map((lintError) => {
                const loc = lintError.location.reduce((acc, el, index) => {
                    if ('mappings' in acc) {
                        const map = acc.mappings.find(
                            (x: YAMLNode) => x.key.value === el,
                        );

                        const isLast = index === lintError.location.length - 1;
                        const propName =
                            isLast && KEY_POINTING_ERRORS.has(lintError.name)
                                ? 'key'
                                : 'value';

                        return map[propName];
                    }
                    if (isYamlSequence(acc)) {
                        return acc.items[Number(el)];
                    }

                    return acc;
                }, parsed);

                if (loc === undefined) {
                    return {
                        ...lintError,
                        start: {
                            line: 0,
                            col: 0,
                        },
                        end: {
                            line: 0,
                            col: 0,
                        },
                    };
                }

                // string from schema beginning to error end
                const subRaw = raw
                    .slice(0, loc.endPosition)
                    .trimEnd()
                    .replace(/\\n$/, '');
                console.log({lintError, loc, subRaw});
                const lines = subRaw.split('\n');

                let lineIndex = lines.length - 1;
                let startRow = 1;
                let diff = subRaw.length - 1 - loc.startPosition;
                while (lineIndex) {
                    const lineLength = lines[lineIndex].length;
                    if (lineLength > diff) {
                        startRow = lineLength - diff;
                        break;
                    } else {
                        diff -= lineLength + 1;
                    }
                    lineIndex--;
                }

                return {
                    ...lintError,
                    start: {
                        line: lineIndex + 1,
                        col: startRow,
                    },
                    end: {
                        line: lines.length,
                        col: lines[lines.length - 1].length + 1,
                    },
                };
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
                    isPrettierable: true,
                    swaggerRaw: raw,
                    config: config,
                }));

                this.onValidChange(parsed, raw);
            } catch (e) {
                this.setState((oldState) => ({
                    ...oldState,
                    isValid: false,
                    isPrettierable: false,
                    result: null,
                    swaggerRaw: raw,
                    config: config,
                }));
            }
            return;
        }

        try {
            const parsed = yamlParser(raw);
            this.setState((oldState) => ({
                ...oldState,
                isValid: true,
                isPrettierable: false,
                swaggerRaw: raw,
                config: config,
            }));

            this.onValidChange(parsed, raw);
        } catch (e) {
            this.setState((oldState) => ({
                ...oldState,
                isValid: false,
                isPrettierable: false,
                result: null,
                swaggerRaw: raw,
                config: config,
            }));
        }
    };

    onErrorClick = (start: Coord, end: Coord) => {
        if (!this.editor.current) return;

        const desiredLine = start.line - 5;
        const targetLine = desiredLine > 0 ? desiredLine : start.line;

        this.editor.current.editor.scrollToLine(
            targetLine,
            false,
            false, // TODO: what's up with the animations??
            () => {},
        );

        /**
         * This may seem rather odd
         * We need to forcefully previous marks, for the dom nodes to be removed
         * before adding new ones in order to have the `fadein` animation effect
         */
        this.setState(
            (state) => ({
                ...state,
                currentMark: [],
            }),
            () =>
                requestAnimationFrame(() =>
                    this.setState((state) => ({
                        ...state,
                        currentMark: [
                            {
                                startCol: start.col - 1,
                                endCol: end.col - 1,
                                startRow: start.line - 1,
                                endRow: end.line - 1,
                                className: 'highlighed-error-cause',
                                type: 'text',
                                inFront: true,
                            },
                        ],
                    })),
                ),
        );
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
            isPrettierable,
            result,
            config,
            currentMark,
            format,
        } = this.state;

        return (
            <div className="playground-wrapper">
                <Header>
                    <ConfigDialog
                        config={config}
                        onChange={this.onConfigChange}
                    />
                </Header>
                <Editor
                    $ref={this.editor}
                    errors={result === null ? [] : result}
                    format={format}
                    isPrettierable={isPrettierable}
                    mark={currentMark}
                    onChange={this.onChange}
                    onPrettify={this.onPrettify}
                    value={swaggerRaw}
                />
                <PrintResult result={result} onErrorClick={this.onErrorClick} />
            </div>
        );
    }
}
