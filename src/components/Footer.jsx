import React from 'react';
import { Link } from 'react-router';
import "../style/footer.css"


function Footer() {

    return (
        <>
            <footer>
                <div className='footerlinks'>
                    <Link to="/privacy">Privacy Policy</Link>
                    <Link to="/terms">Terms of Service</Link>
                </div>

                <div className='footercopyright'>
                    <p>© 2026 Eternal.</p>
                </div>
            </footer>
        </>
    );
};


export default Footer;