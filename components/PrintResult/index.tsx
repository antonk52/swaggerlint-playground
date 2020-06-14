import React from 'react';
import {Result} from 'types';
import {ErrorItem} from '../ErrorItem';
import css from './style.module.css';

function ResultWrapper({children}: {children?: React.ReactNode}) {
    return <div className={css.resultWrapper}>{children}</div>;
}

export const PrintResult = ({
    result,
    onErrorClick,
}: {
    result: Result;
    onErrorClick: (loc: string[], name: string) => void;
}) => {
    if (result === null) {
        return <ResultWrapper />;
    }

    if (result.length === 0) {
        return (
            <ResultWrapper>
                <b>Congrats on you, you've done well 🎉</b>
            </ResultWrapper>
        );
    }

    return (
        <ResultWrapper>
            <p className={css.total}>Total {result.length} errors</p>
            <ul className={css.list}>
                {result.map((item, i) => (
                    <ErrorItem
                        key={i}
                        {...item}
                        onButtonClick={() =>
                            onErrorClick(item.location, item.name)
                        }
                    />
                ))}
            </ul>
        </ResultWrapper>
    );
};
