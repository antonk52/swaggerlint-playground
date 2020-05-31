import {LintError, SwaggerlintConfig} from 'swaggerlint';
import {IMarker} from 'react-ace';

export type Format = 'json' | 'yaml';

export type Config = Required<SwaggerlintConfig> & {
    ignore: Required<SwaggerlintConfig['ignore']>;
};

type Coord = {
    col: number;
    line: number;
};
export type LintErrorWithCoords = LintError & {start: Coord; end: Coord};

export type Result = null | LintErrorWithCoords[];
export type Mark = [] | [IMarker];
