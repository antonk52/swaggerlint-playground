import {LintError, SwaggerlintConfig} from 'swaggerlint';

export type Config = Required<SwaggerlintConfig> & {
    ignore: Required<SwaggerlintConfig["ignore"]>
};

type Coord = {
    col: number,
    line: number,
};
export type LintErrorWithCoords = LintError & {start: Coord, end: Coord};

export type Result = null | LintErrorWithCoords[];
