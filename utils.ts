import prettier from 'prettier/standalone';
import prettierBabelParser from 'prettier/parser-babel';
import prettierYamlParser from 'prettier/parser-yaml';
import SLdefaultConfig from 'swaggerlint/dist/defaultConfig';
import {Config, Format} from 'types';

export function prettify(arg: string, parser: Format): string {
    return prettier.format(arg, {
        parser,
        plugins: [prettierBabelParser, prettierYamlParser],
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
