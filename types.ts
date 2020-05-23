import {LintError, SwaggerlintConfig} from 'swaggerlint';

export type Result = null | LintError[];

export type Config = Required<SwaggerlintConfig> & {
    ignore: Required<SwaggerlintConfig["ignore"]>
};
