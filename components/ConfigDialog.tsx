import React from 'react';
import ReactModal from 'react-modal';
import {Config} from 'types';

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
        <div>
            <input
                type="text"
                value={value}
                onChange={({target}) => onChange(target.value)}
            />
            <button onClick={onRemove}>remove me</button>
        </div>
    );
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

    return (
        <React.Fragment>
            <button
                aria-label="edit swaggerlint config"
                onClick={() => setIsOpen(!isOpen)}
            >
                ⚙️
            </button>
            <ReactModal isOpen={isOpen}>
                <div style={{position: 'relative', padding: 12}}>
                    <button
                        aria-label="exit config editing"
                        style={{position: 'absolute', top: 10, right: 10}}
                        onClick={() => setIsOpen(false)}
                    >
                        ✕
                    </button>

                    <span>Tune the rules to your tastes</span>
                    <form>
                        <h2>Rules</h2>
                        <ul style={{listStyle: 'none', margin: 0}}>
                            {Object.entries(config.rules).map(
                                ([name, value]) => (
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
                                ),
                            )}
                        </ul>
                        <h2>Ignore stuff</h2>
                        <h3>Paths</h3>
                        <button
                            type="button"
                            onClick={() => {
                                const copy = copyConf(config);
                                copy.ignore.paths.push('');
                                onChange(copy);
                            }}
                        >
                            ✚ add
                        </button>
                        <ul>
                            {config.ignore.paths.map((el, i) => (
                                <li key={i}>
                                    <IgnoreInput
                                        value={el}
                                        onChange={(value) => {
                                            const copy = copyConf(config);
                                            copy.ignore.paths[i] = value;
                                            onChange(copy);
                                        }}
                                        onRemove={() => {
                                            const copy = copyConf(config);
                                            copy.ignore.paths = copy.ignore.paths.filter((_, indx) => indx !== i);
                                            onChange(copy);
                                        }}
                                    />
                                </li>
                            ))}
                        </ul>
                        <h3>Definitions</h3>
                        <button
                            type="button"
                            onClick={() => {
                                const copy = copyConf(config);
                                copy.ignore.definitions.push('');
                                onChange(copy);
                            }}
                        >
                            ✚ add
                        </button>
                        <ul>
                            {config.ignore.definitions.map((el, i) => (
                                <li key={i}>
                                    <IgnoreInput
                                        value={el}
                                        onChange={(value) => {
                                            const copy = copyConf(config);
                                            copy.ignore.definitions[i] = value;
                                            onChange(copy);
                                        }}
                                        onRemove={() => {
                                            const copy = copyConf(config);
                                            copy.ignore.definitions = copy.ignore.definitions.filter((_, indx) => indx !== i);
                                            onChange(copy);
                                        }}
                                    />
                                </li>
                            ))}
                        </ul>
                    </form>
                </div>
            </ReactModal>
        </React.Fragment>
    );
};
