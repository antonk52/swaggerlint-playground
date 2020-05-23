import {LintError, SwaggerlintConfig} from 'swaggerlint';
import codemirror from 'codemirror';

export type Result = null | LintError[];

export type Config = Required<SwaggerlintConfig> & {
    ignore: Required<SwaggerlintConfig["ignore"]>
};

export type Editor = codemirror.Editor;
