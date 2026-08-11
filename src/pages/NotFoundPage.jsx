import React from 'react';
import { Link } from 'react-router';


function NotFoundPage() {

    return (

        <>
            <h1>404.</h1>
            <p>Page not found.</p>

            <Link to={"/"}>Return Home</Link>
        </>

    );
}


export default NotFoundPage;