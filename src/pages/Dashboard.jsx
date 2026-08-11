import { useAuth } from "../context/AuthContext";
import React, { useEffect, useState } from "react";
import { getAllProfile } from "../services/userService";
import { Link } from "react-router";


function Dashboard({ }) {

    const { user } = useAuth();
    const [dashboard, setDashboard] = useState(null);
    const [error, setError] = useState("");

    async function loadDashboard() {

        try {

            const response = await getAllProfile();
            setDashboard(response);

        } catch (err) {

            console.log(err)
            setError("Could not load dashboard.");
        }
    }

    useEffect(() => {

        loadDashboard();

    }, []);


    function formatDate(date) {

        if (!date) return "N/A";
        return new Date(date).toLocaleDateString();

    }

    if (error) {

        return <p>{error}</p>

    }

    if (!dashboard) {

        return <p>Loading...</p>

    }


    const {
        user: profileUser,
        myItems,
        favouritedItems,
        myBids
    } = dashboard

    return (
        <>
            <h1>Welcome {profileUser.username}</h1>

            <div>

                <p>Email: {profileUser.email}</p>
                <p>Role: {profileUser.role}</p>

                {/* to be changed */}
                {profileUser.isVerifiedSeller &&
                    (<p>✅ Verified Seller</p>)}

                <p>Member since:{formatDate(profileUser.createdAt)}</p>
            </div>
            <br />
            <div>
                <h2>My Items</h2>

                {myItems.length === 0
                    ? (
                        <p>You haven't added any items yet.</p>
                    )
                    : (
                        <div>
                            {myItems.map((item) => (
                                <div key={item._id}>
                                    <img src={item.image.url} alt={item.title} />
                                    <Link to={`/items/${item._id}`}><h3>{item.title}</h3></Link>
                                    <p> Starting Price: {item.startingPrice}</p>
                                    <p>Status: {item.status}</p>
                                </div>
                            ))}
                        </div>
                    )}
            </div>
            <br />
            <div>
                <h2>Favourites ❤️</h2>

                {favouritedItems.length === 0
                    ? (
                        <p>You haven't favourited any items yet.</p>
                    )
                    : (
                        <div>
                            {favouritedItems.map((item) => (
                                <div key={item._id}>
                                    <img src={item.image.url} alt={item.title} />
                                    <Link to={`/items/${item._id}`}><h3>{item.title}</h3></Link>
                                    <p>Starting Price: {item.startingPrice}</p>
                                    <p>Status: {item.status}</p>
                                </div>
                            ))}
                        </div>
                    )}
            </div>
            <br />
            <div>
                <h2>My Bids 💰</h2>

                {myBids.length === 0
                    ? (
                        <p>You haven't placed any bids yet.</p>
                    )
                    : (
                        <div>
                            {myBids.map((bid) => (
                                <div key={bid._id}>
                                    <Link to={`/items/${bid.item?._id}`}><h3>{bid.item?.title}</h3></Link>
                                    {bid.item?.image?.url &&
                                        (<img src={bid.item.image.url} alt={bid.item.title} />)}

                                    <p>Your Bid: {bid.amount}</p>
                                    <p>Bid placed:{formatDate(bid.createdAt)}</p>

                                    {bid.isAutoBid &&
                                        (<p>🤖 Auto Bid</p>)}
                                </div>
                            ))}
                        </div>
                    )}
            </div>
        </>
    );
}


export default Dashboard;