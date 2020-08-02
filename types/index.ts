import {LintError, SwaggerlintConfig, ConfigIgnore} from 'swaggerlint';
import {IMarker} from 'react-ace';

export type Format = 'json' | 'yaml';

interface Ignore extends Required<ConfigIgnore> {
    components: {
        schemas: string[];
        responses: string[];
        parameters: string[];
        examples: string[];
        requestBodies: string[];
        headers: string[];
        securitySchemes: string[];
        links: string[];
        callbacks: string[];
    };
}

export type OpenAPIComponentsKeys = keyof Ignore['components'];

export interface Config extends Required<SwaggerlintConfig> {
    ignore: Ignore;
}

export type Coord = {
    col: number;
    line: number;
};
export type LintErrorWithCoords = LintError & {start: Coord; end: Coord};

export type Result = null | LintErrorWithCoords[];
export type Mark = [] | [IMarker];
