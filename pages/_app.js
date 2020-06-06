import React from 'react';
import Head from 'next/head';
import '../global.css';

export default function MyApp({Component, pageProps}) {
    return (
        <React.Fragment>
            <Head>
                <title>Swaggerlint Playground</title>
                <meta
                    name="description"
                    content="Swaggerlint playground helps you to keep your API consistent. A linter for Swagger schemas."
                />
            </Head>
            <Component {...pageProps} />
        </React.Fragment>
    );
}
