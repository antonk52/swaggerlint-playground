import prettier from 'prettier/standalone';
import prettierBabelParser from 'prettier/parser-babel';

export function prettify(arg: string): string {
    return prettier.format(arg, {
        // stuff
        parser: 'json',
        plugins: [prettierBabelParser],
        tabWidth: 4,
    });
}
