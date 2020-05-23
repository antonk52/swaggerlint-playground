import React from 'react';
import {Result} from 'types';
import {PrintResult} from 'components/PrintResult';
import {ConfigDialog} from 'components/ConfigDialog';
import {swaggerlint, SwaggerlintConfig} from 'swaggerlint';
import {Editor} from 'components/Editor';
import defaultConfig from 'swaggerlint/dist/defaultConfig';
import {prettify} from 'utils';

export default () => {
    const [swaggerRaw, setSwaggerRaw] = React.useState('');
    const [isValid, setIsValid] = React.useState(false);
    const [result, setResult] = React.useState<Result>(null);
    const [config, setConfig] = React.useState(defaultConfig);
    const onChange = (raw: string): void => {
        setSwaggerRaw(raw);

        try {
            const parsed = JSON.parse(raw);
            setIsValid(true);
            setResult(swaggerlint(parsed, config));
        } catch (e) {
            setIsValid(false);
            setResult(null);
        }
    };

    const onConfigChange = (config: SwaggerlintConfig): void => {
        setConfig(config);
        try {
            const parsed = JSON.parse(swaggerRaw);
            setIsValid(true);
            setResult(swaggerlint(parsed, config));
        } catch (e) {
            setIsValid(false);
            setResult(null);
        }
    };

    const onPrettify = () => {
        setSwaggerRaw(
            prettify(swaggerRaw)
        );
    };

    return (
        <div>
            <ConfigDialog config={config} onChange={onConfigChange} />
            <Editor value={swaggerRaw} onChange={onChange} />
            <button onClick={onPrettify} disabled={!isValid}>
                🍬
            </button>
            {isValid ? '✅' : '❌'}
            <PrintResult result={result} />
        </div>
    );
};
