import React from 'react';
import {LintErrorWithCoords} from 'types';

import {Button} from '../Button';
import css from './style.module.css';

export const ErrorItem = ({
    msg,
    name,
    location,
    onButtonClick,
    start,
}: LintErrorWithCoords & {onButtonClick: () => void}) => (
    <li className={css.listItem}>
        <div className={css.info}>
            <span className={css.name}>
                <b>{name}</b>
            </span>
            <span className={css.msg}>
                {msg} (line {start.line})
            </span>
            {location.length > 0 ? <span>in {location.join('.')}</span> : null}
        </div>
        <Button onClick={onButtonClick} className={css.btn} size="lg">
            Go to error
        </Button>
    </li>
);
