import React from 'react';
import {Config} from 'types';
import {Modal} from '../Modal';
import {Button} from '../Button';
import {Checkbox} from '../Checkbox';
import {Input} from '../Input';
import {isBrowser} from 'utils';
import copy from 'copy-to-clipboard';

import css from './style.module.css';

type Props = {
    config: Config;
    onChange: (config: Config) => void;
};

function IgnoreInput({
    value,
    onChange,
    onRemove,
    placeholder,
}: {
    value: string;
    onChange: (value: string) => void;
    onRemove: () => void;
    placeholder: string;
}) {
    return (
        <li className={css.ignoreItem}>
            <Input
                value={value}
                onChange={onChange}
                placeholder={placeholder}
            />
            <Button onClick={onRemove}>remove</Button>
        </li>
    );
}

function Fieldset({
    title,
    onAdd,
    children,
}: {
    title: string;
    onAdd: () => void;
    children: React.ReactNode;
}) {
    return (
        <fieldset className={css.fieldset}>
            <div className={css.subHeadRow}>
                <h3>{title}</h3>
                <Button onClick={onAdd}>✚ Add</Button>
            </div>
            <ul className={css.list}>{children}</ul>
        </fieldset>
    );
}

function stringifyConfig({extends: _, ...config}: Config) {
    return JSON.stringify(config);
}

function copyConf(config: Config): Config {
    return {
        ...config,
        ignore: {
            paths: [...config.ignore.paths],
            definitions: [...config.ignore.definitions],
        },
    };
}

export const ConfigDialog = ({config, onChange}: Props) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const onCheckboxChange = React.useCallback(
        ({target}: React.ChangeEvent<HTMLInputElement>) => {
            const copy = copyConf(config);
            copy.rules[target.name] = target.checked;
            onChange(copy);
        },
        [config.rules],
    );

    const clipboardConfig = React.useCallback(() => {
        if (!isBrowser) return;
        const jsonConfig = stringifyConfig(config);

        copy(jsonConfig);
    }, [config]);

    const onAddIgnorePath = React.useCallback(() => {
        const copy = copyConf(config);
        copy.ignore.paths.push('');
        onChange(copy);
    }, [config.ignore.paths]);

    const onAddIgnoreDefinition = React.useCallback(() => {
        const copy = copyConf(config);
        copy.ignore.definitions.push('');
        onChange(copy);
    }, [config.ignore.definitions]);

    const getIgnoreChangeFunc = (
        i: number,
        propName: 'definitions' | 'paths',
    ) => (value: string) => {
        const copy = copyConf(config);
        copy.ignore[propName][i] = value;
        onChange(copy);
    };

    const getIgnoreRemoveFunc = (
        i: number,
        propName: 'definitions' | 'paths',
    ) => () => {
        const copy = copyConf(config);
        copy.ignore[propName].splice(i, 1);
        onChange(copy);
    };

    return (
        <React.Fragment>
            <Button onClick={() => setIsOpen(!isOpen)} size="sm">
                Config
            </Button>
            <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
                <span>Tune the rules to your tastes</span>
                <form className={css.form}>
                    <h2>Rules</h2>
                    <ul className={css.list}>
                        {Object.entries(config.rules).map(([name, value]) => (
                            <li key={name}>
                                <Checkbox
                                    label={name}
                                    checked={!(value === false)}
                                    onChange={onCheckboxChange}
                                />
                            </li>
                        ))}
                    </ul>
                    <h2>Ignore stuff</h2>
                    <Fieldset title="Paths" onAdd={onAddIgnorePath}>
                        {config.ignore.paths.map((el, i) => (
                            <IgnoreInput
                                key={i}
                                value={el}
                                onChange={getIgnoreChangeFunc(i, 'paths')}
                                onRemove={getIgnoreRemoveFunc(i, 'paths')}
                                placeholder="/path/to/ignore"
                            />
                        ))}
                    </Fieldset>
                    <Fieldset title="Definitions" onAdd={onAddIgnoreDefinition}>
                        {config.ignore.definitions.map((el, i) => (
                            <IgnoreInput
                                key={i}
                                value={el}
                                onChange={getIgnoreChangeFunc(i, 'definitions')}
                                onRemove={getIgnoreRemoveFunc(i, 'definitions')}
                                placeholder="DefinitionToIgnore"
                            />
                        ))}
                    </Fieldset>
                </form>
                <Button onClick={clipboardConfig}>Copy as JSON</Button>
            </Modal>
        </React.Fragment>
    );
};
