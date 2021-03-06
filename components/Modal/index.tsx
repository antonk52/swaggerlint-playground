import React from 'react';
import ReactModal from 'react-modal';

import {isBrowser} from 'utils';
import css from './style.module.css';

// @ts-expect-error
const app: HTMLElement | undefined = isBrowser
    ? document.querySelector('#__next')
    : undefined;

type Props = {
    children: React.ReactNode;
    isOpen: boolean;
    onClose: () => void;
};

export function Modal({children, isOpen, onClose}: Props) {
    return (
        <ReactModal
            isOpen={isOpen}
            appElement={app}
            className={css.content}
            overlayClassName={css.overlay}
            onRequestClose={onClose}
            shouldCloseOnOverlayClick
        >
            <div className={css.inner}>
                <button
                    onClick={onClose}
                    className={css.button}
                    title="exit config editing"
                >
                    ✕
                </button>
                {children}
            </div>
        </ReactModal>
    );
}
