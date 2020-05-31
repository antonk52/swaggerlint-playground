import React from 'react';
import ReactModal from 'react-modal';

import css from './style.module.css';

// @ts-expect-error
const app: HtmlElement | void =
    typeof window === 'undefined'
        ? undefined
        : document.querySelector('#__next');

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
