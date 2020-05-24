import React from 'react';
import {Result, LintErrorWithCoords} from 'types';

const ErrorItem = ({msg, name, location, onButtonClick, start}: LintErrorWithCoords & {onButtonClick: () => void}) => (
    <div>
        <span><b>{name}</b> (found on line {start.line})</span>
        <br />
        <span>{msg}</span>
        <br />
        {location.length > 0 ? (
            <React.Fragment>
                <span>{location.map((item) => `"${item}"`).join(' / ')}</span>
            </React.Fragment>
        ) : null}
        <button type="button" onClick={onButtonClick}>
            show cause
        </button>
    </div>
);

export const PrintResult = ({
    result,
    onErrorClick,
}: {
    result: Result;
    onErrorClick: (arg: string[]) => void;
}) => {
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
                    <ErrorItem
                        {...item}
                        onButtonClick={() => onErrorClick(item.location)}
                    />
                </li>
            ))}
        </ul>
    );
};
