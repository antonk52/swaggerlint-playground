import React from 'react';
import {Result} from 'types';
import {Textarea} from 'components/Textarea';
import {PrintResult} from 'components/PrintResult';
import {ConfigDialog} from 'components/ConfigDialog';
import {swaggerlint, SwaggerlintConfig} from 'swaggerlint';
import defaultConfig from 'swaggerlint/dist/defaultConfig';

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
    }
    return (
        <div>
            <ConfigDialog config={config} onChange={onConfigChange} />
            <Textarea value={swaggerRaw} onChange={onChange} />
            {isValid ? '✅' : '❌'}
            <PrintResult result={result} />
        </div>
    );
};
