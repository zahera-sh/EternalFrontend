import React from "react";
import { Link } from "react-router";


function Homepage() {

    return (
        <>
            <h1>Welcome to Eternal</h1>
            <p>Online Auction House for the rarest, most precious finds.</p>

            <Link to={"/items"}>Enter</Link>
        </>
    );
}


export default Homepage;