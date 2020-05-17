import React from 'react';
import {Result} from 'types';
import {LintError} from 'swaggerlint';

const ErrorItem = ({msg, name, location}: LintError) => (
    <div>
        <b>{name}</b>
        <br />
        <span>{msg}</span>
        <br />
        {location.length > 0
            ? <React.Fragment>
                <span>{location.map(item => `"${item}"`).join(' / ')}</span>
            </React.Fragment>
            : null
        }
    </div>
);

export const PrintResult = ({result}: {result: Result}) => {
    if (result === null) {
        return null;
    }

    if (result.length === 0) {
        return <b>Congrats on you, you've done well</b>;
    }

    return (
        <ul>
            {result.map((item, i) => (
                <li key={i}>
                    <ErrorItem {...item} />
                </li>
            ))}
        </ul>
    );
};
