import React from 'react';
import { Link } from 'react-router';
import '../style/404.css';

function NotFoundPage() {
    document.title = "Eternal | 404";

    return (
        <div className="not-found">
            <div className="not-found-content">

                <span className="not-found-label">ETERNAL</span>

                <div className="not-found-divider">
                    <span></span>
                    <span>✦</span>
                    <span></span>
                </div>

                <h1>404</h1>

                <h2>Page Not Found</h2>

                <p>
                    The piece you're looking for seems to have disappeared
                    beyond time.
                </p>

                <Link to="/" className="home-button">
                    Return Home
                </Link>

            </div>
        </div>
    );
}

export default NotFoundPage;