import React from 'react';
import {SwaggerlintConfig} from 'swaggerlint';

type Props = {
    config: SwaggerlintConfig;
    onChange: (config: SwaggerlintConfig) => void;
};

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
            <dialog open={isOpen} style={{padding: 0}}>
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
                    </form>
                </div>
            </dialog>
        </React.Fragment>
    );
};
