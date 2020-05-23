import prettier from 'prettier/standalone';
import prettierBabelParser from 'prettier/parser-babel';
import SLdefaultConfig from 'swaggerlint/dist/defaultConfig';
import {Config} from 'types';

export function prettify(arg: string): string {
    return prettier.format(arg, {
        // stuff
        parser: 'json',
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
