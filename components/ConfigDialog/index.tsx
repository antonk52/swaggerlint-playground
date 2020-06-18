import React from 'react';
import {Config} from 'types';
import {Modal} from '../Modal';
import {Button} from '../Button';
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
}: {
    value: string;
    onChange: (value: string) => void;
    onRemove: () => void;
}) {
    return (
        <li className={css.ignoreItem}>
            <Input value={value} onChange={onChange} />
            <Button onClick={onRemove}>remove</Button>
        </li>
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
    const onCheckboxChange = ({
        target,
    }: React.ChangeEvent<HTMLInputElement>) => {
        onChange({
            ...config,
            rules: {
                ...config.rules,
                [target.name]: target.checked,
            },
        });
    };

    const clipboardConfig = () => {
        if (!isBrowser) return;
        console.log('trying to copy i guess');
        const jsonConfig = stringifyConfig(config);

        copy(jsonConfig);
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
                    <ul style={{listStyle: 'none', margin: 0}}>
                        {Object.entries(config.rules).map(([name, value]) => (
                            <li key={name}>
                                <label>
                                    <input
                                        type="checkbox"
                                        name={name}
                                        checked={!(value === false)}
                                        onChange={onCheckboxChange}
                                    />
                                    {name}
                                </label>
                            </li>
                        ))}
                    </ul>
                    <h2>Ignore stuff</h2>
                    <h3>Paths</h3>
                    <Button
                        onClick={() => {
                            const copy = copyConf(config);
                            copy.ignore.paths.push('');
                            onChange(copy);
                        }}
                    >
                        ✚ Add
                    </Button>
                    <ul className={css.ignoreList}>
                        {config.ignore.paths.map((el, i) => (
                            <IgnoreInput
                                key={i}
                                value={el}
                                onChange={(value) => {
                                    const copy = copyConf(config);
                                    copy.ignore.paths[i] = value;
                                    onChange(copy);
                                }}
                                onRemove={() => {
                                    const copy = copyConf(config);
                                    copy.ignore.paths = copy.ignore.paths.filter(
                                        (_, indx) => indx !== i,
                                    );
                                    onChange(copy);
                                }}
                            />
                        ))}
                    </ul>
                    <h3>Definitions</h3>
                    <Button
                        onClick={() => {
                            const copy = copyConf(config);
                            copy.ignore.definitions.push('');
                            onChange(copy);
                        }}
                    >
                        ✚ Add
                    </Button>
                    <ul className={css.ignoreList}>
                        {config.ignore.definitions.map((el, i) => (
                            <IgnoreInput
                                key={i}
                                value={el}
                                onChange={(value) => {
                                    const copy = copyConf(config);
                                    copy.ignore.definitions[i] = value;
                                    onChange(copy);
                                }}
                                onRemove={() => {
                                    const copy = copyConf(config);
                                    copy.ignore.definitions = copy.ignore.definitions.filter(
                                        (_, indx) => indx !== i,
                                    );
                                    onChange(copy);
                                }}
                            />
                        ))}
                    </ul>
                </form>
                <Button onClick={clipboardConfig}>Copy as JSON</Button>
            </Modal>
        </React.Fragment>
    );
};
