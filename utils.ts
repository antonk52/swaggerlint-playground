import prettier from 'prettier/standalone';
import prettierBabelParser from 'prettier/parser-babel';
import SLdefaultConfig from 'swaggerlint/dist/defaultConfig';
import {Config, Format} from 'types';

export function prettify(arg: string, parser: Format): string {
    return prettier.format(arg, {
        parser,
        plugins: [prettierBabelParser],
        tabWidth: 4,
    });
}

export const defaultConfig: Config = {
    ...SLdefaultConfig,
    extends: [],
    ignore: {
        paths: [],
        definitions: [],
    },
};

export const isBrowser = typeof window !== 'undefined';

/**
 * a set of rules which have the last element in their location
 * pointing at the object property name, not the value
 */
export const KEY_POINTING_ERRORS = new Set([
    'latin-definitions-only',
    'no-trailing-slash',
    'object-prop-casing',
]);
